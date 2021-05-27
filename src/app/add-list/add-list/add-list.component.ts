import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Card, SetExpansion } from 'src/app/_objects/expansion';
import { CollectionService } from 'src/app/_services/collection.service';

@Component({
  selector: 'app-add-list',
  templateUrl: './add-list.component.html',
  styleUrls: ['./add-list.component.scss']
})
export class AddListComponent implements OnInit {

  listForm: FormGroup;
  cardForm: FormGroup;
  listTypes = ['checklist', 'count list'];
  cards: string[] = [];

  expansions: {};
  expansionNames: string[];

  constructor(
    private fb: FormBuilder,
    private collectionserv: CollectionService,
    private dialogRef: MatDialogRef<AddListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.expansions = this.collectionserv.expansions.value;
    this.expansionNames = Object.keys(this.expansions);
    this.listForm = this.createListForm();
    this.cardForm = this.createCardForm();
  }

  createListForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      listType: 'checklist',
    });
  }

  createCardForm(): FormGroup {
    return this.fb.group({
      expansion: this.expansionNames[0],
      print: [1, Validators.required],
    })
  }

  close() {
    this.dialogRef.close();
  }

  // Drag and drop
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.cards, event.previousIndex, event.currentIndex);
  }

  addCard(): void {
    const cardinfo = this.cardForm.value;
    this.cards.push(`${cardinfo.expansion}-${cardinfo.print}`);
  }

}
