import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { skip, take, tap } from 'rxjs/operators';
import { CardChunk } from '../_objects/card-chunk';
import { CardStorage } from '../_objects/card-instance';
import { SetExpansion } from '../_objects/expansion';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  allCards = new BehaviorSubject<CardStorage[]>([]);
  expansions = new BehaviorSubject<SetExpansion[]>([]);

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

  getExpansions(): Observable<SetExpansion[]> {
    return this.af.collection<SetExpansion>('expansions').valueChanges()
      .pipe(tap(expansions => this.expansions.next(expansions)));
  }

  getMaster(): CardChunk[] {
    return [] // this.convertToCardChunks(this.allCards.value);
  }

  convertToCardChunks(cards: CardStorage[]): CardChunk[] {
    const cardChunks: CardChunk[] = [];

    cards.forEach(card => {
      cardChunks.push(new CardChunk(
        card.printNumber,
        card.expansionName,
        this.expansions.value[card.expansionName]));
      cardChunks[-1].owned = card.cards;
    });

    return cardChunks;
  }

  addExpansion(newExpansion: SetExpansion) {
    return this.af.collection<SetExpansion>('expansions')
      .doc(`${newExpansion.name}`)
      .set(Object.assign({}, newExpansion));
  }

}
