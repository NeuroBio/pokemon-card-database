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

  constructor() {

  }

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

  // getConditionCount(cards: CardInstance[]) {
  //   const conditions = {'M': 0,'NM': 0, 'LP': 0, 'MP': 0, 'HP': 0};
  //   let finalString: string;

  //   cards.forEach(card => {
  //     conditions[card.condition] != 0;
  //   });

  //   Object.keys(conditions).forEach(key => {
  //     if (conditions[key] > 0) {

  //     }
  //   })
  // }


}
