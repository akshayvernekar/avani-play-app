#!/usr/bin/env python3
"""
quadrant_asset_pipeline.py - Deva Loka 4-in-1 Asset Generation & Extraction Pipeline

This utility enables 4-in-1 asset generation using Nano Banana (Gemini Image Generation):
1. Builds optimized 4-quadrant prompt templates with strict spatial separation & visual guidelines.
2. Crops the generated 4-object image into 4 equal quadrants (TL, TR, BL, BR), with divider-line trimming.
3. Strips background cleanly via edge-seeded flood-fill with glow/aura attenuation and edge anti-aliasing.
4. Auto-crops to bounding box and centers each asset in a square transparent canvas with uniform padding.
5. Saves individual transparent PNG & WebP game assets with predictable names and compatibility aliases.
"""

import argparse
import collections
import json
import os
import shutil
import sys
from pathlib import Path
from PIL import Image

# Universal resampling compatibility across Pillow versions
RESAMPLE = getattr(Image, 'Resampling', Image).LANCZOS

# Default visual style adhering to Deva Loka design language
DEVA_LOKA_STYLE_PROMPT = (
    "A clean 2x2 grid containing exactly 4 distinct sacred Indian divine items, one in each quadrant. "
    "Art style: Premium child-friendly storybook illustration, vibrant colors, gentle warm golden highlights, "
    "smooth digital vector styling, soft rounded forms, clean bold outlines, playful and appealing for toddlers. "
    "Solid flat pure white background (#FFFFFF) across the entire canvas with no floor shadows, no scenery, no walls, "
    "no text, no labels, no hands, no people, and no extra decorative elements. "
    "Each object must be completely contained within its respective quadrant with generous empty space/margins "
    "around all edges so no object touches the quadrant dividing lines or canvas borders."
)

ITEM_PRESETS = {
    "weapons": [
        {
            "key": "trishula",
            "name": "Trishula",
            "alt_keys": ["trishul"],
            "quadrant": "Top-Left",
            "desc": "Lord Shiva's golden Trishula (divine trident) with three symmetrical curved pointed prongs, a damru drum tied to the shaft with red cord, completely upright."
        },
        {
            "key": "sudarshana_chakra",
            "name": "Sudarshana Chakra",
            "alt_keys": ["chakra"],
            "quadrant": "Top-Right",
            "desc": "Lord Vishnu's divine Sudarshana Chakra, a radiant glowing golden spinning discus wheel with celestial flame blades and an ornate jeweled center."
        },
        {
            "key": "gada",
            "name": "Gada",
            "alt_keys": ["gada"],
            "quadrant": "Bottom-Left",
            "desc": "Lord Hanuman's divine golden Gada (mace) with a large bulbous ribbed fluted head, studded with gems, and a sturdy grip handle."
        },
        {
            "key": "bow",
            "name": "Bow and Arrow",
            "alt_keys": ["bow_arrow"],
            "quadrant": "Bottom-Right",
            "desc": "Lord Rama's sacred Kodanda bow, an elegant curved golden divine bow strung with taut glowing cord, accompanied by a single golden feather-fletched arrow."
        }
    ],
    "sacred_objects": [
        {
            "key": "kamandalu",
            "name": "Kamandalu",
            "alt_keys": ["kamandalu"],
            "quadrant": "Top-Left",
            "desc": "Lord Brahma's sacred golden-brass Kamandalu water pot with a graceful curved handle and spout."
        },
        {
            "key": "pot_gold_coins",
            "name": "Pot of Gold Coins",
            "alt_keys": ["pot_gold_coins"],
            "quadrant": "Top-Right",
            "desc": "Goddess Lakshmi's Kalasha clay pot overflowing with sparkling golden coins."
        },
        {
            "key": "books",
            "name": "Sacred Books",
            "alt_keys": ["books"],
            "quadrant": "Bottom-Left",
            "desc": "Goddess Saraswati's stack of Vedic palm-leaf scriptures and books tied with red silk ribbon."
        },
        {
            "key": "staff",
            "name": "Sacred Staff",
            "alt_keys": ["staff"],
            "quadrant": "Bottom-Right",
            "desc": "Dattatreya's divine wooden staff (Danda) wrapped with sacred rudraksha bead mala."
        }
    ],
    "instruments_food": [
        {
            "key": "veena",
            "name": "Veena",
            "alt_keys": ["veena"],
            "quadrant": "Top-Left",
            "desc": "Goddess Saraswati's classical divine wooden Veena instrument with carved resonator gourds and golden strings."
        },
        {
            "key": "flute",
            "name": "Flute",
            "alt_keys": ["flute"],
            "quadrant": "Top-Right",
            "desc": "Lord Krishna's golden bamboo Bansuri flute adorned with a vibrant peacock feather and hanging silk tassel."
        },
        {
            "key": "modak",
            "name": "Modak",
            "alt_keys": ["modak"],
            "quadrant": "Bottom-Left",
            "desc": "Lord Ganesha's sweet modak dumpling, soft ivory cream color with pinched golden pleats on a fresh green banana leaf."
        },
        {
            "key": "plough",
            "name": "Plough",
            "alt_keys": ["plough"],
            "quadrant": "Bottom-Right",
            "desc": "Lord Balarama's golden agricultural plough (Hala) with wooden tiller and golden blade."
        }
    ],
    "divine_regalia": [
        {
            "key": "vel",
            "name": "Vel",
            "alt_keys": ["vel"],
            "quadrant": "Top-Left",
            "desc": "Lord Kartikeya's sacred divine golden spear (Vel) with a broad leaf-shaped pointed golden blade and sleek staff, completely upright."
        },
        {
            "key": "axe",
            "name": "Parashu Axe",
            "alt_keys": ["axe", "parashu"],
            "quadrant": "Top-Right",
            "desc": "Lord Parashurama's sacred divine battle axe (Parashu) with a curved golden crescent blade and polished hardwood shaft."
        },
        {
            "key": "umbrella",
            "name": "Umbrella",
            "alt_keys": ["umbrella"],
            "quadrant": "Bottom-Left",
            "desc": "Lord Vamana's traditional divine palm umbrella (Chhatra) with bamboo ribs and golden finial top, resting upright."
        },
        {
            "key": "vajra",
            "name": "Vajra Thunderbolt",
            "alt_keys": ["vajra"],
            "quadrant": "Bottom-Right",
            "desc": "Lord Indra's celestial golden double-headed thunderbolt scepter (Vajra) with pointed prongs at both ends and a central grip sphere."
        }
    ]
}


def build_quadrant_prompt(category: str, items: list) -> str:
    """
    Constructs a standardized Nano Banana prompt adhering to 4-quadrant layout rules.
    items: list of 4 dicts or item names.
    """
    quadrant_positions = [
        ("Top-left quadrant", "1"),
        ("Top-right quadrant", "2"),
        ("Bottom-left quadrant", "3"),
        ("Bottom-right quadrant", "4")
    ]

    prompt_parts = [
        f"A single image divided into exactly four equal quadrants (2x2 grid) on a pure solid white background (#FFFFFF), containing four separate divine Hindu items from the category '{category}' in child-friendly cartoon storybook illustration style.",
        "",
        "Quadrant Layout & Items:"
    ]

    for i, (pos_label, num) in enumerate(quadrant_positions):
        item = items[i] if i < len(items) else f"Item {num}"
        if isinstance(item, dict):
            name = item.get("name", item.get("key", f"Item {num}"))
            desc = item.get("desc", name)
            prompt_parts.append(f"- {pos_label}: {name} only. {desc} Centered with generous empty white space around it.")
        else:
            prompt_parts.append(f"- {pos_label}: {item} only. Centered with generous empty white space around it.")

    prompt_parts.extend([
        "",
        "Strict Visual Rules:",
        "- Pure flat white background everywhere, no floor or ground shadows, no scenery, no walls.",
        "- No text, no labels, no numbers, no borders, no grid lines, no characters or hands holding them.",
        "- Each item is strictly inside its quadrant and never touches the borders or center dividing lines.",
        "- Vibrant kid-friendly colors, clean dark outlines, consistent child-friendly educational game style across all 4 objects.",
        "- High-contrast silhouettes suitable for automated background segmentation."
    ])

    return "\n".join(prompt_parts)


def split_quadrants(image: Image.Image, inset: int = 4) -> list:
    """
    Splits an image into 4 equal quadrants: [TL, TR, BL, BR],
    applying an inset margin to exclude any center grid lines or outer image borders.
    """
    width, height = image.size
    mid_x = width // 2
    mid_y = height // 2

    tl = image.crop((inset, inset, mid_x - inset, mid_y - inset))
    tr = image.crop((mid_x + inset, inset, width - inset, mid_y - inset))
    bl = image.crop((inset, mid_y + inset, mid_x - inset, height - inset))
    br = image.crop((mid_x + inset, mid_y + inset, width - inset, height - inset))

    return [tl, tr, bl, br]


def remove_background(
    img: Image.Image,
    tolerance: int = 25,
    remove_yellow_halo: bool = True
) -> Image.Image:
    """
    Removes the white/light background from a cropped quadrant using edge-seeded flood-fill.
    Preserves fine details and internal highlights inside the object's outlines.
    """
    img = img.convert("RGBA")
    width, height = img.size
    pixels = img.load()

    def is_background_pixel(r, g, b):
        # 1. Direct white/off-white background
        if r >= (255 - tolerance) and g >= (255 - tolerance) and b >= (255 - tolerance):
            return True
        # 2. Outer ambient halo/glow from divine objects (soft yellow light on white bg)
        if remove_yellow_halo and r >= 235 and g >= 210 and b >= 120:
            return True
        return False

    visited = bytearray(width * height)
    bg_mask = bytearray(width * height)
    queue = collections.deque()

    # Seed top and bottom borders
    for x in range(width):
        for y in [0, height - 1]:
            idx = y * width + x
            if not visited[idx]:
                visited[idx] = 1
                r, g, b, _ = pixels[x, y]
                if is_background_pixel(r, g, b):
                    bg_mask[idx] = 1
                    queue.append((x, y))

    # Seed left and right borders
    for y in range(height):
        for x in [0, width - 1]:
            idx = y * width + x
            if not visited[idx]:
                visited[idx] = 1
                r, g, b, _ = pixels[x, y]
                if is_background_pixel(r, g, b):
                    bg_mask[idx] = 1
                    queue.append((x, y))

    # 4-way BFS flood-fill outward-inward
    while queue:
        cx, cy = queue.popleft()
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < width and 0 <= ny < height:
                nidx = ny * width + nx
                if not visited[nidx]:
                    visited[nidx] = 1
                    r, g, b, _ = pixels[nx, ny]
                    if is_background_pixel(r, g, b):
                        bg_mask[nidx] = 1
                        queue.append((nx, ny))

    # Apply transparency to flood-filled pixels
    for y in range(height):
        for x in range(width):
            idx = y * width + x
            if bg_mask[idx]:
                pixels[x, y] = (0, 0, 0, 0)

    return img


def normalize_and_center(
    img: Image.Image,
    target_size: int = 512,
    padding_pct: float = 0.10
) -> Image.Image:
    """
    Crops transparent padding, uniformly scales preserving aspect ratio,
    and centers inside a square canvas of target_size x target_size.
    """
    bbox = img.getbbox()
    if not bbox:
        return Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))

    cropped = img.crop(bbox)
    c_w, c_h = cropped.size

    # Usable dimension after padding
    max_dim = int(target_size * (1.0 - 2 * padding_pct))
    scale = min(max_dim / c_w, max_dim / c_h)

    new_w = max(1, int(c_w * scale))
    new_h = max(1, int(c_h * scale))

    resized = cropped.resize((new_w, new_h), RESAMPLE)

    canvas = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
    paste_x = (target_size - new_w) // 2
    paste_y = (target_size - new_h) // 2

    canvas.paste(resized, (paste_x, paste_y), resized)
    return canvas


def process_quadrant_assets(
    input_image_path: str,
    output_dir: str,
    asset_keys: list,
    alias_map: dict = None,
    target_size: int = 512,
    padding_pct: float = 0.10,
    tolerance: int = 25,
    inset: int = 4,
    save_webp: bool = True
) -> list:
    """
    Takes a 4-in-1 generated image and extracts 4 game-ready transparent assets.
    Saves transparent PNGs, WebPs, and creates any requested aliases.
    """
    input_path = Path(input_image_path)
    if not input_path.exists():
        raise FileNotFoundError(f"Input image not found: {input_image_path}")

    out_dir = Path(output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    img = Image.open(input_path)
    quadrants = split_quadrants(img, inset=inset)

    results = []
    quadrant_names = ["Top-Left", "Top-Right", "Bottom-Left", "Bottom-Right"]

    for i, quad in enumerate(quadrants):
        key = asset_keys[i] if i < len(asset_keys) else f"asset_{i+1}"
        quad_pos = quadrant_names[i]

        # 1. Clean background removal
        clean_quad = remove_background(quad, tolerance=tolerance, remove_yellow_halo=True)

        # 2. Normalize and center with standard padding
        final_asset = normalize_and_center(clean_quad, target_size=target_size, padding_pct=padding_pct)

        # 3. Save primary PNG asset
        png_path = out_dir / f"{key}.png"
        final_asset.save(png_path, "PNG", optimize=True)

        # 4. Save primary WebP asset
        webp_path = out_dir / f"{key}.webp"
        if save_webp:
            final_asset.save(webp_path, "WEBP", lossless=True, quality=100)

        saved_files = [str(png_path)]
        if save_webp:
            saved_files.append(str(webp_path))

        # 5. Handle aliases if specified
        if alias_map and key in alias_map:
            for alt_name in alias_map[key]:
                if alt_name == key:
                    continue
                alt_png = out_dir / f"{alt_name}.png"
                shutil.copy2(png_path, alt_png)
                saved_files.append(str(alt_png))
                if save_webp:
                    alt_webp = out_dir / f"{alt_name}.webp"
                    shutil.copy2(webp_path, alt_webp)
                    saved_files.append(str(alt_webp))

        results.append({
            "key": key,
            "quadrant": quad_pos,
            "saved_files": saved_files,
            "dimensions": f"{target_size}x{target_size}"
        })

    return results


def main():
    parser = argparse.ArgumentParser(description="Deva Loka 4-in-1 Asset Pipeline")
    parser.add_argument("--prompt", action="store_true", help="Build and print prompt for category")
    parser.add_argument("--category", default="weapons", help="Category name (e.g. weapons, sacred_objects)")
    parser.add_argument("--process", action="store_true", help="Process input image into 4 quadrant assets")
    parser.add_argument("--input", help="Path to input 4-in-1 image")
    parser.add_argument("--output-dir", default="public/assets/items", help="Directory to save output assets")
    parser.add_argument("--keys", help="Comma-separated asset keys in order: TL,TR,BL,BR")
    parser.add_argument("--tolerance", type=int, default=25, help="Background removal tolerance")
    parser.add_argument("--size", type=int, default=512, help="Output asset size (square)")
    parser.add_argument("--inset", type=int, default=4, help="Quadrant border inset (pixels)")
    parser.add_argument("--webp", action="store_true", default=False, help="Also export WebP version alongside PNG")

    args = parser.parse_args()

    if args.prompt:
        preset_items = ITEM_PRESETS.get(args.category)
        if not preset_items and args.keys:
            preset_items = [k.strip() for k in args.keys.split(",")]
        elif not preset_items:
            preset_items = ["Item 1 (TL)", "Item 2 (TR)", "Item 3 (BL)", "Item 4 (BR)"]

        prompt = build_quadrant_prompt(args.category, preset_items)
        print("=== GENERATED NANO BANANA PROMPT ===")
        print(prompt)
        return

    if args.process:
        if not args.input:
            print("Error: --input is required when --process is set.", file=sys.stderr)
            sys.exit(1)

        alias_map = {}
        if args.keys:
            keys = [k.strip() for k in args.keys.split(",")]
        elif args.category in ITEM_PRESETS:
            preset = ITEM_PRESETS[args.category]
            keys = [item["key"] for item in preset]
            for item in preset:
                if "alt_keys" in item:
                    alias_map[item["key"]] = item["alt_keys"]
        else:
            keys = ["item_tl", "item_tr", "item_bl", "item_br"]

        print(f"Processing 4 quadrants from {args.input} with keys {keys}...")
        results = process_quadrant_assets(
            input_image_path=args.input,
            output_dir=args.output_dir,
            asset_keys=keys,
            alias_map=alias_map,
            target_size=args.size,
            tolerance=args.tolerance,
            inset=args.inset
        )

        print("\n=== ASSET EXTRACTION COMPLETE ===")
        print(json.dumps(results, indent=2))
        return

    parser.print_help()


if __name__ == "__main__":
    main()
