from pathlib import Path
from PIL import Image
import hashlib,json
root=Path('.');out=root/'public/worlds/doj';out.mkdir(parents=True,exist_ok=True)
rows=[]
for name in ['homepage','chat_interface','response']:
 src=root/'project_story_assets/DOJ'/f'{name}.png'
 original=Image.open(src).convert('RGB')
 for tier,size in [('desktop',1920),('mobile',1152)]:
  im=original.copy();box=None
  if tier=='mobile' and name!='homepage':
   box=(768,0,1917,978) if name=='chat_interface' else (705,0,1756,896)
   im=im.crop(box)
  im.thumbnail((size,size),Image.Resampling.LANCZOS);im.save(out/f'{name}-{tier}.webp','WEBP',quality=90,method=6)
  rows.append({'source':str(src),'sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'tier':tier,'crop':box,'width':im.width,'height':im.height})
(root/'artifacts/doj-asset-manifest.json').write_text(json.dumps(rows,indent=2),encoding='utf-8')
print(sum(p.stat().st_size for p in out.glob('*.webp')))
