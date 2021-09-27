import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { CollectionService } from 'src/app/_services/collection.service';
import { MessengerService } from 'src/app/_services/messenger.service';

@Injectable({
  providedIn: 'root'
})
export class ListResolver implements Resolve<string> {

  constructor(
    private collectionserv: CollectionService,
    private router: Router,
    private messenger: MessengerService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
    const listname = route.paramMap.get('ChecklistID');
    let list: boolean;

    if (listname === 'Masterlist') {
      return of ('Masterlist');
    } else {
      list = this.collectionserv.checkListExists(listname);
      if (list) {
        return of (listname);
      } else {
        this.router.navigate(['Masterlist']);
        this.messenger.send(`List ${listname} was not found.`);
        return of (null);  
      }
    }
  }
}
