import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CheckInfo } from '../_objects/checklist';
import { CollectionService } from './collection.service';

@Injectable({
  providedIn: 'root'
})
export class CheckListService {

  constructor(
    private af: AngularFirestore,
    private collectionserv: CollectionService
    ) { }

  uploadList(list: any): Promise<boolean> {
    list.checkInfo = JSON.stringify(list.checkInfo);
    return this.af.collection<any>('check-lists')
      .doc(`${list.name}`).set(Object.assign({}, list))
      .then(() => true)
      .catch(err => {
        console.error(err);
        return false;
    });
  }

  deleteList(listName: string): Promise<boolean> {
    return this.af.doc(`check-lists/${listName}`).delete()
      .then(() => true)
      .catch(err => {
        console.error(err);
        return false;
      });
  }

  changeCard(newCheckInfo: CheckInfo, listName: string, index: number): Promise<boolean> {
    const list: any = this.collectionserv.getRawCheckList(listName);
    if (newCheckInfo) {
      list.checkInfo[index] = newCheckInfo;
    } else {
      list.checkInfo[index] = "";
    }

    list.checkInfo = JSON.stringify(list.checkInfo);
    return this.af.collection('check-lists').doc(`${listName}`)
      .set(Object.assign({}, list)).then(() => true)
      .catch(err => {
        console.error(err);
        return false;
      });
  }

  updateList(listName: string): Promise<boolean> {
    const list = this.collectionserv.getRawCheckList(listName);
    list.checkInfo = list.checkInfo.map((info, i) => {
      if (!info) {
        const key = list.cardKeys[i];
        const checkChunk = this.collectionserv.getChunk(key);
        if (checkChunk) {
          const best = this.collectionserv.getBestCard(checkChunk);
          if (best) {
            return new CheckInfo(false, best.uid, key);
          }
        }
      }
      return info;
    });
    return this.uploadList(list);
  }

}
