import sys; sys.path.insert(0,'/workspace/infinity-brand/sovrano-crest')
import os; os.chdir('/workspace/infinity-brand/sovrano-crest')
exec(open('crest.py').read().split("crest(OX,")[0])
os.chdir('/workspace/infinity-brand/masthead')
W,H=2400,560
def lockup(name,with_crest):
    im=Image.new("RGBA",(W*S,H*S),CLEAR); d=ImageDraw.Draw(im)
    x0=0
    if with_crest:
        c=Image.open('/workspace/infinity-brand/sovrano-crest/crest-transparent.png').crop((300,180,1300,1400))
        ch=int(H*S*0.92); c=c.resize((int(c.width*ch/c.height),ch),Image.LANCZOS)
        im.alpha_composite(c,(0,int((H*S-ch)/2))); x0=c.width+70*S
    f=font(250*S,600); t="SOVRANO"; track=14*S
    ws=[d.textlength(k,font=f) for k in t]; tot=sum(ws)+track*(len(t)-1)
    bb=d.textbbox((0,0),"H",font=f); y=H*S*0.40-(bb[1]+bb[3])/2; x=x0
    for k,w in zip(t,ws): d.text((x,y),k,font=f,fill=IV); x+=w+track
    f2=font(92*S,500,opsz=40); t2="INFINITUM"; tr2=(tot-sum(d.textlength(k,font=f2) for k in t2))/(len(t2)-1)
    bb2=d.textbbox((0,0),"H",font=f2); y2=H*S*0.80-(bb2[1]+bb2[3])/2; x=x0
    for k in t2: d.text((x,y2),k,font=f2,fill=CH); x+=d.textlength(k,font=f2)+tr2
    out=im.resize((W,H),Image.LANCZOS); out=out.crop(out.getbbox()); out.save(name); return out
a=lockup("masthead-wordmark.png",False); b=lockup("masthead-crest-lockup.png",True)
NAVY=(12,26,42,255)
pv=Image.new("RGBA",(1600,900),NAVY)
cov=Image.open('/workspace/infinity-brand/editorial-art/covers/cover-daily-desk.png').resize((800,450))
pv.paste(Image.open('/workspace/infinity-brand/editorial-art/covers/cover-daily-desk.png').resize((1600,900)).crop((800,0,1600,900)),(800,0))
wa=a.resize((620,int(a.height*620/a.width)),Image.LANCZOS); pv.alpha_composite(wa,(890,70))
wb=b.resize((560,int(b.height*560/b.width)),Image.LANCZOS); pv.alpha_composite(wb,(90,380))
pv.convert("RGB").save("preview-on-navy.jpg",quality=90)
print(a.size,b.size)
