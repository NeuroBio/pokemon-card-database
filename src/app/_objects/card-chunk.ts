import { CardInstance } from "./card-instance";
import { Card, SetExpansion } from "./expansion";

export class CardChunk extends Card {

    owned: CardInstance[] = [];
    expansionName: string;
    generation: number;
    numCards: number;
    release: number;

    constructor(card: Card, expansionName: string, expansion: SetExpansion) {
        super(card.cardTitle, card.cardType, card.dexNumber, card.printNumber, card.rarity)
        this.expansionName = expansionName;
        this.generation = expansion.generation;
        this.numCards = expansion.numCards;
        this.release = expansion.release;
    }

    conditionCount(): string {
        const cards = {};
        let conditionString = '';
        this.owned.forEach(card => {
            // add the card form subgroups
            if (!cards[card.form]) {
                cards[card.form] = {};
            }

            // add the card condition group for the right subgroup
            if (!cards[card.form][card.condition]) {
                cards[card.form][card.condition] = 0;
            }

            // add to count
            cards[card.form][card.condition] += 1;
        });

        // convert counts to display string
        Object.keys(cards).forEach((key, i) => {
            // start with the form
            conditionString += `${key}: `;
            Object.keys(cards[key]).forEach(subkey => {
                // number of cards in each condisiton for a form
                conditionString += `x${cards[key][subkey]} ${subkey} `;
            });

            // add comma and space unless last form
            if (i < Object.keys(cards).length - 1) {
                conditionString += ', ';
            }
        });

        return conditionString ? conditionString : 'none';
    }

    addCard(card: CardInstance): void {
        this.owned.push(card);
    }

    removeCard(index: number): void {
        this.owned.splice(index, 1);
    }

    
}