from pathlib import Path
from PIL import Image, ImageDraw
import colorsys

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "heroes"
OUT.mkdir(parents=True, exist_ok=True)

ROLES = ["knight","fighter","ranger","mage","healer","miner","rogue","monk","witch","engineer"]
ROLE_INDEX = [0,1,8,8,1,0,1,7,0,0,2,0,0,3,0,3,7,0,0,2,1,6,0,1,3,3,8,1,2,0]
BASE = [(101,119,157),(174,66,46),(54,126,83),(104,70,159),(222,205,143),(128,87,51),(48,91,117),(189,111,47),(139,57,127),(47,139,145)]
THREE_KINGDOMS_COLORS = {1:(190,151,42),19:(178,141,38),2:(209,174,56),3:(166,63,139),4:(143,42,42),5:(210,185,88),6:(52,124,68),7:(121,50,39),8:(214,224,226),9:(178,158,61),10:(126,91,40),11:(60,68,83),12:(146,57,48),13:(72,45,108),14:(57,65,73),15:(155,55,45),16:(177,132,38),17:(72,37,47),18:(92,84,72)}
SKINS = [(244,199,166),(218,153,112),(171,108,80),(248,218,190)]
HAIRS = [(48,39,45),(129,59,43),(229,224,211),(45,55,81),(108,72,44),(70,145,165)]
EYES = [(41,130,181),(104,76,190),(49,151,105),(193,80,61),(45,51,64),(177,95,183)]

def rgba(c,a=255): return (*c,a)
def mul(c,f): return tuple(max(0,min(255,int(v*f))) for v in c)
def rect(d,b,c): d.rectangle(b,fill=c)
def base_color(i):
    if i in THREE_KINGDOMS_COLORS: return THREE_KINGDOMS_COLORS[i]
    c=BASE[i%10];h,s,v=colorsys.rgb_to_hsv(*(x/255 for x in c));h=(h+.055*(i//10))%1
    return tuple(int(x*255) for x in colorsys.hsv_to_rgb(h,s,v))

def role_for(i): return ROLES[ROLE_INDEX[i] if i < len(ROLE_INDEX) else i%10]

def body(d,ox,oy,i,frame,bob):
    role=role_for(i);base=base_color(i);dark=mul(base,.38);light=mul(base,1.38);skin=SKINS[i%4];metal=[(217,226,231),(241,201,73),(83,214,222)][i%3];cx=ox+16
    rect(d,(cx-8,oy+45,cx+8,oy+46),(8,10,15,100))
    # short expressive legs
    if frame==0:
        rect(d,(cx-7,oy+38,cx-3,oy+45),rgba(dark));rect(d,(cx+2,oy+38,cx+5,oy+44),rgba(dark));rect(d,(cx-8,oy+44,cx-3,oy+46),(27,25,32,255))
    elif frame==2:
        rect(d,(cx-5,oy+38,cx-2,oy+44),rgba(dark));rect(d,(cx+3,oy+38,cx+7,oy+45),rgba(dark));rect(d,(cx+3,oy+44,cx+8,oy+46),(27,25,32,255))
    else:
        rect(d,(cx-7,oy+38,cx-3,oy+45),rgba(dark));rect(d,(cx+3,oy+38,cx+7,oy+45),rgba(dark));rect(d,(cx-8,oy+44,cx-3,oy+46),(27,25,32,255));rect(d,(cx+3,oy+44,cx+8,oy+46),(27,25,32,255))
    # torso and costume outline
    rect(d,(cx-8,oy+26+bob,cx+8,oy+40+bob),rgba(mul(base,.24)))
    rect(d,(cx-7,oy+26+bob,cx+7,oy+37+bob),rgba(base));rect(d,(cx-6,oy+27+bob,cx+6,oy+29+bob),rgba(light));rect(d,(cx-7,oy+36+bob,cx+7,oy+39+bob),rgba(dark))
    swing=1 if frame==0 else -1 if frame==2 else 0
    rect(d,(cx-11,oy+28+bob+swing,cx-8,oy+39+bob+swing),rgba(dark));rect(d,(cx+8,oy+28+bob-swing,cx+11,oy+39+bob-swing),rgba(dark))
    rect(d,(cx-11,oy+37+bob+swing,cx-8,oy+40+bob+swing),rgba(skin));rect(d,(cx+8,oy+37+bob-swing,cx+11,oy+40+bob-swing),rgba(skin))
    if role in ("knight","healer"):
        rect(d,(cx-2,oy+26+bob,cx+2,oy+37+bob),rgba(metal));rect(d,(cx-6,oy+31+bob,cx+6,oy+33+bob),rgba(metal))
    elif role in ("mage","witch"):
        rect(d,(cx-7,oy+36+bob,cx+7,oy+40+bob),rgba(light));rect(d,(cx-1,oy+30+bob,cx+1,oy+32+bob),rgba(metal))
    elif role=="ranger": rect(d,(cx-1,oy+26+bob,cx+1,oy+38+bob),rgba((224,186,82)))
    elif role=="fighter": rect(d,(cx-6,oy+30+bob,cx+6,oy+32+bob),rgba((238,178,91)))
    elif role=="miner":
        rect(d,(cx-6,oy+27+bob,cx-4,oy+38+bob),rgba((229,166,61)));rect(d,(cx+4,oy+27+bob,cx+6,oy+38+bob),rgba((229,166,61)))
    elif role=="rogue": rect(d,(cx-7,oy+32+bob,cx+7,oy+35+bob),rgba((38,43,53)))
    elif role=="engineer": rect(d,(cx-7,oy+35+bob,cx+7,oy+38+bob),rgba((230,177,58)))
    # weapons
    if role=="knight":
        rect(d,(cx-14,oy+28,cx-11,oy+41),rgba(mul(base,.62)));rect(d,(cx-13,oy+30,cx-12,oy+38),rgba(metal))
    elif role=="fighter":
        rect(d,(cx+11,oy+20,cx+13,oy+41),rgba((105,72,47)));rect(d,(cx+8,oy+18,cx+16,oy+22),rgba(metal))
    elif role=="ranger": d.arc((cx+8,oy+23,cx+17,oy+42),250,110,fill=rgba((99,230,206)),width=2)
    elif role in ("mage","healer","witch"):
        gem=(82,229,241) if role=="mage" else (255,221,82) if role=="healer" else (242,91,207)
        rect(d,(cx+12,oy+22,cx+13,oy+42),rgba(mul(metal,.68)));rect(d,(cx+10,oy+19,cx+15,oy+24),rgba(gem));rect(d,(cx+12,oy+18,cx+13,oy+20),rgba(mul(gem,1.25)))
    elif role=="miner":
        rect(d,(cx+11,oy+22,cx+13,oy+42),rgba((111,77,47)));rect(d,(cx+7,oy+20,cx+17,oy+23),rgba(metal))
    elif role=="rogue":
        rect(d,(cx-14,oy+37,cx-9,oy+39),rgba(metal));rect(d,(cx+9,oy+37,cx+14,oy+39),rgba(metal))
    elif role=="engineer":
        rect(d,(cx+11,oy+28,cx+15,oy+40),rgba(metal));rect(d,(cx+9,oy+25,cx+17,oy+29),rgba((70,218,224)))

def front_face(d,ox,oy,i,bob):
    role=role_for(i);base=base_color(i);dark=mul(base,.38);light=mul(base,1.36);skin=SKINS[i%4];hair=HAIRS[(i*3+i//10)%6];eye=EYES[i%6];cx=ox+16;hy=oy+2+bob
    # head outline and ears
    rect(d,(cx-11,hy+4,cx+11,hy+24),rgba(mul(hair,.35)));rect(d,(cx-10,hy+5,cx+10,hy+23),rgba(skin));rect(d,(cx-13,hy+13,cx-10,hy+19),rgba(skin));rect(d,(cx+10,hy+13,cx+13,hy+19),rgba(skin))
    # hair cap, side locks and layered fringe
    rect(d,(cx-11,hy+2,cx+11,hy+9),rgba(hair));rect(d,(cx-11,hy+7,cx-9,hy+22),rgba(hair));rect(d,(cx+9,hy+7,cx+11,hy+22),rgba(hair))
    fringe=i%4
    if fringe==0:d.polygon([(cx-10,hy+8),(cx-5,hy+3),(cx-2,hy+12),(cx+2,hy+5),(cx+10,hy+9)],fill=rgba(hair))
    elif fringe==1:d.polygon([(cx-10,hy+7),(cx+9,hy+5),(cx+5,hy+13),(cx,hy+8),(cx-5,hy+14)],fill=rgba(hair))
    elif fringe==2:
        rect(d,(cx-10,hy+7,cx+10,hy+11),rgba(hair));rect(d,(cx-3,hy+10,cx,hy+14),rgba(hair))
    else:d.polygon([(cx-10,hy+8),(cx-4,hy+3),(cx+1,hy+10),(cx+6,hy+3),(cx+10,hy+10)],fill=rgba(hair))
    # eyebrows
    rect(d,(cx-7,hy+12,cx-3,hy+13),rgba(mul(hair,.55)));rect(d,(cx+3,hy+12,cx+7,hy+13),rgba(mul(hair,.55)))
    # anime eyes 5x5: lash, sclera, iris, pupil, highlight
    for ex in (cx-8,cx+3):
        rect(d,(ex,hy+14,ex+5,hy+18),(28,25,33,255));rect(d,(ex+1,hy+15,ex+4,hy+18),rgba((245,244,239)));rect(d,(ex+2,hy+15,ex+4,hy+19),rgba(eye));rect(d,(ex+3,hy+16,ex+4,hy+19),rgba(mul(eye,.48)));rect(d,(ex+2,hy+15,ex+2,hy+15),(255,255,255,255))
    # nose, mouth, blush
    rect(d,(cx,hy+19,cx+1,hy+20),rgba(mul(skin,.72)));rect(d,(cx-2,hy+22,cx+2,hy+22),rgba((135,62,65)));rect(d,(cx-8,hy+20,cx-6,hy+21),rgba((242,146,158)));rect(d,(cx+6,hy+20,cx+8,hy+21),rgba((242,146,158)))
    # role silhouette
    if role=="knight":
        metal=(224,232,235);rect(d,(cx-12,hy,cx+12,hy+9),rgba(metal));rect(d,(cx-11,hy+8,cx-9,hy+16),rgba(metal));rect(d,(cx+9,hy+8,cx+11,hy+16),rgba(metal));rect(d,(cx-15,hy-2,cx-11,hy+5),rgba((250,250,239)));rect(d,(cx+11,hy-2,cx+15,hy+5),rgba((250,250,239)));rect(d,(cx-3,hy,cx+3,hy+2),rgba(light))
    elif role=="fighter":
        rect(d,(cx-13,hy+3,cx-10,hy+13),rgba(hair));rect(d,(cx+10,hy,cx+14,hy+10),rgba(hair));rect(d,(cx-6,hy-1,cx,hy+4),rgba(hair))
    elif role=="ranger":
        rect(d,(cx-13,hy,cx+13,hy+7),rgba(base));rect(d,(cx-13,hy+6,cx-10,hy+24),rgba(base));rect(d,(cx+10,hy+6,cx+13,hy+24),rgba(base));rect(d,(cx-10,hy+4,cx+10,hy+6),rgba(light))
    elif role=="mage":
        rect(d,(cx-15,hy+1,cx+15,hy+5),rgba(dark));d.polygon([(cx-7,hy+1),(cx,hy-10),(cx+9,hy+1)],fill=rgba(base));rect(d,(cx-6,hy-2,cx+8,hy),rgba(light))
    elif role=="healer":
        cream=(249,244,225);rect(d,(cx-13,hy,cx+13,hy+7),rgba(cream));rect(d,(cx-13,hy+6,cx-10,hy+25),rgba(cream));rect(d,(cx+10,hy+6,cx+13,hy+25),rgba(cream));rect(d,(cx-2,hy-4,cx+2,hy+4),rgba((248,207,55)));rect(d,(cx-5,hy-1,cx+5,hy+2),rgba((248,207,55)))
    elif role=="miner":
        rect(d,(cx-13,hy,cx+13,hy+7),rgba(base));rect(d,(cx-9,hy-3,cx+9,hy+2),rgba(light));rect(d,(cx-3,hy-4,cx+3,hy+2),rgba((235,187,57)));rect(d,(cx-1,hy-2,cx+1,hy),(255,245,159,255))
    elif role=="rogue":
        rect(d,(cx-13,hy,cx+13,hy+8),rgba(dark));rect(d,(cx-13,hy+7,cx-10,hy+24),rgba(dark));rect(d,(cx+10,hy+7,cx+13,hy+24),rgba(dark));rect(d,(cx-10,hy+21,cx+10,hy+24),rgba(base))
    elif role=="monk":
        rect(d,(cx-10,hy,cx+10,hy+3),rgba(skin));rect(d,(cx-12,hy+5,cx+12,hy+8),rgba(base));rect(d,(cx-11,hy+21,cx-7,hy+25),rgba(hair));rect(d,(cx+7,hy+21,cx+11,hy+25),rgba(hair))
    elif role=="witch":
        rect(d,(cx-16,hy+7,cx-12,hy+24),rgba(hair));rect(d,(cx+12,hy+7,cx+16,hy+24),rgba(hair));rect(d,(cx-17,hy+19,cx-13,hy+29),rgba(hair));rect(d,(cx+13,hy+19,cx+17,hy+29),rgba(hair));rect(d,(cx-15,hy+1,cx+15,hy+5),rgba(dark));d.polygon([(cx-7,hy+1),(cx+1,hy-10),(cx+10,hy+1)],fill=rgba(base));rect(d,(cx-4,hy-1,cx+8,hy),rgba(light))
    else:
        rect(d,(cx-13,hy,cx+13,hy+7),rgba((104,76,48)));rect(d,(cx-10,hy-3,cx+10,hy+3),rgba(base));rect(d,(cx-9,hy-1,cx-2,hy+3),rgba((95,224,230)));rect(d,(cx+2,hy-1,cx+9,hy+3),rgba((95,224,230)))
    # Yellow Turban visual identity and named-warrior ornaments.
    if i in (1,2,16,19):
        rect(d,(cx-11,hy+5,cx+11,hy+8),rgba((238,202,64)));rect(d,(cx+9,hy+6,cx+14,hy+10),rgba((238,202,64)))
    if i==6: rect(d,(cx-8,hy+4,cx+8,hy+6),rgba((54,132,69)))
    if i==13: rect(d,(cx-10,hy-2,cx+10,hy+1),rgba((199,72,86)));rect(d,(cx-2,hy-5,cx+2,hy),rgba((238,191,61)))

def side_or_back(d,ox,oy,i,direction,bob):
    base=base_color(i);hair=HAIRS[(i*3+i//10)%6];skin=SKINS[i%4];cx=ox+16;hy=oy+2+bob
    rect(d,(cx-11,hy+3,cx+11,hy+24),rgba(mul(hair,.4)));rect(d,(cx-10,hy+4,cx+10,hy+23),rgba(hair if direction==3 else skin))
    if direction in (1,2):
        side=-1 if direction==1 else 1;rect(d,(cx-11 if side<0 else cx+8,hy+5,cx-8 if side<0 else cx+11,hy+23),rgba(hair));ex=cx-6 if side<0 else cx+2
        rect(d,(ex,hy+14,ex+5,hy+18),(28,25,33,255));rect(d,(ex+2,hy+15,ex+4,hy+18),rgba(EYES[i%6]));rect(d,(ex+2,hy+15,ex+2,hy+15),(255,255,255,255))
    else:
        rect(d,(cx-10,hy+19,cx+10,hy+25),rgba(mul(hair,.8)))

def character(d,ox,oy,i,direction,frame):
    bob=1 if frame!=1 else 0;body(d,ox,oy,i,frame,bob)
    if direction==0:front_face(d,ox,oy,i,bob)
    else:side_or_back(d,ox,oy,i,direction,bob)

for i in range(30):
    sheet=Image.new("RGBA",(96,192),(0,0,0,0));d=ImageDraw.Draw(sheet)
    for direction in range(4):
        for frame in range(3):character(d,frame*32,direction*48,i,direction,frame)
    sheet.save(OUT/f"h{i:02d}.png",optimize=False)

# Tiny tutorial fairy.
fairy=Image.new("RGBA",(32,32),(0,0,0,0));d=ImageDraw.Draw(fairy)
d.polygon([(7,13),(1,8),(4,17),(1,23),(9,19)],fill=(151,239,248,180));d.polygon([(25,13),(31,8),(28,17),(31,23),(23,19)],fill=(151,239,248,180))
rect(d,(11,4,21,15),(240,199,165,255));rect(d,(10,2,22,7),(244,224,123,255));rect(d,(9,5,11,14),(244,224,123,255));rect(d,(21,5,23,14),(244,224,123,255))
rect(d,(13,9,15,11),(38,87,135,255));rect(d,(18,9,20,11),(38,87,135,255));rect(d,(12,15,20,25),(111,210,133,255));rect(d,(14,24,16,29),(244,224,123,255));rect(d,(18,24,20,29),(244,224,123,255))
fairy.save(ROOT/"assets"/"guide-fairy.png",optimize=False)

# Small two-frame patrol monster used by the live exploration strip.
slime=Image.new("RGBA",(64,32),(0,0,0,0));d=ImageDraw.Draw(slime)
for frame in range(2):
    ox=frame*32;top=10+(frame%2)
    d.polygon([(ox+5,25),(ox+7,15),(ox+11,10),(ox+21,10),(ox+26,15),(ox+28,25),(ox+24,28),(ox+9,28)],fill=(47,39,61,255))
    d.polygon([(ox+7,23),(ox+9,15),(ox+13,12),(ox+21,12),(ox+25,16),(ox+26,23),(ox+22,26),(ox+10,26)],fill=(116,63,148,255))
    rect(d,(ox+10,16,ox+14,20),(245,239,218,255));rect(d,(ox+20,16,ox+24,20),(245,239,218,255))
    rect(d,(ox+12,18,ox+14,21),(24,20,31,255));rect(d,(ox+20,18,ox+22,21),(24,20,31,255));rect(d,(ox+15,23,ox+20,24),(55,24,61,255))
slime.save(ROOT/"assets"/"patrol-slime.png",optimize=False)

preview=Image.new("RGBA",(480,740),(23,20,30,255))
for i in range(30):
    sheet=Image.open(OUT/f"h{i:02d}.png");frame=sheet.crop((32,0,64,48)).resize((64,96),Image.Resampling.NEAREST);x=(i%6)*80+8;y=(i//6)*145+10;preview.alpha_composite(frame,(x,y))
preview.save(ROOT/"assets"/"hero-preview-v3.png",optimize=False)
print("Built 30 detailed 32x48 anime chibi sheets, tutorial fairy and patrol monster")
