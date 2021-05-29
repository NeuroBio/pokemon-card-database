import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { take, timeout } from 'rxjs/operators';
import { CheckInfo, Checklist, PopulateMethod } from 'src/app/_objects/checklist';
import { Card } from 'src/app/_objects/expansion';
import { CheckListService } from 'src/app/_services/check-list.service';
import { CollectionService } from 'src/app/_services/collection.service';
import { MessengerService } from 'src/app/_services/messenger.service';
import { SelectCardComponent } from '../select-card/select-card.component';

@Component({
  selector: 'app-add-list',
  templateUrl: './add-list.component.html',
  styleUrls: ['./add-list.component.scss']
})
export class AddListComponent implements OnInit, OnDestroy {

  @ViewChildren(MatSelect) select: QueryList<MatSelect>;

  listForm: FormGroup;
  cardForm: FormGroup;
  cards: any[] = [];
  drag = true;

  populateMethods = [];

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
    private dialog: MatDialog,
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

    if (this.data) {
      this.loadOldData()
    }
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
      prepopulate: true,
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
    moveItemInArray(this.populateMethods, event.previousIndex, event.currentIndex);
  }

  addCard(): void {
    const cardinfo = this.cardForm.value;
    this.cards.push({
      preview: this.activeCard,
      exp: this.expansions[cardinfo.expansion],
      path: `${cardinfo.expansion}-${cardinfo.print}`,
    });
    this.populateMethods.push({});
    this.cardForm.patchValue({ print: this.cardForm.get('print').value + 1 });
  }

  removeCard(index: number): void {
    this.cards.splice(index, 1);
    this.populateMethods.splice(index, 1);
  }

  populateOption(method: string, index: number): void {
    if (method === 'useCard') {
      this.dialog.open(SelectCardComponent, {
        width: '80vw',
        maxWidth: '650px'
      }).afterClosed()
        .pipe(take(1)).subscribe(cardData => {
          if (cardData) {
            this.populateMethods[index] = new PopulateMethod(method,
              cardData.expansion, cardData.print, cardData.uid);
          }
      })
    } else {
      this.populateMethods[index] = new PopulateMethod(method);
    }
  }

  swapState() {
    this.drag = !this.drag;

    if(!this.drag) {
      setTimeout(() => {
        this.select.forEach((x, i) => x.options.find(op => 
          op.value === this.getMethodValue(i)).select()); }, 10);
    }
  }

  getMethodValue(index: number) {
    return this.populateMethods[index].method ? this.populateMethods[index].method : 'best';
  }

  getCard(info: PopulateMethod) {
    return this.collectionserv.getCard(info.key, info.uid);
  }

  submit() {
    const checklist = new Checklist(this.listForm.value.name, this.cards.map(card => card.path));

    // prepopulation with card instances
    if (this.cardForm.get('prepopulate').value) {
      this.populateMethods.forEach((method, i) => {
        // skip is ignored.
        if (!method.method || method.method === 'best') { // default or manually set to best
          const cards = this.collectionserv.getChunk(checklist.cardKeys[i]);
          
          if (cards) { // only continue is an instance of this card type exists
            const bestCard = this.collectionserv.getBestCard(cards);
            if (bestCard) { // only add if a suitable card was found
              checklist.checkInfo[i] = new CheckInfo(false, bestCard.uid, checklist.cardKeys[i]);
            }              
          }
        } else if (method.method === 'useCard') { // grab existing data and reformat
          checklist.checkInfo[i] = new CheckInfo(
            method.key !== checklist.cardKeys[i], method.uid, method.key);
        }
      })
    }

    return this.checklistserv.uploadList(checklist)
      .then(res => {
        if (res) {
          this.messenger.send('Checklist uploaded.');
          this.dialogRef.close();  
        } else {
          this.messenger.send('Only the Admin may add oredit checklists.');
        }
      });
  }

  loadOldData() {
    this.listForm.patchValue({ name: this.data.name });
    this.cards = this.data.cardKeys.map(key => {
      const keyParts = key.split('-');
      return {
      preview: this.collectionserv.getActiveCard(keyParts[0], keyParts[1]),
      exp: this.expansions[keyParts[0]],
      path: key,
      };
    });
    this.populateMethods = this.data.checkInfo.map(info => {
      if (info.uid) {
        const keyParts = info.key.split('-');
        return new PopulateMethod('useCard', keyParts[0], keyParts[1], info.uid);  
      } else {
        return {};
      }
    });
  }

}
