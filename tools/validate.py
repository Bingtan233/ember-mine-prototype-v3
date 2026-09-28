from pathlib import Path
from PIL import Image
import re

root = Path(__file__).resolve().parents[1]
html = (root / "index.html").read_text(encoding="utf-8")
refs = re.findall(r'(?:src|href)="([^"]+)"', html)
missing = [ref for ref in refs if not ref.startswith("http") and not (root / ref).exists()]
assert not missing, f"Missing HTML assets: {missing}"

css = "\n".join((root / name).read_text(encoding="utf-8") for name in ("style.css", "progression.css"))
assets = re.findall(r"url\(['\"]?([^'\")]+)", css)
missing_css = [asset for asset in assets if not (root / asset).exists()]
assert not missing_css, f"Missing CSS assets: {missing_css}"

sprites = list((root / "assets" / "heroes").glob("*.png"))
assert len(sprites) == 30, f"Expected 30 sprites, got {len(sprites)}"
for sprite in sprites:
    with Image.open(sprite) as image:
        assert image.size == (96, 192), f"Bad sprite size: {sprite.name} {image.size}"
        assert image.mode == "RGBA", f"Bad sprite mode: {sprite.name} {image.mode}"

with Image.open(root / "assets" / "battle-field.png") as image:
    assert image.size == (270, 300)
with Image.open(root / "assets" / "camp.png") as image:
    assert image.size == (270, 210)
for name in ("pixel-heroes-a.png", "pixel-heroes-b.png", "pixel-heroes-c.png", "chapter1-combo-vfx.png", "chapter2-map.png"):
    with Image.open(root / "assets" / name) as image:
        assert image.width >= 1000 and image.height >= 750, f"Generated art is unexpectedly small: {name} {image.size}"
        if name != "chapter2-map.png":
            assert image.mode == "RGBA", f"Generated art must retain transparency: {name} {image.mode}"

print("HTML/CSS references, unified pixel hero atlases, and generated game artwork validated")
