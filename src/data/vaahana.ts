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
}

export interface VaahanaOptionItem {
    id: string;
    name: string;
    image: string;
}

const baseUrl = import.meta.env.BASE_URL;

export const vaahanaData: DeityItem[] = [
    {
        id: "ganesha",
        deityName: "Ganesha",
        titleName: "Lord Ganesha",
        deityImage: `${baseUrl}assets/vaahana/ganesha.svg`,
        successImage: `${baseUrl}assets/vaahana/ganesha-mouse.svg`,
        correctVaahana: "mouse",
        vaahanaName: "Mouse",
        voiceText: "Ganesha's Vaahana is the mouse!",
        hintText: "Ganesha loves riding with his friendly mouse!"
    },
    {
        id: "shiva",
        deityName: "Shiva",
        titleName: "Lord Shiva",
        deityImage: `${baseUrl}assets/vaahana/shiva.svg`,
        successImage: `${baseUrl}assets/vaahana/shiva-nandi.svg`,
        correctVaahana: "nandi",
        vaahanaName: "Bull",
        voiceText: "Shiva's Vaahana is Nandi the bull!",
        hintText: "Shiva rides with Nandi, the gentle white bull!"
    },
    {
        id: "durga",
        deityName: "Durga",
        titleName: "Goddess Durga",
        deityImage: `${baseUrl}assets/vaahana/durga.svg`,
        successImage: `${baseUrl}assets/vaahana/durga-lion.svg`,
        correctVaahana: "lion",
        vaahanaName: "Lion",
        voiceText: "Durga's Vaahana is the brave lion!",
        hintText: "Goddess Durga rides with the mighty lion!"
    },
    {
        id: "kartikeya",
        deityName: "Kartikeya",
        titleName: "Kartikeya (Murugan)",
        deityImage: `${baseUrl}assets/vaahana/kartikeya.svg`,
        successImage: `${baseUrl}assets/vaahana/kartikeya-peacock.svg`,
        correctVaahana: "peacock",
        vaahanaName: "Peacock",
        voiceText: "Kartikeya's Vaahana is the colorful peacock!",
        hintText: "Kartikeya rides with the beautiful peacock!"
    },
    {
        id: "vishnu",
        deityName: "Vishnu",
        titleName: "Lord Vishnu",
        deityImage: `${baseUrl}assets/vaahana/vishnu.svg`,
        successImage: `${baseUrl}assets/vaahana/vishnu-garuda.svg`,
        correctVaahana: "garuda",
        vaahanaName: "Eagle",
        voiceText: "Vishnu's Vaahana is Garuda the eagle!",
        hintText: "Lord Vishnu soars with Garuda, the golden eagle!"
    },
    {
        id: "saraswati",
        deityName: "Saraswati",
        titleName: "Goddess Saraswati",
        deityImage: `${baseUrl}assets/vaahana/saraswati.svg`,
        successImage: `${baseUrl}assets/vaahana/saraswati-swan.svg`,
        correctVaahana: "swan",
        vaahanaName: "Swan",
        voiceText: "Saraswati's Vaahana is the graceful swan!",
        hintText: "Goddess Saraswati glides with the serene swan!"
    }
];

export const vaahanas: VaahanaOptionItem[] = [
    {
        id: "mouse",
        name: "Mouse",
        image: `${baseUrl}assets/vaahana/mouse.svg`
    },
    {
        id: "nandi",
        name: "Bull",
        image: `${baseUrl}assets/vaahana/bull.svg`
    },
    {
        id: "lion",
        name: "Lion",
        image: `${baseUrl}assets/vaahana/lion.svg`
    },
    {
        id: "peacock",
        name: "Peacock",
        image: `${baseUrl}assets/vaahana/peacock.svg`
    },
    {
        id: "garuda",
        name: "Eagle",
        image: `${baseUrl}assets/vaahana/garuda.svg`
    },
    {
        id: "swan",
        name: "Swan",
        image: `${baseUrl}assets/vaahana/swan.svg`
    }
];

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
