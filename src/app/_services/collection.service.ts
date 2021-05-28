import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { map, skip, take, tap } from 'rxjs/operators';
import { CardChunk } from '../_objects/card-chunk';
import { CardStorage } from '../_objects/card-instance';
import { Checklist } from '../_objects/checklist';
import { SetExpansion } from '../_objects/expansion';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  allCards = new BehaviorSubject<CardStorage[]>([]);
  masterList = new BehaviorSubject<CardChunk[]>([]);
  expansions = new BehaviorSubject<Object>([]);
  checkLists = new BehaviorSubject<Checklist[]>(undefined);

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

  private getCards(): Observable<CardStorage[]> {
    return this.af.collection<CardStorage>('pokemon-cards').valueChanges()
      .pipe(tap(cards => this.allCards.next(cards)));
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

  getMaster(unchanged: boolean): CardChunk[] {
    if (unchanged) {
      return this.masterList.value;
    }

    const cards: any[] = this.allCards.value;
    const cardChunks: CardChunk[] = [];
    // loop through all cards
    cards.forEach(card => {

      // create card chunk based on print/expansion
      cardChunks.push(new CardChunk(
        card.printNumber,
        this.expansions.value[card.expansionName])
      );

      // load in the desired cards
      const rawCards = JSON.parse(card.cards);
      Object.keys(rawCards).forEach(uid =>
        cardChunks[cardChunks.length-1].owned.push(rawCards[uid]))
    });

    this.masterList.next(cardChunks);
    return cardChunks;
  }

  getCheckList(listName: string): CardChunk[] {
    const list = this.checkLists.value.find(list => list.name === listName);
    const cardChunks: CardChunk[] = [];
    const cards: any = this.allCards.value;
    const expansions = this.expansions.value;

    // for each card in a list
    list.cardKeys.forEach((key, i) => {
      const keyParts = key.split('-')

      // get the card type to start the cardchunk
      const newChunk = new CardChunk(+keyParts[1], expansions[keyParts[0]], list.checkInfo[i])

      // if there is a card instance, get it and load it into the new chard chunk
      if (list.checkInfo[i].uid) {
        const cardType = cards[list.checkInfo[i].key];
        newChunk.owned.push(JSON.parse(cardType.cards)[list.checkInfo[i].uid]);
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

}
