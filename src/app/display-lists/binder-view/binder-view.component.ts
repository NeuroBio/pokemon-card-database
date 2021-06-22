import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CardChunk } from 'src/app/_objects/card-chunk';
import { CollectionService } from 'src/app/_services/collection.service';

@Component({
  selector: 'app-binder-view',
  templateUrl: './binder-view.component.html',
  styleUrls: ['./binder-view.component.scss']
})
export class BinderViewComponent implements OnInit {

  viewForm: FormGroup;
  activeList: CardChunk[];
  offset = 0;

  constructor(
    private route: ActivatedRoute,
    private collectionserv: CollectionService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.viewForm = this.createForm();
    this.activeList = this.collectionserv
      .getCheckList(this.route.snapshot.paramMap.get('ChecklistID'));
  }

  createForm(): FormGroup {
    return this.fb.group({
      viewStyle: 2,
      paging: 1,
      rows: 3,
      cols: 3
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
  }

}
