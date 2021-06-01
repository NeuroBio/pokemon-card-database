import { CardInstance } from './card-instance';
import { CheckInfo } from './checklist';
import { Card, SetExpansion } from './expansion';

export class CardChunk extends Card {

    owned: CardInstance[] = [];
    expansionName: string;
    generation: number;
    numCards: number;
    release: number;
    checkInfo?: CheckInfo;

    constructor(print: number, expansion: SetExpansion, checkInfo?: CheckInfo) {
        super(
            expansion.cards[print - 1].cardTitle,
            expansion.cards[print - 1].cardType,
            expansion.cards[print - 1].dexNumber,
            expansion.cards[print - 1].printNumber,
            expansion.cards[print - 1].rarity);
        this.expansionName = expansion.name;
        this.generation = expansion.generation;
        this.numCards = expansion.numCards;
        this.release = expansion.release;
        this.checkInfo = checkInfo;
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

    haveCard(): string {
        if (this.checkInfo) {
            if (!this.checkInfo.uid) {
                return 'None';
            } else {
                return this.checkInfo.placeholder ? 'Placeholder' : 'Check';
            }
        } else {
            return 'None';
        }
    }

}
