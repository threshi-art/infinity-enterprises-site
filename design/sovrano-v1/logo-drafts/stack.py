from PIL import Image, ImageDraw
import importlib.util,sys
spec=importlib.util.spec_from_file_location("m","make.py")
src=open("make.py").read().split("IVORY=")[0]
exec(src)
IVORY=(244,239,230,255); INK=(14,14,16,255)
def line(d,text,cy,size,wght,track,W,fg):
    f=font(size*S,wght); tr=track*size*S
    ws=[d.textlength(c,font=f) for c in text]; tot=sum(ws)+tr*(len(text)-1)
    bb=d.textbbox((0,0),"I",font=f); capH=bb[3]-bb[1]
    x=(W*S-tot)/2; y=cy*S-capH/2-bb[1]
    for c,w in zip(text,ws):
        d.text((x,y),c,font=f,fill=fg); x+=w+tr
def stacked(top,bottom,name,W=2400,H=900):
    img=Image.new("RGBA",(W*S,H*S),INK); d=ImageDraw.Draw(img)
    line(d,top,390,280,600,0.04,W,IVORY)
    line(d,bottom,640,80,450,0.6,W,IVORY)
    img.resize((W,H),Image.LANCZOS).save(name)
stacked("SOVRANO","OMBRA","D-sovrano-ombra-stacked.png")
stacked("SOVRANO","INFINITUM","E-sovrano-infinitum-stacked.png")
