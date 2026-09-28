#!/usr/bin/env python3
"""Build sheet.jpg: 4x2 grid of 480px-wide thumbnails with section names beneath."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
D = Path(__file__).resolve().parent
NAMES = ["daily-desk","mercati","moda","viaggi","tavola","sport","tech","reading-room"]
TW, PAD, LABEL = 480, 16, 28
TH = TW * 9 // 16
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
except OSError:
    font = ImageFont.load_default()
cols, rows = 4, 2
W = cols * TW + (cols + 1) * PAD
H = rows * (TH + LABEL) + (rows + 1) * PAD
sheet = Image.new("RGB", (W, H), (20, 20, 22))
dr = ImageDraw.Draw(sheet)
missing = []
for i, n in enumerate(NAMES):
    x = PAD + (i % cols) * (TW + PAD)
    y = PAD + (i // cols) * (TH + LABEL + PAD)
    p = D / f"cover-{n}.png"
    if p.exists():
        im = ImageOps.fit(Image.open(p).convert("RGB"), (TW, TH), Image.LANCZOS)
        sheet.paste(im, (x, y))
    else:
        missing.append(n)
        dr.rectangle([x, y, x + TW - 1, y + TH - 1], outline=(90, 90, 90))
    dr.text((x, y + TH + 6), n, fill=(225, 225, 225), font=font)
sheet.save(D / "sheet.jpg", quality=90)
print("saved", D / "sheet.jpg", "missing:", missing or "none")
