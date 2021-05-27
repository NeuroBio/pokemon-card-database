import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { map, skip, take, tap } from 'rxjs/operators';
import { CardChunk } from '../_objects/card-chunk';
import { CardStorage } from '../_objects/card-instance';
import { SetExpansion } from '../_objects/expansion';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  allCards = new BehaviorSubject<CardStorage[]>([]);
  expansions = new BehaviorSubject<Object>([]);
  checkLists = new BehaviorSubject<any>(undefined);

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

  private getCheckLists(): Observable<any> {
    return this.af.collection<any>('check-lists').valueChanges()
      .pipe(tap(lists => this.checkLists.next(lists)));
  }

  getMaster(): CardChunk[] {
    return this.convertToCardChunks(this.allCards.value);
  }

  private convertToCardChunks(cards: any[]): CardChunk[] {
    const cardChunks: CardChunk[] = [];
    cards.forEach(card => {     
      cardChunks.push(new CardChunk(
        card.printNumber,
        this.expansions.value[card.expansionName])
      );
      const rawCards = JSON.parse(card.cards);
      Object.keys(rawCards).forEach(uid =>
        cardChunks[cardChunks.length-1].owned.push(rawCards[uid]))
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
