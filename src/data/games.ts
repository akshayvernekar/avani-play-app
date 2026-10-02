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
    iconName: "Sparkles",
    customIcon: `${baseUrl}assets/puja/ganesha_idol.webp`,
    bgColor: "linear-gradient(145deg, #FFF3CC 0%, #FFE5A3 100%)",
    borderColor: "#F59E0B",
    textColor: "#9A3412",
    titleColor: "#9A3412",
    enabled: true,
    route: "/puja"
  },
  {
    id: "identify-god",
    title: "Find the God",
    iconName: "Sparkles",
    customIcon: `${baseUrl}assets/vaahana/shiva.webp`,
    bgColor: "linear-gradient(145deg, #E0F2FE 0%, #BAE6FD 100%)",
    borderColor: "#0284C7",
    textColor: "#0369A1",
    titleColor: "#0369A1",
    enabled: true,
    route: "/identify-god"
  },
  {
    id: "vaahana",
    title: "Find the Ride",
    iconName: "Car",
    customIcon: `${baseUrl}assets/cards/tile_ride.webp`,
    bgColor: "linear-gradient(145deg, #DCFCE7 0%, #BBF7D0 100%)",
    borderColor: "#22C55E",
    textColor: "#15803D",
    titleColor: "#15803D",
    enabled: true,
    route: "/vaahana"
  },
  {
    id: "special-item",
    title: "Find My Special Thing",
    iconName: "Sparkles",
    customIcon: `${baseUrl}assets/vaahana/krishna.webp`,
    bgColor: "linear-gradient(145deg, #F3E8FF 0%, #E9D5FF 100%)",
    borderColor: "#A855F7",
    textColor: "#7E22CE",
    titleColor: "#7E22CE",
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
