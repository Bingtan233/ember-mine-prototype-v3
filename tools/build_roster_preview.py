from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
sprites = ROOT / "assets" / "heroes"
out = Image.new("RGB", (540, 720), "#d5ae27")
d = ImageDraw.Draw(out)

# Selected hero panel.
d.rectangle((0, 0, 539, 166), fill="#342d1f", outline="#c8aa50", width=4)
d.rectangle((9, 9, 104, 157), fill="#28231a", outline="#d7b94d", width=3)
selected = Image.open(sprites / "h00.png").crop((32, 0, 64, 48)).resize((64, 96), Image.Resampling.NEAREST)
out.paste(selected, (25, 33), selected)
d.rectangle((116, 18, 310, 31), fill="#f2dda2")
d.rectangle((116, 44, 430, 51), fill="#9d8a55")
for x in range(116, 500, 96):
    d.rectangle((x, 72, x + 90, 98), fill="#242219", outline="#786a41")
d.rectangle((116, 116, 214, 151), fill="#91ca13", outline="#fff080", width=3)
d.rectangle((224, 116, 322, 151), fill="#62563a", outline="#9d8b5b", width=3)

# Five-column roster with the same dimensions as the browser layout.
d.rectangle((0, 167, 539, 210), fill="#403720")
pad, gap, top = 7, 7, 218
card_w = (540 - pad * 2 - gap * 4) // 5
card_h = 132
for idx in range(15):
    col, row = idx % 5, idx // 5
    x = pad + col * (card_w + gap)
    y = top + row * (card_h + gap)
    d.rectangle((x, y, x + card_w - 1, y + card_h - 1), fill="#f6e8a1", outline="#493719", width=3)
    d.rectangle((x + 3, y + card_h - 24, x + card_w - 4, y + card_h - 3), fill="#2b281e")
    sprite = Image.open(sprites / f"h{idx:02d}.png").crop((32, 0, 64, 48)).resize((64, 96), Image.Resampling.NEAREST)
    sx = x + (card_w - 64) // 2
    sy = y + card_h - 24 - 96
    out.paste(sprite, (sx, sy), sprite)
    if idx < 10:
        d.ellipse((x + 5, y + 5, x + 15, y + 15), fill="#72e23c", outline="#244e10", width=2)

out.save(ROOT / "assets" / "roster-preview-v3.png", optimize=False)
print("Built roster-preview-v3.png")
