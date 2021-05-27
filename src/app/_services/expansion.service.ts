import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ExpansionService {

  constructor(private af: AngularFirestore) { }

  addExpansion(newExpansion: any) {
    newExpansion.cards = JSON.stringify(newExpansion.cards); 
    return this.af.collection<any>('expansions')
      .doc(`${newExpansion.name.split(' ').join('-')}`)
      .set(Object.assign({}, newExpansion));
  }
}
