import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { map, skip, take, tap } from 'rxjs/operators';
import { CardChunk } from '../_objects/card-chunk';
import { CardInstance } from '../_objects/card-instance';
import { Checklist } from '../_objects/checklist';
import { SetExpansion } from '../_objects/expansion';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  allCards = new BehaviorSubject<any>([]);
  expansions = new BehaviorSubject<Object>([]);
  checkLists = new BehaviorSubject<any[]>(undefined);
  masterList = new BehaviorSubject<CardChunk[]>([]);

  private bestForm = {'1st': 0, 'shadowless': 1, 'UK 2000': 2, 'unlimited': 3, 'reverse': 4, 'standard': 5};
  private bestCondition = {'M': 0, 'NM': 1, 'LP': 2, 'MP': 3, 'HP': 4};
  private changed: boolean;

  constructor(private af: AngularFirestore) { 
    this.getCards().pipe(skip(1)).subscribe();
    this.getExpansions().pipe(skip(1)).subscribe();
    this.getCheckLists().pipe(skip(1)).subscribe();
  }

  load() {
    return new Promise((resolve) => {
      forkJoin([
        this.getCards().pipe(take(1)),
        this.getExpansions().pipe(take(1)),
        this.getCheckLists().pipe(take(1))
      ]).subscribe(() => resolve(true))
    });
  }

  private getCards(): Observable<Object> {
    return this.af.collection<any>('pokemon-cards').valueChanges()
      .pipe(
        map(cards => {
          const cardObject = {}
          cards.forEach(cardType =>
            cardObject[`${cardType.expansionName}-${cardType.printNumber}`] = JSON.parse(cardType.cards));
          return cardObject;
        }),
        tap(cards => {
        this.allCards.next(cards)
        this.changed = true;
      }));
  }

  private getExpansions(): Observable<Object> {
    return this.af.collection<any>('expansions').valueChanges()
      .pipe(
        map(expansions => {
          const expantionDict = {};
          expansions.forEach(exp => {
            exp.cards = JSON.parse(exp.cards);
            expantionDict[exp.name] = exp as SetExpansion;
          });
          return expantionDict;
        }),
        tap(expansions => this.expansions.next(expansions))
      );
  }

  private getCheckLists(): Observable<Checklist[]> {
    return this.af.collection<Checklist>('check-lists').valueChanges()
      .pipe(tap(lists => this.checkLists.next(lists)));
  }

  getMaster(): CardChunk[] {
    if (!this.changed) {
      return this.masterList.value;
    }

    const cards = this.allCards.value;
    const cardChunks: CardChunk[] = [];
    // loop through all cards
    Object.keys(cards).forEach(key => {
      const keyParts = key.split('-');

      // create card chunk based on print/expansion
      cardChunks.push(new CardChunk(
        +keyParts[1],
        this.expansions.value[keyParts[0]])
      );

      // load in the desired cards
      Object.keys(cards[key]).forEach(uid =>
        cardChunks[cardChunks.length-1].owned.push(cards[key][uid]))
    });

    this.masterList.next(cardChunks);
    this.changed = false;
    return cardChunks;
  }

  getRawCheckList(listName: string): Checklist {
    const list = Object.assign({}, this.checkLists.value.find(list => list.name === listName));
    list.checkInfo = JSON.parse(list.checkInfo)
    return list as Checklist
  }

  getCheckList(listName: string): CardChunk[] {
    const list =  this.getRawCheckList(listName);
    const cardChunks: CardChunk[] = [];
    const cards = this.allCards.value;
    const expansions = this.expansions.value;

    // for each card in a list
    list.cardKeys.forEach((key, i) => {
      const keyParts = key.split('-')

      // get the card type to start the cardchunk
      const newChunk = new CardChunk(+keyParts[1], expansions[keyParts[0]], list.checkInfo[i])

      // if there is a card instance, get it and load it into the new chard chunk
      if (list.checkInfo[i].uid) {
        const cardType = cards[list.checkInfo[i].key];
        newChunk.owned.push(cardType[list.checkInfo[i].uid]);
      }
      cardChunks.push(newChunk);
    });

    return cardChunks;
  }

  getActiveCard(exp: string, print: number) {
    if (print && exp) {
      const card = this.expansions.value[exp].cards[print-1];
      if (!card) {
        return null;
      } else {
        return card;
      }
    } else {
      undefined;
    }
  }

  getChunk(key: string): CardInstance[] {
    const chunk = this.allCards.value[key];
    return chunk ? Object.values(chunk) : null;
  }

  getCard(key: string, uid: string) {
    return this.allCards.value[key][uid];
  }

  getBestCard(cards: CardInstance[]): CardInstance {
    // get the best card based on 1) form and 2) condition
    let bestCard: CardInstance;
    const isRareHolo = this.expansions.value[cards[0].expansionName]
      .cards[cards[0].printNumber].rarity === 'rare-holo';

    cards.forEach(card => {
      if (!bestCard) { // add first card
        bestCard = card;
        return;
      }

      if (this.bestForm[card.form] < this.bestForm[bestCard.form]) { // get better form
        // catch case where holos are better than reverse rares
        if (isRareHolo && bestCard.form === 'standard' && card.form === 'reverse') {
          return;
        }

        // standrd cases
        bestCard = card;
        return;
      } else if (this.bestForm[card.form] === this.bestForm[bestCard.form]) { // same form
        //check condition
        if (this.bestCondition[card.condition] < this.bestCondition[bestCard.condition]) { // better condition
          bestCard = card;
        }
      }
    });

    return bestCard;
  }

  getExpansionNames(): string[] {
    const exp = this.expansions.value;
    return Object.keys(exp).sort((a,b) => 
    // lower gens higher
    exp[a].gen < exp[b].gen ? -1 : 
    exp[a].gen > exp[b].gen ? 1 :

    //same gen, check release order
    exp[a].release < exp[b].release ? -1 : 1
    );
  }

}
