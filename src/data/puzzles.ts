export interface PuzzleItem {
  id: string;
  title: string;
  image: string;
  background: 'underwater' | 'farm' | 'meadow';
  bgImage: string;
  rows: number;
  columns: number;
  difficulty: 'easy' | 'medium';
  vocabulary: string;
  soundEffectName: string;
  cardBgColor: string;
}

// Resolve asset paths correctly for both local dev and GitHub Pages deployment.
// import.meta.env.BASE_URL is '/' locally and '/avani-play-app/' on GitHub Pages.
const base = import.meta.env.BASE_URL.replace(/\/$/, ''); // strip trailing slash

export const puzzles: PuzzleItem[] = [
  {
    id: "fish",
    title: "Fish",
    image: `${base}/assets/puzzles/fish.png`,
    background: "underwater",
    bgImage: `${base}/assets/backgrounds/underwater.png`,
    rows: 2,
    columns: 3,
    difficulty: "easy",
    vocabulary: "Fish",
    soundEffectName: "ocean_splash",
    cardBgColor: "#E0F7FA"
  },
  {
    id: "tractor",
    title: "Tractor",
    image: `${base}/assets/puzzles/tractor.png`,
    background: "farm",
    bgImage: `${base}/assets/backgrounds/farm.svg`,
    rows: 2,
    columns: 2,
    difficulty: "easy",
    vocabulary: "Tractor",
    soundEffectName: "engine",
    cardBgColor: "#FFEBEE"
  },
  {
    id: "dog",
    title: "Dog",
    image: `${base}/assets/puzzles/dog.png`,
    background: "meadow",
    bgImage: `${base}/assets/backgrounds/meadow.svg`,
    rows: 2,
    columns: 2,
    difficulty: "easy",
    vocabulary: "Dog",
    soundEffectName: "bark",
    cardBgColor: "#FFF8E1"
  },
  {
    id: "elephant",
    title: "Elephant",
    image: `${base}/assets/puzzles/elephant.png`,
    background: "meadow",
    bgImage: `${base}/assets/backgrounds/meadow.svg`,
    rows: 2,
    columns: 3,
    difficulty: "easy",
    vocabulary: "Elephant",
    soundEffectName: "trumpet",
    cardBgColor: "#E8EAF6"
  },
  {
    id: "bus",
    title: "Bus",
    image: `${base}/assets/puzzles/bus.svg`,
    background: "farm",
    bgImage: `${base}/assets/backgrounds/farm.svg`,
    rows: 2,
    columns: 3,
    difficulty: "easy",
    vocabulary: "Bus",
    soundEffectName: "horn",
    cardBgColor: "#FFF3E0"
  },
  {
    id: "butterfly",
    title: "Butterfly",
    image: `${base}/assets/puzzles/butterfly.svg`,
    background: "meadow",
    bgImage: `${base}/assets/backgrounds/meadow.svg`,
    rows: 2,
    columns: 2,
    difficulty: "easy",
    vocabulary: "Butterfly",
    soundEffectName: "twinkle",
    cardBgColor: "#F3E5F5"
  },
  {
    id: "apple",
    title: "Apple",
    image: `${base}/assets/puzzles/apple.svg`,
    background: "farm",
    bgImage: `${base}/assets/backgrounds/farm.svg`,
    rows: 2,
    columns: 2,
    difficulty: "easy",
    vocabulary: "Apple",
    soundEffectName: "crunch",
    cardBgColor: "#FFEBEE"
  },
  {
    id: "lion",
    title: "Lion",
    image: `${base}/assets/puzzles/lion.svg`,
    background: "meadow",
    bgImage: `${base}/assets/backgrounds/meadow.svg`,
    rows: 2,
    columns: 3,
    difficulty: "easy",
    vocabulary: "Lion",
    soundEffectName: "roar",
    cardBgColor: "#FFF8E1"
  }
];

export function getPuzzleById(id: string): PuzzleItem | undefined {
  return puzzles.find(p => p.id === id);
}

export function getNextPuzzleId(currentId: string): string {
  const index = puzzles.findIndex(p => p.id === currentId);
  if (index >= 0 && index < puzzles.length - 1) {
    return puzzles[index + 1].id;
  }
  return puzzles[0].id; // Loop back to fish
}
