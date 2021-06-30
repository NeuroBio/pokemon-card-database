import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CardChunk } from 'src/app/_objects/card-chunk';
import { CollectionService } from 'src/app/_services/collection.service';

@Component({
  selector: 'app-binder-view',
  templateUrl: './binder-view.component.html',
  styleUrls: ['./binder-view.component.scss']
})
export class BinderViewComponent implements OnInit, OnDestroy {

  viewForm: FormGroup;
  activeListName: string;
  activeList: CardChunk[];
  offset = 0;
  loading: boolean[];
  size = 0;
  resizeSubscription1: Subscription;
  resizeSubscription2: Subscription;

  constructor(
    private route: ActivatedRoute,
    private collectionserv: CollectionService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.activeListName = this.route.snapshot.paramMap.get('ChecklistID');
    this.viewForm = this.createForm();
    this.activeList = this.collectionserv
      .getCheckList(this.activeListName);
    this.resetLoading();
    this.resizeSubscription1 = this.viewForm.controls.rows.valueChanges
      .subscribe(rows => this.resetLoading(rows));
    this.resizeSubscription2 = this.viewForm.controls.cols.valueChanges
      .subscribe(cols => this.resetLoading(undefined, cols));
  }

  ngOnDestroy() {
    this.resizeSubscription1.unsubscribe();
    this.resizeSubscription2.unsubscribe();
  }

  createForm(): FormGroup {
    return this.fb.group({
      viewStyle: 2,
      paging: this.collectionserv.getChecklistDisplay(this.activeListName),
      rows: 1,
      cols: 1
    });
  }

  getArrangement(): any[] {
    const numCells = this.viewForm.controls.cols.value * this.viewForm.controls.rows.value;
    return new Array(numCells);
  }

  getLink(index: number, page: number): string {
    // grid size
    const numCells = this.viewForm.controls.cols.value * this.viewForm.controls.rows.value;
    const numPages = this.viewForm.controls.viewStyle.value;
    // offset due to left or right page
    let paging = page * numCells;
    // handle offset from starting on right page
    if (numPages === 2) {
      paging -= this.viewForm.controls.paging.value * numCells;
    }

    // get card
    const cardIndex = index + this.offset*numCells*numPages + paging;

    // no card or no image
    if (cardIndex < 0
      || cardIndex >= this.activeList.length
      || !this.activeList[cardIndex].owned[0]
      || !this.activeList[cardIndex].owned[0].front) {
        return;
      }

    return this.activeList[cardIndex].owned[0].front;
  }

  allDisplayed() {
    // grid size
    const numCells = this.viewForm.controls.cols.value * this.viewForm.controls.rows.value;
    const numPages = this.viewForm.controls.viewStyle.value;
    let paging = (numPages - 1) * numCells;
    // handle offset from starting on right page
    if (numPages === 2) {
      paging -= this.viewForm.controls.paging.value * numCells;
    }
    return this.activeList.length < (numCells + numCells*this.offset*numPages + paging);
  }

  changeOffset(change: number) {
    this.offset += change;
    this.resetLoading()
  }

  resetLoading(rows?: number, cols?: number) {
    const view = this.viewForm.value;
    if (!rows) {
      rows = view.rows
    }
    if (!cols) {
      cols = view.cols
    }
    const newSize = rows * cols * view.viewStyle;
    this.loading = new Array(newSize).fill(true);

    // One the first page, resetting the array size can permanently set
    // some of the images to loading because their src did not change.
    // manually reset those cases to false!
    if (this.offset === 0 && newSize !== this.size && this.size !== 0) {
      for(let i = 0; i < Math.min(this.size, newSize); i++) {
        this.loading[i + rows * cols * view.paging] = false;
      }
    }
    this.size = newSize;
  }

  finishLoad(index: number, page: number): void {
    const pageSlots = this.viewForm.controls.rows.value * this.viewForm.controls.cols.value;
    this.loading[index + page * pageSlots] = false;
  }

  checkLoad(index: number, page: number): boolean {
    const pageSlots = this.viewForm.controls.rows.value * this.viewForm.controls.cols.value;
    return this.loading[index + page * pageSlots];
  }

}
