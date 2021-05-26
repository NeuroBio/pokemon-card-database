import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
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
        cardBox.cards.push(newCard);
        return this.af.collection<CardStorage>(`pokemon-cards`)
          .doc(`${newCard.expansionName}-${newCard.printNumber}`).set(Object.assign({}, cardBox));
      })
    );
  }

  editCard(editCard: CardInstance): Observable<void> {
    return this.af.doc<CardStorage>(`pokemon-cards/${editCard.expansionName}-${editCard.printNumber}`)
    .valueChanges().pipe(
      take(1),
      switchMap(cardBox => {
        const editIndex = cardBox.cards.findIndex(card => card.uid = editCard.uid);
        cardBox.cards[editIndex] = editCard;
        return this.af.collection<CardStorage>(`pokemon-cards`)
          .doc(`${editCard.expansionName}-${editCard.printNumber}`).set(Object.assign({}, cardBox));
      })
    );
  }

  deleteCard(expansion: string, print: number, uid: string): Observable<void> {
    return this.af.doc<CardStorage>(`pokemon-cards/${expansion}-${print}`)
    .valueChanges().pipe(
      take(1),
      switchMap(cardBox => {
        const editIndex = cardBox.cards.findIndex(card => card.uid = uid);
        cardBox.cards.splice(editIndex, 1);
        return this.af.collection<CardStorage>(`pokemon-cards`)
          .doc(`${expansion}-${print}`).set(Object.assign({}, cardBox));
      })
    );
  }

  getCards() {
    return this.af.collection('pokemon-cards').valueChanges();
  }
}
