import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CheckInfo, Checklist } from '../_objects/checklist';

@Injectable({
  providedIn: 'root'
})
export class CheckListService {

  constructor(private af: AngularFirestore) { }

  uploadList(list: Checklist): Promise<void> {
    return this.af.collection<Checklist>('check-lists')
      .doc(`${list.name}`).set(Object.assign({}, list));
  }

  delete(listName: string): Promise<void> {
    return this.af.doc(`check-lists/${listName}`).delete();
  }

  changeCard(newCheckInfo: CheckInfo, listName: string, index: number): Observable<void> {
    return this.af.collection<any>('check-lists').doc(`${listName}`)
    .valueChanges().pipe(
      switchMap(list => {
        list.checkInfo = JSON.parse(list.checkInfo);
        list.checkInfo[index] = newCheckInfo;
        list.checkInfo = JSON.stringify(list.checkInfo);
        return this.af.collection('check-lists').doc(`${listName}`).set(Object.assign({}, list));
      })
    );
  }

}
