import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { PickCardComponent } from 'src/app/add-list/pick-card/pick-card.component';
import { CardChunk } from 'src/app/_objects/card-chunk';
import { CardInstance } from 'src/app/_objects/card-instance';
import { StaticData } from 'src/app/_objects/pokemon-list';
import { FilterService } from 'src/app/_services/filter.service';

@Component({
  selector: 'app-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ]
})
export class CardTableComponent implements OnInit, OnChanges, OnDestroy {

  @Input() displayCards: CardChunk[] = [];
  @Input() allowEdit = false;
  @Input() listName = '';

  cards = new MatTableDataSource<CardChunk>();
  displayColumns = [
    'DropDown', 'Dex', 'Name', 'Expansion', 'Gen',
    'Release', 'Print'
  ];

  expanded: CardChunk;
  loading = true;
  filterSubscription: Subscription;


  static = new StaticData();

  constructor(
    private dialog: MatDialog,
    public filterserv: FilterService
    ) { }

  ngOnInit(): void {
    
    this.filterSubscription = this.filterserv.filterForm.valueChanges
      .subscribe(value => this.cards.filter = JSON.stringify(value));
    this.cards.filterPredicate = this.filterserv.customFilterPredicate(this.listName);
  }

  ngOnChanges(): void {
    console.log('changes')
    this.loading = true;
    this.cards.data = [];
    setTimeout(() => {
      this.cards.data = this.displayCards;
      this.filterserv.redoFilter();
      this.cards.data = this.filterserv.redoSort(this.cards.data);
      this.swapListType();
      this.loading = false;
    }, 1);
  }

  ngOnDestroy(): void {
    this.filterSubscription.unsubscribe();
  }

  swapListType(): void {
    if (this.displayColumns.length === 8) {
      this.displayColumns.pop();
    }
    if (this.isMaster()) {
      this.displayColumns.push('Copies');
    } else {
      this.displayColumns.push('Have');
    }
  }

  editChecklistSlot(card: CardChunk, index: number): void {
    const key = card.checkInfo ? card.checkInfo.key : `${card.expansionName}-${card.printNumber}`;
    this.dialog.open(PickCardComponent, {
    width: '80vw',
    data: {
      key,
      listName: this.listName,
      index
      }
    });
  }

  isMaster(): boolean {
    return this.listName === 'Masterlist';
  }

  showAll(card: CardChunk, instance: CardInstance): boolean {
    return `${card.expansionName}-${card.printNumber}`
      !== `${instance.expansionName}-${instance.printNumber}`;
  }

  rowClass(card: CardChunk): string {
    if (card.owned.length === 0) {
      return 'main-rows-none';
    }
    return card.checkInfo && card.checkInfo.placeholder
    ? 'main-rows-placeholder'
    : 'main-rows';
  }

  // Sorting functions
  sortData(sort: Sort): void {
    this.cards.data = this.filterserv.sort(this.cards.data, sort)
  }

}