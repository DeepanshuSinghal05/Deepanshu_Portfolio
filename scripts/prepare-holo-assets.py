from pathlib import Path
from PIL import Image, ImageDraw
import cv2, json, hashlib
root=Path('.'); source=root/'project_story_assets/holo_gesture'; out=root/'public/worlds/holo'; audit=root/'artifacts/holo'
out.mkdir(parents=True,exist_ok=True); audit.mkdir(parents=True,exist_ok=True)
rows=[]
for name in ['normal_mode','jarvis_golden_mode']:
 src=source/f'{name}.png'
 for tier,size in [('desktop',1920),('mobile',1280)]:
  im=Image.open(src).convert('RGB'); im.thumbnail((size,size),Image.Resampling.LANCZOS)
  dest=out/f'{name}-{tier}.webp'; im.save(dest,'WEBP',quality=91,method=6)
  rows.append(dict(source=str(src),sha256=hashlib.sha256(src.read_bytes()).hexdigest(),tier=tier,width=im.width,height=im.height,bytes=dest.stat().st_size))
c=cv2.VideoCapture(str(source/'holo_gesture.mp4')); fps=c.get(cv2.CAP_PROP_FPS); duration=c.get(cv2.CAP_PROP_FRAME_COUNT)/fps
sheet=Image.new('RGB',(1600,1200)); draw=ImageDraw.Draw(sheet)
times=[duration*i/12 for i in range(12)]
for i,t in enumerate(times):
 c.set(cv2.CAP_PROP_POS_MSEC,t*1000); ok,frame=c.read()
 if ok:
  im=Image.fromarray(cv2.cvtColor(frame,cv2.COLOR_BGR2RGB)); im.thumbnail((530,270)); sheet.paste(im,((i%3)*533,(i//3)*300)); draw.text(((i%3)*533,(i//3)*300+275),f'{t:.1f}s',fill='white')
sheet.save(audit/'video-contact.jpg'); c.release()
(audit/'asset-manifest.json').write_text(json.dumps(dict(images=rows,video=dict(fps=fps,duration=duration,sampledSeconds=times,usage='Reference only; not shipped')),indent=2),encoding='utf-8')
print(json.dumps(dict(bytes=sum(r['bytes'] for r in rows),duration=duration,fps=fps)))
