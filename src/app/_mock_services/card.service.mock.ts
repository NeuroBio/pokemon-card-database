import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CardInstance } from '../_objects/card-instance';

@Injectable({
  providedIn: 'root'
})
export class CardServiceMock {

  constructor() { }

    uploadCard(newCard: CardInstance, images: Blob[]): Observable<boolean> {
        return of(true);
    }

    deleteCard(expansion: string, print: number, uid: string): Observable<boolean> {
        return of(true);
    }
}
