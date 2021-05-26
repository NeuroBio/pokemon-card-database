import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { CardInstance } from '../_objects/card-instance';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private af: AngularFirestore) { }

  uploadCard(newCard:CardInstance): Promise<DocumentReference<CardInstance>> {
    return this.af.collection<CardInstance>('pokemon-cards').add(newCard);
  }

  editCard(newCard: CardInstance, key: string) {
    return this.af.collection<CardInstance>('pokemon-cards').doc(key).set(newCard);
  }

  getCards() {
    return this.af.collection<CardInstance>('pokemon-cards').valueChanges({ idField: 'key' });
  }
}
