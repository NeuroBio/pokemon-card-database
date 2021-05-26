import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AddCardComponent } from 'src/app/add-card/add-card/add-card.component';
import { CardChunk } from 'src/app/_objects/card-chunk';
import { CardInstance } from 'src/app/_objects/card-instance';
import { CardService } from 'src/app/_services/card.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-main-display',
  templateUrl: './main-display.component.html',
  styleUrls: ['./main-display.component.scss']
})
export class MainDisplayComponent implements OnInit, OnDestroy {

  allCards: CardInstance[];
  cardSubscription: Subscription;
  masterList: CardChunk[];

  cardLists = ['Master List', 'Checklist'];
  whichList: FormControl;
  listSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private cardserv: CardService,
    private dialog: MatDialog
    ) { }

  ngOnInit(): void {
    // this.cardSubscription =
    this.cardserv.getCards().subscribe(x => {
      console.log('done')
      console.log(x)
    })
    // .pipe(tap(data => {
    //   console.log('returned')
    //   console.log(data)
    // }))
      // .subscribe(cards => {
      //   // this.allCards = cards;

      // });

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
