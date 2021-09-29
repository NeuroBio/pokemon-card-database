import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { CardChunk } from '../_objects/card-chunk';
import { CheckInfo } from '../_objects/checklist';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  sortingData = {
    Dex: 'asc',
    Name: '',
    Expansion: '',
    Gen: 'asc',
    Release: '',
    Print: '',
    Copies: '',
  };

  filterObject  = {
    dex: '', title: '', expansion: '', gen: '',
    release: '', print: '', copies: null, haveCard: ''
  };
  filterForm: FormGroup;


  constructor(private fb: FormBuilder) { 
    this.filterForm = this.createFilterForm();
  }

  redoSort(cards: CardChunk[]) {
    Object.keys(this.sortingData).forEach(active => {
      if (this.sortingData[active]) {
        cards = this.sort(cards, { active, direction: this.sortingData[active] } as Sort);
      }
    });
    return cards;
  }

  sort(cards: CardChunk[], sort: Sort): CardChunk[] {
    // check if sort needed
    this.sortingData[sort.active] = sort.direction;
    if (!sort.active || sort.direction === '') {
      return cards;
    }

    // actual sort
    return cards.sort((a, b) => {
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

  private compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a === b ? 0 : a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  private compareDex(a: number | string, b: number | string, isAsc: boolean): number {
    return (a === null || a === b ? 0 : a > b ? 1 : -1) * (isAsc ? 1 : -1);
  }

  private compareHave(a: CheckInfo, b: CheckInfo, isAsc: boolean): number {
    return (a === b ? 0 : !a ? -1 : a.placeholder && !b || !a.placeholder  && (!b || b.placeholder) ? 1 : -1) * (isAsc ? 1 : -1);
  }

  // Filter functions
  createFilterForm(): FormGroup {
    return this.fb.group(this.filterObject);
  }

  redoFilter() {
    this.filterForm.patchValue(this.filterForm.value);
  }

  clearFilter(): void {
    this.filterForm.reset(this.filterObject);
  }

  customFilterPredicate(listName: string): (data: CardChunk, filter: string) => boolean {
    const myFilterPredicate = (card: CardChunk, filter: string) => {
      const searchString = JSON.parse(filter);
      // Filter tests
      const include =
        // filter on card title
        card.cardTitle.trim().toLowerCase().indexOf(searchString.title.toLowerCase()) !== -1
        // filter on expansion
        && card.expansionName.trim().toLowerCase().indexOf(searchString.expansion.toLowerCase()) !== -1
        // filter on dex number
        && (!searchString.dex || card.dexNumber === searchString.dex - 1)
        // filter on generation
        && (!searchString.gen || card.generation === searchString.gen)
        // filter on release
        && (!searchString.release || card.release === searchString.release)
        // filter on print
        && (!searchString.print || card.printNumber === searchString.print)
        // filter on copies
        && (searchString.copies === null || listName !== 'Masterlist' || card.owned.length === searchString.copies)
        // filter on have
        && (!searchString.haveCard || listName === 'Masterlist' || card.haveCard() === searchString.haveCard);
      return include;
    };
    return myFilterPredicate;
  }
}
