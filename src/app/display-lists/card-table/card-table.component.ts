import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { CardChunk } from 'src/app/_objects/card-chunk';
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

  filterForm: FormGroup;
  filterSubscription: Subscription;

  static = new StaticData();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    // NONSENSE
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
    ];

    // legit
    this.filterForm = this.createFilterForm();
    this.filterSubscription = this.filterForm.valueChanges
      .subscribe(value => this.cards.filter = JSON.stringify(value));
    this.cards.filterPredicate = this.customFilterPredicate();

  }


  // Sorting functions

  sortData(sort: Sort) {
    const data = this.cards.data.slice();
    if (!sort.active || sort.direction === '') {
      return;
    }

    this.cards.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'Dex': return this.compare(a.dexNumber, b.dexNumber, isAsc);
        case 'Name': return this.compare(a.cardTitle, b.cardTitle, isAsc);
        case 'Gen': return this.compare(a.generation, b.generation, isAsc);
        case 'Expansion': return this.compare(a.expansionName, b.expansionName, isAsc);
        case 'Release': return this.compare(a.release, b.release, isAsc);
        case 'Print': return this.compare(a.printNumber, b.printNumber, isAsc);
        case 'Copies': return this.compare(a.owned.length, b.owned.length, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  // Filter functions
  createFilterForm(): FormGroup {
    return this.fb.group({
      dex: '', //
      title: '', //
      expansion: '', //
      gen: '', //
      release: '', //
      print: '', //
      copies: ''
    });
  }

  clearFilter(): void {
    this.filterForm.reset();
  }

  customFilterPredicate() {
    const myFilterPredicate = (card: CardChunk, filter: string) => {
      const searchString = JSON.parse(filter);

      // Filter tests
      const include = 
        // filter on card title
        card.cardTitle.trim().toLowerCase().indexOf(searchString.title.toLowerCase()) !== -1
        // filter on expansion
        && card.expansionName.trim().toLowerCase().indexOf(searchString.expansion.toLowerCase()) !== -1
        // filter on dex number
        && (!searchString.dex || card.dexNumber === searchString.dex)
        // filter on generation
        && (!searchString.gen || card.generation === searchString.gen)
        // filter on release
        && (!searchString.release || card.release === searchString.release)
        // filter on print
        && (!searchString.print || card.printNumber === searchString.print)
        // filter on copies
        && (!searchString.copies || card.owned.length === searchString.copies);
      return include;
    };
    return myFilterPredicate;
  }
}