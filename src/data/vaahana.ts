import { centralDeities, getFindTheRideDeities, DeityAudio } from './deities';

export interface DeityItem {
    id: string;
    deityName: string;
    titleName: string;
    deityImage: string;
    successImage: string;
    correctVaahana: string;
    vaahanaName: string;
    voiceText: string;
    hintText: string;
    audio?: DeityAudio;
}

export interface VaahanaOptionItem {
    id: string;
    name: string;
    emoji: string;        // Used now — large emoji display
    image?: string;       // Reserved for future real artwork
}

const baseUrl = import.meta.env.BASE_URL;

// Derive Find the Ride deities from central scalable deity registry
export const vaahanaData: DeityItem[] = getFindTheRideDeities().map(deity => ({
    id: deity.id,
    deityName: deity.name,
    titleName: deity.titleName,
    deityImage: deity.image,
    successImage: deity.successImage || deity.image,
    correctVaahana: deity.vahana!.id,
    vaahanaName: deity.vahana!.name,
    voiceText: deity.vahana!.voiceText,
    hintText: deity.vahana!.hintText,
    audio: deity.audio
}));

export const vaahanas: VaahanaOptionItem[] = [
    {
        id: "mouse",
        name: "Mouse",
        emoji: "🐭",
        image: `${baseUrl}assets/vaahana/mouse.png`
    },
    {
        id: "nandi",
        name: "Bull",
        emoji: "🐂",
        image: `${baseUrl}assets/vaahana/bull.png`
    },
    {
        id: "lion",
        name: "Lion",
        emoji: "🦁",
        image: `${baseUrl}assets/vaahana/lion.png`
    },
    {
        id: "peacock",
        name: "Peacock",
        emoji: "🦚",
        image: `${baseUrl}assets/vaahana/peacock-removebg-preview.png`
    },
    {
        id: "garuda",
        name: "Eagle",
        emoji: "🦅",
        image: `${baseUrl}assets/vaahana/garuda.png`
    },
    {
        id: "swan",
        name: "Swan",
        emoji: "🦢",
        image: `${baseUrl}assets/vaahana/swan.png`
    },
    {
        id: "owl",
        name: "Owl",
        emoji: "🦉",
        image: `${baseUrl}assets/vaahana/owl.png`
    },
    {
        id: "elephant",
        name: "White Elephant",
        emoji: "🐘",
        image: `${baseUrl}assets/vaahana/white_elephant.png`
    },
    {
        id: "horses",
        name: "Seven Horses",
        emoji: "🐎",
        image: `${baseUrl}assets/vaahana/seven_horses.png`
    },
    {
        id: "crow",
        name: "Crow",
        emoji: "🐦‍⬛",
        image: `${baseUrl}assets/vaahana/crow.png`
    },
    {
        id: "buffalo",
        name: "Buffalo",
        emoji: "🐃",
        image: `${baseUrl}assets/vaahana/buffalo.png`
    },
    {
        id: "ram",
        name: "Ram",
        emoji: "🐏",
        image: `${baseUrl}assets/vaahana/ram.png`
    },
    {
        id: "crocodile",
        name: "Crocodile",
        emoji: "🐊",
        image: `${baseUrl}assets/vaahana/crocodile.png`
    },
    {
        id: "tiger",
        name: "Tiger",
        emoji: "🐅",
        image: `${baseUrl}assets/vaahana/tiger.png`
    },
    {
        id: "dogs",
        name: "Four Dogs",
        emoji: "🐕",
        image: `${baseUrl}assets/vaahana/four_dogs.png`
    }
];

export interface VaahanaQuestion {
    targetDeity: DeityItem;
    options: VaahanaOptionItem[];
}

export function getRandomVaahanaQuestion(lastTargetId?: string): VaahanaQuestion {
    let candidateDeities = vaahanaData;
    if (lastTargetId && vaahanaData.length > 1) {
        candidateDeities = vaahanaData.filter(d => d.id !== lastTargetId);
    }
    const targetDeity = candidateDeities[Math.floor(Math.random() * candidateDeities.length)];
    const options = getRandomVaahanaOptions(targetDeity.correctVaahana);
    return {
        targetDeity,
        options
    };
}

export function getRandomVaahanaOptions(correctId: string): VaahanaOptionItem[] {
    const correctOption = vaahanas.find(v => v.id === correctId);
    const otherOptions = vaahanas.filter(v => v.id !== correctId);

    // Pick 3 random incorrect items
    const shuffledOthers = [...otherOptions].sort(() => 0.5 - Math.random());
    const selectedOthers = shuffledOthers.slice(0, 3);

    // Combine & shuffle
    const all4 = [correctOption!, ...selectedOthers];
    return all4.sort(() => 0.5 - Math.random());
}
