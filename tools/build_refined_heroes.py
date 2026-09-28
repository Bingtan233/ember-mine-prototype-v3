from pathlib import Path
from PIL import Image, ImageDraw
import colorsys

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "heroes"
OUT.mkdir(parents=True, exist_ok=True)

ROLES = ["knight", "fighter", "ranger", "mage", "healer", "miner", "rogue", "monk", "witch", "engineer"]
BASE = [
    (101, 119, 157), (174, 66, 46), (54, 126, 83), (104, 70, 159), (222, 205, 143),
    (128, 87, 51), (48, 91, 117), (189, 111, 47), (139, 57, 127), (47, 139, 145),
]
SKINS = [(241, 193, 158), (211, 146, 105), (166, 105, 78), (246, 211, 183)]
HAIRS = [(52, 42, 45), (126, 57, 42), (226, 221, 207), (48, 57, 82), (105, 70, 43), (75, 146, 164)]
EYES = [(45, 113, 157), (92, 70, 170), (56, 137, 99), (181, 83, 55), (36, 47, 59)]

def rgba(rgb, a=255): return (*rgb, a)
def mul(rgb, amount): return tuple(max(0, min(255, int(v * amount))) for v in rgb)
def rect(d, box, fill): d.rectangle(box, fill=fill)

def shifted_base(idx):
    base = BASE[idx % 10]
    h, s, v = colorsys.rgb_to_hsv(*(c / 255 for c in base))
    h = (h + .06 * (idx // 10)) % 1
    return tuple(int(c * 255) for c in colorsys.hsv_to_rgb(h, s, v))

def draw_body(d, ox, oy, idx, frame, bob):
    role = ROLES[idx % 10]
    base = shifted_base(idx)
    dark, light = mul(base, .43), mul(base, 1.33)
    skin = SKINS[idx % len(SKINS)]
    metal = [(213, 221, 226), (240, 198, 71), (83, 207, 215)][idx % 3]
    cx = ox + 12
    # soft shadow and short legs
    rect(d, (cx-6, oy+29, cx+6, oy+30), (10, 12, 18, 105))
    if frame == 0:
        rect(d, (cx-5, oy+25, cx-2, oy+30), rgba(dark)); rect(d, (cx+1, oy+25, cx+4, oy+29), rgba(dark))
    elif frame == 2:
        rect(d, (cx-4, oy+25, cx-1, oy+29), rgba(dark)); rect(d, (cx+2, oy+25, cx+5, oy+30), rgba(dark))
    else:
        rect(d, (cx-5, oy+25, cx-2, oy+30), rgba(dark)); rect(d, (cx+2, oy+25, cx+5, oy+30), rgba(dark))
    rect(d, (cx-6, oy+29, cx-2, oy+30), (27, 25, 31, 255)); rect(d, (cx+2, oy+29, cx+6, oy+30), (27, 25, 31, 255))
    # compact torso with dark one-pixel outline
    rect(d, (cx-6, oy+18+bob, cx+6, oy+26+bob), rgba(mul(base,.28)))
    rect(d, (cx-5, oy+18+bob, cx+5, oy+24+bob), rgba(base))
    rect(d, (cx-4, oy+19+bob, cx+4, oy+20+bob), rgba(light))
    rect(d, (cx-5, oy+24+bob, cx+5, oy+26+bob), rgba(dark))
    # arms and hands
    swing = 1 if frame == 0 else -1 if frame == 2 else 0
    rect(d, (cx-8, oy+19+bob+swing, cx-6, oy+26+bob+swing), rgba(dark))
    rect(d, (cx+6, oy+19+bob-swing, cx+8, oy+26+bob-swing), rgba(dark))
    rect(d, (cx-8, oy+25+bob+swing, cx-6, oy+27+bob+swing), rgba(skin))
    rect(d, (cx+6, oy+25+bob-swing, cx+8, oy+27+bob-swing), rgba(skin))
    # costume marks
    if role in ("knight","healer"):
        rect(d, (cx-1, oy+18+bob, cx+1, oy+25+bob), rgba(metal))
        rect(d, (cx-4, oy+21+bob, cx+4, oy+22+bob), rgba(metal))
    elif role in ("mage","witch"):
        rect(d, (cx-5, oy+24+bob, cx+5, oy+27+bob), rgba(light))
        rect(d, (cx-1, oy+20+bob, cx+1, oy+21+bob), rgba(metal))
    elif role == "ranger":
        rect(d, (cx-1, oy+18+bob, cx+1, oy+25+bob), rgba((213,181,93)))
    elif role == "fighter":
        rect(d, (cx-4, oy+20+bob, cx+4, oy+21+bob), rgba((235,179,95)))
    elif role == "miner":
        rect(d, (cx-4, oy+19+bob, cx-3, oy+25+bob), rgba((225,165,70)))
        rect(d, (cx+3, oy+19+bob, cx+4, oy+25+bob), rgba((225,165,70)))
    elif role == "rogue":
        rect(d, (cx-5, oy+21+bob, cx+5, oy+23+bob), rgba((42,45,53)))
    elif role == "monk":
        rect(d, (cx-2, oy+18+bob, cx, oy+26+bob), rgba((245,198,83)))
    elif role == "engineer":
        rect(d, (cx-5, oy+23+bob, cx+5, oy+25+bob), rgba((226,178,63)))
    # readable equipment silhouettes
    if role == "knight":
        rect(d, (cx-10, oy+19+bob, cx-7, oy+27+bob), rgba(mul(base,.65)))
        rect(d, (cx-9, oy+20+bob, cx-8, oy+25+bob), rgba(metal))
    elif role == "fighter":
        rect(d, (cx+8, oy+14+bob, cx+9, oy+27), rgba((101,72,48)))
        rect(d, (cx+6, oy+13+bob, cx+11, oy+16+bob), rgba(metal))
    elif role == "ranger":
        d.arc((cx+5,oy+15,cx+12,oy+28),260,100,fill=rgba((108,221,203)),width=1)
    elif role in ("mage","healer","witch"):
        gem=(81,223,237) if role=="mage" else (255,220,89) if role=="healer" else (238,91,203)
        rect(d,(cx+8,oy+15,cx+9,oy+28),rgba(mul(metal,.72)));rect(d,(cx+7,oy+13,cx+10,oy+16),rgba(gem))
    elif role == "miner":
        rect(d,(cx+8,oy+14,cx+9,oy+28),rgba((117,81,48)));rect(d,(cx+5,oy+13,cx+11,oy+15),rgba(metal))
    elif role == "rogue":
        rect(d,(cx-10,oy+24,cx-6,oy+25),rgba(metal));rect(d,(cx+6,oy+24,cx+10,oy+25),rgba(metal))
    elif role == "engineer":
        rect(d,(cx+8,oy+18,cx+10,oy+26),rgba(metal));rect(d,(cx+7,oy+17,cx+11,oy+19),rgba((65,211,217)))

def draw_face(d, ox, oy, idx, direction, bob):
    role=ROLES[idx%10];base=shifted_base(idx);dark=mul(base,.40);light=mul(base,1.3)
    skin=SKINS[idx%4];hair=HAIRS[(idx*3+idx//10)%len(HAIRS)];eye=EYES[idx%len(EYES)];cx=ox+12;hy=oy+2+bob
    # oversized head: dark outline, face, ears
    rect(d,(cx-8,hy+3,cx+8,hy+16),rgba(mul(hair,.42)))
    rect(d,(cx-7,hy+4,cx+7,hy+16),rgba(skin))
    rect(d,(cx-9,hy+9,cx-7,hy+13),rgba(skin));rect(d,(cx+7,hy+9,cx+9,hy+13),rgba(skin))
    if direction==3:
        rect(d,(cx-8,hy+2,cx+8,hy+16),rgba(hair));rect(d,(cx-5,hy+14,cx+5,hy+17),rgba(mul(hair,.78)));return
    if direction in (1,2):
        # side profile, still retaining one large readable eye
        side=-1 if direction==1 else 1
        rect(d,(cx-8,hy+2,cx+8,hy+7),rgba(hair))
        rect(d,(cx-8 if side<0 else cx+5,hy+5,cx-5 if side<0 else cx+8,hy+16),rgba(hair))
        ex=cx-4 if side<0 else cx+2
        rect(d,(ex,hy+10,ex+2,hy+12),(26,26,31,255));rect(d,(ex+(0 if side<0 else 1),hy+11,ex+2,hy+12),rgba(eye))
        return
    # front hair mass and fringe
    rect(d,(cx-8,hy+2,cx+8,hy+7),rgba(hair))
    rect(d,(cx-8,hy+5,cx-6,hy+15),rgba(hair));rect(d,(cx+6,hy+5,cx+8,hy+15),rgba(hair))
    fringe=(idx%4)
    if fringe==0:
        d.polygon([(cx-7,hy+6),(cx-3,hy+3),(cx-1,hy+9),(cx+2,hy+4),(cx+7,hy+7)],fill=rgba(hair))
    elif fringe==1:
        d.polygon([(cx-7,hy+5),(cx+6,hy+4),(cx+2,hy+10),(cx-1,hy+6),(cx-4,hy+10)],fill=rgba(hair))
    elif fringe==2:
        rect(d,(cx-7,hy+5,cx+7,hy+8),rgba(hair));rect(d,(cx-2,hy+7,cx,hy+10),rgba(hair))
    else:
        d.polygon([(cx-7,hy+5),(cx-2,hy+2),(cx+2,hy+7),(cx+6,hy+3),(cx+7,hy+8)],fill=rgba(hair))
    # large anime eyes: black upper lash, colored iris, single white pixel
    for ex in (cx-5,cx+2):
        rect(d,(ex,hy+9,ex+3,hy+12),(24,23,29,255))
        rect(d,(ex+1,hy+10,ex+3,hy+12),rgba(eye))
        rect(d,(ex+1,hy+9,ex+1,hy+9),(255,255,244,255))
        rect(d,(ex+1,hy+12,ex+3,hy+12),rgba(mul(eye,1.35)))
    rect(d,(cx-6,hy+13,cx-5,hy+13),rgba((241,143,152)));rect(d,(cx+5,hy+13,cx+6,hy+13),rgba((241,143,152)))
    rect(d,(cx-1,hy+14,cx+1,hy+14),rgba(mul(skin,.60)))
    # role-defining head shapes drawn last for a clear silhouette
    if role=="knight":
        metal=(220,228,232);rect(d,(cx-8,hy,cx+8,hy+6),rgba(metal));rect(d,(cx-7,hy+5,cx-6,hy+11),rgba(metal));rect(d,(cx+6,hy+5,cx+7,hy+11),rgba(metal))
        rect(d,(cx-10,hy+1,cx-8,hy+6),rgba((244,246,239)));rect(d,(cx+8,hy+1,cx+10,hy+6),rgba((244,246,239)))
        rect(d,(cx-11,hy-1,cx-9,hy+2),rgba((244,246,239)));rect(d,(cx+9,hy-1,cx+11,hy+2),rgba((244,246,239)))
        rect(d,(cx-2,hy,cx+2,hy+2),rgba(light))
    elif role=="fighter":
        rect(d,(cx-9,hy+3,cx-7,hy+9),rgba(hair));rect(d,(cx+7,hy,cx+10,hy+7),rgba(hair));rect(d,(cx-4,hy-1,cx,hy+3),rgba(hair))
    elif role=="ranger":
        rect(d,(cx-9,hy+1,cx+9,hy+5),rgba(base));rect(d,(cx-9,hy+4,cx-7,hy+15),rgba(base));rect(d,(cx+7,hy+4,cx+9,hy+15),rgba(base));rect(d,(cx-7,hy+3,cx+7,hy+4),rgba(light))
    elif role=="mage":
        rect(d,(cx-10,hy+1,cx+10,hy+4),rgba(dark));d.polygon([(cx-5,hy+1),(cx,hy-7),(cx+6,hy+1)],fill=rgba(base));rect(d,(cx-4,hy-1,cx+5,hy),rgba(light))
    elif role=="healer":
        rect(d,(cx-9,hy+1,cx+9,hy+5),rgba((246,241,220)));rect(d,(cx-9,hy+4,cx-7,hy+16),rgba((246,241,220)));rect(d,(cx+7,hy+4,cx+9,hy+16),rgba((246,241,220)))
        rect(d,(cx-1,hy-3,cx+1,hy+3),rgba((245,207,62)));rect(d,(cx-3,hy-1,cx+3,hy+1),rgba((245,207,62)))
    elif role=="miner":
        rect(d,(cx-9,hy+1,cx+9,hy+5),rgba(base));rect(d,(cx-6,hy-1,cx+6,hy+2),rgba(light));rect(d,(cx-2,hy-2,cx+2,hy+2),rgba((234,189,70)));rect(d,(cx-1,hy-1,cx+1,hy),(255,243,157,255))
    elif role=="rogue":
        rect(d,(cx-9,hy+1,cx+9,hy+6),rgba(dark));rect(d,(cx-9,hy+5,cx-7,hy+15),rgba(dark));rect(d,(cx+7,hy+5,cx+9,hy+15),rgba(dark));rect(d,(cx-7,hy+14,cx+7,hy+16),rgba(base))
    elif role=="monk":
        rect(d,(cx-7,hy+1,cx+7,hy+3),rgba(skin));rect(d,(cx-8,hy+4,cx+8,hy+6),rgba(base));rect(d,(cx-8,hy+14,cx-5,hy+17),rgba(hair));rect(d,(cx+5,hy+14,cx+8,hy+17),rgba(hair))
    elif role=="witch":
        # twin tails plus compact witch crown
        rect(d,(cx-11,hy+5,cx-8,hy+16),rgba(hair));rect(d,(cx+8,hy+5,cx+11,hy+16),rgba(hair));rect(d,(cx-12,hy+12,cx-9,hy+18),rgba(hair));rect(d,(cx+9,hy+12,cx+12,hy+18),rgba(hair))
        rect(d,(cx-10,hy,cx+10,hy+3),rgba(dark));d.polygon([(cx-4,hy),(cx+1,hy-7),(cx+6,hy)],fill=rgba(base));rect(d,(cx-2,hy-1,cx+5,hy),rgba(light))
    elif role=="engineer":
        rect(d,(cx-9,hy+1,cx+9,hy+5),rgba((108,78,47)));rect(d,(cx-7,hy-1,cx+7,hy+2),rgba(base));rect(d,(cx-6,hy,cx-1,hy+3),rgba((94,218,226)));rect(d,(cx+1,hy,cx+6,hy+3),rgba((94,218,226)))

def draw_character(d, ox, oy, idx, direction, frame):
    bob=1 if frame!=1 else 0
    draw_body(d,ox,oy,idx,frame,bob)
    draw_face(d,ox,oy,idx,direction,bob)

for idx in range(30):
    sheet=Image.new("RGBA",(72,128),(0,0,0,0));d=ImageDraw.Draw(sheet)
    for direction in range(4):
        for frame in range(3): draw_character(d,frame*24,direction*32,idx,direction,frame)
    sheet.save(OUT/f"h{idx:02d}.png",optimize=False)

# Contact sheet uses the exact frame shown in the roster.
preview=Image.new("RGBA",(480,500),(23,20,30,255))
d=ImageDraw.Draw(preview)
for idx in range(30):
    sheet=Image.open(OUT/f"h{idx:02d}.png")
    frame=sheet.crop((24,0,48,32)).resize((72,96),Image.Resampling.NEAREST)
    x=(idx%6)*80+4;y=(idx//6)*100+2
    preview.alpha_composite(frame,(x,y))
preview.save(ROOT/"assets"/"hero-preview-v3.png",optimize=False)
print("Rebuilt 30 refined big-head chibi sprites")
