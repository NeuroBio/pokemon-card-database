import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { CardInstance } from '../_objects/card-instance';

@Injectable({
  providedIn: 'root'
})
export class AddCardService {

  constructor(private af: AngularFirestore) { }

  uploadCard(newCard:CardInstance): Promise<DocumentReference<CardInstance>> {
    return this.af.collection<CardInstance>('pokemon-cards').add(newCard);
  }
}
