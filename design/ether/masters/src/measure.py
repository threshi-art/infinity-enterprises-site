# Ember: #56 layout-rule check + contact sheet. Zone = left 58% x bottom 45%. Phone crop 506x900,
# text column = left 70% of crop; phone_x0 = centre crop if its column p95<=70, else rightmost that passes.
from PIL import Image, ImageDraw
import numpy as np, json, os
def lum(a): return 0.2126*a[...,0]+0.7152*a[...,1]+0.0722*a[...,2]
names=[f'{r}-{i}' for r in ('late-night-soul','mutant-groove','spy-lounge') for i in (1,2,3,4)]
res={}; tw,th=533,300
sheet=Image.new('RGB',(tw*4+50,th*3+40),(12,12,16)); clean=Image.new('RGB',(tw*4+50,th*3+40),(12,12,16))
for i,n in enumerate(names):
    p=f'masters/{n}.jpg' if os.path.exists(f'masters/{n}.jpg') else f'masters/{n}.png'
    img=Image.open(p).convert('RGB'); L=lum(np.asarray(img).astype(float)); ll=L[495:,:928]
    c=np.percentile(L[:,547:901],95)
    x0s=[x for x in range(0,1095,8) if np.percentile(L[:,x:x+354],95)<=70]
    x=547 if c<=70 else (max(x0s) if x0s else None)
    res[n]=dict(file=p,mean=round(float(L.mean()),1),zone_mean=round(float(ll.mean()),1),zone_p95=round(float(np.percentile(ll,95)),1),
      centre_phone_col_p95=round(float(c),1),phone_x0=x,phone_object_position_x_pct=None if x is None else round(x/1094*100),
      webp_kb=round(os.path.getsize(f'web/{n}.webp')/1024,1))
    t=img.resize((tw,th),Image.LANCZOS); pos=(10+(i%4)*(tw+10),10+(i//4)*(th+10)); clean.paste(t,pos)
    d=ImageDraw.Draw(t); d.rectangle([0,int(th*.55),int(tw*.58),th-1],outline=(0,200,255))
    if x is not None: s=tw/1600; d.rectangle([int(x*s),0,int((x+506)*s),th-1],outline=(255,210,0),width=2)
    d.text((6,4),n,fill=(255,255,255)); sheet.paste(t,pos); print(n,res[n])
sheet.save('contact-sheet-guides.jpg',quality=88); clean.save('contact-sheet.jpg',quality=88)
json.dump(res,open('measure.json','w'),indent=1)
