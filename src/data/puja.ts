export type PujaCategory = 'flowers' | 'garlands' | 'offerings' | 'lights' | 'incense' | 'aarti';

export type PlacementZone = 'feet' | 'neck' | 'platform' | 'scene_left' | 'scene_right' | 'front';
export type PujaSoundType = 'chime' | 'bell' | 'whoosh' | 'incense' | 'aarti' | 'celebration';

export interface PujaItem {
  id: string;
  name: string;
  emoji: string;           // fallback emoji if image missing
  image: string;           // path relative to BASE_URL
  type: PujaCategory;
  placement: PlacementZone;
  sound: PujaSoundType;
  snapRadius?: number;     // px within which auto-snap triggers (default 100 or % based)
}

export interface PlacedItem {
  id: string;
  item: PujaItem;
  x: number; // normalized (0.0 to 1.0) relative to scene width
  y: number; // normalized (0.0 to 1.0) relative to scene height
  scale?: number;
  rotation?: number;
  zIndex: number;
  lit?: boolean;
}

export interface SnapZoneConfig {
  id: string;
  cx: number; // percentage 0-100
  cy: number; // percentage 0-100
  r: number;  // radius percentage tolerance
  maxItems?: number;
}

export interface PujaDeityConfig {
  id: string;
  name: string;
  image: string;
  sceneBackground: string;
  platformImage: string;
  snapZones: Record<PlacementZone, SnapZoneConfig[]>;
  aartiCenter: { cx: number; cy: number };
  aartiOrbitRadius: number; // % of scene width
}

const baseUrl = import.meta.env.BASE_URL;

export const pujaCategories: { id: PujaCategory; label: string; emoji: string }[] = [
  { id: 'flowers', label: 'Flowers', emoji: '🌸' },
  { id: 'garlands', label: 'Garlands', emoji: '📿' },
  { id: 'offerings', label: 'Offerings', emoji: '🍬' },
  { id: 'lights', label: 'Diyas', emoji: '🪔' },
  { id: 'incense', label: 'Incense', emoji: '🪔' },
  { id: 'aarti', label: 'Aarti', emoji: '✨' }
];

export const pujaItems: Record<PujaCategory, PujaItem[]> = {
  flowers: [
    {
      id: 'marigold',
      name: 'Marigold',
      emoji: '🌼',
      image: `${baseUrl}assets/puja/flowers/marigold.png`,
      type: 'flowers',
      placement: 'feet',
      sound: 'chime',
      snapRadius: 20
    },
    {
      id: 'rose',
      name: 'Rose',
      emoji: '🌹',
      image: `${baseUrl}assets/puja/flowers/rose.png`,
      type: 'flowers',
      placement: 'feet',
      sound: 'chime',
      snapRadius: 20
    },
    {
      id: 'jasmine',
      name: 'Jasmine',
      emoji: '🤍',
      image: `${baseUrl}assets/puja/flowers/jasmine.png`,
      type: 'flowers',
      placement: 'feet',
      sound: 'chime',
      snapRadius: 20
    },
    {
      id: 'lotus',
      name: 'Lotus',
      emoji: '🪷',
      image: `${baseUrl}assets/puja/flowers/lotus.png`,
      type: 'flowers',
      placement: 'feet',
      sound: 'chime',
      snapRadius: 20
    }
  ],
  garlands: [
    {
      id: 'garland_marigold',
      name: 'Marigold Mala',
      emoji: '🏵️',
      image: `${baseUrl}assets/puja/garlands/garland_marigold.png`,
      type: 'garlands',
      placement: 'neck',
      sound: 'bell',
      snapRadius: 25
    },
    {
      id: 'garland_rose',
      name: 'Rose Mala',
      emoji: '🌹',
      image: `${baseUrl}assets/puja/garlands/garland_rose.png`,
      type: 'garlands',
      placement: 'neck',
      sound: 'bell',
      snapRadius: 25
    },
    {
      id: 'garland_jasmine',
      name: 'Jasmine Mala',
      emoji: '🤍',
      image: `${baseUrl}assets/puja/garlands/garland_jasmine.png`,
      type: 'garlands',
      placement: 'neck',
      sound: 'bell',
      snapRadius: 25
    }
  ],
  offerings: [
    {
      id: 'modak',
      name: 'Modak',
      emoji: '🥟',
      image: `${baseUrl}assets/puja/offerings/modak.png`,
      type: 'offerings',
      placement: 'platform',
      sound: 'chime',
      snapRadius: 22
    },
    {
      id: 'laddoo',
      name: 'Laddoo',
      emoji: '🟡',
      image: `${baseUrl}assets/puja/offerings/laddoo.png`,
      type: 'offerings',
      placement: 'platform',
      sound: 'chime',
      snapRadius: 22
    },
    {
      id: 'banana',
      name: 'Bananas',
      emoji: '🍌',
      image: `${baseUrl}assets/puja/offerings/banana.png`,
      type: 'offerings',
      placement: 'platform',
      sound: 'chime',
      snapRadius: 22
    },
    {
      id: 'coconut',
      name: 'Coconut',
      emoji: '🥥',
      image: `${baseUrl}assets/puja/offerings/coconut.png`,
      type: 'offerings',
      placement: 'platform',
      sound: 'chime',
      snapRadius: 22
    },
    {
      id: 'fruits',
      name: 'Fruit Plate',
      emoji: '🍎',
      image: `${baseUrl}assets/puja/offerings/fruits.png`,
      type: 'offerings',
      placement: 'platform',
      sound: 'chime',
      snapRadius: 22
    }
  ],
  lights: [
    {
      id: 'diya',
      name: 'Clay Diya',
      emoji: '🪔',
      image: `${baseUrl}assets/puja/lights/diya_lit.png`,
      type: 'lights',
      placement: 'scene_left',
      sound: 'whoosh',
      snapRadius: 25
    },
    {
      id: 'diya_pair',
      name: 'Twin Diyas',
      emoji: '🪔',
      image: `${baseUrl}assets/puja/lights/diya_lit.png`,
      type: 'lights',
      placement: 'scene_right',
      sound: 'whoosh',
      snapRadius: 25
    },
    {
      id: 'lamp_brass',
      name: 'Brass Deepam',
      emoji: '🏮',
      image: `${baseUrl}assets/puja/lights/lamp_brass.png`,
      type: 'lights',
      placement: 'platform',
      sound: 'whoosh',
      snapRadius: 25
    }
  ],
  incense: [
    {
      id: 'incense_stick',
      name: 'Agarbatti',
      emoji: '🥢',
      image: `${baseUrl}assets/puja/incense/incense_stick.png`,
      type: 'incense',
      placement: 'platform',
      sound: 'incense',
      snapRadius: 25
    },
    {
      id: 'incense_holder',
      name: 'Dhoop Stand',
      emoji: '💨',
      image: `${baseUrl}assets/puja/incense/incense_holder.png`,
      type: 'incense',
      placement: 'scene_left',
      sound: 'incense',
      snapRadius: 25
    }
  ],
  aarti: [
    {
      id: 'aarti_small',
      name: 'Diya Thali',
      emoji: '✨',
      image: `${baseUrl}assets/puja/aarti/aarti_small.png`,
      type: 'aarti',
      placement: 'front',
      sound: 'aarti',
      snapRadius: 30
    },
    {
      id: 'aarti_large',
      name: 'Royal Aarti',
      emoji: '🌟',
      image: `${baseUrl}assets/puja/aarti/aarti_large.png`,
      type: 'aarti',
      placement: 'front',
      sound: 'aarti',
      snapRadius: 30
    },
    {
      id: 'aarti_multi',
      name: 'Pancha Aarti',
      emoji: '🔥',
      image: `${baseUrl}assets/puja/aarti/aarti_multi.png`,
      type: 'aarti',
      placement: 'front',
      sound: 'aarti',
      snapRadius: 30
    }
  ]
};

export const ganeshaPujaConfig: PujaDeityConfig = {
  id: 'ganesha',
  name: 'Shree Ganesha',
  image: `${baseUrl}assets/puja/ganesha_idol.png`,
  sceneBackground: `${baseUrl}assets/puja/bg/temple_bg.png`,
  platformImage: `${baseUrl}assets/puja/platform/puja_platform.png`,
  snapZones: {
    neck: [
      { id: 'neck-main', cx: 50, cy: 60, r: 22 }
    ],
    feet: [
      { id: 'feet-center', cx: 50, cy: 86, r: 18 },
      { id: 'feet-left', cx: 36, cy: 88, r: 16 },
      { id: 'feet-right', cx: 64, cy: 88, r: 16 }
    ],
    platform: [
      { id: 'plat-left', cx: 28, cy: 92, r: 18 },
      { id: 'plat-center', cx: 50, cy: 94, r: 18 },
      { id: 'plat-right', cx: 72, cy: 92, r: 18 }
    ],
    scene_left: [
      { id: 'side-l1', cx: 16, cy: 78, r: 18 },
      { id: 'side-l2', cx: 18, cy: 62, r: 18 }
    ],
    scene_right: [
      { id: 'side-r1', cx: 84, cy: 78, r: 18 },
      { id: 'side-r2', cx: 82, cy: 62, r: 18 }
    ],
    front: [
      { id: 'front-center', cx: 50, cy: 62, r: 35 }
    ]
  },
  aartiCenter: { cx: 50, cy: 54 },
  aartiOrbitRadius: 30
};
