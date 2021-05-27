import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { CardInstance, CardStorage } from '../_objects/card-instance';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private af: AngularFirestore) { }

  uploadCard(newCard:CardInstance): Observable<void> {
    return this.af.doc<CardStorage>(`pokemon-cards/${newCard.expansionName}-${newCard.printNumber}`)
    .valueChanges().pipe(
      take(1),
      switchMap(cardBox => {
        if (!cardBox) {
          cardBox = new CardStorage(newCard.expansionName, newCard.printNumber);
        }
        cardBox.cards[newCard.uid] = newCard;
        cardBox.cards = JSON.stringify(cardBox.cards);
        return this.af.collection<any>(`pokemon-cards`)
          .doc(`${newCard.expansionName}-${newCard.printNumber}`).set(Object.assign({}, cardBox));
      })
    );
  }

  editCard(editCard: CardInstance): Observable<void> {
    return this.af.doc<any>(`pokemon-cards/${editCard.expansionName}-${editCard.printNumber}`)
    .valueChanges().pipe(
      take(1),
      switchMap(cardBox => {
        cardBox.cards = JSON.parse(cardBox.cards);
        cardBox.cards[editCard.uid] = editCard;
        cardBox.cards = JSON.stringify(cardBox.cards);
        return this.af.collection<any>(`pokemon-cards`)
          .doc(`${editCard.expansionName}-${editCard.printNumber}`).set(Object.assign({}, cardBox));
      })
    );
  }

  deleteCard(expansion: string, print: number, uid: string): Observable<void> {
    return this.af.doc<any>(`pokemon-cards/${expansion}-${print}`)
    .valueChanges().pipe(
      take(1),
      switchMap(cardBox => {
        cardBox.cards = JSON.parse(cardBox.cards);
        delete cardBox.cards[uid];
        cardBox.cards = JSON.stringify(cardBox.cards);
        return this.af.collection<any>(`pokemon-cards`)
          .doc(`${expansion}-${print}`).set(Object.assign({}, cardBox));
      })
    );
  }

}
