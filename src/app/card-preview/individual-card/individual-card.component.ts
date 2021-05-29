import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddCardComponent } from 'src/app/add-card/add-card/add-card.component';
import { CardInstance } from 'src/app/_objects/card-instance';
import { Card, SetExpansion } from 'src/app/_objects/expansion';
import { CollectionService } from 'src/app/_services/collection.service';

@Component({
  selector: 'app-individual-card',
  templateUrl: './individual-card.component.html',
  styleUrls: ['./individual-card.component.scss']
})
export class IndividualCardComponent implements OnInit {

  @Input() instance: CardInstance = new CardInstance(0, 'False Hoods', 'Spectacular', 'M', []);
  @Input() allowEdit: boolean = false;
  @Input() mainKey: string = '';

  exp: SetExpansion;
  cardType: Card;


  constructor(
    private collectionserv: CollectionService,
    private dialog: MatDialog) { }

  ngOnInit(): void { 
    this.exp = this.collectionserv.expansions.value[this.instance.expansionName];
    this.cardType = this.exp.cards[this.instance.printNumber-1];
  }

  isPlaceholder() {
    const cardKey = `${this.instance.expansionName}-${this.instance.printNumber}`;
    if (this.mainKey && this.mainKey !== cardKey) {
      return true;
    }
    return false;
  }

  edit(): void {
    this.dialog.open(AddCardComponent, {
      width: '80vw',
      maxWidth: '650px',
      data: this.instance
    });
  }

}
