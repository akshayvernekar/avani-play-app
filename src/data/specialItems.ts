import { 
  centralDeities, 
  getSpecialItemDeities, 
  CentralDeity, 
  DeitySpecialItem, 
  SpecialItemCategory,
  DeityAudio 
} from './deities';

export interface SpecialItemRound {
  targetDeity: CentralDeity;
  correctItem: DeitySpecialItem;
  options: DeitySpecialItem[];
  questionText: string;
  questionAudio: string;
}

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 15 initial deities for "Find My Special Item"
export const specialItemDeities: CentralDeity[] = getSpecialItemDeities();

// Unique pool of special items across all 15 deities for distractors
const seenItemIds = new Set<string>();
export const distinctSpecialItemsPool: DeitySpecialItem[] = [];

for (const deity of specialItemDeities) {
  if (deity.specialItems) {
    for (const item of deity.specialItems) {
      if (!seenItemIds.has(item.id)) {
        seenItemIds.add(item.id);
        distinctSpecialItemsPool.push(item);
      }
    }
  }
}

/**
 * Creates a freshly shuffled deck of the 15 deities, avoiding repeating the last target deity on deck reset
 */
export function createShuffledSpecialItemsDeck(existingIdToAvoid?: string): CentralDeity[] {
  const deck = shuffleArray(specialItemDeities);
  if (existingIdToAvoid && deck.length > 1 && deck[0].id === existingIdToAvoid) {
    [deck[0], deck[deck.length - 1]] = [deck[deck.length - 1], deck[0]];
  }
  return deck;
}

/**
 * Generates a round for the given deity:
 * - 1 correct item (primary item, e.g. Veena for Saraswati)
 * - 3 distinct distractors from other deities
 * - Randomizes the positions of the 4 options
 * - Never duplicates an answer within a question
 */
export function createRoundForDeity(deity: CentralDeity): SpecialItemRound {
  // Select primary special item (for Saraswati, this is Veena at index 0)
  const correctItem = (deity.specialItems && deity.specialItems.length > 0)
    ? deity.specialItems[0]
    : {
        id: 'item',
        name: 'Special Item',
        category: 'object' as SpecialItemCategory,
        emoji: '✨'
      };

  // Filter candidate distractors (must not have same id or same name)
  const eligibleDistractors = distinctSpecialItemsPool.filter(
    item => item.id !== correctItem.id && item.name.toLowerCase() !== correctItem.name.toLowerCase()
  );

  const shuffledDistractors = shuffleArray(eligibleDistractors);
  const selectedDistractors = shuffledDistractors.slice(0, 3);

  // Combine 1 correct + 3 distractors and randomize position
  const options = shuffleArray([correctItem, ...selectedDistractors]);

  const questionText = `What belongs to ${deity.name}?`;
  const questionAudio = deity.audio?.specialItemQuestion || `assets/audio_gungun/item_q_${deity.id}.mp3`;

  return {
    targetDeity: deity,
    correctItem,
    options,
    questionText,
    questionAudio
  };
}
