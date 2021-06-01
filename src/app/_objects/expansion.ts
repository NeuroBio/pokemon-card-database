export class SetExpansion {
    name: string;
    cards: Card[];
    generation: number;
    release: number;
    numCards: number;

    constructor(name: string, cards: Card[], generation: number, release: number, numCards: number) {
        this.name = name;
        this.cards = cards;
        this.generation = generation;
        this.release = release;
        this.numCards = numCards;
    }
}

export class Card {
    cardTitle: string;
    cardType: string;
    dexNumber: number;
    printNumber: number;
    rarity: string;

    constructor(cardTitle: string, type: string, dex: number, print: number, rarity: string) {
        this.cardTitle = cardTitle;
        this.cardType = type;
        this.dexNumber = dex;
        this.printNumber = print;
        this.rarity = rarity;
    }
}
