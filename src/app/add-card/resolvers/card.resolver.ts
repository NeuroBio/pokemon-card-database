import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { CardInstance } from 'src/app/_objects/card-instance';
import { CollectionService } from 'src/app/_services/collection.service';
import { MessengerService } from 'src/app/_services/messenger.service';

@Injectable({
  providedIn: 'root'
})
export class CardResolver implements Resolve<CardInstance> {

  constructor(
    private collectionserv: CollectionService,
    private router: Router,
    private messenger: MessengerService
    ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CardInstance> {
    const cardInfo = route.paramMap.get('CardID').split('_');
    const card = this.collectionserv.getCard(cardInfo[0], cardInfo[1]);
    if (card) {
      return of(card);
    }
    this.router.navigate(['checklist']);
    this.messenger.send(`Request card was not found.`)
    return of (null);
  }
}
