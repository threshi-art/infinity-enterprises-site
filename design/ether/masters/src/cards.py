# #56 mood cards, 800x800. Square 900x900 crop from a 1600x900 scene (x0 chosen per card),
# Lanczos to 800. Noir Jazz "Upcoming" is a procedural textless dark field (page supplies text).
from PIL import Image, ImageFilter
import numpy as np, json, os
CARDS={'cosmic-funk':('../ether-1.jpg',None),'late-night-soul':('masters/late-night-soul-1.jpg',None),
       'mutant-groove':('masters/mutant-groove-3.png',None),'spy-lounge':('masters/spy-lounge-3.png',None)}
X0=json.load(open('src/card_x0.json')) if os.path.exists('src/card_x0.json') else {}
os.makedirs('cards',exist_ok=True); out={}
for k,(src,_) in CARDS.items():
    im=Image.open(src).convert('RGB')
    if im.size!=(1600,900): im=im.resize((1600,900),Image.LANCZOS)
    x0=X0.get(k,350); c=im.crop((x0,0,x0+900,900)).resize((800,800),Image.LANCZOS)
    c.save(f'cards/{k}.png',optimize=True); c.save(f'cards/{k}.webp','WEBP',quality=80,method=6)
    out[k]=dict(source=src,crop_x0_of_1600=x0)
# Noir Jazz: navy-to-black radial, faint cool haze top-right, fine grain. No text, no motifs.
rng=np.random.default_rng(56); S=800; yy,xx=np.mgrid[0:S,0:S]/S
r=np.hypot(xx-0.68,yy-0.30)
base=np.clip(1-r/0.95,0,1)**1.6
col=np.stack([18+34*base,20+30*base,34+58*base],-1)          # charcoal navy lifting to muted violet-blue
haze=np.clip(1-np.hypot(xx-0.78,yy-0.18)/0.35,0,1)**2.2
col+=np.stack([40*haze,34*haze,52*haze],-1)
img=Image.fromarray(np.clip(col,0,255).astype('uint8')).filter(ImageFilter.GaussianBlur(6))
a=np.asarray(img).astype(float)+rng.normal(0,2.2,(S,S,1))
img=Image.fromarray(np.clip(a,0,255).astype('uint8'))
img.save('cards/noir-jazz-upcoming.png',optimize=True); img.save('cards/noir-jazz-upcoming.webp','WEBP',quality=82,method=6)
out['noir-jazz-upcoming']=dict(source='procedural (src/cards.py, seed 56)',crop_x0_of_1600=None)
json.dump(out,open('cards/cards.json','w'),indent=1)
sheet=Image.new('RGB',(5*410+10,420),(12,12,16))
for i,k in enumerate(['cosmic-funk','mutant-groove','late-night-soul','spy-lounge','noir-jazz-upcoming']):
    sheet.paste(Image.open(f'cards/{k}.png').resize((400,400),Image.LANCZOS),(10+i*410,10))
sheet.save('cards-sheet.jpg',quality=88)
for k in out: print(k,out[k],os.path.getsize(f'cards/{k}.webp')//1024,'KB')
