import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { forkJoin, Observable, of } from 'rxjs';
import { finalize, switchMap, take } from 'rxjs/operators';
import { CardInstance, CardStorage } from '../_objects/card-instance';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(
    private af: AngularFirestore,
    private as: AngularFireStorage
    ) { }

  uploadCard(newCard:CardInstance, images: Blob[]): Observable<any> {
    // get card storage
    return this.af.doc<any>(`pokemon-cards/${newCard.expansionName}-${newCard.printNumber}`)
    .valueChanges().pipe(
      take(1),
      switchMap(cardBox => {

        // make cardstorage if none exists
        if (!cardBox) {
          cardBox = new CardStorage(newCard.expansionName, newCard.printNumber);
        } else {
          cardBox.cards = JSON.parse(cardBox.cards);  
        }


        // upload image if there are any to upload
        return forkJoin(images.map((image, i) => {
          if (image) {
            const path = `card-images/${newCard.uid}-${i == 0 ? 'front' : 'back'}`;
            return this.as.upload(path, image)
              .snapshotChanges().pipe(finalize(() => {})).toPromise()
              .then(() => {
                return this.as.ref(path).getDownloadURL().toPromise()
            }).then(url => {
              newCard[i == 0 ? 'front' : 'back'] = url
            });
          }
          return of ().toPromise();
        })).pipe(switchMap(() => {
          console.log('urls fetched and applied:', newCard)
          cardBox.cards[newCard.uid] = newCard;
          cardBox.cards = JSON.stringify(cardBox.cards);
          return this.af.collection<any>(`pokemon-cards`)
            .doc(`${newCard.expansionName}-${newCard.printNumber}`).set(Object.assign({}, cardBox));
        }) );
      }));
  }

  // editCard(editCard: CardInstance): Observable<void> {
  //   return this.af.doc<any>(`pokemon-cards/${editCard.expansionName}-${editCard.printNumber}`)
  //   .valueChanges().pipe(
  //     take(1),
  //     switchMap(cardBox => {
  //       cardBox.cards = JSON.parse(cardBox.cards);
  //       cardBox.cards[editCard.uid] = editCard;
  //       cardBox.cards = JSON.stringify(cardBox.cards);
  //       return this.af.collection<any>(`pokemon-cards`)
  //         .doc(`${editCard.expansionName}-${editCard.printNumber}`).set(Object.assign({}, cardBox));
  //     })
  //   );
  // }

  deleteCard(expansion: string, print: number, uid: string): Observable<any> {
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
              return this.af.collection<any>(`pokemon-cards`).doc(`${expansion}-${print}`).delete();
            } else {
              delete cardBox.cards[uid];
              cardBox.cards = JSON.stringify(cardBox.cards);
              return this.af.collection<any>(`pokemon-cards`)
                .doc(`${expansion}-${print}`).set(Object.assign({}, cardBox));
            }
          })
        )
      })
    );
  }
}
