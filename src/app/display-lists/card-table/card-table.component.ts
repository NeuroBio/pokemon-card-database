import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { PickCardComponent } from 'src/app/add-list/pick-card/pick-card.component';
import { CardChunk } from 'src/app/_objects/card-chunk';
import { CardInstance } from 'src/app/_objects/card-instance';
import { CheckInfo } from 'src/app/_objects/checklist';
import { StaticData } from 'src/app/_objects/pokemon-list';

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

  filterObject  = {
    dex: '', title: '', expansion: '', gen: '',
    release: '', print: '', copies: null, haveCard: ''
  };
  filterForm: FormGroup;
  filterSubscription: Subscription;

  sortingData = {
    Dex: 'asc',
    Name: '',
    Expansion: '',
    Gen: 'asc',
    Release: '',
    Print: '',
    Copies: '',
  };
  static = new StaticData();

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.filterForm = this.createFilterForm();
    this.filterSubscription = this.filterForm.valueChanges
      .subscribe(value => this.cards.filter = JSON.stringify(value));
    this.cards.filterPredicate = this.customFilterPredicate();
  }

  ngOnChanges(): void {
    this.cards.data = this.displayCards;

    Object.keys(this.sortingData).forEach(active => {
      if (this.sortingData[active]) {
        this.sortData({ active, direction: this.sortingData[active] } as Sort);
      }
    });

    this.swapListType();
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
    this.dialog.open(PickCardComponent, {
    width: '80vw',
    data: {
      key: `${card.expansionName}-${card.printNumber}`,
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
      return 'main-rows-none'
    }
    return card.checkInfo && card.checkInfo.placeholder
    ? 'main-rows-placeholder'
    : 'main-rows';
  }

  // Sorting functions
  sortData(sort: Sort): void {
    this.sortingData[sort.active] = sort.direction;
    const data = this.cards.data.slice();
    if (!sort.active || sort.direction === '') {
      return;
    }

    this.cards.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'Dex': return this.compareDex(a.dexNumber, b.dexNumber, isAsc);
        case 'Name': return this.compare(a.cardTitle, b.cardTitle, isAsc);
        case 'Gen': return this.compare(a.generation, b.generation, isAsc);
        case 'Expansion': return this.compare(a.expansionName, b.expansionName, isAsc);
        case 'Release': return this.compare(a.release, b.release, isAsc);
        case 'Print': return this.compare(a.printNumber, b.printNumber, isAsc);
        case 'Copies': return this.compare(a.owned.length, b.owned.length, isAsc);
        case 'Have': return this.compareHave(a.checkInfo, b.checkInfo, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a === b ? 0 : a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  compareDex(a: number | string, b: number | string, isAsc: boolean): number {
    return (a === null || a === b ? 0 : a > b ? 1 : -1) * (isAsc ? 1 : -1);
  }

  compareHave(a: CheckInfo, b: CheckInfo, isAsc: boolean): number {
    return (a === b ? 0 : !a ? -1 : a.placeholder && !b || !a.placeholder  && (!b || b.placeholder) ? 1 : -1) * (isAsc ? 1 : -1);
  }

  // Filter functions
  createFilterForm(): FormGroup {
    return this.fb.group(this.filterObject);
  }

  clearFilter(): void {
    this.filterForm.reset(this.filterObject);
  }

  customFilterPredicate(): (data: CardChunk, filter: string) => boolean {
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
        && (searchString.copies === null || card.owned.length === searchString.copies)
        // filter on have
        && (!searchString.haveCard || card.haveCard() === searchString.haveCard);
      return include;
    };
    return myFilterPredicate;
  }

}
