import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Checklist } from 'src/app/_objects/checklist';
import { CollectionService } from 'src/app/_services/collection.service';
import { MessengerService } from 'src/app/_services/messenger.service';

@Injectable({
  providedIn: 'root'
})

export class ChecklistResolver implements Resolve<Checklist> {

  constructor(
    private collectionserv: CollectionService,
    private router: Router,
    private messenger: MessengerService
    ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Checklist> {
    const listname = route.paramMap.get('ChecklistID');
    const list = this.collectionserv.getRawCheckList(listname);
    if (list) {
      return of (list);
    }
    this.router.navigate(['checklist']);
    this.messenger.send(`Checkist ${listname} was not found.`)
    return of (null);
  }
}
