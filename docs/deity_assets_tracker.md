# Deity & Ride Assets Generation Tracker

This tracker documents all deities and rides (vaahanas) in the Avani Kids Learning App, their attributes, and image asset generation status using `nanobanana` (image generation).

If credits run out or generation is paused, this document allows seamlessly resuming generation for the remaining deities and rides.

---

## 🎨 Art Style Guide for Generation

To maintain exact visual harmony with existing characters (**Ganesha**, **Shiva**, **Durga**, **Mouse**, **Bull**, **Lion**):

### 1. Deities
- **Character Style**: Adorable chibi cartoon Hindu deity, cute toddler-friendly character, large head with big expressive sparkling eyes, sweet gentle smile.
- **Outlines & Shading**: Bold clean outlines, smooth vibrant digital vector coloring, rich warm palette.
- **Composition**: Centered full-body seated or standing pose, white die-cut sticker border, isolated on pure white background (clean background easy to make transparent).
- **Aspect Ratio**: `3:4` or `1:1`.

### 2. Rides (Animals)
- **Character Style**: Adorable baby animal chibi cartoon, chubby friendly proportions, big cute sparkling black eyes, friendly sweet smile, toddler-friendly.
- **Outlines & Shading**: Bold soft outlines, warm vibrant vector colors, matching the friendly aesthetic of existing rides (`mouse.png`, `bull.png`, `lion.png`).
- **Composition**: Centered full animal figure, white die-cut sticker border around the outline, isolated on pure white background (easy for transparent cutout).
- **Special Requirements**:
  - **Dog (Dattatreya's Ride)**: Must be **Indian Pariah Dogs (Desi dogs)** with light fawn/tan coat, pointed triangular alert ears, curled bushy tail, friendly puppy face. **Show 4 dogs in the same picture** sitting happily together.
  - **Elephant (Indra's Ride)**: Must be a **White Elephant** (Airavata) — creamy snow-white skin with gentle pinkish accents, decorated with royal golden headwear/bells.

---

## 📊 1. Deities Status Table

| # | Deity | Ride (English) | In Find the Ride | In Find the God | Asset PNG Path | Fallback | Status |
|---|---|---|---|---|---|---|---|
| 1 | **Ganesha** | Mouse 🐭 | Yes | Yes | `public/assets/vaahana/ganesha.png` | `ganesha.svg` | ✅ Existing |
| 2 | **Shiva** | Bull 🐂 | Yes | Yes | `public/assets/vaahana/shiva.png` | `shiva.svg` | ✅ Existing |
| 3 | **Vishnu** | Eagle 🦅 | Yes | Yes | `public/assets/vaahana/vishnu.png` | `vishnu.svg` | ✅ Existing |
| 4 | **Durga** | Lion 🦁 | Yes | Yes | `public/assets/vaahana/durga.png` | `durga.svg` | ✅ Existing |
| 5 | **Saraswati** | Swan 🦢 | Yes | Yes | `public/assets/vaahana/saraswati.png` | `saraswati.svg` | ✅ Existing |
| 6 | **Kartikeya** | Peacock 🦚 | Yes | Yes | `public/assets/vaahana/kartikeya.png` | `kartikeya.svg` | ✅ Existing |
| 7 | **Lakshmi** | Owl 🦉 | Yes | Yes | `public/assets/vaahana/lakshmi.png` | `lakshmi.svg` | ✅ Generated (PNG) |
| 8 | **Brahma** | Swan 🦢 | Yes | Yes | `public/assets/vaahana/brahma.png` | `brahma.svg` | ✅ Generated (PNG) |
| 9 | **Indra** | White Elephant 🐘 | Yes | Yes | `public/assets/vaahana/indra.png` | `indra.svg` | ✅ Generated (PNG) |
| 10 | **Surya** | Seven Horses 🐎 | Yes | Yes | `public/assets/vaahana/surya.png` | `surya.svg` | ✅ Generated (PNG) |
| 11 | **Shani** | Crow 🐦‍⬛ | Yes | Yes | `public/assets/vaahana/shani.png` | `shani.svg` | ✅ Generated (PNG) |
| 12 | **Yama** | Buffalo 🐃 | Yes | Yes | `public/assets/vaahana/yama.png` | `yama.svg` | ✅ Generated (PNG) |
| 13 | **Agni** | Ram 🐏 | Yes | Yes | `public/assets/vaahana/agni.png` | `agni.svg` | ✅ Generated (PNG) |
| 14 | **Varuna** | Crocodile 🐊 | Yes | Yes | `public/assets/vaahana/varuna.png` | `varuna.svg` | ✅ Generated (PNG) |
| 15 | **Ayyappa** | Tiger 🐅 | Yes | Yes | `public/assets/vaahana/ayyappa.png` | `ayyappa.svg` | ✅ Generated (PNG) |
| 16 | **Dattatreya** | Four Dogs 🐕 | Yes | Yes | `public/assets/vaahana/dattatreya.png` | `dattatreya.svg` | ✅ Generated (PNG) |
| 17 | **Hanuman** | — | — | Yes | `public/assets/vaahana/hanuman.png` | `hanuman.svg` | ✅ Generated (PNG) |
| 18 | **Krishna** | — | — | Yes | `public/assets/vaahana/krishna.png` | `krishna.svg` | ✅ Generated (PNG) |
| 19 | **Rama** | — | — | Yes | `public/assets/vaahana/rama.png` | `rama.svg` | ⏳ Pending Quota (SVG Fallback Active) |
| 20 | **Parvati** | — | — | Yes | `public/assets/vaahana/parvati.png` | `parvati.svg` | ⏳ Pending Quota (SVG Fallback Active) |
| 21 | **Kali** | — | — | Yes | `public/assets/vaahana/kali.png` | `kali.svg` | ⏳ Pending Quota (SVG Fallback Active) |

---

## 🐾 2. Rides Status Table

| # | Ride Name (English) | Deity | Asset PNG Path | Fallback | Status | Notes |
|---|---|---|---|---|---|---|
| 1 | **Mouse** | Ganesha | `public/assets/vaahana/mouse.png` | 🐭 Emoji | ✅ Existing | Cute gray mouse with sweet smile |
| 2 | **Bull** | Shiva | `public/assets/vaahana/bull.png` | 🐂 Emoji | ✅ Existing | Nandi the hump-backed bull |
| 3 | **Lion** | Durga | `public/assets/vaahana/lion.png` | 🦁 Emoji | ✅ Existing | Golden lion with fluffy mane |
| 4 | **Peacock** | Kartikeya | `public/assets/vaahana/peacock-removebg-preview.png` | 🦚 Emoji | ✅ Existing | Vibrant blue/green peacock |
| 5 | **Eagle** | Vishnu | `public/assets/vaahana/garuda.png` | 🦅 Emoji | ✅ Existing | Garuda the golden eagle |
| 6 | **Swan** | Saraswati, Brahma | `public/assets/vaahana/swan.png` | 🦢 Emoji | ✅ Existing | Graceful white swan |
| 7 | **White Elephant** | Indra | `public/assets/vaahana/white_elephant.png` | 🐘 Emoji | ⏳ Pending Quota | Airavata: white baby elephant, golden adornments |
| 8 | **Four Dogs** | Dattatreya | `public/assets/vaahana/four_dogs.png` | 🐕 Emoji | ⏳ Pending Quota | 4 Indian Pariah (Desi) dogs in same picture |
| 9 | **Seven Horses** | Surya | `public/assets/vaahana/seven_horses.png` | 🐎 Emoji | ⏳ Pending Quota | 7 radiant white horses side-by-side |
| 10 | **Crow** | Shani | `public/assets/vaahana/crow.png` | 🐦‍⬛ Emoji | ⏳ Pending Quota | Cute friendly black crow |
| 11 | **Buffalo** | Yama | `public/assets/vaahana/buffalo.png` | 🐃 Emoji | ⏳ Pending Quota | Adorable baby water buffalo |
| 12 | **Ram** | Agni | `public/assets/vaahana/ram.png` | 🐏 Emoji | ⏳ Pending Quota | Fluffy ram with curved horns |
| 13 | **Crocodile** | Varuna | `public/assets/vaahana/crocodile.png` | 🐊 Emoji | ⏳ Pending Quota | Cute smiling green Makara crocodile |
| 14 | **Tiger** | Ayyappa | `public/assets/vaahana/tiger.png` | 🐅 Emoji | ⏳ Pending Quota | Playful orange striped baby tiger |
| 15 | **Owl** | Lakshmi | `public/assets/vaahana/owl.png` | 🦉 Emoji | ⏳ Pending Quota | Wise cute barn owl with big golden eyes |

---

## 🛡️ Fallback Architecture

1. **Deities**: Handled by `DeityOptionCard.vue` and `DeityCard.vue`:
   - Checks `${id}.png`.
   - On `@error`, falls back seamlessly to `${id}.svg`.
2. **Rides**: Handled by `VaahanaOption.vue`:
   - Checks `option.image` (`${id}.png`).
   - On `@error` or if missing, automatically falls back to the large, colorful, high-contrast Toddler Emoji card (`option.emoji`).
   - As soon as the PNG file is generated and saved in `public/assets/vaahana/`, it automatically shows the artwork without requiring code changes.

---

## 📝 Generation Prompts Queue

### Pending Deities (3 Deities)

#### 19. Rama (`rama.png`)
```text
Cute chibi sticker illustration of Lord Rama, adorable noble cartoon prince with soft greenish-blue complexion, holding golden kodanda bow and quiver of arrows on back, wearing yellow and gold royal dhoti, magnificent golden crown, noble gentle smile, big expressive eyes, white die-cut sticker outline, isolated on pure white background, kid-friendly vector art style.
```

#### 20. Parvati (`parvati.png`)
```text
Cute chibi sticker illustration of Goddess Parvati, adorable cartoon goddess wearing an emerald green silk sari with gold borders, holding a pink lotus blossom, ornate golden crown mukut with flowers, red bindi, nose ring, warm motherly smile, big loving eyes, white die-cut sticker outline, isolated on pure white background, kid-friendly vector art style.
```

#### 21. Kali (`kali.png`)
```text
Cute chibi sticker illustration of Goddess Kali, adorable toddler-friendly cartoon goddess with deep indigo blue complexion, cute playful smile with red tongue, holding a small golden sword in hand, crescent moon on forehead, wild dark hair, big loving cute eyes, golden crown, white die-cut sticker outline, isolated on pure white background, friendly vector art style.
```

---

### Pending Rides (9 Rides)

#### 1. White Elephant (`white_elephant.png`) — Indra's Ride
```text
Cute chibi sticker illustration of Lord Indra's sacred white elephant Airavata, adorable baby white elephant with creamy snow-white skin and soft pink accents on ears and cheeks, wearing royal golden headpiece ornaments and gentle bells, raised trunk happily holding a small pink lotus flower, big sparkling innocent eyes, sweet cheerful smile, white die-cut sticker outline, isolated on pure white background, toddler-friendly cartoon vector art style.
```

#### 2. Four Dogs (`four_dogs.png`) — Dattatreya's Ride (Indian Pariah Dogs)
```text
Cute chibi sticker illustration of four adorable Indian Pariah dogs (desi dogs) sitting together happily in a group, showing all 4 dogs clearly in the same picture, fawn light brown coats with white chest patches, alert upright pointed triangular ears, curled fluffy tails wagging, big sparkling happy eyes, sweet smiling friendly puppy faces, white die-cut sticker outline, isolated on pure white background, kid-friendly cartoon vector art style.
```

#### 3. Seven Horses (`seven_horses.png`) — Surya's Ride
```text
Cute chibi sticker illustration of seven magical white horses galloping forward together side by side, seven cute white ponies with flowing silky golden-yellow manes, sparkling joyful eyes, cheerful energetic expressions, white die-cut sticker outline, isolated on pure white background, kid-friendly cartoon vector art style.
```

#### 4. Crow (`crow.png`) — Shani's Ride
```text
Cute chibi sticker illustration of an adorable cartoon black crow, sleek shiny blue-black feathers, big cute round sparkling curious eyes, sweet gentle beak, friendly cheerful posture, white die-cut sticker outline, isolated on pure white background, toddler-friendly vector art style.
```

#### 5. Buffalo (`buffalo.png`) — Yama's Ride
```text
Cute chibi sticker illustration of an adorable baby water buffalo, smooth slate-gray coat, cute little curved horns with golden bells, big gentle sparkling brown eyes, sweet innocent smiling face, white die-cut sticker outline, isolated on pure white background, kid-friendly vector art style.
```

#### 6. Ram (`ram.png`) — Agni's Ride
```text
Cute chibi sticker illustration of an adorable baby ram sheep, super fluffy cream-colored fleece, cute spiral golden horns, sweet rosy cheeks, happy smiling face, big sparkling eyes, white die-cut sticker outline, isolated on pure white background, toddler-friendly cartoon vector art style.
```

#### 7. Crocodile (`crocodile.png`) — Varuna's Ride
```text
Cute chibi sticker illustration of a friendly cute cartoon crocodile (Makara), gentle rounded snout with a sweet toothy cheerful smile, big sparkling friendly eyes, soft lime green scales with warm yellow belly, cute stubby legs, white die-cut sticker outline, isolated on pure white background, kid-friendly vector art style.
```

#### 8. Tiger (`tiger.png`) — Ayyappa's Ride
```text
Cute chibi sticker illustration of an adorable playful baby tiger cub, bright vibrant orange fur with cute black stripes, fluffy white belly, big round sparkling golden eyes, joyful sweet open-mouth smile, white die-cut sticker outline, isolated on pure white background, toddler-friendly cartoon vector art style.
```

#### 9. Owl (`owl.png`) — Lakshmi's Ride
```text
Cute chibi sticker illustration of a wise and adorable baby barn owl, soft brown and white feathers with gentle heart-shaped face, big round sparkling golden eyes, cute little beak, friendly and calm expression, white die-cut sticker outline, isolated on pure white background, kid-friendly vector art style.
```

---

## 🛠️ Transparent Background Processing Script

Once images are generated with `isolated on pure white background`, run this Python script to cut out the white background while preserving the crisp white die-cut sticker border:

```python
import collections
from PIL import Image

def make_transparent_with_sticker_border(input_path, output_path, bg_color=(255, 255, 255), tolerance=20):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()

    visited = bytearray(width * height)
    queue = collections.deque()

    def is_bg(r, g, b):
        return (abs(r - bg_color[0]) <= tolerance and 
                abs(g - bg_color[1]) <= tolerance and 
                abs(b - bg_color[2]) <= tolerance)

    # Seed corners and borders
    for x in range(width):
        for y in [0, height - 1]:
            idx = y * width + x
            if not visited[idx]:
                r, g, b, a = pixels[x, y]
                if is_bg(r, g, b):
                    queue.append((x, y))
                    visited[idx] = 1

    for y in range(height):
        for x in [0, width - 1]:
            idx = y * width + x
            if not visited[idx]:
                r, g, b, a = pixels[x, y]
                if is_bg(r, g, b):
                    queue.append((x, y))
                    visited[idx] = 1

    while queue:
        cx, cy = queue.popleft()
        pixels[cx, cy] = (0, 0, 0, 0)
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < width and 0 <= ny < height:
                nidx = ny * width + nx
                if not visited[nidx]:
                    r, g, b, a = pixels[nx, ny]
                    if is_bg(r, g, b):
                        visited[nidx] = 1
                        queue.append((nx, ny))

    img.save(output_path, "PNG")
    print(f"Processed: {output_path}")
```
