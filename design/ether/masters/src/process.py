# #56 scene processing (v2). Upscale 1280x720 -> 1600x900 Lanczos, lift mid-tones and
# highlights outside the protected lower-left zone, burn the zone if it runs hot, +6% saturation.
from PIL import Image, ImageEnhance
import numpy as np, glob, os
W,H=1600,900
def lum(a): return 0.2126*a[...,0]+0.7152*a[...,1]+0.0722*a[...,2]
yy,xx=np.mgrid[0:H,0:W]
fx=np.clip((W*0.58+120-xx)/120,0,1); fy=np.clip((yy-(H*0.55-120))/120,0,1)
protect=(fx*fy)[...,None]
for f in sorted(glob.glob('raw/*.png')):
    name=os.path.splitext(os.path.basename(f))[0]
    a=np.asarray(Image.open(f).convert('RGB').resize((W,H),Image.LANCZOS)).astype(float)/255
    p95=np.percentile(lum(a),95)
    gain=min(1.8,max(1.0,0.85/max(p95,1e-3)))
    lifted=np.clip((a**0.78)*gain,0,1)
    zone=a[int(H*0.55):,:int(W*0.58)]
    zp95=np.percentile(lum(zone),95)
    burn=min(1.0,0.20/max(zp95,1e-3))   # keep zone p95 near 51/255
    b=lifted*(1-protect)+a*burn*protect
    img=ImageEnhance.Color(Image.fromarray((b*255+0.5).astype('uint8'))).enhance(1.06)
    img.save(f'masters/{name}.png',optimize=True)
    img.save(f'web/{name}.webp','WEBP',quality=78,method=6)
    print(name,'gain',round(gain,2),'burn',round(burn,2))
