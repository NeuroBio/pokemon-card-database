import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { CheckInfo } from '../_objects/checklist';

@Injectable({
  providedIn: 'root'
})
export class CheckListService {

  constructor(private af: AngularFirestore) { }

  uploadList(list: any): Promise<boolean> {
    list.checkInfo = JSON.stringify(list.checkInfo);
    return this.af.collection<any>('check-lists')
      .doc(`${list.name}`).set(Object.assign({}, list))
      .then(() => true).catch(() => false);
  }

  deleteList(listName: string): Promise<boolean> {
    return this.af.doc(`check-lists/${listName}`).delete()
      .then(() => true).catch(() => false);
  }

  changeCard(newCheckInfo: CheckInfo, listName: string, index: number): Observable<boolean> {
    return this.af.collection<any>('check-lists').doc(`${listName}`)
    .valueChanges().pipe(
      switchMap(list => {
        list.checkInfo = JSON.parse(list.checkInfo);
        list.checkInfo[index] = newCheckInfo;
        list.checkInfo = JSON.stringify(list.checkInfo);
        return this.af.collection('check-lists').doc(`${listName}`)
          .set(Object.assign({}, list)).then(() => true);
      }),
      catchError(() => of(false))
    );
  }

}
