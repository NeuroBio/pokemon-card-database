import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { CardInstance } from 'src/app/_objects/card-instance';
import { CheckInfo, Checklist, PopulateMethod } from 'src/app/_objects/checklist';
import { Card } from 'src/app/_objects/expansion';
import { CheckListService } from 'src/app/_services/check-list.service';
import { CollectionService } from 'src/app/_services/collection.service';
import { MessengerService } from 'src/app/_services/messenger.service';
import { PickCardComponent } from '../pick-card/pick-card.component';

@Component({
  selector: 'app-add-list',
  templateUrl: './add-list.component.html',
  styleUrls: ['./add-list.component.scss']
})
export class AddListComponent implements OnInit, OnDestroy {

  @ViewChildren(MatSelect) select: QueryList<MatSelect>;

  editData: any;
  listForm: FormGroup;
  cardForm: FormGroup;
  cards: any[] = [];
  drag = true;

  populateMethods = [];
  previews = [];
  expanded: number;

  activeCard: Card;
  expansionSubscription: Subscription;
  printSubscription: Subscription;

  expansions: {};
  expansionNames: string[];

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private collectionserv: CollectionService,
    private checklistserv: CheckListService,
    private messenger: MessengerService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.editData = data.checklist;
    });
    this.expansions = this.collectionserv.expansions.value;
    this.expansionNames = this.collectionserv.getExpansionNames();
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

    if (this.editData) {
      this.loadOldData();
    }
  }

  ngOnDestroy(): void {
    this.expansionSubscription.unsubscribe();
    this.printSubscription.unsubscribe();
  }

  createListForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      startOn: [1, Validators.required]
    });
  }

  createCardForm(): FormGroup {
    return this.fb.group({
      prepopulate: true,
      expansion: this.expansionNames[0],
      print: [1, Validators.required],
    });
  }

  close(): void {
    this.router.navigate([this.collectionserv.activeList]);
  }

  // Drag and drop
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.cards, event.previousIndex, event.currentIndex);
    moveItemInArray(this.populateMethods, event.previousIndex, event.currentIndex);
    moveItemInArray(this.previews, event.previousIndex, event.currentIndex);
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
    this.previews.push(undefined);
  }

  removeCard(index: number): void {
    this.cards.splice(index, 1);
    this.populateMethods.splice(index, 1);
    this.previews.splice(index, 1);
  }

  populateOption(method: string, index: number): void {
    if (method === 'useCard') {
      const currentMethod = this.populateMethods[index];
      this.dialog.open(PickCardComponent, {
        width: '80vw',
        data: {
          key: `${this.cards[index].path}`,
          activeCardKey: currentMethod.uid ? `${currentMethod.key}` : undefined,
          activeCardUID: currentMethod.uid ? currentMethod.uid : undefined,
          newSubmission: true
        }
      }).afterClosed()
        .pipe(take(1)).subscribe(cardData => {
          if (cardData) {
            this.populateMethods[index] = new PopulateMethod('useCard',
              cardData.expansion, cardData.print, cardData.uid);
            this.previews[index] = this.getCard(this.populateMethods[index]);
          }
      });
    } else {
      this.populateMethods[index] = new PopulateMethod(method);
    }
  }

  swapState(): void {
    this.drag = !this.drag;

    if (!this.drag) {
      setTimeout(() => {
        this.select.forEach((x, i) => x.options.find(op =>
          op.value === this.getMethodValue(i)).select()); }, 10);
    }
  }

  getMethodValue(index: number): string {
    return this.populateMethods[index].method ? this.populateMethods[index].method : 'best';
  }

  getCard(info: PopulateMethod): CardInstance {
    return this.collectionserv.getCard(info.key, info.uid);
  }

  submit(): Promise<void> {
    this.isLoading = true;
    const checklist = new Checklist(this.listForm.value.name,
      this.cards.map(card => card.path),
      this.listForm.value.startOn
      );

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
      });
    }

    return this.checklistserv.uploadList(checklist, this.editData ? this.editData.name : undefined)
      .then(res => {
        this.isLoading = false;
        if (res) {
          this.messenger.send('Checklist uploaded.');
          this.close();
        } else {
          this.messenger.send('Only the Admin may add or edit checklists.');
        }
      });
  }

  loadOldData(): void {
    this.listForm.patchValue({ name: this.editData.name, startOn: this.editData.startOn });
    this.cards = this.editData.cardKeys.map(key => {
      const keyParts = key.split(/-(?!.*-)/);
      return {
      preview: this.collectionserv.getActiveCard(keyParts[0], keyParts[1]),
      exp: this.expansions[keyParts[0]],
      path: key,
      };
    });
    this.populateMethods = this.editData.checkInfo.map(info => {
      if (info.uid) {
        const keyParts = info.key.split(/-(?!.*-)/);
        return new PopulateMethod('useCard', keyParts[0], keyParts[1], info.uid);
      } else {
        return {};
      }
    });
    this.populateMethods.forEach((info, i) => {
      this.previews[i] = info.key ? this.getCard(info) : undefined;
    });
  }

}
