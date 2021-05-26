import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CardChunk } from 'src/app/_objects/card-chunk';
import { CardInstance } from 'src/app/_objects/card-instance';
import { StaticData } from 'src/app/_objects/pokemon-list';

@Component({
  selector: 'app-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed',
      style({
        height: '0px',
        padding: '0px',
        color: 'transparent'
      })),
      // state('expanded', style({
      //   // height: '*',
      //   // padding: '*'
      // })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class CardTableComponent implements OnInit {

  cards = new MatTableDataSource<CardChunk>();
  displayColumns = [
    'DropDown', 'Dex' ,'Name', 'Expansion', 'Gen',
    'Release', 'Print', 'Copies'
  ];
  expanded: CardChunk;

  static = new StaticData();

  constructor() { }

  ngOnInit(): void {
    const carder = new CardChunk(this.static.Expansions['Base Set'].cards[0], 'Base Set', this.static.Expansions['Base Set'])
    carder.addCard(this.static.Cards[0]);
    carder.addCard(this.static.Cards[0]);
    const modified = Object.assign({}, this.static.Cards[0]);
    modified.condition = "NM";
    carder.addCard(modified);
    carder.addCard(this.static.Cards[1]);
    this.cards.data = [carder,
      new CardChunk(this.static.Expansions['Base Set'].cards[1], 'Base Set', this.static.Expansions['Base Set']),
      new CardChunk(this.static.Expansions['Base Set'].cards[1], 'Base Set', this.static.Expansions['Base Set'])
    ]

  }

  check(card: CardChunk) {
    return this.expanded === card ? 'expanded' : 'collapsed';
  }

}
