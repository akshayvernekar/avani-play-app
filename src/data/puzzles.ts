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

export const puzzles: PuzzleItem[] = [
  {
    id: "fish",
    title: "Fish",
    image: "/assets/puzzles/fish.png",
    background: "underwater",
    bgImage: "/assets/backgrounds/underwater.png",
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
    image: "/assets/puzzles/tractor.png",
    background: "farm",
    bgImage: "/assets/backgrounds/farm.svg",
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
    image: "/assets/puzzles/dog.png",
    background: "meadow",
    bgImage: "/assets/backgrounds/meadow.svg",
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
    image: "/assets/puzzles/elephant.png",
    background: "meadow",
    bgImage: "/assets/backgrounds/meadow.svg",
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
    image: "/assets/puzzles/bus.svg",
    background: "farm",
    bgImage: "/assets/backgrounds/farm.svg",
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
    image: "/assets/puzzles/butterfly.svg",
    background: "meadow",
    bgImage: "/assets/backgrounds/meadow.svg",
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
    image: "/assets/puzzles/apple.svg",
    background: "farm",
    bgImage: "/assets/backgrounds/farm.svg",
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
    image: "/assets/puzzles/lion.svg",
    background: "meadow",
    bgImage: "/assets/backgrounds/meadow.svg",
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
