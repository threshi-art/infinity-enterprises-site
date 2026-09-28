from PIL import Image, ImageDraw, ImageFont
import math
F="/usr/share/fonts/truetype/sand-box/google/Bodoni Moda/BodoniModa-VariableFont_opsz,wght.ttf"
_fc={}
def font(size,wght=600,opsz=96):
    k=(size,wght,opsz)
    if k in _fc: return _fc[k]
    f=ImageFont.truetype(F,int(size)); vals=[]
    for a in f.get_variation_axes():
        n=a['name'] if isinstance(a['name'],str) else a['name'].decode()
        vals.append(opsz if n.lower().startswith('op') or 'ptical' in n else wght)
    f.set_variation_by_axes(vals); _fc[k]=f; return f
S=2
OX=(58,14,20,255); CH=(226,201,150,255); IV=(244,239,230,255); RED=(214,58,36,255); CLEAR=(0,0,0,0)
def lemni(d,cx,cy,a,w,fg):
    pts=[]
    for i in range(361):
        t=2*math.pi*i/360; den=1+math.sin(t)**2
        pts.append((cx+a*math.cos(t)/den, cy+a*math.sin(t)*math.cos(t)/den))
    d.line(pts,fill=fg,width=int(w),joint="curve")
def ctext(d,text,cx,cy,f,fg,track=0):
    ws=[d.textlength(c,font=f) for c in text]; tot=sum(ws)+track*(len(text)-1)
    bb=d.textbbox((0,0),"H",font=f); x=cx-tot/2; y=cy-(bb[1]+bb[3])/2
    for c,w in zip(text,ws): d.text((x,y),c,font=f,fill=fg); x+=w+track
def shield(cx,top,w,h,inset=0):
    R=cx+w/2-inset; T=top+inset; B=top+h-inset*1.5; mid=T+(B-T)*0.45
    right=[(cx,T),(R,T),(R,mid)]
    for i in range(1,31):
        t=i/30; right.append((R-(R-cx)*(1-math.cos(t*math.pi/2)), mid+(B-mid)*math.sin(t*math.pi/2)))
    left=[(2*cx-x,y) for x,y in right[::-1]]
    return right+left[1:]
def crest(bg,name,W=1600,H=2000):
    im=Image.new("RGBA",(W*S,H*S),bg); d=ImageDraw.Draw(im)
    fg=IV if bg!=IV else OX
    cx=W*S/2; top=220*S; sw=900*S; sh=1100*S
    d.polygon(shield(cx,top,sw,sh),outline=CH,width=7*S)
    d.polygon(shield(cx,top,sw,sh,inset=30*S),outline=CH,width=2*S)
    d.rectangle((cx-sw/2+30*S,top+159*S,cx+sw/2-30*S,top+177*S),fill=CH)
    d.rectangle((cx-sw/2+30*S,top+165*S,cx+sw/2-30*S,top+171*S),fill=RED)
    ctext(d,"MMXXVI",cx,top+100*S,font(46*S,500),CH,track=18*S)
    ctext(d,"S",cx,top+560*S,font(540*S,600),fg)
    lemni(d,cx,top+880*S,115*S,5*S,CH)
    ctext(d,"SOVRANO",cx,top+sh+180*S,font(130*S,600),fg,track=10*S)
    d.rectangle((cx-60*S,top+sh+272*S,cx+60*S,top+sh+276*S),fill=CH)
    ctext(d,"INFINITUM",cx,top+sh+350*S,font(62*S,500),CH,track=40*S)
    out=im.resize((W,H),Image.LANCZOS); out.save(name); return out
crest(OX,"crest-oxblood.png"); crest(CLEAR,"crest-transparent.png"); crest(IV,"crest-ivory.png")

def badge(edition,accent,name,D=1000):
    im=Image.new("RGBA",(D*S,D*S),CLEAR); d=ImageDraw.Draw(im)
    c=D*S/2; R=D*S/2-6*S
    d.ellipse((c-R,c-R,c+R,c+R),fill=OX,outline=CH,width=6*S)
    r2=R-118*S; d.ellipse((c-r2,c-r2,c+r2,c+r2),outline=CH,width=3*S)
    f=font(66*S,600); rad=R-60*S
    def arc(text,top):
        ws=[d.textlength(ch,font=f) for ch in text]; gap=14*S
        total=sum(ws)+gap*(len(text)-1); span=total/rad
        a=(-math.pi/2-span/2) if top else (math.pi/2+span/2)
        bb=d.textbbox((0,0),"H",font=f)
        for ch,w in zip(text,ws):
            mid=a+((w/2)/rad if top else -(w/2)/rad)
            g=Image.new("RGBA",(int(w)+20*S,int((bb[3]-bb[1])*2)),CLEAR); gd=ImageDraw.Draw(g)
            gd.text((10*S,g.height/2-(bb[1]+bb[3])/2),ch,font=f,fill=IV)
            deg=math.degrees(mid)
            rot=-(deg+90) if top else -(deg-90)
            g=g.rotate(rot,resample=Image.BICUBIC,expand=True)
            x=c+rad*math.cos(mid); y=c+rad*math.sin(mid)
            im.alpha_composite(g,(int(x-g.width/2),int(y-g.height/2)))
            a+=((w+gap)/rad if top else -(w+gap)/rad)
    arc("SOVRANO",True); arc(edition.upper(),False)
    for s in (-1,1):
        d.ellipse((c+s*rad-8*S,c-8*S,c+s*rad+8*S,c+8*S),fill=CH)
    ctext(d,"S",c,c-45*S,font(400*S,600),IV)
    lemni(d,c,c+210*S,75*S,5*S,CH)
    if accent==RED: d.rectangle((c-100*S,c+284*S,c+100*S,c+302*S),fill=CH)
    d.rectangle((c-100*S,c+290*S,c+100*S,c+296*S),fill=accent)
    out=im.resize((D,D),Image.LANCZOS); out.save(name); return out
bs=[badge("Infinitum",CH,"badge-infinitum.png"),badge("Motore",RED,"badge-motore.png"),badge("Moda",IV,"badge-moda.png")]
fv=Image.new("RGBA",(512*S,512*S),OX); d=ImageDraw.Draw(fv)
ctext(d,"S",256*S,236*S,font(400*S,700,28),IV)
d.rectangle((186*S,425*S,326*S,437*S),fill=CH)
fv=fv.resize((512,512),Image.LANCZOS); fv.save("favicon-512.png")
for s in (180,32,16): fv.resize((s,s),Image.LANCZOS).save(f"favicon-{s}.png")
sheet=Image.new("RGBA",(2600,1300),(18,18,20,255))
sheet.alpha_composite(Image.open("crest-oxblood.png").resize((1000,1250)),(25,25))
for i,b in enumerate(bs): sheet.alpha_composite(b.resize((500,500)),(1080+i*505,80))
sheet.alpha_composite(fv.resize((180,180)),(1100,720))
sheet.alpha_composite(Image.open("favicon-32.png"),(1320,794))
sheet.alpha_composite(Image.open("favicon-16.png"),(1372,802))
sheet.convert("RGB").save("sheet.png")
print("ok")
