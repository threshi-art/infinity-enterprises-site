from PIL import Image, ImageDraw, ImageFont
import math
F="/usr/share/fonts/truetype/sand-box/google/Bodoni Moda/BodoniModa-VariableFont_opsz,wght.ttf"
def font(size, wght=600, opsz=96):
    f=ImageFont.truetype(F,size)
    try:
        axes=f.get_variation_axes(); vals=[]
        for a in axes:
            n=a['name'] if isinstance(a['name'],str) else a['name'].decode()
            vals.append(opsz if 'ptical' in n or n.lower().startswith('op') else wght)
        f.set_variation_by_axes(vals)
    except Exception as e: print("axes",e)
    return f
S=4  # supersample
def wordmark(text, fg, bg, W=2400, H=900, size=300, track=0.06, wght=600, inf=False, name="x"):
    img=Image.new("RGBA",(W*S,H*S),bg); d=ImageDraw.Draw(img)
    f=font(size*S,wght)
    widths=[d.textlength(c,font=f) for c in text]
    tr=track*size*S
    total=sum(widths)+tr*(len(text)-1)
    x=(W*S-total)/2
    bb=d.textbbox((0,0),"I",font=f); capH=bb[3]-bb[1]
    y=(H*S-capH)/2-bb[1]
    for c,w in zip(text,widths):
        if inf and c=="O":
            # draw O, then hairline infinity lemniscate inside the counter
            d.text((x,y),c,font=f,fill=fg)
            cb=d.textbbox((x,y),c,font=f)
            cx=(cb[0]+cb[2])/2; cy=(cb[1]+cb[3])/2
            a=(cb[2]-cb[0])*0.5  # half-width spanning beyond the bowl
            pts=[]
            for i in range(721):
                t=2*math.pi*i/720
                den=1+math.sin(t)**2
                pts.append((cx+a*math.cos(t)/den, cy+a*math.sin(t)*math.cos(t)/den))
            d.line(pts,fill=fg,width=int(size*S*0.012),joint="curve")
        else:
            d.text((x,y),c,font=f,fill=fg)
        x+=w+tr
    img=img.resize((W,H),Image.LANCZOS); img.save(name+".png"); return img
IVORY=(244,239,230,255); INK=(14,14,16,255); CLEAR=(0,0,0,0)
wordmark("INFINOIR",INK,IVORY,track=0.04,name="A-classic-ink-on-ivory")
wordmark("INFINOIR",IVORY,INK,track=0.04,inf=True,name="B-infinity-O-ivory-on-noir")
wordmark("INFINOIR",INK,IVORY,track=0.04,inf=True,name="B-infinity-O-ink-on-ivory")
wordmark("INFINOIR",INK,CLEAR,track=0.04,inf=True,name="B-infinity-O-ink-transparent")
wordmark("INFINOIR",IVORY,CLEAR,track=0.04,inf=True,name="B-infinity-O-ivory-transparent")
wordmark("INFINOIR",IVORY,INK,track=0.22,size=200,wght=450,name="C-wide-tracked-ivory-on-noir")
