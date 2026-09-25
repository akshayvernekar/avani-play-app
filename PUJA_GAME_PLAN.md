# Puja Interactive Sub-App — Implementation Plan

> **Purpose**: A trackable, step-by-step plan for building the Puja doll-dressing game.  
> Agents picking up this plan should read [AGENTS.md](./AGENTS.md) first for architectural conventions.

---

## Progress Legend

- `[ ]` — Not started  
- `[~]` — In progress  
- `[x]` — Complete  

---

## Codebase Snapshot (at time of planning)

| Path | Notes |
|---|---|
| `src/router/index.ts` | Add `/puja` route here |
| `src/data/games.ts` | Add Puja tile to home screen |
| `src/audio/AudioManager.ts` | **Do NOT modify** — use `audioManager.playTap()`, `playSnap()`, `playCelebration()`, `playPickup()` |
| `public/assets/vaahana/ganesha.png` | **Existing Ganesha artwork** — reuse, do not regenerate |
| `public/assets/backgrounds/home_bg.svg` | Existing background |
| `src/views/VaahanaGameView.vue` | Reference for landscape layout pattern |
| `src/components/NavigationButton.vue` | Reuse for Home + Mute buttons |

---

## File Structure to Create

```
src/
├── data/
│   └── puja.ts                          ← Puja config data (items, placements, deity config)
├── views/
│   └── PujaGameView.vue                 ← Main landscape game view
└── components/
    └── puja/
        ├── PujaScene.vue                ← Left 65-70%: Ganesha scene + placed items
        ├── PujaToolsPanel.vue           ← Right 30-35%: Category tabs + item cards
        ├── PujaItemCard.vue             ← Individual draggable item card
        ├── AartiOverlay.vue             ← Aarti gesture interaction overlay
        └── PujaCelebrationModal.vue     ← Completion celebration screen

public/assets/puja/
├── bg/
│   └── temple_bg.svg                    ← Temple/shrine background (generate)
├── platform/
│   └── puja_platform.png                ← Puja tray/platform (generate)
├── flowers/
│   ├── marigold.png
│   ├── rose.png
│   ├── jasmine.png
│   └── lotus.png
├── garlands/
│   ├── garland_marigold.png
│   ├── garland_rose.png
│   └── garland_jasmine.png
├── offerings/
│   ├── modak.png
│   ├── laddoo.png
│   ├── banana.png
│   ├── coconut.png
│   └── fruits.png
├── lights/
│   ├── diya_unlit.png
│   ├── diya_lit.png
│   └── lamp_brass.png
├── incense/
│   ├── incense_stick.png
│   └── incense_holder.png
└── aarti/
    ├── aarti_small.png
    ├── aarti_large.png
    └── aarti_multi.png
```

---

## Phase 0 — Setup & Routing

### Tasks

- [ ] **0.1** Add `puja` entry to `src/data/games.ts`
  - `id: "puja"`, `title: "Puja Time 🙏"`, `subtitle: "Decorate Ganesha!"`, use existing `ganesha.png` as `customIcon`
  - `bgColor: "#FFF8E1"`, `borderColor: "#FFB300"`, `textColor: "#E65100"`, `enabled: true`, `route: "/puja"`
  - Badge: `"New!"`

- [ ] **0.2** Add route to `src/router/index.ts`
  ```ts
  import PujaGameView from '../views/PujaGameView.vue';
  // In routes array:
  { path: '/puja', name: 'PujaGame', component: PujaGameView }
  ```

- [ ] **0.3** Create `src/data/puja.ts` — configuration data (see Phase 1)

- [ ] **0.4** Create placeholder `src/views/PujaGameView.vue` with landscape container + portrait blocker (copy pattern from `VaahanaGameView.vue`)

---

## Phase 1 — Data Layer (`src/data/puja.ts`)

### Type Definitions

```ts
export type PujaCategory = 'flowers' | 'garlands' | 'offerings' | 'lights' | 'incense' | 'aarti';

export interface PujaItem {
  id: string;
  name: string;
  emoji: string;           // fallback emoji if image missing
  image: string;           // path relative to BASE_URL
  type: PujaCategory;
  placement: PlacementZone;
  sound: PujaSoundType;
  snapRadius?: number;     // px within which auto-snap triggers (default 100)
}

export type PlacementZone = 'feet' | 'neck' | 'platform' | 'scene_left' | 'scene_right' | 'front';
export type PujaSoundType = 'chime' | 'bell' | 'whoosh' | 'incense' | 'aarti' | 'celebration';

export interface PujaDeityConfig {
  id: string;
  name: string;
  image: string;
  sceneBackground: string;
  platformImage: string;
  neckSnapZone: { cx: number; cy: number; r: number }; // % of scene dimensions
  feetSnapZone: { cx: number; cy: number; r: number };
  platformSnapZone: { cx: number; cy: number; r: number };
  aartiOrbitRadius: number; // % of scene width
}
```

### Data to Create

- [ ] **1.1** `pujaItems` object with arrays for each category (flowers, garlands, offerings, lights, incense, aarti) — minimum 3 items per category
- [ ] **1.2** `ganeshaPujaConfig: PujaDeityConfig` — snap zone coordinates tuned for the existing Ganesha PNG

### Notes

- All image paths should be like: `assets/puja/flowers/marigold.png` (resolved with `import.meta.env.BASE_URL` at runtime)
- For Phase 1, use emoji as visual placeholders before generating image assets

---

## Phase 2 — Asset Generation

> **Executing agent**: Use the `generate_image` tool for every task below. Save all output files to the paths shown under **Output**. After each save, update `[ ]` → `[x]`.

---

### Cohesive Visual Style — READ BEFORE GENERATING ANY ASSET

All assets in this phase must feel like they belong to the **same children's game**. Maintain the following across every image:

| Rule | Specification |
|---|---|
| Art style | Beautiful, warm, colorful **3D cartoon illustration** |
| Audience | Children aged 2–6 — soft, friendly, premium look |
| Aesthetic | Warm Indian temple / Puja festival |
| Forms | Rounded, chunky, slightly exaggerated proportions |
| Lighting | Soft studio lighting from upper-left, subtle warm glow |
| Depth | Subtle 3D shading, gentle drop shadow under each object |
| Silhouette | Clean, readable at small sizes |
| Palette | Warm: saffron orange, turmeric yellow, rose pink, ivory cream, gold, soft green — NO cold blues or greys |
| Background | **Transparent** (PNG) unless stated otherwise |
| Composition | Object **centered**, fully visible, **not cropped** |
| Text / UI | **None — no text, no labels, no UI elements** |
| Scale | Consistent relative scale across all assets |
| Perspective | Slight 3/4 birds-eye view for platform objects; front-facing for flowers and garlands |

**Do not include** surrounding objects, decorative elements that belong to a different asset, borders, frames, or gradients that imply a background.

---

### 2A — Environment / Scene Background

- [ ] **2.1** Temple background  
  **Output**: `public/assets/puja/bg/temple_bg.png` (AspectRatio: `4:3`)  
  **Prompt**:
  > Beautiful warm 3D cartoon illustration of a Hindu temple shrine interior background for a children's game. Arched golden mandap frame at the center, decorative carved stone pillars on the sides with marigold flower string garlands draped between them. Warm saffron orange and turmeric yellow walls with subtle decorative motifs. Red cloth backdrop behind the arch center. Small oil diyas flickering along the base edges. Soft glowing temple atmosphere, warm golden ambient light, no people, no deities, the center space is empty and ready for a Ganesha idol to be placed. Top-down slightly tilted view. Child-friendly, colorful, not crowded, premium cartoon animation style.

- [ ] **2.2** Puja platform / tray  
  **Output**: `public/assets/puja/platform/puja_platform.png` (AspectRatio: `3:2`)  
  **Prompt**:
  > A single ornate 3D cartoon illustration of a traditional brass Indian puja thali (offering tray / platform). Round or slightly rectangular, highly polished golden brass with intricate embossed border pattern. Viewed from a slight 3/4 top-down angle. Empty surface, no items on it. Soft warm gold and amber tones, gentle studio light reflection. Transparent background. Child-friendly cartoon style, rounded and chunky 3D look. No text, no additional objects.

---

### 2B — Flowers

> All flower assets: **square 1:1**, transparent background, object centered and fully visible.

- [ ] **2.3** Marigold  
  **Output**: `public/assets/puja/flowers/marigold.png` (AspectRatio: `1:1`)  
  **Prompt**:
  > A single 3D cartoon marigold flower, bright saffron orange and golden yellow petals arranged in concentric rings, green rounded base/calyx. Soft studio lighting, warm glow, rounded petals with subtle depth shading. Transparent background. Centered, not cropped. Child-friendly, vibrant, cute. No leaves, no stem, just the flower head. Premium children's game illustration style.

- [ ] **2.4** Rose  
  **Output**: `public/assets/puja/flowers/rose.png` (AspectRatio: `1:1`)  
  **Prompt**:
  > A single 3D cartoon rose flower, rich deep pink and soft coral petals tightly spiraling outward, small rounded green leaves at base. Soft warm studio lighting, subtle depth. Transparent background. Centered, fully visible. Child-friendly, rounded, chunky cartoon style. No stem. Premium children's game illustration.

- [ ] **2.5** Jasmine  
  **Output**: `public/assets/puja/flowers/jasmine.png` (AspectRatio: `1:1`)  
  **Prompt**:
  > A small cluster of 3D cartoon jasmine flowers, creamy white star-shaped blooms with tiny yellow centers, set on a small rounded bunch of deep green leaves. Soft warm studio light, gentle glow. Transparent background. Centered, not cropped. Cute, rounded, child-friendly cartoon style. Premium children's game illustration.

- [ ] **2.6** Lotus  
  **Output**: `public/assets/puja/flowers/lotus.png` (AspectRatio: `1:1`)  
  **Prompt**:
  > A single open 3D cartoon lotus flower viewed slightly from above. Soft pink outer petals graduating to creamy white center, golden yellow stamen cluster in the middle. Round flat green lily pad base just visible beneath. Transparent background. Centered, fully visible, not cropped. Soft studio lighting, gentle warm glow. Child-friendly, rounded, premium cartoon style. No water, no background.

---

### 2C — Garlands

> Garlands should be **arc/loop shaped** — wide enough to drape around a neck. Landscape orientation `3:2`. Transparent background.

- [ ] **2.7** Marigold garland  
  **Output**: `public/assets/puja/garlands/garland_marigold.png` (AspectRatio: `3:2`)  
  **Prompt**:
  > A 3D cartoon orange marigold garland in a gentle arc or U-loop shape, as if draped around a deity's neck. Dense row of bright saffron-orange marigold blooms threaded on a green string. Warm golden ambient light, soft depth shading on each flower. Transparent background. Wide arc shape, object centered and fully visible. No text, no background. Child-friendly premium cartoon game art style.

- [ ] **2.8** Rose garland  
  **Output**: `public/assets/puja/garlands/garland_rose.png` (AspectRatio: `3:2`)  
  **Prompt**:
  > A 3D cartoon deep red and pink rose garland in a gentle arc or U-loop draping shape. Alternating dark red and soft pink cartoon rose blooms threaded closely on a golden string. Some small white jasmine flowers interspersed. Soft studio lighting, warm glow. Transparent background. Centered arc shape, fully visible. Premium child-friendly cartoon game illustration.

- [ ] **2.9** Jasmine garland  
  **Output**: `public/assets/puja/garlands/garland_jasmine.png` (AspectRatio: `3:2`)  
  **Prompt**:
  > A 3D cartoon white jasmine flower garland (veni/gajra style) in a gentle arc or U-loop shape. Densely packed small white star-shaped jasmine blooms on a thin green thread, with tiny green leaves peeking between flowers. Soft warm creamy light, subtle depth. Transparent background. Centered wide arc shape. Premium children's game cartoon illustration.

---

### 2D — Offerings

> All offering assets: **1:1 square**, transparent background, centered, slight 3/4 top-down view.

- [ ] **2.10** Modak  
  **Output**: `public/assets/puja/offerings/modak.png` (AspectRatio: `1:1`)  
  **Prompt**:
  > A single 3D cartoon modak sweet (Ganesha's favourite). Teardrop-shaped white and ivory dumpling with a neatly pinched and pleated top. Soft cream-white colour with subtle golden sheen, resting on a tiny green banana leaf. Warm soft studio lighting, gentle drop shadow beneath. Transparent background. Centered, fully visible. Child-friendly, chubby, premium cartoon illustration.

- [ ] **2.11** Laddoo  
  **Output**: `public/assets/puja/offerings/laddoo.png` (AspectRatio: `1:1`)  
  **Prompt**:
  > A single large 3D cartoon laddoo sweet. Perfectly round ball, golden-yellow besan/chickpea flour colour, with a slightly grainy texture, tiny pistachio flake on top and a small decorative silver sugar pearl. Warm amber studio lighting, soft shadow below. Transparent background. Centered. Child-friendly chunky cartoon style.

- [ ] **2.12** Banana  
  **Output**: `public/assets/puja/offerings/banana.png` (AspectRatio: `1:1`)  
  **Prompt**:
  > A small bunch of 3 ripe 3D cartoon bananas, bright yellow with a tiny hint of green at the tips, connected at a short brown stalk. Warm golden light, soft shadows. Transparent background. Centered, fully visible, not cropped. Cheerful, rounded, child-friendly cartoon style. No additional fruits.

- [ ] **2.13** Coconut  
  **Output**: `public/assets/puja/offerings/coconut.png` (AspectRatio: `1:1`)  
  **Prompt**:
  > A single whole 3D cartoon coconut with its green outer husk, slightly rounded, with a tuft of 3 small green leaves at the top. Warm studio lighting, soft shadow. Transparent background. Centered, fully visible. Child-friendly chunky proportions, premium cartoon style. No cracks, not split open.

- [ ] **2.14** Mixed fruit plate  
  **Output**: `public/assets/puja/offerings/fruits.png` (AspectRatio: `1:1`)  
  **Prompt**:
  > A 3D cartoon small golden brass plate viewed from slight above, with a cheerful arrangement of tiny cartoon fruits: one red apple, one orange mango, a small bunch of purple grapes, and a banana. All fruits rounded, cute, proportional. Warm amber plate, warm studio lighting, subtle shadow beneath. Transparent background. Centered, not cropped. Premium child-friendly game illustration.

---

### 2E — Lights

- [ ] **2.15** Diya — unlit  
  **Output**: `public/assets/puja/lights/diya_unlit.png` (AspectRatio: `1:1`)  
  **Prompt**:
  > A single 3D cartoon clay oil lamp (diya). Traditional small rounded terracotta clay bowl shape, warm reddish-brown clay colour, small spout at front. A short dark grey cotton wick is visible in the center bowl, NO flame. Small amount of golden oil in the bowl. Warm soft studio lighting. Transparent background. Centered, fully visible, slight 3/4 front-facing view. Child-friendly premium cartoon style.

- [ ] **2.16** Diya — lit  
  **Output**: `public/assets/puja/lights/diya_lit.png` (AspectRatio: `1:1`)  
  **Prompt**:
  > A single 3D cartoon clay oil lamp (diya) that is LIT and glowing. Same terracotta clay bowl as unlit version, with a bright cartoon flame — teardrop shaped, orange at base graduating to bright yellow tip, with a warm golden-white glow halo radiating outward. Gentle golden light cast on the clay beneath. Transparent background. Centered, fully visible. Flame is cheerful, safe and cartoon-friendly — not scary. Premium children's game illustration.

- [ ] **2.17** Brass lamp (deepam)  
  **Output**: `public/assets/puja/lights/lamp_brass.png` (AspectRatio: `1:1`)  
  **Prompt**:
  > A single 3D cartoon traditional brass oil lamp (deepam / kuthuvilakku). Tall pedestal lamp with a central pillar and 5 small bowl-shaped flame spouts arranged in a circular crown. Rich polished golden brass colour with warm amber reflections. Small cartoon orange flames in each spout. Warm golden studio lighting with a gentle glow. Transparent background. Centered, fully visible, slight 3/4 front-facing view. Premium child-friendly cartoon illustration.

---

### 2F — Incense

- [ ] **2.18** Incense stick (lit)  
  **Output**: `public/assets/puja/incense/incense_stick.png` (AspectRatio: `1:1`)  
  **Prompt**:
  > A single 3D cartoon incense stick held upright. Thin wooden stick, dark brown lower half, upper half is a glowing deep red/orange agarbatti stick. At the very tip: a tiny glowing orange-red ember and a soft white wispy smoke curl rising upward in a gentle S-curve. The smoke is translucent, soft and white. Warm ambient light. Transparent background. Centered and fully visible including the smoke trail. Child-friendly premium cartoon style.

- [ ] **2.19** Incense holder  
  **Output**: `public/assets/puja/incense/incense_holder.png` (AspectRatio: `1:1`)  
  **Prompt**:
  > A single 3D cartoon small brass incense stick holder. Small ornate rectangular or boat-shaped brass tray with a round hole at one end to hold an incense stick. Polished golden brass with small engraved decorative pattern. Warm golden studio lighting, soft shadow beneath. Transparent background. Centered, fully visible, slight 3/4 top-down view. Premium child-friendly cartoon style.

---

### 2G — Aarti Plates

- [ ] **2.20** Aarti plate — small  
  **Output**: `public/assets/puja/aarti/aarti_small.png` (AspectRatio: `1:1`)  
  **Prompt**:
  > A single 3D cartoon small brass aarti plate. Round polished golden brass tray with a single lit cartoon diya in the center. The diya has a cheerful orange cartoon flame with a small golden glow halo. Subtle embossed border pattern on the plate rim. Warm golden studio lighting. Transparent background. Centered, fully visible, viewed from slight above/front. Premium child-friendly cartoon game illustration.

- [ ] **2.21** Aarti plate — large brass  
  **Output**: `public/assets/puja/aarti/aarti_large.png` (AspectRatio: `1:1`)  
  **Prompt**:
  > A single 3D cartoon large ornate brass aarti plate. Wide round golden brass tray, highly decorative embossed border, with 3 lit cartoon diyas arranged in a triangle, a small brass bell at the side, and a few scattered marigold petals on the plate surface. Each diya has a bright cheerful orange cartoon flame. Rich warm golden glow, premium studio lighting. Transparent background. Centered, fully visible. Premium child-friendly cartoon game illustration.

- [ ] **2.22** Aarti plate — multi-wick  
  **Output**: `public/assets/puja/aarti/aarti_multi.png` (AspectRatio: `1:1`)  
  **Prompt**:
  > A single 3D cartoon traditional pancha-aarti plate — a round brass tray with 5 lit cartoon wicks/diyas arranged in a circle (one at each of the 5 points). Each wick has a small cheerful teardrop orange cartoon flame. Rich polished golden brass tray with ornate embossed rim. Warm golden glow radiating from the flames. Transparent background. Centered, fully visible, slight top-down perspective. Premium child-friendly cartoon illustration.

---

## Phase 3 — Core Components

### 3A — `PujaItemCard.vue`

A single item in the tools panel. Displays image + name label below.

- [ ] **3A.1** Props: `item: PujaItem`, `disabled?: boolean`
- [ ] **3A.2** Emits: `dragstart(item, event)`, `tap(item)` (for non-drag taps)
- [ ] **3A.3** Style: large card `min-height: clamp(70px, 12vh, 100px)`, rounded `18px`, cream/white bg, slight shadow, warm border on hover/active
- [ ] **3A.4** Touch: must handle both `mousedown`/`mousemove` and `touchstart`/`touchmove` for cross-device drag

### 3B — `PujaToolsPanel.vue`

Right 30-35% panel with category tabs + item grid.

- [ ] **3B.1** Props: `items: Record<PujaCategory, PujaItem[]>`, `activeCategory: PujaCategory`
- [ ] **3B.2** Emits: `category-change(cat)`, `item-drag-start(item, event)`, `item-tap(item)`
- [ ] **3B.3** Category tabs: horizontal scrollable row of emoji+label pill buttons at top. Active tab highlighted in warm yellow/orange.
- [ ] **3B.4** Items grid: `grid-template-columns: repeat(2, 1fr)` below tabs, scrollable if overflow
- [ ] **3B.5** Panel style: `background: rgba(255,255,255,0.85)`, `border-radius: clamp(16px, 3vw, 28px)`, warm border

### 3C — `PujaScene.vue`

Left 65-70% scene area containing Ganesha + all placed items.

- [ ] **3C.1** Props: `deity: PujaDeityConfig`, `placedItems: PlacedItem[]`, `isAartiActive: boolean`, `aartiProgress: number (0-1)`
- [ ] **3C.2** Emits: `drop(item, dropPoint)` — fired when a dragged item is dropped onto the scene
- [ ] **3C.3** Scene layers (z-index order, bottom to top):
  1. Background image (temple_bg.svg)
  2. Platform image
  3. Placed offerings (on platform)
  4. Ganesha image (`ganesha.png`)
  5. Placed garlands (on neck)
  6. Placed flowers (scattered around)
  7. Incense smoke (CSS animation)
  8. Aarti overlay (circular path + plate)
  9. Diya flames (CSS animation)
  10. Celebration effects
- [ ] **3C.4** Drop detection: listen to `pointermove` + `pointerup` on scene. On drop, calculate snap zone proximity and snap item to nearest valid zone.
- [ ] **3C.5** Scene must be `position: relative` with `overflow: hidden`. All child items positioned `absolute`.

### 3D — `AartiOverlay.vue`

Handles the aarti gesture interaction.

- [ ] **3D.1** Props: `item: PujaItem`, `deityConfig: PujaDeityConfig`, `active: boolean`
- [ ] **3D.2** Emits: `progress-update(angle: number)`, `complete`
- [ ] **3D.3** Render a semi-transparent circular orbit path centered on Ganesha
- [ ] **3D.4** Aarti plate follows pointer/touch using CSS `transform: translate()`
- [ ] **3D.5** Track circular progress: detect angle covered using `Math.atan2`. Fire `complete` after ≥ 300° covered.
- [ ] **3D.6** Animate fill of orbital arc using SVG `stroke-dashoffset` technique
- [ ] **3D.7** On complete: emit, do NOT self-close (parent handles celebration)

### 3E — `PujaCelebrationModal.vue`

Full-screen completion overlay.

- [ ] **3E.1** Props: `show: boolean`
- [ ] **3E.2** Emits: `play-again`, `go-home`
- [ ] **3E.3** Display: `"Puja Complete! 🙏"` in large Fredoka font, golden glow, confetti via `canvas-confetti`
- [ ] **3E.4** Two large buttons: `🔄 Try Again` (resets), `🏠 Home`
- [ ] **3E.5** Animated flower petals falling (CSS keyframes, pure CSS — no canvas)
- [ ] **3E.6** Auto-play `audioManager.playCelebration()` on show

---

## Phase 4 — Main Game View (`PujaGameView.vue`)

The orchestrator. Manages all state and coordinates components.

### State

- [ ] **4.1** Define reactive state:
  ```ts
  const activeCategory = ref<PujaCategory>('flowers');
  const placedItems = ref<PlacedItem[]>([]);   // { item, x, y, zone, id }
  const litDiyas = ref<Set<string>>(new Set());
  const incenseLit = ref(false);
  const selectedAartiItem = ref<PujaItem | null>(null);
  const aartiProgress = ref(0);
  const aartiComplete = ref(false);
  const showCelebration = ref(false);
  const isMuted = ref(audioManager.getMuted());
  const draggingItem = ref<PujaItem | null>(null);
  const dragPos = ref({ x: 0, y: 0 });
  ```

### Layout

- [ ] **4.2** Top nav bar: title `"Puja Time 🙏"`, mute button, home button — copy pattern from `VaahanaGameView.vue`
- [ ] **4.3** Main stage: `display: grid; grid-template-columns: 65fr 35fr;`
- [ ] **4.4** Portrait blocker overlay — copy exactly from `VaahanaGameView.vue`
- [ ] **4.5** Attempt `screen.orientation.lock('landscape')` on mount

### Interactions

- [ ] **4.6** **Drag from panel**: On `item-drag-start`, set `draggingItem` and show a floating ghost element that follows pointer
- [ ] **4.7** **Drop on scene**: On `pointerup` over scene, call `handleDrop(item, x, y)`:
  - Detect nearest snap zone (neck, feet, platform, etc.)
  - If within `snapRadius` of a valid zone for the item type, place item there
  - If invalid drop area, animate item back to panel (CSS transition)
  - Call appropriate audio: `playSnap()` for garlands/flowers, `playTap()` for offerings
- [ ] **4.8** **Lights interaction**: Tapping a `lights` item in panel places a diya in scene; tapping diya IN scene lights it (toggles `litDiyas`)
- [ ] **4.9** **Incense interaction**: Tapping/dragging incense places holder in scene and auto-lights (sets `incenseLit = true`)
- [ ] **4.10** **Aarti interaction**: Selecting aarti category shows item selection; selecting an item activates `AartiOverlay`. On `complete` event, trigger celebration.
- [ ] **4.11** **Completion check**: After aarti complete, wait 1.5s then show `PujaCelebrationModal`
- [ ] **4.12** **Reset**: `playAgain()` resets all state, re-mounts fresh scene

### Audio Sound Functions (add to `AudioManager.ts`)

- [ ] **4.13** Add `playChime()` — soft bell chime for flower/offering placement
  _(Frequencies: 880Hz → 1046Hz → 1318Hz quick cascade, triangle wave)_
- [ ] **4.14** Add `playBell()` — temple bell sound for garland snap
  _(Frequencies: 523Hz → 659Hz → 784Hz, triangle wave with longer decay ~0.5s)_
- [ ] **4.15** Add `playFlameWhoosh()` — diya lighting sound
  _(White noise burst + sine fade: 400Hz → 200Hz over 0.3s)_
- [ ] **4.16** Add `playAartiBells()` — looping temple bells during aarti (5 notes repeating, stop via returned stop function)

> **Note**: All new audio methods follow the same pattern as existing ones in `AudioManager.ts` — use Web Audio API oscillators, no external files. This keeps the app fully offline-capable.

---

## Phase 5 — Animations & Visual Polish

### CSS Animations to Implement

- [ ] **5.1** **Diya flame flicker** — CSS keyframe on `.flame` element:
  ```css
  @keyframes flicker {
    0%, 100% { transform: scaleY(1) rotate(-2deg); opacity: 1; }
    25% { transform: scaleY(1.08) rotate(1deg); opacity: 0.95; }
    50% { transform: scaleY(0.94) rotate(-1deg); opacity: 1; }
    75% { transform: scaleY(1.04) rotate(2deg); opacity: 0.98; }
  }
  ```

- [ ] **5.2** **Smoke animation** — Incense smoke rising (CSS `@keyframes smokeDrift`)
  - Upward translate + gentle left/right sway + fade in/out
  - Use multiple layered `div` elements with staggered `animation-delay`

- [ ] **5.3** **Placement bounce** — Item placed in scene gets a brief scale bounce:
  ```css
  @keyframes placeBounce {
    0% { transform: scale(0.6); opacity: 0; }
    60% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }
  ```

- [ ] **5.4** **Aarti glow** — During aarti, Ganesha gets a pulsing golden CSS `filter: drop-shadow(0 0 24px #FFD700)`

- [ ] **5.5** **Garland snap animation** — Quick scale up then settle when garland snaps to neck

- [ ] **5.6** **Celebration petals** — CSS-only falling petals in `PujaCelebrationModal`:
  - 8-10 absolutely positioned petal emojis (🌸🌺🌼) with staggered `animation-delay`
  - `@keyframes fallPetal`: translate from top to bottom + gentle rotation

- [ ] **5.7** **Golden glow on Ganesha at completion** — `filter: drop-shadow(0 0 32px #FFD700) brightness(1.08)` with CSS transition

---

## Phase 6 — Integration & Testing

- [ ] **6.1** Verify drag-and-drop works on desktop mouse (pointerdown → pointermove → pointerup)
- [ ] **6.2** Verify drag-and-drop works on mobile touch (touchstart → touchmove → touchend)
- [ ] **6.3** Test portrait blocker appears in portrait orientation
- [ ] **6.4** Test reset clears all placed items and restarts fresh
- [ ] **6.5** Verify all audio plays without errors in muted/unmuted state
- [ ] **6.6** Check that no layout scrolling occurs (overflow: hidden respected)
- [ ] **6.7** Test aarti circular gesture detection — ensure it's forgiving (completes at 300°, not 360°)
- [ ] **6.8** Verify celebration modal shows correctly and `Try Again` resets cleanly
- [ ] **6.9** Check `HOME` button routes back correctly to `/`
- [ ] **6.10** Verify Ganesha image is the existing `public/assets/vaahana/ganesha.png` (NOT regenerated)

---

## Phase 7 — Home Screen Integration

- [ ] **7.1** Verify Puja tile appears on home screen grid (done as part of Phase 0.1)
- [ ] **7.2** Verify tile routes to `/puja` correctly
- [ ] **7.3** Check tile styling matches other enabled tiles (warm color, badge)

---

## Implementation Notes for Agents

### Drag-and-Drop Strategy

Use native pointer events (not HTML5 drag API) for cross-device compatibility:

```ts
// On item card (in PujaItemCard.vue):
function onPointerDown(e: PointerEvent) {
  e.preventDefault();
  emit('dragstart', props.item, e);
}

// In PujaGameView.vue, track global pointer:
window.addEventListener('pointermove', onDragMove);
window.addEventListener('pointerup', onDragEnd);
```

The floating ghost element during drag should be appended using Vue `<Teleport to="body">` to escape any `overflow: hidden` containers.

### Snap Zone Detection

```ts
function findSnapZone(dropXPercent: number, dropYPercent: number, item: PujaItem): SnapResult | null {
  const zones = ganeshaPujaConfig.snapZones[item.placement];
  // dropXPercent, dropYPercent are percentages of the scene container (0-100)
  for (const zone of zones) {
    const dist = Math.sqrt((dropXPercent - zone.cx)**2 + (dropYPercent - zone.cy)**2);
    if (dist < (item.snapRadius ?? 15)) {  // 15% tolerance
      return zone;
    }
  }
  return null;
}
```

### Aarti Angle Tracking

```ts
// Track total angle swept (not just current angle — allows multiple full circles)
let lastAngle = 0;
let totalSweep = 0;

function onAartiPointerMove(e: PointerEvent) {
  const dx = e.clientX - centerX;
  const dy = e.clientY - centerY;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const delta = angleDiff(angle, lastAngle);  // handles -180/180 wraparound
  totalSweep += Math.abs(delta);
  lastAngle = angle;
  aartiProgress.value = Math.min(totalSweep / 300, 1); // Complete at 300°
  if (totalSweep >= 300) emit('complete');
}

function angleDiff(a: number, b: number): number {
  let d = a - b;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return d;
}
```

### Image Fallback Strategy

If generated images are not yet available, use large emoji as visual placeholders:

```html
<!-- In PujaItemCard.vue template: -->
<img v-if="imageLoaded" :src="fullImageUrl" class="item-img" />
<span v-else class="emoji-fallback">{{ item.emoji }}</span>
```

This means the app is functional even before all assets are generated.

---

## Execution Order for Sequential Agents

For lower-cost models executing this plan:

1. **Start with Phase 0** — just routing + placeholder view (30 min)
2. **Then Phase 1** — data layer with emoji fallbacks (30 min)
3. **Then Phase 3A + 3B** — tools panel works, shows emoji items (1 hr)
4. **Then Phase 3C** — scene with placeholder Ganesha and drop zones (1 hr)
5. **Then Phase 4** — wire up state management and interactions (1.5 hr)
6. **Then Phase 2** — generate image assets (use `generate_image` tool) (1 hr)
7. **Then Phase 3D** — aarti overlay (45 min)
8. **Then Phase 3E** — celebration modal (30 min)
9. **Then Phase 5** — CSS animations and polish (45 min)
10. **Then Phase 6 + 7** — testing and home screen integration (30 min)

---

## Checklist Summary

| Phase | Description | Status |
|---|---|---|
| 0 | Setup & Routing | `[x]` |
| 1 | Data Layer (puja.ts) | `[x]` |
| 2 | Asset Generation | `[x]` |
| 3A | PujaItemCard.vue | `[x]` |
| 3B | PujaToolsPanel.vue | `[x]` |
| 3C | PujaScene.vue | `[x]` |
| 3D | AartiOverlay.vue | `[x]` |
| 3E | PujaCelebrationModal.vue | `[x]` |
| 4 | PujaGameView.vue (main orchestrator) | `[x]` |
| 5 | Animations & Visual Polish | `[x]` |
| 6 | Integration & Testing | `[x]` |
| 7 | Home Screen Integration | `[x]` |

---

## Key Constraints (Do Not Violate)

1. ✅ Landscape-only — `overflow: hidden; position: fixed; inset: 0` on main container
2. ✅ Portrait blocker — copy from `VaahanaGameView.vue` exactly
3. ✅ Do NOT regenerate `ganesha.png` — use `public/assets/vaahana/ganesha.png`
4. ✅ Do NOT modify `AudioManager.ts` internals — only ADD new methods at the bottom
5. ✅ Touch targets: all interactive elements `min-height: 48px`
6. ✅ Font: `'Fredoka'` for titles, `'Outfit'` for secondary labels
7. ✅ Config-driven: all puja items in `puja.ts`, not hardcoded in components
8. ✅ No scrolling in game screens
9. ✅ No red errors, no punitive UX
10. ✅ Use `import.meta.env.BASE_URL` for all asset paths (PWA deployed at `/avani-play-app/`)
