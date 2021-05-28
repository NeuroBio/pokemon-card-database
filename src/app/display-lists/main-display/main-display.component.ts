import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CardChunk } from 'src/app/_objects/card-chunk';
import { CollectionService } from 'src/app/_services/collection.service';

@Component({
  selector: 'app-main-display',
  templateUrl: './main-display.component.html',
  styleUrls: ['./main-display.component.scss']
})
export class MainDisplayComponent implements OnInit, OnDestroy {

  cardSubscription: Subscription;

  checklists: string[];
  activeList: CardChunk[];

  whichList: FormControl;
  listSubscription: Subscription;
  activeListSubscription: Subscription;

  allowEdit = true// false;

  constructor(
    private fb: FormBuilder,
    private collectionserv: CollectionService
    ) { }

  ngOnInit(): void {
    // control active list
    this.collectionserv.getMaster();
    this.whichList = this.fb.control('test')// 'Masterlist');

    this.cardSubscription = this.collectionserv.allCards
      .subscribe(() => this.getList());

    this.listSubscription = this.collectionserv.checkLists
      .subscribe(lists => {
        this.checklists = lists.map(list => list.name)
        this.checklists.splice(0, 0, 'Masterlist')
    });

    this.activeListSubscription = this.whichList.valueChanges
      .subscribe(() => this.getList());
  }

  ngOnDestroy() {
    this.cardSubscription.unsubscribe();
    this.listSubscription.unsubscribe();
    this.activeListSubscription.unsubscribe();
  }

  lockSwitch() {
    this.allowEdit = !this.allowEdit;
  }

  getList() {
    if (this.whichList.value === 'Masterlist') {
      this.activeList = this.collectionserv.getMaster();
    } else {
      this.activeList = this.collectionserv.getCheckList(this.whichList.value);
    }
  }

}
