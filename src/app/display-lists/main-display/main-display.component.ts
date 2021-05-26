import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AddCardComponent } from 'src/app/add-card/add-card/add-card.component';
import { CardChunk } from 'src/app/_objects/card-chunk';
import { CardInstance, CardStorage } from 'src/app/_objects/card-instance';
import { CardService } from 'src/app/_services/card.service';
import { tap } from 'rxjs/operators';
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

  constructor(
    private fb: FormBuilder,
    private collectionserv: CollectionService,
    private dialog: MatDialog
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

  addCard() {
    this.dialog.open(AddCardComponent, {
      width: '80vw'
    });
  }

}
