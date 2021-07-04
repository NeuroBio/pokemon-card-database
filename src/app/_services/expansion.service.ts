import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CollectionService } from './collection.service';

@Injectable({
  providedIn: 'root'
})
export class ExpansionService {

  constructor(
    private af: AngularFirestore,
    private collectionserv: CollectionService) { }

  addExpansion(newExpansion: any): Promise<boolean> {
    const genNum = newExpansion.generation
    let gen = this.collectionserv.generations.value[genNum];
    if (gen === undefined) {
      gen = {};
    }
    // remove custom card object, convert to standard oject
    newExpansion.cards = newExpansion.cards.map(card => Object.assign({}, card));
    gen.data[newExpansion.name] = newExpansion;
    gen.lastUpdated = +Date.now();

    return this.af.collection<any>('expansions').doc(`Gen-${genNum}`).set(gen)
      .then(() => true)
      .catch(err => {
        console.error(err);
        return false;
    });
  }

  deleteExpansion(expName: string, genNum: number): Promise<boolean> {
    const gen = this.collectionserv.generations.value[genNum];
    delete gen.data[expName];
    gen.lastUpdated = +Date.now();
    return this.af.collection<any>('expansions').doc(`Gen-${genNum}`)
      .set(Object.assign({}, gen))
      .then(() => true)
      .catch(err => {
        console.error(err);
        return false;
    });
  }
}
