import { Component, Input, OnChanges } from '@angular/core';
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
export class IndividualCardComponent implements OnChanges {

  @Input() instance: CardInstance = new CardInstance(0, 'False Hoods', 'Spectacular', 'M', []);
  @Input() allowEdit: boolean = false;
  @Input() showAll: boolean = false;
  @Input() creating: boolean = false;

  exp: SetExpansion;
  cardType: Card;

  constructor(
    private collectionserv: CollectionService,
    private dialog: MatDialog) { }

  ngOnChanges(): void {
    this.exp = this.collectionserv.expansions.value[this.instance.expansionName];
    this.cardType = this.exp ? this.exp.cards[this.instance.printNumber-1] : undefined;
  }

  edit(): void {
    this.dialog.open(AddCardComponent, {
      width: '80vw',
      maxWidth: '1050px',
      data: this.instance
    });
  }

}
