# Avani's Little World (Deva Loka Kids Learning App)

A playful, interactive Indian cultural learning web application for young kids built with **Vue 3**, **Vite**, **TypeScript**, and **Phaser 3**, configured as a full offline **Progressive Web App (PWA)**.

---

## 🎧 Audio Generation Guide

Spoken question prompts, success celebrations, and hints across the games are generated using Microsoft Edge's Neural Text-to-Speech via the Python library **`edge-tts`**.

### Voice & Settings Configuration

| Parameter | Value | Purpose |
|---|---|---|
| **Engine / Library** | `edge-tts` (Python) | High-fidelity neural voice synthesis without external API keys |
| **Voice** | `en-IN-NeerjaExpressiveNeural` | Authentic Indian English accent with friendly, warm, expressive intonation |
| **Pitch** | `+52Hz` | Elevated pitch tuned specifically to sound like a young, cheerful child narrator |
| **Rate** | `+6%` | Slightly elevated tempo for a playful, lively child speaking cadence |
| **Output Directory** | `public/assets/audio_gungun/` | Static audio assets served by Vite / PWA |

> **Note on Pitch Tuning:**
> - Baseline adult female voice is standard `+0Hz`.
> - Friendly adult/teacher narration was previously `+25Hz`.
> - **Kid Narrator voice** is tuned to **`+52Hz`** with **`+6%` rate**, giving a clear, cute child tone without robotic distortion or chipmunk artifacts.

---

### Prerequisites

Install `edge-tts` in your Python environment:

```bash
pip install edge-tts
```

To list all available Indian voices:

```bash
edge-tts --list-voices | grep -i "\-IN"
```

Available Indian English voices:
- `en-IN-NeerjaExpressiveNeural` (Female, Friendly & Expressive) — **Recommended for narration**
- `en-IN-NeerjaNeural` (Female, General)
- `en-IN-PrabhatNeural` (Male, Friendly)

---

### Generation Script

Here is the standard Python script template used to generate kid-voice MP3 files:

```python
import asyncio
import os
import edge_tts

OUTPUT_DIR = "public/assets/audio_gungun"
VOICE = "en-IN-NeerjaExpressiveNeural"
PITCH = "+52Hz"   # Kid narrator pitch
RATE = "+6%"      # Kid speaking tempo

# List of (filename, spoken_text) pairs
AUDIO_PROMPTS = [
    ("find_god_balarama.mp3", "Where is Balarama?"),
    ("find_god_parashurama.mp3", "Where is Parashurama?"),
    ("find_god_vamana.mp3", "Where is Vamana?"),
]

async def generate_single(filename: str, text: str):
    out_path = os.path.join(OUTPUT_DIR, filename)
    print(f"Generating {filename} -> '{text}'...")
    communicate = edge_tts.Communicate(text, VOICE, pitch=PITCH, rate=RATE)
    await communicate.save(out_path)
    size = os.path.getsize(out_path)
    print(f"✓ Saved {filename} ({size} bytes)")

async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    for filename, text in AUDIO_PROMPTS:
        await generate_single(filename, text)
        await asyncio.sleep(0.15)
    print("All audio files generated successfully!")

if __name__ == "__main__":
    asyncio.run(main())
```

### CLI One-Liner Alternative

You can also generate individual clips directly from the terminal:

```bash
edge-tts --voice "en-IN-NeerjaExpressiveNeural" --pitch="+52Hz" --rate="+6%" \
  --text "Where is Balarama?" \
  --write-media "public/assets/audio_gungun/find_god_balarama.mp3"
```

---

### Connecting Generated Audio to the App

After generating new audio files:

1. **Register in `src/audio/AudioManager.ts`**:
   Add the filename to the `KNOWN_AUDIO_FILES` Set in `src/audio/AudioManager.ts`. This tells the audio manager that a local file exists so it plays it directly instead of falling back to Web Speech Synthesis:
   ```ts
   const KNOWN_AUDIO_FILES = new Set([
     ...
     'find_god_balarama.mp3',
     'find_god_parashurama.mp3',
     'find_god_vamana.mp3',
     ...
   ]);
   ```

2. **Map in Data Files (`src/data/deities.ts`)**:
   Reference the path in the deity's `audio` object:
   ```ts
   audio: {
     findGodQuestion: "assets/audio_gungun/find_god_balarama.mp3",
     findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
     specialItemQuestion: "assets/audio_gungun/item_q_balarama.mp3"
   }
   ```

3. **Verify Build**:
   ```bash
   npm run build
   ```

---

## 🚀 Development & Build

```bash
# Install dependencies
npm install

# Start local development server (port 3000)
npm run dev

# Typecheck and build for production
npm run build

# Preview production build
npm run preview
```

---

## 📖 Architecture & Conventions

For detailed layout rules, orientation standards, and directory mappings, refer to [AGENTS.md](AGENTS.md).
