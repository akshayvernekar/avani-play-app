export interface GameCategory {
  id: string;
  title: string;
  subtitle?: string;
  iconName: string; // Lucide icon or custom vector name
  customIcon?: string;
  cardImage?: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  titleColor?: string;
  subtitleColor?: string;
  enabled: boolean;
  comingSoonText?: string;
  badge?: string;
  route?: string;
}

const baseUrl = import.meta.env.BASE_URL;

export const games: GameCategory[] = [
  {
    id: "puja",
    title: "Puja Time",
    subtitle: "Decorate Ganesha!",
    iconName: "Sparkles",
    customIcon: `${baseUrl}assets/cards/card_puja.webp`,
    bgColor: "linear-gradient(180deg, #FFF9ED 0%, #FFE9D1 100%)",
    borderColor: "#FFA726",
    textColor: "#D84315",
    titleColor: "#D84315",
    subtitleColor: "#BF360C",
    enabled: true,
    route: "/puja"
  },
  {
    id: "identify-god",
    title: "Find the God",
    subtitle: "Where is Ganesha? Tap to find!",
    iconName: "Sparkles",
    customIcon: `${baseUrl}assets/cards/card_god.webp`,
    bgColor: "linear-gradient(180deg, #F0F9FF 0%, #D8F0FE 100%)",
    borderColor: "#29B6F6",
    textColor: "#0D47A1",
    titleColor: "#0D47A1",
    subtitleColor: "#1565C0",
    enabled: true,
    route: "/identify-god"
  },
  {
    id: "vaahana",
    title: "Find the Ride",
    subtitle: "What does Ganesha ride? Tap to find!",
    iconName: "Sparkles",
    customIcon: `${baseUrl}assets/cards/card_ride.webp`,
    bgColor: "linear-gradient(180deg, #F1FBF0 0%, #DCF3D5 100%)",
    borderColor: "#66BB6A",
    textColor: "#1B5E20",
    titleColor: "#1B5E20",
    subtitleColor: "#2E7D32",
    enabled: true,
    route: "/vaahana"
  },
  {
    id: "special-item",
    title: "Find My Special Thing",
    subtitle: "What belongs to Krishna? Tap to find!",
    iconName: "Sparkles",
    customIcon: `${baseUrl}assets/cards/card_special.webp`,
    bgColor: "linear-gradient(180deg, #FBF6FF 0%, #EEDBFF 100%)",
    borderColor: "#BA68C8",
    textColor: "#6A1B9A",
    titleColor: "#6A1B9A",
    subtitleColor: "#7B1FA2",
    enabled: true,
    route: "/special-item"
  },
  {
    id: "puzzles",
    title: "Puzzles",
    subtitle: "Put the pieces together!",
    iconName: "Puzzle",
    customIcon: `${baseUrl}assets/puzzles/apple.svg`,
    bgColor: "linear-gradient(180deg, #F8F2FF 0%, #EEDBFF 100%)",
    borderColor: "#BA68C8",
    textColor: "#6A1B9A",
    titleColor: "#6A1B9A",
    subtitleColor: "#7B1FA2",
    enabled: true,
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
