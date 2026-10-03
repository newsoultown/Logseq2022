import sys
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw
def banner(srcp,outp,W=1600,H=600,k=.60):
    src=Image.open(srcp).convert('RGB')
    bg=src.resize((W,int(W*src.height/src.width)),Image.LANCZOS)
    top=(bg.height-H)//2;bg=bg.crop((0,top,W,top+H)).filter(ImageFilter.GaussianBlur(30))
    bg=ImageEnhance.Brightness(bg).enhance(.5);bg=ImageEnhance.Color(bg).enhance(.65)
    ch=int(H*k);cw=int(ch*src.width/src.height);cov=src.resize((cw,ch),Image.LANCZOS)
    x=(W-cw)//2;y=(H-ch)//2
    sh=Image.new('RGBA',(W,H),(0,0,0,0));d=ImageDraw.Draw(sh);d.rectangle((x+6,y+12,x+cw+6,y+ch+12),fill=(0,0,0,160))
    sh=sh.filter(ImageFilter.GaussianBlur(12));bg=bg.convert('RGBA');bg.alpha_composite(sh);bg=bg.convert('RGB');bg.paste(cov,(x,y))
    bg.save(outp,quality=85,optimize=True,progressive=True)
if __name__=='__main__':banner(sys.argv[1],sys.argv[2])
