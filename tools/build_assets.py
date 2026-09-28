from pathlib import Path
from PIL import Image, ImageDraw
import colorsys
import random

ROOT = Path(__file__).resolve().parents[1]
SPRITES = ROOT / "assets" / "heroes"
SPRITES.mkdir(parents=True, exist_ok=True)

ROLES = ["knight", "fighter", "ranger", "mage", "healer", "miner", "rogue", "monk", "witch", "engineer"]
BASE_COLORS = [
    (76, 117, 166), (177, 68, 48), (64, 126, 73), (100, 73, 160), (218, 190, 105),
    (119, 83, 55), (54, 86, 103), (176, 104, 45), (125, 53, 119), (49, 133, 137),
]

def shade(rgb, f):
    return tuple(max(0, min(255, int(c * f))) for c in rgb)

def color(rgb):
    return (*rgb, 255)

def px(d, box, fill):
    d.rectangle(box, fill=fill)

def draw_sprite(d, ox, oy, idx, direction, frame):
    role = ROLES[idx % len(ROLES)]
    base = BASE_COLORS[idx % len(BASE_COLORS)]
    h, s, v = colorsys.rgb_to_hsv(*(c / 255 for c in base))
    h = (h + (idx // 10) * .07) % 1
    base = tuple(int(c * 255) for c in colorsys.hsv_to_rgb(h, s, v))
    dark, light = shade(base, .48), shade(base, 1.30)
    skin_options = [(224, 165, 113), (194, 126, 82), (237, 191, 145), (155, 97, 70)]
    hair_options = [(47, 35, 32), (119, 55, 38), (222, 210, 173), (50, 58, 77), (93, 65, 40)]
    skin, hair = skin_options[idx % 4], hair_options[(idx * 3) % 5]
    metal = [(204, 216, 222), (224, 183, 71), (109, 197, 208)][idx % 3]
    step = (-1, 0, 1)[frame]
    bob = 1 if frame != 1 else 0
    cx = ox + 12
    # shadow
    px(d, (cx - 6, oy + 29, cx + 6, oy + 30), (5, 8, 13, 100))
    # rear weapons
    if role in ("fighter", "ranger", "miner", "engineer"):
        wx = cx + (7 if direction != 1 else -8)
        px(d, (wx, oy + 10, wx + 1, oy + 26), color(metal))
        if role == "fighter":
            px(d, (wx - 2, oy + 8, wx + 3, oy + 12), color(metal))
        elif role == "ranger":
            d.arc((wx - 4, oy + 9, wx + 4, oy + 27), 260, 100, fill=color(light), width=1)
        elif role == "miner":
            px(d, (wx - 4, oy + 9, wx + 4, oy + 11), color(metal))
        else:
            px(d, (wx - 2, oy + 8, wx + 2, oy + 12), color(light))
    if role in ("mage", "healer", "witch"):
        wx = cx - 8 if direction == 1 else cx + 7
        px(d, (wx, oy + 10, wx + 1, oy + 27), color(shade(metal, .75)))
        gem = (77, 222, 233) if role == "mage" else (239, 201, 82) if role == "healer" else (222, 76, 184)
        px(d, (wx - 2, oy + 8, wx + 3, oy + 12), color(gem))
        px(d, (wx - 1, oy + 7, wx + 2, oy + 9), color(shade(gem, 1.25)))
    # legs
    if frame == 0:
        px(d, (cx - 5, oy + 22 + bob, cx - 2, oy + 29), color(dark))
        px(d, (cx + 2, oy + 22 + bob, cx + 4, oy + 28), color(dark))
        px(d, (cx - 6, oy + 29, cx - 2, oy + 30), (20, 21, 25, 255))
    elif frame == 2:
        px(d, (cx - 4, oy + 22 + bob, cx - 2, oy + 28), color(dark))
        px(d, (cx + 2, oy + 22 + bob, cx + 5, oy + 29), color(dark))
        px(d, (cx + 2, oy + 29, cx + 6, oy + 30), (20, 21, 25, 255))
    else:
        px(d, (cx - 5, oy + 22, cx - 1, oy + 29), color(dark))
        px(d, (cx + 1, oy + 22, cx + 5, oy + 29), color(dark))
        px(d, (cx - 5, oy + 29, cx - 1, oy + 30), (20, 21, 25, 255))
        px(d, (cx + 1, oy + 29, cx + 5, oy + 30), (20, 21, 25, 255))
    # body and outline
    px(d, (cx - 6, oy + 12 + bob, cx + 6, oy + 23 + bob), color(dark))
    px(d, (cx - 5, oy + 12 + bob, cx + 5, oy + 20 + bob), color(base))
    px(d, (cx - 4, oy + 13 + bob, cx + 4, oy + 14 + bob), color(light))
    px(d, (cx - 5, oy + 20 + bob, cx + 5, oy + 22 + bob), color(metal))
    px(d, (cx - 1, oy + 20 + bob, cx + 1, oy + 22 + bob), color((45, 35, 29)))
    # arms
    arm = 1 if frame == 0 else -1 if frame == 2 else 0
    px(d, (cx - 8, oy + 13 + bob + arm, cx - 6, oy + 22 + bob + arm), color(dark))
    px(d, (cx + 6, oy + 13 + bob - arm, cx + 8, oy + 22 + bob - arm), color(dark))
    px(d, (cx - 7, oy + 20 + bob + arm, cx - 6, oy + 23 + bob + arm), color(skin))
    px(d, (cx + 6, oy + 20 + bob - arm, cx + 7, oy + 23 + bob - arm), color(skin))
    # head + outline
    hy = oy + 4 + bob
    px(d, (cx - 6, hy + 1, cx + 6, hy + 10), color(shade(hair, .55)))
    px(d, (cx - 5, hy + 1, cx + 5, hy + 9), color(skin))
    px(d, (cx - 5, hy, cx + 5, hy + 3), color(hair))
    px(d, (cx - 6, hy + 2, cx - 5, hy + 8), color(hair))
    px(d, (cx + 5, hy + 2, cx + 6, hy + 7), color(hair))
    if direction == 0:
        px(d, (cx - 3, hy + 5, cx - 2, hy + 6), (20, 28, 36, 255))
        px(d, (cx + 2, hy + 5, cx + 3, hy + 6), (20, 28, 36, 255))
        px(d, (cx - 1, hy + 8, cx + 1, hy + 8), color(shade(skin, .67)))
    elif direction == 1:
        px(d, (cx - 4, hy + 5, cx - 3, hy + 6), (20, 28, 36, 255))
        px(d, (cx + 3, hy + 1, cx + 6, hy + 9), color(hair))
    elif direction == 2:
        px(d, (cx + 3, hy + 5, cx + 4, hy + 6), (20, 28, 36, 255))
        px(d, (cx - 6, hy + 1, cx - 3, hy + 9), color(hair))
    else:
        px(d, (cx - 5, hy + 1, cx + 5, hy + 9), color(hair))
        px(d, (cx - 3, hy + 8, cx + 3, hy + 10), color(hair))
    # role silhouettes
    if role == "knight":
        px(d, (cx - 6, hy - 1, cx + 6, hy + 6), color(metal))
        px(d, (cx - 5, hy + 5, cx + 5, hy + 7), color(dark))
        px(d, (cx - 1, hy + 4, cx + 1, hy + 5), (13, 18, 25, 255))
        px(d, (cx - 9, oy + 14, cx - 7, oy + 24), color(shade(base, .75)))
    elif role == "fighter":
        px(d, (cx - 6, hy - 2, cx + 4, hy + 2), color(hair))
        px(d, (cx - 4, hy + 8, cx + 4, hy + 11), color(hair))
    elif role == "ranger":
        px(d, (cx - 7, hy - 1, cx + 7, hy + 4), color(base))
        px(d, (cx - 6, hy + 3, cx - 5, hy + 10), color(base))
        px(d, (cx + 5, hy + 3, cx + 6, hy + 10), color(base))
    elif role == "mage":
        px(d, (cx - 8, hy + 1, cx + 8, hy + 3), color(dark))
        px(d, (cx - 4, hy - 5, cx + 3, hy + 1), color(base))
        px(d, (cx + 2, hy - 7, cx + 5, hy - 3), color(base))
    elif role == "healer":
        px(d, (cx - 6, hy - 1, cx + 6, hy + 2), color(light))
        px(d, (cx - 1, hy - 4, cx + 1, hy + 1), color(metal))
        px(d, (cx - 3, hy - 2, cx + 3, hy), color(metal))
    elif role == "miner":
        px(d, (cx - 7, hy - 1, cx + 7, hy + 3), color(base))
        px(d, (cx - 2, hy - 2, cx + 2, hy + 1), color(metal))
        px(d, (cx - 1, hy - 1, cx + 1, hy), (255, 225, 125, 255))
    elif role == "rogue":
        px(d, (cx - 6, hy - 1, cx + 6, hy + 5), color(dark))
        px(d, (cx - 5, hy + 6, cx + 5, hy + 7), color(base))
        px(d, (cx - 8, oy + 19, cx - 5, oy + 20), color(metal))
    elif role == "monk":
        px(d, (cx - 4, hy - 1, cx + 4, hy + 1), color(skin))
        px(d, (cx - 5, hy + 8, cx + 5, hy + 10), color(shade(hair, .7)))
    elif role == "witch":
        px(d, (cx - 9, hy, cx + 8, hy + 2), color(dark))
        d.polygon([(cx - 4, hy), (cx + 1, hy - 8), (cx + 5, hy)], fill=color(base))
    else:
        px(d, (cx - 7, hy - 1, cx + 7, hy + 3), color((92, 70, 48)))
        px(d, (cx + 3, hy - 3, cx + 6, hy), color(metal))

for idx in range(30):
    sheet = Image.new("RGBA", (72, 128), (0, 0, 0, 0))
    draw = ImageDraw.Draw(sheet)
    for direction in range(4):
        for frame in range(3):
            draw_sprite(draw, frame * 24, direction * 32, idx, direction, frame)
    sheet.save(SPRITES / f"h{idx:02d}.png", optimize=False)

def stone_texture(img, rect, seed, colors):
    rng = random.Random(seed)
    d = ImageDraw.Draw(img)
    x0, y0, x1, y1 = rect
    d.rectangle(rect, fill=colors[0])
    for y in range(y0, y1, 8):
        for x in range(x0 - (4 if (y // 8) % 2 else 0), x1, 12):
            d.line((x, y, x + 10, y), fill=colors[1])
            d.line((x + 10, y, x + 10, y + 7), fill=colors[2])
            if rng.random() < .25:
                d.point((x + rng.randint(2, 8), y + rng.randint(2, 6)), fill=colors[3])

# 270x300 battle backdrop, intended for exact 2x display in a 540px UI.
battle = Image.new("RGB", (270, 300), "#86b9a2")
d = ImageDraw.Draw(battle)
d.rectangle((0, 0, 269, 72), fill="#79b8c5")
d.polygon([(0, 60), (42, 28), (83, 58), (126, 20), (177, 62), (220, 31), (269, 60), (269, 90), (0, 90)], fill="#527d76")
d.polygon([(0, 74), (62, 51), (106, 75), (151, 43), (216, 78), (269, 55), (269, 104), (0, 104)], fill="#385b55")
d.rectangle((0, 76, 269, 299), fill="#92b47d")
for y in range(90, 300, 18):
    d.line((0, y, 269, y), fill="#789b69")
for x in range(0, 270, 24):
    d.line((x, 78, x - 16, 299), fill="#a8c78f")
for x in range(8, 270, 36):
    d.rectangle((x, 74, x + 2, 85), fill="#284b35")
    d.rectangle((x - 3, 70, x + 5, 76), fill="#3e764b")
battle.save(ROOT / "assets" / "battle-field.png", optimize=False)

# Camp/tent background.
camp = Image.new("RGB", (270, 210), "#8cc9d1")
d = ImageDraw.Draw(camp)
d.rectangle((0, 92, 269, 209), fill="#c3ad73")
d.polygon([(0, 100), (40, 58), (85, 101), (126, 52), (170, 101), (220, 62), (269, 100)], fill="#597b61")
d.rectangle((0, 110, 269, 209), fill="#9a9363")
d.polygon([(65, 174), (135, 76), (207, 174)], fill="#e9d3b4")
d.polygon([(86, 174), (135, 90), (135, 174)], fill="#c4554b")
d.polygon([(135, 90), (135, 174), (185, 174)], fill="#f0e0c6")
d.rectangle((112, 145, 158, 177), fill="#342a27")
d.rectangle((104, 122, 166, 137), fill="#865332")
d.rectangle((108, 125, 162, 133), fill="#bd7f43")
d.rectangle((0, 180, 269, 209), fill="#756b4c")
camp.save(ROOT / "assets" / "camp.png", optimize=False)

# Sprite contact sheet for review.
preview = Image.new("RGBA", (360, 384), (12, 17, 27, 255))
for idx in range(30):
    sheet = Image.open(SPRITES / f"h{idx:02d}.png")
    cell = sheet.crop((24, 0, 48, 32)).resize((48, 64), Image.Resampling.NEAREST)
    x = (idx % 6) * 60 + 6
    y = (idx // 6) * 74 + 5
    preview.alpha_composite(cell, (x, y))
preview.save(ROOT / "assets" / "hero-preview.png", optimize=False)

print("Built 30 directional hero sheets, battle-field.png, camp.png, and hero-preview.png")
