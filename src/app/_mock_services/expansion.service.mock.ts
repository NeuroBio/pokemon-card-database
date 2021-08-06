import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExpansionServiceMock {

  constructor() { }

  addExpansion(newExpansion: any): Promise<boolean> {
    return new Promise(resolve => resolve(true));
  }

  deleteExpansion(expName: string, genNum: number): Promise<boolean> {
    return new Promise(resolve => resolve(true));
  }
}
