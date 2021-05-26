import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CardChunk } from 'src/app/_objects/card-chunk';
import { CardInstance } from 'src/app/_objects/card-instance';
import { CardService } from 'src/app/_services/card.service';

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
    private cardserv: CardService
    ) { }

  ngOnInit(): void {
    this.cardSubscription = this.cardserv.getCards()
      .subscribe(cards => {
        this.allCards = cards;
        
      });

    this.whichList = this.fb.control('Master List');
    this.listSubscription = this.whichList.valueChanges
      .subscribe(list => console.log('swap'));
  }

  ngOnDestroy() {
    this.listSubscription.unsubscribe();
  }

}
