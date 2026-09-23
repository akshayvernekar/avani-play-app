export interface DeityInfo {
    id: string;
    name: string;
    title: string;
    image: string;
    questionText: string;
    successText: string;
}

const baseUrl = import.meta.env.BASE_URL;

export const identifyGodDeities: DeityInfo[] = [
    {
        id: "ganesha",
        name: "Ganesha",
        title: "Lord Ganesha",
        image: `${baseUrl}assets/vaahana/ganesha.png`,
        questionText: "Where is Ganesha?",
        successText: "Yes! That's Ganesha!"
    },
    {
        id: "shiva",
        name: "Shiva",
        title: "Lord Shiva",
        image: `${baseUrl}assets/vaahana/shiva.png`,
        questionText: "Where is Shiva?",
        successText: "Yes! That's Shiva!"
    },
    {
        id: "durga",
        name: "Durga",
        title: "Goddess Durga",
        image: `${baseUrl}assets/vaahana/durga.png`,
        questionText: "Where is Durga?",
        successText: "Yes! That's Goddess Durga!"
    },
    {
        id: "kartikeya",
        name: "Kartikeya",
        title: "Kartikeya (Murugan)",
        image: `${baseUrl}assets/vaahana/kartikeya.png`,
        questionText: "Where is Kartikeya?",
        successText: "Yes! That's Kartikeya!"
    },
    {
        id: "vishnu",
        name: "Vishnu",
        title: "Lord Vishnu",
        image: `${baseUrl}assets/vaahana/vishnu.png`,
        questionText: "Where is Vishnu?",
        successText: "Yes! That's Lord Vishnu!"
    },
    {
        id: "saraswati",
        name: "Saraswati",
        title: "Goddess Saraswati",
        image: `${baseUrl}assets/vaahana/saraswati.png`,
        questionText: "Where is Saraswati?",
        successText: "Yes! That's Goddess Saraswati!"
    }
];

export function shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

export interface IdentifyGodQuestion {
    targetDeity: DeityInfo;
    options: DeityInfo[];
}

export function getRandomIdentifyGodQuestion(lastTargetId?: string): IdentifyGodQuestion {
    // Candidate targets (avoiding immediate repeat if possible)
    let candidateTargets = identifyGodDeities;
    if (lastTargetId && identifyGodDeities.length > 1) {
        candidateTargets = identifyGodDeities.filter(d => d.id !== lastTargetId);
    }

    const targetDeity = candidateTargets[Math.floor(Math.random() * candidateTargets.length)];

    // Pick 3 random incorrect deities
    const otherDeities = identifyGodDeities.filter(d => d.id !== targetDeity.id);
    const shuffledOthers = shuffleArray(otherDeities);
    const selectedOthers = shuffledOthers.slice(0, 3);

    // Combine target + 3 incorrect deities & shuffle position
    const options = shuffleArray([targetDeity, ...selectedOthers]);

    return {
        targetDeity,
        options
    };
}
