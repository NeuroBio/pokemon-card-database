import { Injectable } from '@angular/core';
import { CardChunk } from '../_objects/card-chunk';
import { CardInstance } from '../_objects/card-instance';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  constructor() { }

  // convertToCardChunks(cards: CardInstance[]) {
  //   const cardChunks: CardChunk[] = [];
  //   const cardList = this.sortIntoCardType(cards);
  //   Object.keys(cardList).forEach(cardKey => {
  //     const expansionKey = cardKey.split('-')[0];
  //     cardChunks.push(new CardChunk(cardList[cardKey], expansionKey, ))
  //   })
  // }

  sortIntoCardType(cards: CardInstance[]): Object {
    const cardlist = {};
    cards.forEach(card => {
      if (!cardlist[`${card.expansionName}-${card.printNumber}`]) {
        cardlist[`${card.expansionName}-${card.printNumber}`] = []
      }
      cardlist[`${card.expansionName}-${card.printNumber}`].push(card);
    });
    return cardlist;
  }
}
