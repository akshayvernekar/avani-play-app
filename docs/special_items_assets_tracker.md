# Special Items & Deity Assets Generation Tracker

This tracker documents all 15 deities and their associated special items in the **Find My Special Item** game for Avani Kids Learning App, along with asset generation status, prompts for resuming image generation when credits renew, and fallback assets.

---

## 🎨 Art Style Guide

All assets adhere strictly to the project's chibi toddler sticker aesthetic:
- **Character Style**: Adorable chibi cartoon deities, cute toddler-friendly characters, large heads with big expressive sparkling eyes, sweet gentle smiles.
- **Item Style**: Chunky, vibrant, rounded edges, child-friendly sacred objects/instruments/weapons, sparkling details, non-threatening designs.
- **Outlines & Shading**: Bold clean outlines, smooth vibrant digital vector coloring, rich warm palette.
- **Composition**: Centered figures/items, white die-cut sticker borders around outlines, transparent backgrounds.
- **Aspect Ratio**: `3:4` for Deities, `1:1` for Items.

---

## 📊 1. Deities Status Table (All 15 Initial Deities)

| # | Deity | Item Name | Category | Primary Deity Artwork | Fallback | Status | Notes |
|---|---|---|---|---|---|---|---|
| 1 | **Ganesha** | Modak | Food | `public/assets/vaahana/ganesha.png` | `ganesha.svg` | ✅ Completed | Existing asset |
| 2 | **Shiva** | Trishul | Weapon | `public/assets/vaahana/shiva.png` | `shiva.svg` | ✅ Completed | Existing asset |
| 3 | **Vishnu** | Sudarshana Chakra | Weapon | `public/assets/vaahana/vishnu.png` | `vishnu.svg` | ✅ Completed | Existing asset |
| 4 | **Kartikeya** | Vel | Weapon | `public/assets/vaahana/kartikeya.png` | `kartikeya.svg` | ✅ Completed | Existing asset |
| 5 | **Saraswati** | Veena | Instrument | `public/assets/vaahana/saraswati.png` | `saraswati.svg` | ✅ Completed | Existing asset |
| 6 | **Lakshmi** | Pot of Gold Coins | Object | `public/assets/vaahana/lakshmi.png` | `lakshmi.svg` | ✅ Completed | Existing asset |
| 7 | **Hanuman** | Gada | Weapon | `public/assets/vaahana/hanuman.png` | `hanuman.svg` | ✅ Completed | Existing asset |
| 8 | **Krishna** | Flute | Instrument | `public/assets/vaahana/krishna.png` | `krishna.svg` | ✅ Completed | Existing asset |
| 9 | **Rama** | Bow and Arrow | Weapon | `public/assets/vaahana/rama.png` | `rama.svg` | ✅ Completed | Existing asset |
| 10 | **Yama** | Staff | Object | `public/assets/vaahana/yama.png` | `yama.svg` | ✅ Completed | Existing asset |
| 11 | **Ayyappa** | Bow and Arrow | Weapon | `public/assets/vaahana/ayyappa.png` | `ayyappa.svg` | ✅ Completed | Existing asset |
| 12 | **Dattatreya** | Kamandalu | Sacred Object | `public/assets/vaahana/dattatreya.png` | `dattatreya.svg` | ✅ Completed | Existing asset |
| 13 | **Vamana** | Umbrella | Object | `public/assets/vaahana/vamana.png` | `vamana.svg` | ✅ Generated | Generated & converted to transparent PNG |
| 14 | **Parashurama** | Axe | Weapon | `public/assets/vaahana/parashurama.png` | `parashurama.svg` | ✅ Active | High-res PNG & SVG fallback active |
| 15 | **Balarama** | Plough | Agricultural Tool | `public/assets/vaahana/balarama.png` | `balarama.svg` | ✅ Active | High-res PNG & SVG fallback active |

---

## 🎁 2. Special Items Status Table (All 15 Items + Extensions)

| # | Item ID | Item Name | Associated Deity | Category | PNG Asset | Fallback SVG / Emoji | Status | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | `modak` | Modak | Ganesha | Food | `public/assets/items/modak.png` | `modak.svg` / 🥟 | ✅ Active | High-res PNG & SVG fallback |
| 2 | `trishul` | Trishul | Shiva | Weapon | `public/assets/items/trishul.png` | `trishul.svg` / 🔱 | ✅ Active | High-res PNG & SVG fallback |
| 3 | `chakra` | Sudarshana Chakra | Vishnu | Weapon | `public/assets/items/chakra.png` | `chakra.svg` / ☸️ | ✅ Active | High-res PNG & SVG fallback |
| 4 | `vel` | Vel | Kartikeya | Weapon | `public/assets/items/vel.png` | `vel.svg` / 🗡️ | ✅ Active | High-res PNG & SVG fallback |
| 5 | `veena` | Veena | Saraswati | Instrument | `public/assets/items/veena.png` | `veena.svg` / 🪕 | ✅ Active | High-res PNG & SVG fallback |
| 6 | `pot_gold_coins` | Pot of Gold Coins | Lakshmi | Object | `public/assets/items/pot_gold_coins.png` | `pot_gold_coins.svg` / 🏺 | ✅ Active | High-res PNG & SVG fallback |
| 7 | `gada` | Gada | Hanuman | Weapon | `public/assets/items/gada.png` | `gada.svg` / 🪓 | ✅ Active | High-res PNG & SVG fallback |
| 8 | `flute` | Flute | Krishna | Instrument | `public/assets/items/flute.png` | `flute.svg` / 🪈 | ✅ Active | High-res PNG & SVG fallback |
| 9 | `bow_arrow` | Bow and Arrow | Rama, Ayyappa | Weapon | `public/assets/items/bow_arrow.png` | `bow_arrow.svg` / 🏹 | ✅ Active | High-res PNG & SVG fallback |
| 10 | `staff` | Staff | Yama | Object | `public/assets/items/staff.png` | `staff.svg` / 🪄 | ✅ Active | High-res PNG & SVG fallback |
| 11 | `kamandalu` | Kamandalu | Dattatreya | Sacred Object | `public/assets/items/kamandalu.png` | `kamandalu.svg` / 🫖 | ✅ Active | High-res PNG & SVG fallback |
| 12 | `umbrella` | Umbrella | Vamana | Object | `public/assets/items/umbrella.png` | `umbrella.svg` / ☂️ | ✅ Active | High-res PNG & SVG fallback |
| 13 | `axe` | Axe | Parashurama | Weapon | `public/assets/items/axe.png` | `axe.svg` / 🪓 | ✅ Active | High-res PNG & SVG fallback |
| 14 | `plough` | Plough | Balarama | Agricultural Tool | `public/assets/items/plough.png` | `plough.svg` / 🌾 | ✅ Active | High-res PNG & SVG fallback |
| 15 | `books` | Books | Saraswati | Sacred Object | `public/assets/items/books.png` | `books.svg` / 📚 | ✅ Active | High-res PNG & SVG fallback |

---

## 🔊 3. Audio Assets Status Table (All 15 Complete)

Generated using Neural TTS voice `en-IN-NeerjaExpressiveNeural` (`pitch="+25Hz"`, `rate="+4%"`):

| # | Deity | Filename | Audio Question Spoken Text | Status |
|---|---|---|---|---|
| 1 | Ganesha | `public/assets/audio_gungun/item_q_ganesha.mp3` | "What belongs to Ganesha?" | ✅ Generated |
| 2 | Shiva | `public/assets/audio_gungun/item_q_shiva.mp3` | "What belongs to Shiva?" | ✅ Generated |
| 3 | Vishnu | `public/assets/audio_gungun/item_q_vishnu.mp3` | "What belongs to Vishnu?" | ✅ Generated |
| 4 | Kartikeya | `public/assets/audio_gungun/item_q_kartikeya.mp3` | "What belongs to Karthikeya?" | ✅ Generated |
| 5 | Saraswati | `public/assets/audio_gungun/item_q_saraswati.mp3` | "What belongs to Saraswati?" | ✅ Generated |
| 6 | Lakshmi | `public/assets/audio_gungun/item_q_lakshmi.mp3` | "What belongs to Lakshmi?" | ✅ Generated |
| 7 | Hanuman | `public/assets/audio_gungun/item_q_hanuman.mp3` | "What belongs to Hanuman?" | ✅ Generated |
| 8 | Krishna | `public/assets/audio_gungun/item_q_krishna.mp3` | "What belongs to Krishna?" | ✅ Generated |
| 9 | Rama | `public/assets/audio_gungun/item_q_rama.mp3` | "What belongs to Rama?" | ✅ Generated |
| 10 | Yama | `public/assets/audio_gungun/item_q_yama.mp3` | "What belongs to Yama?" | ✅ Generated |
| 11 | Ayyappa | `public/assets/audio_gungun/item_q_ayyappa.mp3` | "What belongs to Ayyappa?" | ✅ Generated |
| 12 | Dattatreya | `public/assets/audio_gungun/item_q_dattatreya.mp3` | "What belongs to Dattatreya?" | ✅ Generated |
| 13 | Vamana | `public/assets/audio_gungun/item_q_vamana.mp3` | "What belongs to Vamana?" | ✅ Generated |
| 14 | Parashurama | `public/assets/audio_gungun/item_q_parashurama.mp3` | "What belongs to Parashurama?" | ✅ Generated |
| 15 | Balarama | `public/assets/audio_gungun/item_q_balarama.mp3` | "What belongs to Balarama?" | ✅ Generated |

---

## 🔄 4. Resumption Instructions (When Image Quota Renews)

When image generation quota resets, run the following generation prompts with `generate_image`:

### Deities:
1. **Parashurama** (Aspect `3:4`):
   ```text
   In the exact same cartoon chibi sticker style as the reference images, create an adorable child cartoon Hindu deity Parashurama avatar, cute warrior sage boy with ascetic topknot hairstyle (rudraksha beads), gentle warrior expression, carrying a stylized traditional divine battle axe (parashu) over his shoulder, wearing light saffron cloth, big cute expressive sparkling eyes, sweet smile, clean bold outlines, white die-cut sticker outline border, isolated on pure white background, flat color vector shading, toddler-friendly character design.
   ```
2. **Balarama** (Aspect `3:4`):
   ```text
   In the exact same cartoon chibi sticker style as the reference images, create an adorable child cartoon Hindu deity Balarama avatar, cute strong fair-complexioned boy in dark blue silk clothes, carrying a golden plough (hala) over his shoulder, wearing single golden earring (kundala), big cute expressive sparkling eyes, broad cheerful smile, clean bold outlines, white die-cut sticker outline border, isolated on pure white background, flat color vector shading, toddler-friendly character design.
   ```

### Items (Aspect `1:1`):
1. **Trishul**: "Cute cartoon sticker of Lord Shiva's golden trishul trident with a small damru drum tied in the middle with orange ribbons..."
2. **Sudarshana Chakra**: "Cute cartoon sticker of Lord Vishnu's divine Sudarshana Chakra, radiant spinning golden celestial wheel..."
3. **Vel**: "Cute cartoon sticker of Lord Murugan's golden Vel spear, sacred leaf-shaped divine spearhead..."
4. **Veena**: "Cute cartoon sticker of Goddess Saraswati's classical Indian veena musical instrument..."
5. **Pot of Gold Coins**: "Cute cartoon sticker of Goddess Lakshmi's sacred golden kalash pot overflowing with sparkling gold coins..."
6. **Gada**: "Cute cartoon sticker of Lord Hanuman's golden gada mace..."
7. **Flute**: "Cute cartoon sticker of Lord Krishna's divine bamboo bansuri flute decorated with a peacock feather..."
8. **Bow and Arrow**: "Cute cartoon sticker of Lord Rama's golden Kodanda bow and arrow..."
9. **Staff**: "Cute cartoon sticker of Lord Yama's traditional sacred wooden staff (danda)..."
10. **Kamandalu**: "Cute cartoon sticker of Lord Dattatreya's sacred brass kamandalu water pot with overhead handle..."
11. **Umbrella**: "Cute cartoon sticker of Lord Vamana's traditional wooden chatra umbrella..."
12. **Axe**: "Cute cartoon sticker of Lord Parashurama's sacred battle axe (parashu)..."
13. **Plough**: "Cute cartoon sticker of Lord Balarama's traditional golden agricultural plough (hala)..."

After generation, process background transparency with:
```bash
python3 scratch/make_transparent.py "<input_file.jpg>" "<output_file.png>" 20
```
