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
    const exps = this.collectionserv.expansions.value;
    exps[newExpansion.name] = newExpansion;
    const expData = { 
      data: JSON.stringify(exps),
      lastUpdated: +Date.now()
    }
    return this.af.collection<any>('expansions').doc('expansions').set(expData)
      .then(() => true)
      .catch(err => {
        console.error(err);
        return false;
      });
  }
}
