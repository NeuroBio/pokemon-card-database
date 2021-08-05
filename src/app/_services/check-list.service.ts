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

  uploadList(list: any, oldListName?: string): Promise<boolean> {
    list.checkInfo = JSON.stringify(list.checkInfo);
    list.lastUpdated = +Date.now();
    return this.af.collection<any>('check-lists')
      .doc(`${list.name}`).set(Object.assign({}, list))
      .then(() => true)
      .catch(err => {
        console.error(err);
        return false;
    }).then(res => new Promise((resolve) => {
      if (!res) {
        resolve(false);
      }
      if (!oldListName || list.name === oldListName) {
        resolve(true);
      } else { // if list name changed, set old list for destruction
        return this.deleteList(oldListName);
      }
    }));
  }

  deleteList(listName: any): Promise<boolean> {
    const list = this.collectionserv.getRawCheckList(listName);
    list.lastUpdated = +Date.now();
    list.deleted = +Date.now();
    return this.af.collection<any>('check-lists')
    .doc(`${list.name}`).set(Object.assign({}, list))
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
      list.checkInfo[index] = '';
    }

    list.checkInfo = JSON.stringify(list.checkInfo);
    list.lastUpdated = +Date.now();
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
