"""Privacy-safe, traceable fragments of supplied product evidence. Originals stay intact."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import cv2, json, hashlib
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'project_story_assets'
OUT=ROOT/'public/worlds'
manifest=[]
def save(world,name,im,source,crop=None,note='Real application UI'):
    folder=OUT/world;folder.mkdir(parents=True,exist_ok=True)
    for tier,size in [('desktop',1536),('mobile',768)]:
        derived=im.copy();derived.thumbnail((size,size),Image.Resampling.LANCZOS)
        derived.save(folder/f'{name}-{tier}.webp','WEBP',quality=88,method=6)
    manifest.append(dict(world=world,name=name,source=source,crop=crop,note=note,aspect=im.width/im.height))
def crop(world,name,source,box,masks=[]):
    im=Image.open(SRC/source).convert('RGB');draw=ImageDraw.Draw(im)
    for rect in masks:draw.rounded_rectangle(rect,4,fill='#c5ccd5')
    save(world,name,im.crop(box),source,box,'Personal values masked' if masks else 'Real application UI; demo values are not business claims')
identity=Image.open(SRC/'yatralok/trips-digital-id.png').convert('RGB')
draw=ImageDraw.Draw(identity)
for rect in [(906,382,1345,418),(908,474,1345,503),(908,566,1345,596)]:draw.rounded_rectangle(rect,4,fill='#bdcad4')
identity=identity.crop((860,220,1390,695))
save('yatralok','identity',identity,'yatralok/trips-digital-id.png',note='Previously redacted identity; identifier and phone values masked')
save('yatralok','identity-title',identity.crop((0,0,530,110)),'yatralok/trips-digital-id.png',note='Digital identity heading; no private values')
crop('yatralok','trip','yatralok/dashboard.png',(375,340,1850,690))
crop('yatralok','sos','yatralok/panic-sos.png',(1048,233,1223,408))
crop('yatralok','route-concept','yatralok/live_tracking.png',(500,267,1563,653))
manifest[-1]['note']='Supplied supporting route concept, not verified implementation evidence; status, speed and ETA claims excluded.'
crop('yatralok','contacts','yatralok/panic-sos.png',(28,545,340,590))
cap=cv2.VideoCapture(str(SRC/'yatralok/yatralok_demo.mp4'));cap.set(cv2.CAP_PROP_POS_MSEC,88000);ok,frame=cap.read();cap.release()
assert ok
tracking=Image.fromarray(cv2.cvtColor(frame,cv2.COLOR_BGR2RGB))
map_image=tracking.crop((711,293,1559,793)).filter(ImageFilter.GaussianBlur(8))
save('yatralok','map',map_image,'yatralok/yatralok_demo.mp4 @ 88s',(711,293,1559,793),'Real tracking map; all geographical detail obscured. Portfolio route is conceptual.')
save('yatralok','tracking-title',tracking.crop((710,151,1560,200)),'yatralok/yatralok_demo.mp4 @ 88s',note='Actual Live Tracking heading')
crop('prisha','storefront','prisha_enterprises/home.png',(0,110,1908,875))
crop('prisha','catalogue','prisha_enterprises/products.png',(190,432,1725,973))
crop('prisha','product','prisha_enterprises/products.png',(980,442,1320,715))
crop('prisha','product-detail','prisha_enterprises/products.png',(980,723,1320,970))
crop('prisha','checkout','prisha_enterprises/checkout.png',(393,473,1128,805))
crop('prisha','payment','prisha_enterprises/checkout.png',(393,805,1128,924))
crop('prisha','portal','prisha_enterprises/admin_login.png',(680,212,1240,812),[(755,420,1170,454),(748,545,1170,580)])
crop('prisha','orders','prisha_enterprises/admin_dashboard.png',(193,121,1715,280))
crop('prisha','revenue','prisha_enterprises/admin_dashboard.png',(193,319,1715,505))
crop('prisha','distribution','prisha_enterprises/admin_dashboard.png',(193,545,940,975))
crop('prisha','products','prisha_enterprises/admin_dashboard.png',(969,545,1715,975))
for row in manifest:
    source=SRC/row['source'].split(' @ ')[0]
    row['sourceSha256']=hashlib.sha256(source.read_bytes()).hexdigest()
(ROOT/'artifacts/world-asset-manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
print(f'{len(manifest)} fragments, desktop/mobile variants, {sum(p.stat().st_size for p in OUT.rglob("*.webp")):,} bytes')
