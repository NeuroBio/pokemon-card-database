import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CardChunk } from 'src/app/_objects/card-chunk';
import { CardInstance } from 'src/app/_objects/card-instance';
import { StaticData } from 'src/app/_objects/pokemon-list';

@Component({
  selector: 'app-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.scss']
})
export class CardTableComponent implements OnInit {

  cards = new MatTableDataSource<CardChunk>();
  displayColumns = [
    'DropDown', 'Dex' ,'Name', 'Expansion', 'Gen',
    'Release', 'Print', 'Copies'
  ];
  static = new StaticData();

  constructor() { }

  ngOnInit(): void {
    const carder = new CardChunk(this.static.Expansions['Base Set'].cards[0], 'Base Set', this.static.Expansions['Base Set'])
    carder.addCard(this.static.Cards[0]);
    carder.addCard(this.static.Cards[0]);
    this.cards.data = [carder];
  }

}
