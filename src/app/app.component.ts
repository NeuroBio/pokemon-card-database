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
  sets: string[];
  cardList: CardInstance[];

  ngOnInit() {
    this.sets = Object.keys(this.static.Expansions);
    this.buildCardList(this.static.Cards)
  }

  buildCardList(cards: CardInstance[]) {

  }
}
