from PIL import Image, ImageDraw, ImageFont
import math
exec(open("make.py").read().split("IVORY=")[0])
FI="/usr/share/fonts/truetype/sand-box/google/Bodoni Moda/BodoniModa-Italic-VariableFont_opsz,wght.ttf"
def ifont(size,wght=500,opsz=96):
    f=ImageFont.truetype(FI,size)
    vals=[]
    for a in f.get_variation_axes():
        n=a['name'] if isinstance(a['name'],str) else a['name'].decode()
        vals.append(opsz if n.lower().startswith('op') or 'ptical' in n else wght)
    f.set_variation_by_axes(vals); return f
def lemni(d,cx,cy,a,w,fg):
    pts=[]
    for i in range(721):
        t=2*math.pi*i/720; den=1+math.sin(t)**2
        pts.append((cx+a*math.cos(t)/den, cy+a*math.sin(t)*math.cos(t)/den))
    d.line(pts,fill=fg,width=w,joint="curve")
def setline(d,text,f,cy,track,W,fg,target_w=None,inf_on=None,size=100):
    ws=[d.textlength(c,font=f) for c in text]
    if target_w: tr=(target_w-sum(ws))/(len(text)-1)
    else: tr=track
    tot=sum(ws)+tr*(len(text)-1)
    bb=d.textbbox((0,0),"I",font=f); capH=bb[3]-bb[1]
    x=(W-tot)/2; y=cy-capH/2-bb[1]; x0=x
    for i,(c,w) in enumerate(zip(text,ws)):
        d.text((x,y),c,font=f,fill=fg)
        if inf_on is not None and i==inf_on:
            cb=d.textbbox((x,y),c,font=f)
            lemni(d,(cb[0]+cb[2])/2,(cb[1]+cb[3])/2,(cb[2]-cb[0])*0.5,max(2,int(size*0.012)),fg)
        x+=w+tr
    return x0,x0+tot,cy-capH/2,cy+capH/2
W,H=2400,1200
def canvas(bg): 
    im=Image.new("RGBA",(W*S,H*S),bg); return im,ImageDraw.Draw(im)
def save(im,n): im.resize((W,H),Image.LANCZOS).save("sovrano-infinitum/"+n)

# 1 Noir Couture: stacked, justified to equal width, lemniscate in O of SOVRANO, ink on ivory
IV=(244,239,230,255); INK=(14,14,16,255)
im,d=canvas(IV)
x0,x1,t,b=setline(d,"SOVRANO",font(300*S,600),520*S,0.04*300*S,W*S,INK,inf_on=6,size=300*S)
setline(d,"INFINITUM",font(175*S,500),800*S,0,W*S,INK,target_w=x1-x0)
save(im,"1-noir-couture-justified.png")

# 2 Oxblood & Champagne: one line equal size, italic Infinitum
OX=(58,14,20,255); CH=(226,201,150,255)
im,d=canvas(OX)
f1=font(200*S,600); f2=ifont(200*S,500)
a=d.textlength("SOVRANO",font=f1)+ 0.03*200*S*6; gap=60*S; bI=d.textlength("Infinitum",font=f2)
tot=a+gap+bI; x=(W*S-tot)/2
bb=d.textbbox((0,0),"I",font=f1); cy=600*S; y=cy-(bb[3]-bb[1])/2-bb[1]
for c in "SOVRANO":
    d.text((x,y),c,font=f1,fill=CH); x+=d.textlength(c,font=f1)+0.03*200*S
x+=gap-0.03*200*S
d.text((x,y),"Infinitum",font=f2,fill=CH)
save(im,"2-oxblood-champagne-one-line.png")

# 3 Paddock Night: ivory on carbon, one line equal size, orange-red start hairline under
CB=(20,22,26,255); RED=(226,62,38,255)
im,d=canvas(CB)
x0,x1,t,b=setline(d,"SOVRANO INFINITUM",font(150*S,600),560*S,0.05*150*S,W*S,IV)
d.rectangle((x0,b+70*S,x0+(x1-x0)*0.18,b+70*S+6*S),fill=RED)
d.rectangle((x0+(x1-x0)*0.18+20*S,b+72*S,x1,b+72*S+2*S),fill=IV)
save(im,"3-paddock-night-one-line.png")

# 4 Monogram seal: S with lemniscate, for favicon/app icon/social avatar
im,d=canvas(INK)
cx,cy=W*S/2,H*S/2; R=420*S
d.ellipse((cx-R,cy-R,cx+R,cy+R),outline=CH,width=4*S)
d.ellipse((cx-R+28*S,cy-R+28*S,cx+R-28*S,cy+R-28*S),outline=CH,width=2*S)
fS=font(520*S,600); bb=d.textbbox((0,0),"S",font=fS)
d.text((cx-(bb[0]+bb[2])/2,cy-(bb[1]+bb[3])/2-40*S),"S",font=fS,fill=IV)
lemni(d,cx,cy+250*S,110*S,5*S,CH)
save(im,"4-monogram-seal.png")
