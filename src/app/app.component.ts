import { Component, OnInit } from '@angular/core';
import { StaticData } from './_objects/pokemon-list';
import { CardInstance } from './_objects/card-instance';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  static = new StaticData();
  cardTypes: string[];
  cardList: {};

  ngOnInit() {
    this.cardList = this.buildCardList(this.static.Cards)
    this.cardTypes = Object.keys(this.cardList);
  }

  buildCardList(cards: CardInstance[]) {
    const list = {};
    cards.forEach(card => {
      if (!list[`${card.expansionName}-${card.printNumber}`]) {
        list[`${card.expansionName}-${card.printNumber}`] = []
      }
      list[`${card.expansionName}-${card.printNumber}`].push(card);
    });
    return list;
  }
}
