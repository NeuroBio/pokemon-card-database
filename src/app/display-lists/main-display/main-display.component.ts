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

  allCards: CardStorage[];
  cardSubscription: Subscription;
  masterList: CardChunk[];

  cardLists = ['Master List', 'Checklist'];
  whichList: FormControl;
  listSubscription: Subscription;

  allowEdit = false;

  constructor(
    private fb: FormBuilder,
    private collectionserv: CollectionService
    ) { }

  ngOnInit(): void {
    this.masterList = this.collectionserv.getMaster()
    this.whichList = this.fb.control('Master List');
    this.listSubscription = this.whichList.valueChanges
      .subscribe(list => console.log('swap'));
  }

  ngOnDestroy() {
    this.listSubscription.unsubscribe();
  }

  lockSwitch() {
    this.allowEdit = !this.allowEdit;
  }

}
