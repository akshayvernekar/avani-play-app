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
- **Dual Orientation (Portrait & Landscape)**:
  - `HomeView.vue` (`/`)
  - `PujaGameView.vue` (`/puja`)
  - `IdentifyGodView.vue` (`/identify-god`)
  - `VaahanaGameView.vue` (`/vaahana/:id?`)
  - `VaahanaSelectionView.vue` (`/vaahana`)
  - `PuzzleSelectionView.vue` (`/puzzles`)
- **Landscape-Only Games**:
  - `PuzzleGameView.vue` (`/puzzle/:id`) (Phaser 3 jigsaw board)
- **No scrolling**: Containers use `width: 100vw; height: 100vh; height: 100dvh; overflow: hidden; position: fixed; inset: 0;`.
- **Safe areas**: Padding uses `env(safe-area-inset-*)` combined with `clamp()`.

### Adaptive Layout (Games)
Games adapt smoothly between Landscape and Portrait:
1. **Landscape Mode**:
   - Left Panel (~46% - 50%): Question & prompt card in cream gradient, prominent speaker button, illustration scaled with `object-fit: contain`.
   - Right Panel (~50% - 54%): 2 × 2 grid of large rounded option cards.
2. **Portrait Mode**:
   - Top Stage (~40% - 48%): Question prompt card / deity figure, cleanly scaled to avoid vertical scrolling.
   - Bottom Stage (~52% - 60%): 2 × 2 grid of option cards with responsive emoji/label font scaling.
   - Navigation: Slim header with inline feedback hidden on extra-narrow viewports (< 480px) to preserve button spacing.

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
