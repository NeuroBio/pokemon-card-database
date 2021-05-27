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

  constructor(private af: AngularFirestore) { 
    this.getCards().pipe(skip(1)).subscribe();
    this.getExpansions().pipe(skip(1)).subscribe();
  }

  load() {
    return new Promise((resolve) => {
      forkJoin([this.getCards().pipe(take(1)), this.getExpansions().pipe(take(1))])
        .subscribe(x => resolve(true))
    });
  }

  getCards(): Observable<CardStorage[]> {
    return this.af.collection<CardStorage>('pokemon-cards').valueChanges()
      .pipe(tap(cards => this.allCards.next(cards)));
  }

  getExpansions(): Observable<Object> {
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
        tap(expansions => this.expansions.next(expansions)));
  }

  getMaster(): CardChunk[] {
    return this.convertToCardChunks(this.allCards.value);
  }

  convertToCardChunks(cards: CardStorage[]): CardChunk[] {
    const cardChunks: CardChunk[] = [];
    cards.forEach(card => {     
      cardChunks.push(new CardChunk(
        card.printNumber,
        this.expansions.value[card.expansionName])
      );
      cardChunks[cardChunks.length-1].owned = card.cards;
    });

    return cardChunks;
  }

  addExpansion(newExpansion: any) {
    newExpansion.cards = JSON.stringify(newExpansion.cards); 
    return this.af.collection<any>('expansions')
      .doc(`${newExpansion.name.split(' ').join('-')}`)
      .set(Object.assign({}, newExpansion));
  }

}
