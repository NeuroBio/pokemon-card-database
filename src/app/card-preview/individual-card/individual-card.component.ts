import { Component, Input, OnChanges } from '@angular/core';
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
    private collectionserv: CollectionService) { }

  ngOnChanges(): void {
    this.exp = this.collectionserv.expansions.value[this.instance.expansionName];
    this.cardType = this.exp ? this.exp.cards[this.instance.printNumber-1] : undefined;
  }

}
