import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Card } from 'src/app/_objects/expansion';
import { CollectionService } from 'src/app/_services/collection.service';

@Component({
  selector: 'app-select-card',
  templateUrl: './select-card.component.html',
  styleUrls: ['./select-card.component.scss']
})
export class SelectCardComponent implements OnInit, OnDestroy {

  cardForm: FormGroup;

  expansions: {};
  expansionNames: string[];
  activeSubscription: Subscription;
  activeCard: Card;

  constructor(
    private fb: FormBuilder,
    private collectionserv: CollectionService,
    private dialogRef: MatDialogRef<SelectCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.cardForm = this.createForm();
    this.expansions = this.collectionserv.expansions.value;
    this.expansionNames = Object.keys(this.expansions);
    this.activeCard = this.collectionserv.getActiveCard('Base Set', 1);

    this.activeSubscription = this.cardForm.valueChanges
      .subscribe(() => {
        const value = this.cardForm.value;
        this.activeCard = this.collectionserv.getActiveCard(value.expansion, value.print);
    });
  }

  ngOnDestroy() {
    this.activeSubscription.unsubscribe();
  }

  createForm() {
    return this.fb.group({
      expansion: 'Base Set',
      print: 1
    });
  }

  getInstances() {
    const keys = this.cardForm.value;
    return this.collectionserv.getChunk(`${keys.expansion}-${keys.print}`);
  }

  close() {
    this.dialogRef.close();
  }

  submit(index: number) {
    const chosenCard = this.getInstances()[index];
    this.dialogRef.close({
      expansion: chosenCard.expansionName,
      print: chosenCard.printNumber,
      uid: chosenCard.uid
    });
  }

}
