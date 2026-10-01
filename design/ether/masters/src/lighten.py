# #56 v3 lift for the two darkest scenes (MG1, SL4). Starts from the v2 master, lifts
# mid-tones outside the protected lower-left zone only (same feathered mask as process.py).
from PIL import Image, ImageEnhance, ImageFilter
import numpy as np, sys
W,H=1600,900
def lum(a): return 0.2126*a[...,0]+0.7152*a[...,1]+0.0722*a[...,2]
yy,xx=np.mgrid[0:H,0:W]
F=260; fx=np.clip((W*0.58+F-xx)/F,0,1); fy=np.clip((yy-(H*0.55-F))/F,0,1)
protect=0.65*(fx*fy)[...,None]  # zone still gets 35% of the lift, so no seam
for name,g,gain in [('mutant-groove-1',0.72,1.25),('spy-lounge-4',0.72,1.25)]:
    src=Image.open(f'masters/v1-dark/{name}.png').convert('RGB').filter(ImageFilter.GaussianBlur(0.6))  # tame lifted grain
    a=np.asarray(src).astype(float)/255
    lifted=np.clip((a**g)*gain,0,1)
    b=lifted*(1-protect)+a*protect
    img=ImageEnhance.Color(Image.fromarray((b*255+0.5).astype('uint8'))).enhance(1.04)
    img.save(f'masters/{name}.png',optimize=True)
    img.save(f'web/{name}.webp','WEBP',quality=78,method=6)
    L=lum(np.asarray(img).astype(float))
    print(name,'mean',round(L.mean(),1),'zone_p95',round(np.percentile(L[495:,:928],95),1))
