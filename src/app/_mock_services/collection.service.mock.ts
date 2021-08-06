import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MockCardChunk } from '../_mock_objects/card-chunk.mock';
import { MockCardInstance, MockPopulation } from '../_mock_objects/card-instance.mock';
import { MockChecklist } from '../_mock_objects/check-list.mock';
import { MockSetExpansion } from '../_mock_objects/expansion.mock';

import { CardChunk } from '../_objects/card-chunk';
import { CardInstance, Population } from '../_objects/card-instance';
import { Checklist } from '../_objects/checklist';

@Injectable({
  providedIn: 'root'
})
export class CollectionServiceMock {

  allCards = new BehaviorSubject<any>(undefined);
  generations = new BehaviorSubject<any>(undefined);
  expansions = new BehaviorSubject<any>(undefined);
  checkLists = new BehaviorSubject<any[]>(undefined);
  masterList = new BehaviorSubject<CardChunk[]>(undefined);
  populationCount = new BehaviorSubject<Population>(undefined);

  activeList = 'Masterlist';
  allowEdit = false;

  private cardInstanceMock = new MockCardInstance();
  private cardChunkMock = new MockCardChunk();
  private expansionMock = new MockSetExpansion();
  private populationmock = new MockPopulation();
  private checklistMock = new MockChecklist();

  constructor() { 
    this.allCards.next(this.cardInstanceMock.mockAllCards());
    this.expansions.next({'Base Set': this.expansionMock.mock(10)});
    this.generations.next(this.expansionMock.mockUpload([1], [[this.expansions.value['Base Set']]]));
    this.checkLists.next([this.checklistMock.mock()]);
    this.masterList.next([this.cardChunkMock.mock(this.expansions.value['Base Set'])]);
    this.populationCount.next(this.populationmock.mock());
  }

  getMaster(): CardChunk[] {
    return this.masterList.value;
  }

  getRawCheckList(listName: string): Checklist {
    try {
      const list = Object.assign({}, this.checkLists.value.find(li => li.name === listName));
      list.checkInfo = JSON.parse(list.checkInfo);
      return list as Checklist;
    } catch {
      // list does not exist
      return;
    }
  }

  getChecklistDisplay(listName: string): number {
    const list = this.getRawCheckList(listName);
    if (list && list.startOn) {
      return list.startOn;
    } else {
      return 1;
    }
  }

  getCheckList(listName: string): CardChunk[] {
    return [];
  }

  getActiveCard(exp: string, print: number): any {
    return {};
  }

  getChunk(key: string): CardInstance[] {
    return [this.cardInstanceMock.mock(0)];
  }

  getCard(key: string, uid: string): CardInstance {
    return this.cardInstanceMock.mock(0);
  }

  getBestCard(cards: CardInstance[]): CardInstance {
    return this.cardInstanceMock.mock(0);
  }

  getExpansionNames(): string[] {
    return ['Test'];
  }

}
