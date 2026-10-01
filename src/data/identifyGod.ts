import { centralDeities, getFindTheGodDeities, DeityAudio } from './deities';

export interface DeityInfo {
    id: string;
    name: string;
    title: string;
    image: string;
    questionText: string;
    successText: string;
    audio?: DeityAudio;
}

const baseUrl = import.meta.env.BASE_URL;

// Derive Find the God deities from the central scalable registry (all 21 deities)
export const identifyGodDeities: DeityInfo[] = getFindTheGodDeities().map(deity => ({
    id: deity.id,
    name: deity.name,
    title: deity.titleName,
    image: deity.image,
    questionText: deity.questionText,
    successText: deity.successText,
    audio: deity.audio
}));

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

export function createShuffledIdentifyGodDeck(existingIdToAvoid?: string): DeityInfo[] {
    const deck = shuffleArray(identifyGodDeities);
    if (existingIdToAvoid && deck.length > 1 && deck[0].id === existingIdToAvoid) {
        [deck[0], deck[deck.length - 1]] = [deck[deck.length - 1], deck[0]];
    }
    return deck;
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
