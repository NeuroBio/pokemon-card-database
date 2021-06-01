import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, finalize, map, switchMap, take } from 'rxjs/operators';
import { CardInstance, CardStorage } from '../_objects/card-instance';
import { CollectionService } from './collection.service';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(
    private af: AngularFirestore,
    private as: AngularFireStorage,
    private collectionserv: CollectionService
    ) { }

  uploadCard(newCard:CardInstance, images: Blob[]): Observable<boolean> {
    let cardBox = this.collectionserv.allCards
      .value[`${newCard.expansionName}-${newCard.printNumber}`];

      console.log(cardBox);
    // make cardstorage if none exists
    if (!cardBox) {
      cardBox = new CardStorage(newCard.expansionName, newCard.printNumber);
    }

    // upload image if there are any to upload
    return forkJoin(images.map((image, i) => {
      if (image) {
        const path = `card-images/${newCard.uid}-${i == 0 ? 'front' : 'back'}`;
        return this.as.upload(path, image)
          .snapshotChanges().pipe(finalize(() => {})).toPromise()
          .then(() => {
            return this.as.ref(path).getDownloadURL().toPromise();
        }).then(url => {
          newCard[i == 0 ? 'front' : 'back'] = url;
        });
      }
      return of ().toPromise();
    }) ).pipe(
      switchMap(() => {
        cardBox.cards[newCard.uid] = newCard;
        cardBox.cards = JSON.stringify(cardBox.cards);
        return this.af.collection<any>(`pokemon-cards`)
          .doc(`${newCard.expansionName}-${newCard.printNumber}`)
          .set(Object.assign({}, cardBox)).then(() => true);
      }),
      catchError(() => of(false))
    );
  }

  deleteCard(expansion: string, print: number, uid: string): Observable<boolean> {
    return this.af.doc<any>(`pokemon-cards/${expansion}-${print}`)
    .valueChanges().pipe(
      take(1),
      switchMap(cardBox => {
        cardBox.cards = JSON.parse(cardBox.cards);
        return forkJoin([
          `card-images/${uid}-back`,
          `card-images/${uid}-front`
        ].map((url, i) => {
          if (cardBox.cards[uid][i == 0 ? 'front' : 'back']) {
            return this.as.ref(url).delete()
            .pipe(finalize(() => {})).toPromise();
          }
          return of().toPromise();
        })).pipe(
          switchMap(() => {
            if (Object.keys(cardBox.cards).length === 1) {
              return this.af.collection<any>(`pokemon-cards`)
                .doc(`${expansion}-${print}`).delete().then(() => true);
            } else {
              delete cardBox.cards[uid];
              cardBox.cards = JSON.stringify(cardBox.cards);
              return this.af.collection<any>(`pokemon-cards`)
                .doc(`${expansion}-${print}`).set(Object.assign({}, cardBox)).then(() => true);
            }
          })
        )
      }),
      catchError(() => of(false))
    );
  }
}
