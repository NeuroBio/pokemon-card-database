import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ExpansionService {

  constructor(private af: AngularFirestore) { }

  addExpansion(newExpansion: any): Promise<boolean> {
    // TODO: test if this is truely unnecessary
    // Test Results: Yes, it is necessary.
    newExpansion.cards = JSON.stringify(newExpansion.cards);
    return this.af.collection<any>('expansions')
      .doc(`${newExpansion.name.split(' ').join('-')}`)
      .set(Object.assign({}, newExpansion))
      .then(() => true)
      .catch(err => {
        console.error(err);
        return false;
      });
  }
}
