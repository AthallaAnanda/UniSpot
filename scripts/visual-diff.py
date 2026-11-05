"""Compare matching Playwright screenshots; ignore the live-clock header."""
import json
from pathlib import Path
from PIL import Image, ImageChops, ImageStat

root = Path(__file__).resolve().parents[1]
folder = root / "docs/design-references/luma.com"
results = []
for width in (1440, 768, 390):
    reference = Image.open(folder / f"reference-{width}-qa.png").convert("RGB")
    clone = Image.open(folder / f"clone-{width}-qa.png").convert("RGB")
    if reference.size != clone.size:
        raise ValueError(f"Screenshot size mismatch at {width}: {reference.size} / {clone.size}")
    crop = (0, 54, reference.width, reference.height)
    diff = ImageChops.difference(reference.crop(crop), clone.crop(crop))
    pixels = list(diff.get_flattened_data())
    changed = sum(max(pixel) > 16 for pixel in pixels)
    mean = sum(ImageStat.Stat(diff).mean) / 3
    diff.save(folder / f"diff-{width}.png")
    results.append({
        "viewport": width,
        "image_size": reference.size,
        "excluded": "top 54px (live clock)",
        "pixels_over_16_rgb_difference_percent": round(100 * changed / len(pixels), 5),
        "mean_absolute_channel_difference": round(mean, 5),
    })
report = root / "docs/research/luma.com/visual-diff.json"
report.write_text(json.dumps(results, indent=2) + "\n")
print(json.dumps(results, indent=2))
