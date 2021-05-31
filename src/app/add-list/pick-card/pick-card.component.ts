import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { CardChunk } from 'src/app/_objects/card-chunk';
import { CardInstance } from 'src/app/_objects/card-instance';
import { CheckInfo } from 'src/app/_objects/checklist';
import { CheckListService } from 'src/app/_services/check-list.service';
import { CollectionService } from 'src/app/_services/collection.service';
import { MessengerService } from 'src/app/_services/messenger.service';

@Component({
  selector: 'app-pick-card',
  templateUrl: './pick-card.component.html',
  styleUrls: ['./pick-card.component.scss']
})
export class PickCardComponent implements OnInit, OnDestroy {

  cardForm: FormGroup;

  expansionNames: string[];
  expansions: any;
  masterList: CardChunk[];
  allowed: CardChunk[];

  cardSubscription: Subscription;
  chunkSubscription: Subscription;
  expSubscription: Subscription;

  constructor(
    private checklistserv: CheckListService,
    private collectionserv: CollectionService,
    private fb: FormBuilder,
    private messenger: MessengerService,
    private dialogRef: MatDialogRef<PickCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.expansionNames = this.collectionserv.getExpansionNames();
    this.masterList = this.collectionserv.getMaster();
    this.expansions = this.collectionserv.expansions.value;
    this.cardForm = this.createForm();
    this.getAllowed('Base Set');

    // load in past data
    const chunk: CardInstance[] = this.collectionserv.getChunk(this.data.key);
    if (chunk) {
      const keyParts = this.data.key.split('-');
      this.cardForm.patchValue({
        exp: keyParts[0],
        activeCardChunkKey: this.data.key,
        activeCardChunk: chunk,
        activeCard: this.data.activeCardUID
          ? this.collectionserv.getCard(this.data.activeCardKey , this.data.activeCardUID)
          : this.collectionserv.getBestCard(chunk)
      });
      this.getAllowed(keyParts[0]);
    }

    this.expSubscription = this.cardForm.controls.exp.valueChanges
      .subscribe(exp => {
        this.getAllowed(exp);
        this.cardForm.patchValue({ activeCardChunkKey: `${exp}-${this.allowed[0].printNumber}` });
    });

    this.chunkSubscription = this.cardForm.controls.activeCardChunkKey.valueChanges
      .subscribe(key => {
        this.cardForm.patchValue({ activeCardChunk: this.collectionserv.getChunk(key) });
    });

    this.cardSubscription = this.cardForm.controls.activeCardChunk.valueChanges
      .subscribe(chunk => {
        this.cardForm.patchValue({ activeCard: this.collectionserv.getBestCard(chunk) });
      });
  }

  ngOnDestroy() {
    this.cardSubscription.unsubscribe();
    this.chunkSubscription.unsubscribe();
    this.expSubscription.unsubscribe();
  }

  createForm() {
    return this.fb.group({
      exp: 'Base Set',
      activeCardChunkKey: '',
      activeCardChunk: '',
      activeCard: ''
    });
  }

  getValue(control: string) {
    return this.cardForm.get(control).value;
  }
  private getAllowed(exp: string) {
    this.allowed = this.masterList.filter(chunk => chunk.expansionName === exp);
  }

  submit(): void {
    if (this.data.newSubmission) {
      this.return();
    } else {
      this.upload();
    }
  }

  // list submission
  return(): void {
    const activeCard = this.cardForm.value.activeCard;
    this.dialogRef.close({
      expansion: activeCard.expansionName,
      print: activeCard.printNumber,
      uid: activeCard.uid
    });
  }

  // list entry submission
  upload() {
    const activeCard = this.cardForm.value.activeCard;
    const key = `${activeCard.expansionName}-${activeCard.printNumber}`;
    const placeholder = key !== this.data.key;
    const newCheckInfo = new CheckInfo(placeholder, activeCard.uid, key);
    return this.checklistserv.changeCard(newCheckInfo, this.data.listName, this.data.index)
      .pipe(take(1)).subscribe(res => {
        if (res) {
          this.messenger.send(`Card in ${this.data.listName} updated.`);
          this.close();  
        } else {
          this.messenger.send('Only the Admin may update a checklist.')
        }
    });
  }

  close() {
    this.dialogRef.close();
  }

}
