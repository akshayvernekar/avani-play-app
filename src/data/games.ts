export interface GameCategory {
  id: string;
  title: string;
  subtitle?: string;
  iconName: string; // Lucide icon or custom vector name
  customIcon?: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  enabled: boolean;
  comingSoonText?: string;
  badge?: string;
  route?: string;
}

const baseUrl = import.meta.env.BASE_URL;

export const games: GameCategory[] = [
  {
    id: "vaahana",
    title: "Gods & Vaahanas",
    subtitle: "Match the Gods with their Vehicles!",
    iconName: "Sparkles",
    customIcon: `${baseUrl}assets/vaahana/ganesha.png`,
    bgColor: "#FFF3E0",
    borderColor: "#FF9800",
    textColor: "#E65100",
    enabled: true,
    badge: "New Game!",
    route: "/vaahana"
  },
  {
    id: "puzzles",
    title: "Puzzles",
    iconName: "Puzzle",
    bgColor: "#E3F2FD",
    borderColor: "#1E88E5",
    textColor: "#0D47A1",
    enabled: true,
    badge: "8 Fun Puzzles",
    route: "/puzzles"
  },
  {
    id: "animals",
    title: "Animals",
    iconName: "Dog",
    bgColor: "#E8F5E9",
    borderColor: "#4CAF50",
    textColor: "#1B5E20",
    enabled: false,
    comingSoonText: "Cute animals are coming soon!"
  },
  {
    id: "numbers",
    title: "Numbers",
    iconName: "Binary",
    bgColor: "#FFF8E1",
    borderColor: "#FFC107",
    textColor: "#F57F17",
    enabled: false,
    comingSoonText: "1 2 3 fun is coming soon!"
  },
  {
    id: "letters",
    title: "Letters",
    iconName: "CaseUpper",
    bgColor: "#F3E5F5",
    borderColor: "#AB47BC",
    textColor: "#4A148C",
    enabled: false,
    comingSoonText: "A B C games coming soon!"
  },
  {
    id: "colors",
    title: "Colors",
    iconName: "Palette",
    bgColor: "#E0F7FA",
    borderColor: "#26C6DA",
    textColor: "#006064",
    enabled: false,
    comingSoonText: "Rainbow color fun coming soon!"
  },
  {
    id: "vehicles",
    title: "Vehicles",
    iconName: "Car",
    bgColor: "#FFEBEE",
    borderColor: "#EF5350",
    textColor: "#B71C1C",
    enabled: false,
    comingSoonText: "Vroom vroom games coming soon!"
  }
];
