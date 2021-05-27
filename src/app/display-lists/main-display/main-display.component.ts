import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CardChunk } from 'src/app/_objects/card-chunk';
import { CardStorage } from 'src/app/_objects/card-instance';
import { CollectionService } from 'src/app/_services/collection.service';

@Component({
  selector: 'app-main-display',
  templateUrl: './main-display.component.html',
  styleUrls: ['./main-display.component.scss']
})
export class MainDisplayComponent implements OnInit, OnDestroy {

  cardSubscription: Subscription;

  cardLists = ['Master List', 'Checklist'];
  activeList: CardChunk[];
  activeListName = 'Master List';

  whichList: FormControl;
  listSubscription: Subscription;

  allowEdit = false;

  constructor(
    private fb: FormBuilder,
    private collectionserv: CollectionService
    ) { }

  ngOnInit(): void {
    this.cardSubscription = this.collectionserv.allCards
      .subscribe(() => this.getList());
    
    this.whichList = this.fb.control('Master List');
    this.listSubscription = this.whichList.valueChanges
      .subscribe(list => this.activeList = list);
  }

  ngOnDestroy() {
    this.cardSubscription.unsubscribe();
    this.listSubscription.unsubscribe();
  }

  lockSwitch() {
    this.allowEdit = !this.allowEdit;
  }

  getList() {
    console.log('called')
    switch(this.activeListName) {
      case 'Master List':
        this.activeList = this.collectionserv.getMaster();
      break;
    }
  }

}
