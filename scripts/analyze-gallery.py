#!/usr/bin/env python3
"""
Analyze and order the Glass page gallery.

Workflow:
1. Put images in assets/images/gallery/.
2. Add title/date/type entries to assets/js/gallery-data.js.
   Optional location values are manual only; EXIF GPS is never read or exposed.
3. Run: python3 scripts/analyze-gallery.py
4. Commit the updated assets/js/gallery-generated.js file.

Requires Pillow and NumPy:
python3 -m pip install Pillow numpy
"""

from __future__ import annotations

import json
import math
import re
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
SOURCE_FILE = ROOT / "assets/js/gallery-data.js"
OUTPUT_FILE = ROOT / "assets/js/gallery-generated.js"
TYPE_VALUES = {"Photography", "Glass"}

COLOR_ANCHORS = [
    (-15.0, "red"),
    (30.0, "orange"),
    (60.0, "yellow"),
    (120.0, "green"),
    (165.0, "teal"),
    (190.0, "cyan"),
    (220.0, "blue"),
    (255.0, "indigo"),
    (285.0, "purple"),
]

COLOR_NAMES = {
    "red": 0,
    "orange": 30,
    "yellow": 60,
    "green": 120,
    "teal": 165,
    "cyan": 190,
    "blue": 220,
    "indigo": 255,
    "purple": 285,
    "neutral": None,
}


def strip_js_comments(text: str) -> str:
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    return re.sub(r"(^|[^:])//.*", r"\1", text)


def extract_js_array(text: str, variable_name: str) -> str:
    marker = f"window.{variable_name}"
    start = text.find(marker)
    if start < 0:
        raise ValueError(f"Could not find window.{variable_name} in {SOURCE_FILE}")
    bracket_start = text.find("[", start)
    if bracket_start < 0:
        raise ValueError(f"Could not find opening array for {variable_name}")

    depth = 0
    in_string: str | None = None
    escape = False
    for index in range(bracket_start, len(text)):
        char = text[index]
        if in_string:
            if escape:
                escape = False
            elif char == "\\":
                escape = True
            elif char == in_string:
                in_string = None
            continue
        if char in ("'", '"'):
            in_string = char
        elif char == "[":
            depth += 1
        elif char == "]":
            depth -= 1
            if depth == 0:
                return text[bracket_start : index + 1]
    raise ValueError(f"Could not find closing array for {variable_name}")


def js_array_to_json(array_text: str) -> str:
    cleaned = strip_js_comments(array_text)
    cleaned = re.sub(r"([{,]\s*)([A-Za-z_$][\w$]*)(\s*:)", r'\1"\2"\3', cleaned)
    cleaned = re.sub(r",(\s*[}\]])", r"\1", cleaned)
    return cleaned


def load_source_items() -> list[dict[str, Any]]:
    source = SOURCE_FILE.read_text(encoding="utf-8")
    array_text = extract_js_array(source, "GALLERY_SOURCE_ITEMS")
    items = json.loads(js_array_to_json(array_text))
    if not isinstance(items, list):
        raise ValueError("GALLERY_SOURCE_ITEMS must be an array")
    return items


def validate_item(item: dict[str, Any], index: int) -> None:
    for key in ("image", "date", "type"):
        if not item.get(key):
            raise ValueError(f"Gallery item {index + 1} is missing required key: {key}")
    item.setdefault("title", "")
    if item["type"] not in TYPE_VALUES:
        raise ValueError(f"Gallery item {index + 1} has invalid type: {item['type']}")
    image_path = ROOT / item["image"]
    if not image_path.exists():
        raise FileNotFoundError(f"Missing gallery image: {item['image']}")


def import_image_deps():
    try:
        from PIL import Image  # type: ignore
        from PIL import ImageOps  # type: ignore
        import numpy as np  # type: ignore
    except ModuleNotFoundError as exc:
        raise SystemExit(
            "Missing image-analysis dependencies. Install them with:\n"
            "python3 -m pip install Pillow numpy"
        ) from exc
    return Image, ImageOps, np


def rgb_to_hsv(np, rgb):
    red, green, blue = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    maxc = np.max(rgb, axis=-1)
    minc = np.min(rgb, axis=-1)
    delta = maxc - minc

    hue = np.zeros_like(maxc)
    mask = delta > 1e-6
    red_mask = mask & (maxc == red)
    green_mask = mask & (maxc == green)
    blue_mask = mask & (maxc == blue)
    hue[red_mask] = ((green[red_mask] - blue[red_mask]) / delta[red_mask]) % 6
    hue[green_mask] = ((blue[green_mask] - red[green_mask]) / delta[green_mask]) + 2
    hue[blue_mask] = ((red[blue_mask] - green[blue_mask]) / delta[blue_mask]) + 4
    hue = (hue * 60) % 360

    saturation = np.where(maxc <= 1e-6, 0, delta / maxc)
    value = maxc
    return hue, saturation, value


def circular_distance(a: float | None, b: float | None) -> float:
    if a is None or b is None:
        return 180.0
    return abs(((a - b + 180) % 360) - 180)


def circular_mean(np, hues, weights) -> float:
    if len(hues) == 0 or float(np.sum(weights)) <= 0:
        return 0.0
    radians = np.deg2rad(hues)
    sin_sum = np.sum(np.sin(radians) * weights)
    cos_sum = np.sum(np.cos(radians) * weights)
    return float((np.rad2deg(np.arctan2(sin_sum, cos_sum)) + 360) % 360)


def dominant_hue(np, hue, weights, mask) -> tuple[float | None, float | None, float, str]:
    selected_hue = hue[mask]
    selected_weights = weights[mask]
    if selected_hue.size == 0 or float(np.sum(selected_weights)) <= 0:
        return None, None, 0.0, "neutral"

    bin_count = 72
    bins = np.zeros(bin_count)
    indexes = np.floor(selected_hue / 360 * bin_count).astype(int) % bin_count
    np.add.at(bins, indexes, selected_weights)
    total_weight = float(np.sum(bins))
    dominant_index = int(np.argmax(bins))
    strength = float(bins[dominant_index] / total_weight) if total_weight else 0.0

    centers = (indexes == dominant_index) | (indexes == ((dominant_index - 1) % bin_count)) | (indexes == ((dominant_index + 1) % bin_count))
    dom_hue = circular_mean(np, selected_hue[centers], selected_weights[centers])

    secondary_bins = bins.copy()
    for offset in range(-5, 6):
        secondary_bins[(dominant_index + offset) % bin_count] = 0
    secondary_index = int(np.argmax(secondary_bins))
    if secondary_bins[secondary_index] <= 0:
        secondary_hue = None
    else:
        secondary_mask = indexes == secondary_index
        secondary_hue = circular_mean(np, selected_hue[secondary_mask], selected_weights[secondary_mask])

    family = color_family(dom_hue, False)
    return dom_hue, secondary_hue, strength, family


def color_override_to_hue(value: Any) -> float | None:
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return float(value) % 360
    if isinstance(value, str):
        lower = value.strip().lower()
        if lower in COLOR_NAMES:
            return COLOR_NAMES[lower]
        if re.fullmatch(r"#[0-9a-f]{6}", lower):
            red = int(lower[1:3], 16) / 255
            green = int(lower[3:5], 16) / 255
            blue = int(lower[5:7], 16) / 255
            maxc = max(red, green, blue)
            minc = min(red, green, blue)
            delta = maxc - minc
            if delta == 0:
                return None
            if maxc == red:
                hue = ((green - blue) / delta) % 6
            elif maxc == green:
                hue = ((blue - red) / delta) + 2
            else:
                hue = ((red - green) / delta) + 4
            return (hue * 60) % 360
    raise ValueError(f"Unsupported colorOverride: {value!r}")


def color_axis(hue: float | None, neutral: bool, brightness: float) -> float:
    if neutral or hue is None:
        return 900.0 + brightness * 80
    shifted = hue - 360 if hue >= 330 else hue
    if shifted <= COLOR_ANCHORS[0][0]:
        return 0.0
    for index in range(len(COLOR_ANCHORS) - 1):
        left_hue = COLOR_ANCHORS[index][0]
        right_hue = COLOR_ANCHORS[index + 1][0]
        if left_hue <= shifted <= right_hue:
            fraction = (shifted - left_hue) / (right_hue - left_hue)
            return index * 100 + fraction * 100
    return (len(COLOR_ANCHORS) - 1) * 100


def color_family(hue: float | None, neutral: bool) -> str:
    if neutral or hue is None:
        return "neutral"
    shifted = hue - 360 if hue >= 330 else hue
    nearest = min(COLOR_ANCHORS, key=lambda anchor: abs(anchor[0] - shifted))
    return nearest[1]


def orientation(aspect_ratio: float) -> str:
    if aspect_ratio > 1.18:
        return "landscape"
    if aspect_ratio < 0.86:
        return "portrait"
    return "square"


def analyze_image(item: dict[str, Any], Image, ImageOps, np) -> dict[str, Any]:
    path = ROOT / item["image"]
    image = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
    width, height = image.size
    image.thumbnail((420, 420))
    rgb = np.asarray(image).astype("float32") / 255.0
    hue, saturation, value = rgb_to_hsv(np, rgb)
    luminance = 0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]

    neutral_mask = (saturation < 0.18) | (value < 0.08) | ((value > 0.92) & (saturation < 0.35))
    color_mask = ~neutral_mask
    if int(np.sum(color_mask)) < 24:
        color_mask = (saturation > 0.08) & (value > 0.05)

    weights = (saturation ** 1.45) * np.clip(value, 0.12, 1)
    dom_hue, secondary_hue, strength, family = dominant_hue(np, hue, weights, color_mask)

    edge_mask = np.zeros(hue.shape, dtype=bool)
    edge_y = max(1, int(hue.shape[0] * 0.08))
    edge_x = max(1, int(hue.shape[1] * 0.08))
    edge_mask[:edge_y, :] = True
    edge_mask[-edge_y:, :] = True
    edge_mask[:, :edge_x] = True
    edge_mask[:, -edge_x:] = True
    edge_hue, _, _, _ = dominant_hue(np, hue, weights, edge_mask & color_mask)

    override_hue = color_override_to_hue(item.get("colorOverride"))
    if override_hue is not None:
        dom_hue = override_hue
        family = color_family(dom_hue, False)

    neutral_percent = float(np.mean(neutral_mask))
    neutralish = neutral_percent > 0.72 or float(np.mean(saturation)) < 0.16

    return {
        "dominantHue": round(dom_hue, 2) if dom_hue is not None else None,
        "secondaryHue": round(secondary_hue, 2) if secondary_hue is not None else None,
        "saturation": round(float(np.mean(saturation)), 4),
        "brightness": round(float(np.mean(luminance)), 4),
        "contrast": round(float(np.std(luminance)), 4),
        "dominantColorStrength": round(strength, 4),
        "aspectRatio": round(width / height, 4),
        "neutralPixelPercent": round(neutral_percent, 4),
        "edgeHues": [round(edge_hue, 2)] if edge_hue is not None else [],
        "colorFamily": "neutral" if neutralish else family,
    }


def prepared_item(item: dict[str, Any], analysis: dict[str, Any]) -> dict[str, Any]:
    brightness = float(analysis["brightness"])
    hue = analysis["dominantHue"]
    neutral = analysis["colorFamily"] == "neutral"
    axis = color_axis(hue, neutral, brightness)
    if item.get("orderOverride") is not None:
        axis = float(item["orderOverride"])
    return {
        "source": item,
        "analysis": analysis,
        "axis": axis,
        "orientation": orientation(float(analysis["aspectRatio"])),
    }


def transition_cost(left: dict[str, Any], right: dict[str, Any]) -> float:
    left_analysis = left["analysis"]
    right_analysis = right["analysis"]
    hue_cost = circular_distance(left_analysis["dominantHue"], right_analysis["dominantHue"]) / 180
    secondary_bridge = min(
        circular_distance(left_analysis.get("secondaryHue"), right_analysis["dominantHue"]),
        circular_distance(left_analysis["dominantHue"], right_analysis.get("secondaryHue")),
    ) / 180
    brightness_cost = abs(left_analysis["brightness"] - right_analysis["brightness"])
    saturation_cost = abs(left_analysis["saturation"] - right_analysis["saturation"])
    contrast_cost = abs(left_analysis["contrast"] - right_analysis["contrast"])
    aspect_cost = min(abs(math.log(max(left_analysis["aspectRatio"], 0.1) / max(right_analysis["aspectRatio"], 0.1))), 1.0)
    axis_delta = abs(left["axis"] - right["axis"]) / 900
    backward_penalty = max(0.0, left["axis"] - right["axis"]) / 300
    same_type_penalty = 0.08 if left["source"]["type"] == right["source"]["type"] else -0.03
    same_orientation_penalty = 0.05 if left["orientation"] == right["orientation"] else -0.02
    too_similar_penalty = 0.0
    if hue_cost < 0.08 and brightness_cost < 0.08 and saturation_cost < 0.08 and aspect_cost < 0.12:
        too_similar_penalty = 0.22
    return (
        hue_cost * 1.55
        + secondary_bridge * 0.35
        + brightness_cost * 0.85
        + saturation_cost * 0.6
        + contrast_cost * 0.45
        + aspect_cost * 0.24
        + axis_delta * 0.65
        + backward_penalty
        + same_type_penalty
        + same_orientation_penalty
        + too_similar_penalty
    )


def path_cost(route: list[dict[str, Any]]) -> float:
    return sum(transition_cost(route[index], route[index + 1]) for index in range(len(route) - 1))


def nearest_neighbor(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    if len(items) <= 2:
        return sorted(items, key=lambda item: item["axis"])
    remaining = sorted(items, key=lambda item: item["axis"])
    route = [remaining.pop(0)]
    while remaining:
        current = route[-1]
        next_index = min(range(len(remaining)), key=lambda index: transition_cost(current, remaining[index]))
        route.append(remaining.pop(next_index))
    return route


def two_opt(route: list[dict[str, Any]], passes: int = 4) -> list[dict[str, Any]]:
    best = route[:]
    best_cost = path_cost(best)
    for _ in range(passes):
        improved = False
        for start in range(1, len(best) - 2):
            for end in range(start + 1, len(best) - 1):
                candidate = best[:start] + list(reversed(best[start : end + 1])) + best[end + 1 :]
                candidate_cost = path_cost(candidate)
                if candidate_cost + 1e-6 < best_cost:
                    best = candidate
                    best_cost = candidate_cost
                    improved = True
        if not improved:
            break
    return best


def optimize_order(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    colored = [item for item in items if item["analysis"]["colorFamily"] != "neutral"]
    neutral = [item for item in items if item["analysis"]["colorFamily"] == "neutral"]
    ordered = two_opt(nearest_neighbor(colored)) if colored else []
    if neutral:
        ordered.extend(two_opt(nearest_neighbor(neutral)))
    return ordered


def public_item(prepared: dict[str, Any], index: int) -> dict[str, Any]:
    source = prepared["source"]
    return {
        "image": source["image"],
        "title": source["title"],
        "date": source["date"],
        "type": source["type"],
        "location": source.get("location", ""),
        "featured": bool(source.get("featured", False)),
        "caption": source.get("caption", ""),
        "order": index + 1,
        "analysis": prepared["analysis"],
    }


def write_generated(items: list[dict[str, Any]]) -> None:
    content = (
        "/*\n"
        "  Generated gallery metadata for glass.html.\n"
        "  Do not edit this file directly. Edit assets/js/gallery-data.js, then run:\n"
        "  python3 scripts/analyze-gallery.py\n"
        "*/\n"
        f"window.GALLERY_ITEMS = {json.dumps(items, indent=2, ensure_ascii=False)};\n"
    )
    OUTPUT_FILE.write_text(content, encoding="utf-8")


def main() -> int:
    items = load_source_items()
    for index, item in enumerate(items):
        validate_item(item, index)

    if not items:
        write_generated([])
        print("No gallery items found. Wrote an empty generated gallery.")
        return 0

    Image, ImageOps, np = import_image_deps()
    prepared = [prepared_item(item, analyze_image(item, Image, ImageOps, np)) for item in items]
    ordered = optimize_order(prepared)
    generated = [public_item(item, index) for index, item in enumerate(ordered)]
    write_generated(generated)
    print(f"Wrote {len(generated)} gallery items to {OUTPUT_FILE.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
