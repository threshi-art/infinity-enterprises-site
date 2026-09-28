# Ember: #56 pre-scrim "lightest spot" check (method agreed in room: blur ~1 letter stroke, take max).
# Relative luminance per WCAG (linearised sRGB), Gaussian blur sigma 3px at 1600w (~one stroke of
# 16-24px text at 1440 CSS px), max inside the zone, then contrast vs white text. No scrim applied,
# so these are pessimistic; the automated check on the committed build supersedes them.
from PIL import Image
import numpy as np, json, os
def gaussian_filter(a,s):   # separable Gaussian in numpy, edge-padded
    r=int(3*s); k=np.exp(-0.5*(np.arange(-r,r+1)/s)**2); k/=k.sum()
    p=np.pad(a,((0,0),(r,r)),mode='edge'); a=sum(k[i]*p[:,i:i+a.shape[1]] for i in range(2*r+1))
    p=np.pad(a,((r,r),(0,0)),mode='edge'); return sum(k[i]*p[i:i+a.shape[0],:] for i in range(2*r+1))
def rel(a):
    c=a/255.0; c=np.where(c<=0.04045,c/12.92,((c+0.055)/1.055)**2.4)
    return 0.2126*c[...,0]+0.7152*c[...,1]+0.0722*c[...,2]
cr=lambda L:(1.05)/(L+0.05)
m=json.load(open('measure.json')); out={}
for n,d in m.items():
    L=gaussian_filter(rel(np.asarray(Image.open(d['file']).convert('RGB')).astype(float)),3)
    z=L[495:,:928]; x0=d['phone_x0'] or 547; ph=L[:,x0:x0+354]; phb=L[495:,x0:x0+354]
    r=lambda v:round(float(cr(v)),2)
    out[n]=dict(desktop_zone_lightest_cr_white=r(z.max()),desktop_zone_p95_cr_white=r(np.percentile(z,95)),
        phone_col_full_lightest_cr_white=r(ph.max()),phone_col_bottom45_lightest_cr_white=r(phb.max()))
    for k in ('desktop_zone_lightest_cr_white','phone_col_bottom45_lightest_cr_white'):
        v=out[n][k]; out[n][k.replace('_cr_white','_verdict')]='pass body 4.5' if v>=4.5 else ('pass large 3.0 only' if v>=3 else 'fail, needs scrim')
    d.update(out[n]); print(n,out[n])
L=gaussian_filter(rel(np.asarray(Image.open('cards/noir-jazz-upcoming.png').convert('RGB')).astype(float)),3)
print('noir-jazz card whole-image lightest cr white',round(float(cr(L.max())),2))
m['_card_noir_jazz_lightest_cr_white']=round(float(cr(L.max())),2)
json.dump(m,open('measure.json','w'),indent=1)
