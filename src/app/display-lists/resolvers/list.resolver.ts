import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { CardChunk } from 'src/app/_objects/card-chunk';
import { CollectionService } from 'src/app/_services/collection.service';
import { MessengerService } from 'src/app/_services/messenger.service';

@Injectable({
  providedIn: 'root'
})
export class ListResolver implements Resolve<CardChunk[]> {

  constructor(
    private collectionserv: CollectionService,
    private router: Router,
    private messenger: MessengerService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CardChunk[]> {
    const listname = route.paramMap.get('ChecklistID');
    let list: CardChunk[];

    if (listname === 'Masterlist') {
      list = this.collectionserv.getMaster();
    } else {
      list = this.collectionserv.getCheckList(listname);
    }

    if (list) {
      return of (list);
    }
    this.router.navigate(['Masterlist']);
    this.messenger.send(`List ${listname} was not found.`);
    return of (null);
  }
}
