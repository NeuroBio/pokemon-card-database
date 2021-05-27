import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Checklist } from 'src/app/_objects/checklist';
import { Card } from 'src/app/_objects/expansion';
import { CheckListService } from 'src/app/_services/check-list.service';
import { CollectionService } from 'src/app/_services/collection.service';
import { MessengerService } from 'src/app/_services/messenger.service';

@Component({
  selector: 'app-add-list',
  templateUrl: './add-list.component.html',
  styleUrls: ['./add-list.component.scss']
})
export class AddListComponent implements OnInit, OnDestroy {

  listForm: FormGroup;
  cardForm: FormGroup;
  cards: any[] = [];

  activeCard: Card;
  expansionSubscription: Subscription;
  printSubscription: Subscription;

  expansions: {};
  expansionNames: string[];

  constructor(
    private fb: FormBuilder,
    private collectionserv: CollectionService,
    private checklistserv: CheckListService,
    private messenger: MessengerService,
    private dialogRef: MatDialogRef<AddListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.expansions = this.collectionserv.expansions.value;
    this.expansionNames = Object.keys(this.expansions);
    this.listForm = this.createListForm();
    this.cardForm = this.createCardForm();
    this.activeCard = this.collectionserv.getActiveCard('Base Set', 1);

    this.expansionSubscription = this.cardForm.controls.expansion.valueChanges
      .subscribe(exp => { 
        const print = this.cardForm.controls.print.value;
        this.activeCard = this.collectionserv.getActiveCard(exp, print);
    });

    this.printSubscription = this.cardForm.controls.print.valueChanges
      .subscribe(print => {
        const exp = this.cardForm.controls.expansion.value;
        this.activeCard = this.collectionserv.getActiveCard(exp, print);
    });
  }

  ngOnDestroy(): void {
    this.expansionSubscription.unsubscribe();
    this.printSubscription.unsubscribe();
  }

  createListForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
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
    this.cards.push({
      preview: this.activeCard,
      exp: this.expansions[cardinfo.expansion],
      path: `${cardinfo.expansion}-${cardinfo.print}`,
      instance: ''
    });
  }

  removeCard(index: number): void {
    this.cards.splice(index, 1)
  }

  submit() {
    const checklist = new Checklist(this.listForm.value.name, this.cards.map(card => card.path));
    return this.checklistserv.uploadList(checklist)
      .then(() => {
        this.messenger.send('Checklist uploaded.');
        this.dialogRef.close();
      });
  }

}
