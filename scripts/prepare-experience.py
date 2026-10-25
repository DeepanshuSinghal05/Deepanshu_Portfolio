"""Crop only authentic supplied UI; omit browser chrome and unused whitespace."""
from pathlib import Path
from PIL import Image
import json

root = Path(__file__).resolve().parents[1]
out = root / 'public/experience'
out.mkdir(exist_ok=True)
sources = [
    ('colorbar-loyalty', 'experience/colorbar/loyalty_member_serach.png', (250, 125, 1655, 960)),
    ('acmegrade-cart', 'experience/Acmegrade/Screenshot 2025-06-22 015648.png', (0, 108, 1918, 619)),
    ('acmegrade-product', 'experience/Acmegrade/Screenshot 2025-06-22 015753.png', (475, 438, 1426, 926)),
]
manifest = []
for name, source, crop in sources:
    original = Image.open(root / source).convert('RGB').crop(crop)
    for size, width in [('desktop', 1200), ('mobile', 640)]:
        image = original.copy()
        image.thumbnail((width, 1200), Image.Resampling.LANCZOS)
        target = out / f'{name}-{size}.webp'
        image.save(target, quality=86, method=6)
        manifest.append(dict(source=source, crop=crop, file=str(target.relative_to(root)), width=image.width, height=image.height, bytes=target.stat().st_size))
(out / 'provenance.json').write_text(json.dumps(manifest, indent=2))
print(json.dumps(manifest, indent=2))
