export interface DeityWeapon {
  id: string;
  name: string;
  image?: string;
  description?: string;
}

export type SpecialItemCategory =
  | 'weapon'
  | 'instrument'
  | 'object'
  | 'sacred_object'
  | 'food'
  | 'agricultural_tool';

export interface DeitySpecialItem {
  id: string;
  name: string;
  category: SpecialItemCategory;
  image?: string;
  fallbackImage?: string;
  emoji?: string;
  description?: string;
}

export interface DeityVahana {
  id: string;
  name: string;
  emoji: string;
  image?: string;
  voiceText: string;
  hintText: string;
}

export interface DeityAudio {
  findGodQuestion?: string;
  findGodSuccess?: string;
  vahanaQuestion?: string;
  vahanaSuccess?: string;
  vahanaHint?: string;
  specialItemQuestion?: string;
  specialItemSuccess?: string;
}

export interface CentralDeity {
  id: string;
  name: string;
  titleName: string;
  image: string;
  successImage: string;

  // Ride information (for "Find the Ride")
  vahana?: DeityVahana;

  // Weapons (extensible for future "Find the Weapon" mini-game)
  weapons?: DeityWeapon[];

  // Special items (for "Find My Special Item" and future "Find the Weapon")
  specialItems?: DeitySpecialItem[];

  // Spoken questions & confirmations for "Find the God"
  questionText: string;
  successText: string;

  // Data-driven audio configuration
  audio?: DeityAudio;
}

const baseUrl = import.meta.env.BASE_URL;

export const centralDeities: CentralDeity[] = [
  // ── Existing 6 Core Deities (Find the Ride + Find the God) ──
  {
    id: "ganesha",
    name: "Ganesha",
    titleName: "Lord Ganesha",
    image: `${baseUrl}assets/vaahana/ganesha.webp`,
    successImage: `${baseUrl}assets/vaahana/ganesha.webp`,
    vahana: {
      id: "mouse",
      name: "Mouse",
      emoji: "🐭",
      image: `${baseUrl}assets/vaahana/mouse.webp`,
      voiceText: "Ganesha's ride is the mouse!",
      hintText: "Ganesha loves riding with his friendly mouse!"
    },
    weapons: [
      { id: "parashu", name: "Parashu (Axe)" }
    ],
    specialItems: [
      { id: "modak", name: "Modak", category: "food", image: `${baseUrl}assets/items/modak.png`, fallbackImage: `${baseUrl}assets/items/modak.webp`, emoji: "🥟" }
    ],
    questionText: "Where is Ganesha?",
    successText: "Yes! That's Ganesha!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_ganesha.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      vahanaQuestion: "assets/audio_gungun/ride_q_ganesha.mp3",
      vahanaSuccess: "assets/audio_gungun/ride_success_ganesha.mp3",
      vahanaHint: "assets/audio_gungun/ride_hint_ganesha.mp3",
      specialItemQuestion: "assets/audio_gungun/item_q_ganesha.mp3"
    }
  },
  {
    id: "shiva",
    name: "Shiva",
    titleName: "Lord Shiva",
    image: `${baseUrl}assets/vaahana/shiva.webp`,
    successImage: `${baseUrl}assets/vaahana/shiva.webp`,
    vahana: {
      id: "nandi",
      name: "Bull",
      emoji: "🐂",
      image: `${baseUrl}assets/vaahana/bull.webp`,
      voiceText: "Shiva's ride is Nandi the bull!",
      hintText: "Shiva rides with Nandi, the gentle white bull!"
    },
    weapons: [
      { id: "trishul", name: "Trishul (Trident)" }
    ],
    specialItems: [
      { id: "trishul", name: "Trishul", category: "weapon", image: `${baseUrl}assets/items/trishul.png`, fallbackImage: `${baseUrl}assets/items/trishul.webp`, emoji: "🔱" }
    ],
    questionText: "Where is Shiva?",
    successText: "Yes! That's Shiva!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_shiva.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      vahanaQuestion: "assets/audio_gungun/ride_q_shiva.mp3",
      vahanaSuccess: "assets/audio_gungun/ride_success_shiva.mp3",
      vahanaHint: "assets/audio_gungun/ride_hint_shiva.mp3",
      specialItemQuestion: "assets/audio_gungun/item_q_shiva.mp3"
    }
  },
  {
    id: "durga",
    name: "Durga",
    titleName: "Goddess Durga",
    image: `${baseUrl}assets/vaahana/durga.webp`,
    successImage: `${baseUrl}assets/vaahana/durga.webp`,
    vahana: {
      id: "lion",
      name: "Lion",
      emoji: "🦁",
      image: `${baseUrl}assets/vaahana/lion.webp`,
      voiceText: "Durga's ride is the brave lion!",
      hintText: "Goddess Durga rides with the mighty lion!"
    },
    weapons: [
      { id: "trishul", name: "Trishul (Trident)" }
    ],
    questionText: "Where is Durga?",
    successText: "Yes! That's Goddess Durga!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_durga.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      vahanaQuestion: "assets/audio_gungun/ride_q_durga.mp3",
      vahanaSuccess: "assets/audio_gungun/ride_success_durga.mp3",
      vahanaHint: "assets/audio_gungun/ride_hint_durga.mp3"
    }
  },
  {
    id: "kartikeya",
    name: "Kartikeya",
    titleName: "Kartikeya (Murugan)",
    image: `${baseUrl}assets/vaahana/kartikeya.webp`,
    successImage: `${baseUrl}assets/vaahana/kartikeya.webp`,
    vahana: {
      id: "peacock",
      name: "Peacock",
      emoji: "🦚",
      image: `${baseUrl}assets/vaahana/peacock-removebg-preview.webp`,
      voiceText: "Kartikeya's ride is the colorful peacock!",
      hintText: "Kartikeya rides with the beautiful peacock!"
    },
    weapons: [
      { id: "vel", name: "Vel (Divine Spear)" }
    ],
    specialItems: [
      { id: "vel", name: "Vel", category: "weapon", image: `${baseUrl}assets/items/vel.png`, fallbackImage: `${baseUrl}assets/items/vel.webp`, emoji: "🗡️" }
    ],
    questionText: "Where is Kartikeya?",
    successText: "Yes! That's Kartikeya!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_kartikeya.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      vahanaQuestion: "assets/audio_gungun/ride_q_kartikeya.mp3",
      vahanaSuccess: "assets/audio_gungun/ride_success_kartikeya.mp3",
      vahanaHint: "assets/audio_gungun/ride_hint_kartikeya.mp3",
      specialItemQuestion: "assets/audio_gungun/item_q_kartikeya.mp3"
    }
  },
  {
    id: "vishnu",
    name: "Vishnu",
    titleName: "Lord Vishnu",
    image: `${baseUrl}assets/vaahana/vishnu.webp`,
    successImage: `${baseUrl}assets/vaahana/vishnu.webp`,
    vahana: {
      id: "garuda",
      name: "Eagle",
      emoji: "🦅",
      image: `${baseUrl}assets/vaahana/garuda.webp`,
      voiceText: "Vishnu's ride is Garuda the eagle!",
      hintText: "Lord Vishnu soars with Garuda, the golden eagle!"
    },
    weapons: [
      { id: "sudarshana_chakra", name: "Sudarshana Chakra" }
    ],
    specialItems: [
      { id: "chakra", name: "Sudarshana Chakra", category: "weapon", image: `${baseUrl}assets/items/chakra.png`, fallbackImage: `${baseUrl}assets/items/chakra.webp`, emoji: "☸️" }
    ],
    questionText: "Where is Vishnu?",
    successText: "Yes! That's Lord Vishnu!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_vishnu.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      vahanaQuestion: "assets/audio_gungun/ride_q_vishnu.mp3",
      vahanaSuccess: "assets/audio_gungun/ride_success_vishnu.mp3",
      vahanaHint: "assets/audio_gungun/ride_hint_vishnu.mp3",
      specialItemQuestion: "assets/audio_gungun/item_q_vishnu.mp3"
    }
  },
  {
    id: "saraswati",
    name: "Saraswati",
    titleName: "Goddess Saraswati",
    image: `${baseUrl}assets/vaahana/saraswati.webp`,
    successImage: `${baseUrl}assets/vaahana/saraswati.webp`,
    vahana: {
      id: "swan",
      name: "Swan",
      emoji: "🦢",
      image: `${baseUrl}assets/vaahana/swan.webp`,
      voiceText: "Saraswati's ride is the graceful swan!",
      hintText: "Goddess Saraswati glides with the serene swan!"
    },
    weapons: [
      { id: "veena", name: "Veena" }
    ],
    specialItems: [
      { id: "veena", name: "Veena", category: "instrument", image: `${baseUrl}assets/items/veena.png`, fallbackImage: `${baseUrl}assets/items/veena.webp`, emoji: "🪕" },
      { id: "books", name: "Books", category: "sacred_object", image: `${baseUrl}assets/items/books.png`, fallbackImage: `${baseUrl}assets/items/books.webp`, emoji: "📚" }
    ],
    questionText: "Where is Saraswati?",
    successText: "Yes! That's Goddess Saraswati!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_saraswati.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      vahanaQuestion: "assets/audio_gungun/ride_q_saraswati.mp3",
      vahanaSuccess: "assets/audio_gungun/ride_success_saraswati.mp3",
      vahanaHint: "assets/audio_gungun/ride_hint_saraswati.mp3",
      specialItemQuestion: "assets/audio_gungun/item_q_saraswati.mp3"
    }
  },

  // ── 10 New Deities Added to "Find the Ride" (And also in "Find the God") ──
  {
    id: "lakshmi",
    name: "Lakshmi",
    titleName: "Goddess Lakshmi",
    image: `${baseUrl}assets/vaahana/lakshmi.webp`,
    successImage: `${baseUrl}assets/vaahana/lakshmi.webp`,
    vahana: {
      id: "owl",
      name: "Owl",
      emoji: "🦉",
      image: `${baseUrl}assets/vaahana/owl.webp`,
      voiceText: "Lakshmi rides with the wise owl!",
      hintText: "Goddess Lakshmi's ride is the wise night owl!"
    },
    specialItems: [
      { id: "pot_gold_coins", name: "Pot of Gold Coins", category: "object", image: `${baseUrl}assets/items/pot_gold_coins.png`, fallbackImage: `${baseUrl}assets/items/pot_gold_coins.webp`, emoji: "🏺" }
    ],
    questionText: "Where is Lakshmi?",
    successText: "Yes! That's Goddess Lakshmi!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_lakshmi.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      vahanaQuestion: "assets/audio_gungun/ride_q_lakshmi.mp3",
      vahanaSuccess: "assets/audio_gungun/ride_success_lakshmi.mp3",
      vahanaHint: "assets/audio_gungun/ride_hint_lakshmi.mp3",
      specialItemQuestion: "assets/audio_gungun/item_q_lakshmi.mp3"
    }
  },
  {
    id: "brahma",
    name: "Brahma",
    titleName: "Lord Brahma",
    image: `${baseUrl}assets/vaahana/brahma.webp`,
    successImage: `${baseUrl}assets/vaahana/brahma.webp`,
    vahana: {
      id: "swan",
      name: "Swan",
      emoji: "🦢",
      image: `${baseUrl}assets/vaahana/swan.webp`,
      voiceText: "Brahma rides with the sacred white swan!",
      hintText: "Lord Brahma glides with the graceful swan!"
    },
    weapons: [
      { id: "vedas", name: "Sacred Vedas" }
    ],
    questionText: "Where is Brahma?",
    successText: "Yes! That's Lord Brahma!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_brahma.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      vahanaQuestion: "assets/audio_gungun/ride_q_brahma.mp3",
      vahanaSuccess: "assets/audio_gungun/ride_success_brahma.mp3",
      vahanaHint: "assets/audio_gungun/ride_hint_brahma.mp3"
    }
  },
  {
    id: "indra",
    name: "Indra",
    titleName: "Lord Indra",
    image: `${baseUrl}assets/vaahana/indra.webp`,
    successImage: `${baseUrl}assets/vaahana/indra.webp`,
    vahana: {
      id: "elephant",
      name: "White Elephant",
      emoji: "🐘",
      image: `${baseUrl}assets/vaahana/white_elephant.webp`,
      voiceText: "Indra rides with the majestic white elephant!",
      hintText: "Lord Indra rides the mighty white elephant!"
    },
    weapons: [
      { id: "vajra", name: "Vajra (Thunderbolt)" }
    ],
    questionText: "Where is Indra?",
    successText: "Yes! That's Lord Indra!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_indra.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      vahanaQuestion: "assets/audio_gungun/ride_q_indra.mp3",
      vahanaSuccess: "assets/audio_gungun/ride_success_indra.mp3",
      vahanaHint: "assets/audio_gungun/ride_hint_indra.mp3"
    }
  },
  {
    id: "surya",
    name: "Surya",
    titleName: "Surya Bhagavan",
    image: `${baseUrl}assets/vaahana/surya.webp`,
    successImage: `${baseUrl}assets/vaahana/surya.webp`,
    vahana: {
      id: "horses",
      name: "Seven Horses",
      emoji: "🐎",
      image: `${baseUrl}assets/vaahana/seven_horses.webp`,
      voiceText: "Surya rides across the sky with seven horses!",
      hintText: "Surya rides a chariot drawn by seven radiant horses!"
    },
    questionText: "Where is Surya?",
    successText: "Yes! That's Surya Bhagavan!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_surya.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      vahanaQuestion: "assets/audio_gungun/ride_q_surya.mp3",
      vahanaSuccess: "assets/audio_gungun/ride_success_surya.mp3",
      vahanaHint: "assets/audio_gungun/ride_hint_surya.mp3"
    }
  },
  {
    id: "shani",
    name: "Shani",
    titleName: "Lord Shani",
    image: `${baseUrl}assets/vaahana/shani.webp`,
    successImage: `${baseUrl}assets/vaahana/shani.webp`,
    vahana: {
      id: "crow",
      name: "Crow",
      emoji: "🐦‍⬛",
      image: `${baseUrl}assets/vaahana/crow.webp`,
      voiceText: "Shani rides with the loyal crow!",
      hintText: "Lord Shani flies with the clever black crow!"
    },
    weapons: [
      { id: "bow", name: "Bow and Arrow" }
    ],
    questionText: "Where is Shani?",
    successText: "Yes! That's Lord Shani!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_shani.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      vahanaQuestion: "assets/audio_gungun/ride_q_shani.mp3",
      vahanaSuccess: "assets/audio_gungun/ride_success_shani.mp3",
      vahanaHint: "assets/audio_gungun/ride_hint_shani.mp3"
    }
  },
  {
    id: "yama",
    name: "Yama",
    titleName: "Lord Yama",
    image: `${baseUrl}assets/vaahana/yama.webp`,
    successImage: `${baseUrl}assets/vaahana/yama.webp`,
    vahana: {
      id: "buffalo",
      name: "Buffalo",
      emoji: "🐃",
      image: `${baseUrl}assets/vaahana/buffalo.webp`,
      voiceText: "Yama rides with the strong water buffalo!",
      hintText: "Lord Yama rides with the powerful buffalo!"
    },
    weapons: [
      { id: "gada", name: "Gada (Mace)" },
      { id: "pasha", name: "Pasha (Noose)" }
    ],
    specialItems: [
      { id: "staff", name: "Staff", category: "object", image: `${baseUrl}assets/items/staff.png`, fallbackImage: `${baseUrl}assets/items/staff.webp`, emoji: "🪄" }
    ],
    questionText: "Where is Yama?",
    successText: "Yes! That's Lord Yama!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_yama.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      vahanaQuestion: "assets/audio_gungun/ride_q_yama.mp3",
      vahanaSuccess: "assets/audio_gungun/ride_success_yama.mp3",
      vahanaHint: "assets/audio_gungun/ride_hint_yama.mp3",
      specialItemQuestion: "assets/audio_gungun/item_q_yama.mp3"
    }
  },
  {
    id: "agni",
    name: "Agni",
    titleName: "Lord Agni",
    image: `${baseUrl}assets/vaahana/agni.webp`,
    successImage: `${baseUrl}assets/vaahana/agni.webp`,
    vahana: {
      id: "ram",
      name: "Sheep",
      emoji: "🐏",
      image: `${baseUrl}assets/vaahana/ram.webp`,
      voiceText: "Agni rides with the brave sheep!",
      hintText: "Lord Agni rides with the fiery, horned sheep!"
    },
    questionText: "Where is Agni?",
    successText: "Yes! That's Lord Agni!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_agni.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      vahanaQuestion: "assets/audio_gungun/ride_q_agni.mp3",
      vahanaSuccess: "assets/audio_gungun/ride_success_agni.mp3",
      vahanaHint: "assets/audio_gungun/ride_hint_agni.mp3"
    }
  },
  {
    id: "varuna",
    name: "Varuna",
    titleName: "Lord Varuna",
    image: `${baseUrl}assets/vaahana/varuna.webp`,
    successImage: `${baseUrl}assets/vaahana/varuna.webp`,
    vahana: {
      id: "crocodile",
      name: "Crocodile",
      emoji: "🐊",
      image: `${baseUrl}assets/vaahana/crocodile.webp`,
      voiceText: "Varuna rides with the friendly crocodile!",
      hintText: "Lord Varuna rules the ocean with the crocodile!"
    },
    weapons: [
      { id: "pasha", name: "Pasha (Water Noose)" }
    ],
    questionText: "Where is Varuna?",
    successText: "Yes! That's Lord Varuna!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_varuna.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      vahanaQuestion: "assets/audio_gungun/ride_q_varuna.mp3",
      vahanaSuccess: "assets/audio_gungun/ride_success_varuna.mp3",
      vahanaHint: "assets/audio_gungun/ride_hint_varuna.mp3"
    }
  },
  {
    id: "ayyappa",
    name: "Ayyappa",
    titleName: "Swami Ayyappa",
    image: `${baseUrl}assets/vaahana/ayyappa.webp`,
    successImage: `${baseUrl}assets/vaahana/ayyappa.webp`,
    vahana: {
      id: "tiger",
      name: "Tiger",
      emoji: "🐅",
      image: `${baseUrl}assets/vaahana/tiger.webp`,
      voiceText: "Swami Ayyappa rides with the courageous tiger!",
      hintText: "Swami Ayyappa rides with the fierce tiger!"
    },
    weapons: [
      { id: "bow", name: "Bow and Arrow" }
    ],
    specialItems: [
      { id: "bow_arrow", name: "Bow and Arrow", category: "weapon", image: `${baseUrl}assets/items/bow_arrow.png`, fallbackImage: `${baseUrl}assets/items/bow_arrow.webp`, emoji: "🏹" }
    ],
    questionText: "Where is Ayyappa?",
    successText: "Yes! That's Swami Ayyappa!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_ayyappa.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      vahanaQuestion: "assets/audio_gungun/ride_q_ayyappa.mp3",
      vahanaSuccess: "assets/audio_gungun/ride_success_ayyappa.mp3",
      vahanaHint: "assets/audio_gungun/ride_hint_ayyappa.mp3",
      specialItemQuestion: "assets/audio_gungun/item_q_ayyappa.mp3"
    }
  },
  {
    id: "dattatreya",
    name: "Dattatreya",
    titleName: "Lord Dattatreya",
    image: `${baseUrl}assets/vaahana/dattatreya.webp`,
    successImage: `${baseUrl}assets/vaahana/dattatreya.webp`,
    vahana: {
      id: "dogs",
      name: "Four Dogs",
      emoji: "🐕",
      image: `${baseUrl}assets/vaahana/four_dogs.webp`,
      voiceText: "Lord Dattatreya is accompanied by four faithful dogs!",
      hintText: "Lord Dattatreya walks with friendly dogs representing the Vedas!"
    },
    weapons: [
      { id: "trishul", name: "Trishul (Trident)" },
      { id: "chakra", name: "Chakra" }
    ],
    specialItems: [
      { id: "kamandalu", name: "Kamandalu", category: "sacred_object", image: `${baseUrl}assets/items/kamandalu.png`, fallbackImage: `${baseUrl}assets/items/kamandalu.webp`, emoji: "🫖" }
    ],
    questionText: "Where is Dattatreya?",
    successText: "Yes! That's Lord Dattatreya!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_dattatreya.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      vahanaQuestion: "assets/audio_gungun/ride_q_dattatreya.mp3",
      vahanaSuccess: "assets/audio_gungun/ride_success_dattatreya.mp3",
      vahanaHint: "assets/audio_gungun/ride_hint_dattatreya.mp3",
      specialItemQuestion: "assets/audio_gungun/item_q_dattatreya.mp3"
    }
  },

  // ── 5 Additional Deities for "Find the God" ──
  {
    id: "hanuman",
    name: "Hanuman",
    titleName: "Lord Hanuman",
    image: `${baseUrl}assets/vaahana/hanuman.webp`,
    successImage: `${baseUrl}assets/vaahana/hanuman.webp`,
    weapons: [
      { id: "gada", name: "Gada (Mace)" }
    ],
    specialItems: [
      { id: "gada", name: "Gada", category: "weapon", image: `${baseUrl}assets/items/gada.png`, fallbackImage: `${baseUrl}assets/items/gada.webp`, emoji: "🪓" }
    ],
    questionText: "Where is Hanuman?",
    successText: "Yes! That's Lord Hanuman! Jai Bajrangbali!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_hanuman.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      specialItemQuestion: "assets/audio_gungun/item_q_hanuman.mp3"
    }
  },
  {
    id: "krishna",
    name: "Krishna",
    titleName: "Lord Krishna",
    image: `${baseUrl}assets/vaahana/krishna.webp`,
    successImage: `${baseUrl}assets/vaahana/krishna.webp`,
    weapons: [
      { id: "flute", name: "Bansuri (Flute)" },
      { id: "sudarshana_chakra", name: "Sudarshana Chakra" }
    ],
    specialItems: [
      { id: "flute", name: "Flute", category: "instrument", image: `${baseUrl}assets/items/flute.png`, fallbackImage: `${baseUrl}assets/items/flute.webp`, emoji: "🪈" }
    ],
    questionText: "Where is Krishna?",
    successText: "Yes! That's Lord Krishna with his sweet flute!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_krishna.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      specialItemQuestion: "assets/audio_gungun/item_q_krishna.mp3"
    }
  },
  {
    id: "rama",
    name: "Rama",
    titleName: "Lord Rama",
    image: `${baseUrl}assets/vaahana/rama.webp`,
    successImage: `${baseUrl}assets/vaahana/rama.webp`,
    weapons: [
      { id: "kodanda_bow", name: "Kodanda Bow and Arrow" }
    ],
    specialItems: [
      { id: "bow_arrow", name: "Bow and Arrow", category: "weapon", image: `${baseUrl}assets/items/bow_arrow.png`, fallbackImage: `${baseUrl}assets/items/bow_arrow.webp`, emoji: "🏹" }
    ],
    questionText: "Where is Rama?",
    successText: "Yes! That's Lord Rama!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_rama.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      specialItemQuestion: "assets/audio_gungun/item_q_rama.mp3"
    }
  },
  {
    id: "parvati",
    name: "Parvati",
    titleName: "Goddess Parvati",
    image: `${baseUrl}assets/vaahana/parvati.webp`,
    successImage: `${baseUrl}assets/vaahana/parvati.webp`,
    questionText: "Where is Parvati?",
    successText: "Yes! That's Goddess Parvati!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_parvati.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3"
    }
  },
  {
    id: "kali",
    name: "Kali",
    titleName: "Goddess Kali",
    image: `${baseUrl}assets/vaahana/kali.webp`,
    successImage: `${baseUrl}assets/vaahana/kali.webp`,
    weapons: [
      { id: "khadga", name: "Khadga (Sword)" }
    ],
    questionText: "Where is Kali?",
    successText: "Yes! That's Goddess Kali!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_kali.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3"
    }
  },
  // ── Dashavatara Additions for "Find My Special Item" ──
  {
    id: "vamana",
    name: "Vamana",
    titleName: "Lord Vamana",
    image: `${baseUrl}assets/vaahana/vamana.webp`,
    successImage: `${baseUrl}assets/vaahana/vamana.webp`,
    specialItems: [
      { id: "umbrella", name: "Umbrella", category: "object", image: `${baseUrl}assets/items/umbrella.png`, fallbackImage: `${baseUrl}assets/items/umbrella.webp`, emoji: "☂️" }
    ],
    questionText: "Where is Vamana?",
    successText: "Yes! That's Lord Vamana!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_vamana.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      specialItemQuestion: "assets/audio_gungun/item_q_vamana.mp3"
    }
  },
  {
    id: "parashurama",
    name: "Parashurama",
    titleName: "Lord Parashurama",
    image: `${baseUrl}assets/vaahana/parashurama.webp`,
    successImage: `${baseUrl}assets/vaahana/parashurama.webp`,
    weapons: [
      { id: "axe", name: "Axe" }
    ],
    specialItems: [
      { id: "axe", name: "Axe", category: "weapon", image: `${baseUrl}assets/items/axe.png`, fallbackImage: `${baseUrl}assets/items/axe.webp`, emoji: "🪓" }
    ],
    questionText: "Where is Parashurama?",
    successText: "Yes! That's Lord Parashurama!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_parashurama.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      specialItemQuestion: "assets/audio_gungun/item_q_parashurama.mp3"
    }
  },
  {
    id: "balarama",
    name: "Balarama",
    titleName: "Lord Balarama",
    image: `${baseUrl}assets/vaahana/balarama.webp`,
    successImage: `${baseUrl}assets/vaahana/balarama.webp`,
    specialItems: [
      { id: "plough", name: "Plough", category: "agricultural_tool", image: `${baseUrl}assets/items/plough.png`, fallbackImage: `${baseUrl}assets/items/plough.webp`, emoji: "🌾" }
    ],
    questionText: "Where is Balarama?",
    successText: "Yes! That's Lord Balarama!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_balarama.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      specialItemQuestion: "assets/audio_gungun/item_q_balarama.mp3"
    }
  }
];

/**
 * Filter deities that have a ride defined (participate in "Find the Ride")
 */
export function getFindTheRideDeities(): CentralDeity[] {
  return centralDeities.filter(d => Boolean(d.vahana));
}

/**
 * All deities available for "Find the God"
 */
export function getFindTheGodDeities(): CentralDeity[] {
  return centralDeities;
}

const SPECIAL_ITEM_DEITY_IDS = new Set([
  'ganesha', 'shiva', 'vishnu', 'kartikeya', 'saraswati',
  'lakshmi', 'hanuman', 'krishna', 'rama', 'yama',
  'ayyappa', 'dattatreya', 'vamana', 'parashurama', 'balarama'
]);

/**
 * Filter the 15 deities configured for "Find My Special Item"
 */
export function getSpecialItemDeities(): CentralDeity[] {
  return centralDeities.filter(d =>
    SPECIAL_ITEM_DEITY_IDS.has(d.id) && Boolean(d.specialItems && d.specialItems.length > 0)
  );
}
