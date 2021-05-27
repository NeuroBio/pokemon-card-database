import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Checklist } from '../_objects/checklist';

@Injectable({
  providedIn: 'root'
})
export class CheckListService {

  constructor(private af: AngularFirestore) { }

  uploadList(list: Checklist) {
    return this.af.collection<Checklist>('check-lists')
      .doc(`${list.name}`).set(Object.assign({}, list));
  }

  delete(listName: string) {
    return this.af.doc(`check-lists/${listName}`).delete();
  }

}
