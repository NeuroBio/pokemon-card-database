import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CheckListService {

  constructor(private af: AngularFirestore) { }

  uploadList(list: any) {
    return this.af.collection<any>('check-lists').doc(list.name).set(list);
  }

  delete(listName: string) {
    return this.af.doc(`check-lists/${listName}`).delete();
  }

}
