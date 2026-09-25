# Agents Guide - Avani Kids Learning App

This guide documents the architecture, layout rules, and key conventions of the codebase so future agents can understand and maintain the application quickly without scanning media assets or reading raw files repeatedly.

---

## 1. Project Overview & Tech Stack
- **Framework**: Vue 3 (Composition API `<script setup lang="ts">`), Vite, TypeScript, Vue Router (`history: createWebHistory('/avani-play-app/')`).
- **PWA**: `vite-plugin-pwa` configured in `vite.config.ts`.
- **Game Engine**: Phaser 3 (for jigsaw puzzles in `src/games/puzzle/`).
- **Icons**: `lucide-vue-next`.
- **Effects & Audio**: `canvas-confetti`, custom singleton `AudioManager` (`src/audio/AudioManager.ts`).
- **Styling**: Scoped CSS with Google Fonts (`Fredoka`, `Outfit`). Uses CSS Grid, Flexbox, and `clamp()` for responsive fluid layouts.

---

## 2. Layout & Orientation Rules

### App-Wide Viewport Standard
- **Game Screens are strictly LANDSCAPE ONLY**:
  - `VaahanaGameView.vue` (`/vaahana/:id?`)
  - `IdentifyGodView.vue` (`/identify-god`)
  - `PuzzleGameView.vue` (`/puzzle/:id`)
  - **No scrolling**: Containers use `width: 100vw; height: 100vh; height: 100dvh; overflow: hidden; position: fixed; inset: 0;`.
  - **Safe areas**: Padding uses `env(safe-area-inset-*)` combined with `clamp()`.

### Split-Screen Landscape Layout (Games)
Games follow a consistent 2-column landscape structure:
1. **Top Nav Bar (`<header class="top-nav">`)**:
   - Slim height (`clamp(38px, 7.5vh, 52px)`).
   - Left: Game title + animated inline feedback / hint pill (`feedback-inline`).
   - Right: Compact round counter pill (`progress-pill`, e.g. `1/6`), circular Sound toggle, circular Home button.
2. **Main Stage (`<main class="game-stage-landscape">`)**:
   - **Left Panel (~46% - 50%)**:
     - Question & prompt card in cream gradient (`radial-gradient(#FFFDE7, #FFF3E0)`), bordered with rounded corners (`clamp(18px, 3vh, 28px)`).
     - Prominent speaker button (`clamp(44px, 10vh, 72px)`) with pulse animation and audio playback.
     - Illustration or question text scaled proportionally with `object-fit: contain` (never cropped).
     - On answer match, success actions (such as `Try Another` / `Try New God`) appear inside the left panel without pushing boundaries.
   - **Right Panel (~50% - 54%)**:
     - `2 × 2` grid (`display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; height: 100%; min-height: 0; gap: clamp(8px, 1.6vh, 14px);`).
     - 4 large rounded option cards (`VaahanaOption.vue` or `DeityOptionCard.vue`).
     - Tapping incorrect options triggers a gentle shake animation (`shakeReturn` / `shake-anim`) and encouraging feedback (`Try again!`).
     - Tapping correct option triggers confetti, celebration audio, and highlights the card.

### Portrait Blocker Overlay (`.portrait-guard-overlay`)
- Whenever `@media (orientation: portrait)` is active on landscape-only game screens, a full-screen blocker is shown (`z-index: 999999`):
  - Minimal playful message: *"Turn your device sideways!"*
  - Animated phone rotating icon + arrow.
  - On mount, game views also attempt `screen.orientation?.lock?.('landscape')`.

### First Screen / Home (`HomeView.vue`)
- **Dual Adaptive**: Fully adapts to **both** Portrait and Landscape orientations.
  - Portrait: 2-column grid of game tiles.
  - Landscape / Wide: Expands to 3-column layout on wider aspect ratios, scaling vertical margins to fit viewport height cleanly.

---

## 3. Directory Map & Key Files

```
src/
├── App.vue                         # Root app component (fade route transitions)
├── router/
│   └── index.ts                    # Routes: '/', '/identify-god', '/vaahana', '/vaahana/:id', '/puzzles', '/puzzle/:id'
├── audio/
│   └── AudioManager.ts             # Global audio player, TTS fallback, mute state
├── data/
│   ├── games.ts                    # Home screen category cards
│   ├── vaahana.ts                  # Gods & Vaahanas dataset (deities, correct vaahana, hint, audio paths)
│   ├── identifyGod.ts              # Identify the God dataset (questionText, options, successText)
│   └── puzzles.ts                  # Jigsaw puzzle images, grid rows/cols, background themes
├── views/
│   ├── HomeView.vue                # Main landing screen (adaptive portrait/landscape)
│   ├── IdentifyGodView.vue         # Identify God game (landscape split layout)
│   ├── VaahanaGameView.vue         # Gods & Vaahanas game (landscape split layout)
│   ├── VaahanaSelectionView.vue    # Deity picker grid (responsive 2-3 cols)
│   ├── PuzzleSelectionView.vue     # Puzzle picker grid (responsive 2-3 cols)
│   └── PuzzleGameView.vue          # Phaser jigsaw puzzle board
└── components/
    ├── NavigationButton.vue        # Circular 56px button (home, back, audio)
    ├── GameTile.vue                # Home category tile
    ├── vaahana/
    │   ├── DeityCard.vue           # Left question panel in Vaahana game
    │   ├── VaahanaOption.vue       # 2x2 animal option cards
    │   └── VaahanaCelebrationModal.vue # Victory gallery modal
    ├── identifyGod/
    │   └── DeityOptionCard.vue     # 2x2 deity option cards
    └── CelebrationModal.vue        # Jigsaw puzzle victory modal
```

---

## 4. Key Rules for Future Updates
1. **Never alter existing game logic or remove audio triggers** (`audioManager.playAudioFile`, speech synthesis fallbacks, confetti).
2. **Never overwrite or recompress images/audio assets** in `public/assets/`.
3. **Never allow vertical or horizontal page scrolling in game screens** (`overflow: hidden; height: 100vh; height: 100dvh;`).
4. **Always test touch targets**: Buttons must be large enough for young children (`min-height: 48px`, rounded pill/circle styling).
5. **Color & Typography System**:
   - Palette: Sunny yellows (`#FFFDE7`, `#FFE082`, `#FFB300`), warm orange (`#FF9800`, `#E65100`), pinks (`#FF4081`, `#C2185B`), sky blues (`#0288D1`, `#4FC3F7`), greens (`#4CAF50`, `#2E7D32`).
   - Font: `'Fredoka', sans-serif` for headers/titles, `'Outfit'` for secondary labels.
