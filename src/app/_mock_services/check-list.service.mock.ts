import { Injectable } from '@angular/core';
import { CheckInfo } from '../_objects/checklist';

@Injectable({
  providedIn: 'root'
})
export class CheckListServiceMock {

  constructor() { }

  uploadList(list: any, oldListName?: string): Promise<boolean> {
    return new Promise(resolve => resolve(true));
  }

  deleteList(listName: any): Promise<boolean> {
    return new Promise(resolve => resolve(true));
  }

  changeCard(newCheckInfo: CheckInfo, listName: string, index: number): Promise<boolean> {
    return new Promise(resolve => resolve(true));
  }

  updateList(listName: string): Promise<boolean> {
    return new Promise(resolve => resolve(true));
  }

}
