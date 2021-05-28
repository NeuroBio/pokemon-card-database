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

  masterList: CardChunk[];
  masterSubscription: Subscription;

  chunkSubscription: Subscription;

  constructor(
    private checklistserv: CheckListService,
    private collectionserv: CollectionService,
    private fb: FormBuilder,
    private messenger: MessengerService,
    private dialogRef: MatDialogRef<PickCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.cardForm = this.createForm();
    const chunk: CardInstance[] = this.collectionserv.getChunk(this.data.key);
    if (chunk) {
      this.cardForm.patchValue({
        activeCardChunkKey: this.data.key,
        activeCardChunk: chunk,
        activeCard: this.collectionserv.getBestCard(chunk)
      });
    }
    this.masterSubscription = this.collectionserv.masterList
      .subscribe(list => this.masterList = list);
  }

  ngOnDestroy() {
    this.masterSubscription.unsubscribe();
  }

  createForm() {
    return this.fb.group({
      activeCardChunkKey: '',
      activeCardChunk: '',
      activeCard: ''
    });
  }

  getValue(control: string) {
    return this.cardForm.get(control).value;
  }

  submit() {
    const activeCard = this.cardForm.value.activeCard;
    const key = `${activeCard.expansionName}-${activeCard.printNumber}`;
    const placeholder = key !== this.data.key;
    const newCheckInfo = new CheckInfo(placeholder, activeCard.uid, key);
    console.log(newCheckInfo, this.data.listName, this.data.index)
    return this.checklistserv.changeCard(newCheckInfo, this.data.listName, this.data.index)
      .pipe(take(1)).subscribe(() => {
        this.messenger.send(`Card in ${this.data.listName} updated.`);
        this.dialogRef.close();
      });
  }

  close() {
    this.dialogRef.close();
  }

  setIndex(index: number): void {
    this.cardForm.patchValue({activeCardChunk: this.masterList[index].owned});
  }
}
