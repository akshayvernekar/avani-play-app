export interface DeityWeapon {
  id: string;
  name: string;
  image?: string;
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
    image: `${baseUrl}assets/vaahana/ganesha.png`,
    successImage: `${baseUrl}assets/vaahana/ganesha.png`,
    vahana: {
      id: "mouse",
      name: "Mouse",
      emoji: "🐭",
      image: `${baseUrl}assets/vaahana/mouse.png`,
      voiceText: "Ganesha's ride is the mouse!",
      hintText: "Ganesha loves riding with his friendly mouse!"
    },
    weapons: [
      { id: "parashu", name: "Parashu (Axe)" }
    ],
    questionText: "Where is Ganesha?",
    successText: "Yes! That's Ganesha!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_ganesha.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      vahanaQuestion: "assets/audio_gungun/ride_q_ganesha.mp3",
      vahanaSuccess: "assets/audio_gungun/ride_success_ganesha.mp3",
      vahanaHint: "assets/audio_gungun/ride_hint_ganesha.mp3"
    }
  },
  {
    id: "shiva",
    name: "Shiva",
    titleName: "Lord Shiva",
    image: `${baseUrl}assets/vaahana/shiva.png`,
    successImage: `${baseUrl}assets/vaahana/shiva.png`,
    vahana: {
      id: "nandi",
      name: "Bull",
      emoji: "🐂",
      image: `${baseUrl}assets/vaahana/bull.png`,
      voiceText: "Shiva's ride is Nandi the bull!",
      hintText: "Shiva rides with Nandi, the gentle white bull!"
    },
    weapons: [
      { id: "trishul", name: "Trishul (Trident)" }
    ],
    questionText: "Where is Shiva?",
    successText: "Yes! That's Shiva!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_shiva.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      vahanaQuestion: "assets/audio_gungun/ride_q_shiva.mp3",
      vahanaSuccess: "assets/audio_gungun/ride_success_shiva.mp3",
      vahanaHint: "assets/audio_gungun/ride_hint_shiva.mp3"
    }
  },
  {
    id: "durga",
    name: "Durga",
    titleName: "Goddess Durga",
    image: `${baseUrl}assets/vaahana/durga.png`,
    successImage: `${baseUrl}assets/vaahana/durga.png`,
    vahana: {
      id: "lion",
      name: "Lion",
      emoji: "🦁",
      image: `${baseUrl}assets/vaahana/lion.png`,
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
    image: `${baseUrl}assets/vaahana/kartikeya.png`,
    successImage: `${baseUrl}assets/vaahana/kartikeya.png`,
    vahana: {
      id: "peacock",
      name: "Peacock",
      emoji: "🦚",
      image: `${baseUrl}assets/vaahana/peacock-removebg-preview.png`,
      voiceText: "Kartikeya's ride is the colorful peacock!",
      hintText: "Kartikeya rides with the beautiful peacock!"
    },
    weapons: [
      { id: "vel", name: "Vel (Divine Spear)" }
    ],
    questionText: "Where is Kartikeya?",
    successText: "Yes! That's Kartikeya!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_kartikeya.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      vahanaQuestion: "assets/audio_gungun/ride_q_kartikeya.mp3",
      vahanaSuccess: "assets/audio_gungun/ride_success_kartikeya.mp3",
      vahanaHint: "assets/audio_gungun/ride_hint_kartikeya.mp3"
    }
  },
  {
    id: "vishnu",
    name: "Vishnu",
    titleName: "Lord Vishnu",
    image: `${baseUrl}assets/vaahana/vishnu.png`,
    successImage: `${baseUrl}assets/vaahana/vishnu.png`,
    vahana: {
      id: "garuda",
      name: "Eagle",
      emoji: "🦅",
      image: `${baseUrl}assets/vaahana/garuda.png`,
      voiceText: "Vishnu's ride is Garuda the eagle!",
      hintText: "Lord Vishnu soars with Garuda, the golden eagle!"
    },
    weapons: [
      { id: "sudarshana_chakra", name: "Sudarshana Chakra" }
    ],
    questionText: "Where is Vishnu?",
    successText: "Yes! That's Lord Vishnu!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_vishnu.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      vahanaQuestion: "assets/audio_gungun/ride_q_vishnu.mp3",
      vahanaSuccess: "assets/audio_gungun/ride_success_vishnu.mp3",
      vahanaHint: "assets/audio_gungun/ride_hint_vishnu.mp3"
    }
  },
  {
    id: "saraswati",
    name: "Saraswati",
    titleName: "Goddess Saraswati",
    image: `${baseUrl}assets/vaahana/saraswati.png`,
    successImage: `${baseUrl}assets/vaahana/saraswati.png`,
    vahana: {
      id: "swan",
      name: "Swan",
      emoji: "🦢",
      image: `${baseUrl}assets/vaahana/swan.png`,
      voiceText: "Saraswati's ride is the graceful swan!",
      hintText: "Goddess Saraswati glides with the serene swan!"
    },
    weapons: [
      { id: "veena", name: "Veena" }
    ],
    questionText: "Where is Saraswati?",
    successText: "Yes! That's Goddess Saraswati!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_saraswati.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      vahanaQuestion: "assets/audio_gungun/ride_q_saraswati.mp3",
      vahanaSuccess: "assets/audio_gungun/ride_success_saraswati.mp3",
      vahanaHint: "assets/audio_gungun/ride_hint_saraswati.mp3"
    }
  },

  // ── 10 New Deities Added to "Find the Ride" (And also in "Find the God") ──
  {
    id: "lakshmi",
    name: "Lakshmi",
    titleName: "Goddess Lakshmi",
    image: `${baseUrl}assets/vaahana/lakshmi.png`,
    successImage: `${baseUrl}assets/vaahana/lakshmi.png`,
    vahana: {
      id: "owl",
      name: "Owl",
      emoji: "🦉",
      image: `${baseUrl}assets/vaahana/owl.png`,
      voiceText: "Lakshmi rides with the wise owl!",
      hintText: "Goddess Lakshmi's ride is the wise night owl!"
    },
    questionText: "Where is Lakshmi?",
    successText: "Yes! That's Goddess Lakshmi!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_lakshmi.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      vahanaQuestion: "assets/audio_gungun/ride_q_lakshmi.mp3",
      vahanaSuccess: "assets/audio_gungun/ride_success_lakshmi.mp3",
      vahanaHint: "assets/audio_gungun/ride_hint_lakshmi.mp3"
    }
  },
  {
    id: "brahma",
    name: "Brahma",
    titleName: "Lord Brahma",
    image: `${baseUrl}assets/vaahana/brahma.png`,
    successImage: `${baseUrl}assets/vaahana/brahma.png`,
    vahana: {
      id: "swan",
      name: "Swan",
      emoji: "🦢",
      image: `${baseUrl}assets/vaahana/swan.png`,
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
    image: `${baseUrl}assets/vaahana/indra.png`,
    successImage: `${baseUrl}assets/vaahana/indra.png`,
    vahana: {
      id: "elephant",
      name: "White Elephant",
      emoji: "🐘",
      image: `${baseUrl}assets/vaahana/white_elephant.png`,
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
    image: `${baseUrl}assets/vaahana/surya.png`,
    successImage: `${baseUrl}assets/vaahana/surya.png`,
    vahana: {
      id: "horses",
      name: "Seven Horses",
      emoji: "🐎",
      image: `${baseUrl}assets/vaahana/seven_horses.png`,
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
    image: `${baseUrl}assets/vaahana/shani.png`,
    successImage: `${baseUrl}assets/vaahana/shani.png`,
    vahana: {
      id: "crow",
      name: "Crow",
      emoji: "🐦‍⬛",
      image: `${baseUrl}assets/vaahana/crow.png`,
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
    image: `${baseUrl}assets/vaahana/yama.png`,
    successImage: `${baseUrl}assets/vaahana/yama.png`,
    vahana: {
      id: "buffalo",
      name: "Buffalo",
      emoji: "🐃",
      image: `${baseUrl}assets/vaahana/buffalo.png`,
      voiceText: "Yama rides with the strong water buffalo!",
      hintText: "Lord Yama rides with the powerful buffalo!"
    },
    weapons: [
      { id: "gada", name: "Gada (Mace)" },
      { id: "pasha", name: "Pasha (Noose)" }
    ],
    questionText: "Where is Yama?",
    successText: "Yes! That's Lord Yama!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_yama.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      vahanaQuestion: "assets/audio_gungun/ride_q_yama.mp3",
      vahanaSuccess: "assets/audio_gungun/ride_success_yama.mp3",
      vahanaHint: "assets/audio_gungun/ride_hint_yama.mp3"
    }
  },
  {
    id: "agni",
    name: "Agni",
    titleName: "Lord Agni",
    image: `${baseUrl}assets/vaahana/agni.png`,
    successImage: `${baseUrl}assets/vaahana/agni.png`,
    vahana: {
      id: "ram",
      name: "Sheep",
      emoji: "🐏",
      image: `${baseUrl}assets/vaahana/ram.png`,
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
    image: `${baseUrl}assets/vaahana/varuna.png`,
    successImage: `${baseUrl}assets/vaahana/varuna.png`,
    vahana: {
      id: "crocodile",
      name: "Crocodile",
      emoji: "🐊",
      image: `${baseUrl}assets/vaahana/crocodile.png`,
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
    image: `${baseUrl}assets/vaahana/ayyappa.png`,
    successImage: `${baseUrl}assets/vaahana/ayyappa.png`,
    vahana: {
      id: "tiger",
      name: "Tiger",
      emoji: "🐅",
      image: `${baseUrl}assets/vaahana/tiger.png`,
      voiceText: "Swami Ayyappa rides with the courageous tiger!",
      hintText: "Swami Ayyappa rides with the fierce tiger!"
    },
    weapons: [
      { id: "bow", name: "Bow and Arrow" }
    ],
    questionText: "Where is Ayyappa?",
    successText: "Yes! That's Swami Ayyappa!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_ayyappa.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      vahanaQuestion: "assets/audio_gungun/ride_q_ayyappa.mp3",
      vahanaSuccess: "assets/audio_gungun/ride_success_ayyappa.mp3",
      vahanaHint: "assets/audio_gungun/ride_hint_ayyappa.mp3"
    }
  },
  {
    id: "dattatreya",
    name: "Dattatreya",
    titleName: "Lord Dattatreya",
    image: `${baseUrl}assets/vaahana/dattatreya.png`,
    successImage: `${baseUrl}assets/vaahana/dattatreya.png`,
    vahana: {
      id: "dogs",
      name: "Four Dogs",
      emoji: "🐕",
      image: `${baseUrl}assets/vaahana/four_dogs.png`,
      voiceText: "Lord Dattatreya is accompanied by four faithful dogs!",
      hintText: "Lord Dattatreya walks with friendly dogs representing the Vedas!"
    },
    weapons: [
      { id: "trishul", name: "Trishul (Trident)" },
      { id: "chakra", name: "Chakra" }
    ],
    questionText: "Where is Dattatreya?",
    successText: "Yes! That's Lord Dattatreya!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_dattatreya.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3",
      vahanaQuestion: "assets/audio_gungun/ride_q_dattatreya.mp3",
      vahanaSuccess: "assets/audio_gungun/ride_success_dattatreya.mp3",
      vahanaHint: "assets/audio_gungun/ride_hint_dattatreya.mp3"
    }
  },

  // ── 5 Additional Deities for "Find the God" ──
  {
    id: "hanuman",
    name: "Hanuman",
    titleName: "Lord Hanuman",
    image: `${baseUrl}assets/vaahana/hanuman.png`,
    successImage: `${baseUrl}assets/vaahana/hanuman.png`,
    weapons: [
      { id: "gada", name: "Gada (Mace)" }
    ],
    questionText: "Where is Hanuman?",
    successText: "Yes! That's Lord Hanuman! Jai Bajrangbali!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_hanuman.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3"
    }
  },
  {
    id: "krishna",
    name: "Krishna",
    titleName: "Lord Krishna",
    image: `${baseUrl}assets/vaahana/krishna.png`,
    successImage: `${baseUrl}assets/vaahana/krishna.png`,
    weapons: [
      { id: "flute", name: "Bansuri (Flute)" },
      { id: "sudarshana_chakra", name: "Sudarshana Chakra" }
    ],
    questionText: "Where is Krishna?",
    successText: "Yes! That's Lord Krishna with his sweet flute!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_krishna.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3"
    }
  },
  {
    id: "rama",
    name: "Rama",
    titleName: "Lord Rama",
    image: `${baseUrl}assets/vaahana/rama.png`,
    successImage: `${baseUrl}assets/vaahana/rama.png`,
    weapons: [
      { id: "kodanda_bow", name: "Kodanda Bow and Arrow" }
    ],
    questionText: "Where is Rama?",
    successText: "Yes! That's Lord Rama!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_rama.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3"
    }
  },
  {
    id: "parvati",
    name: "Parvati",
    titleName: "Goddess Parvati",
    image: `${baseUrl}assets/vaahana/parvati.png`,
    successImage: `${baseUrl}assets/vaahana/parvati.png`,
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
    image: `${baseUrl}assets/vaahana/kali.png`,
    successImage: `${baseUrl}assets/vaahana/kali.png`,
    weapons: [
      { id: "khadga", name: "Khadga (Sword)" }
    ],
    questionText: "Where is Kali?",
    successText: "Yes! That's Goddess Kali!",
    audio: {
      findGodQuestion: "assets/audio_gungun/find_god_kali.mp3",
      findGodSuccess: "assets/audio_gungun/find_god_success.mp3"
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
