import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ConfirmComponent } from 'src/app/confirm/confirm/confirm.component';
import { CardChunk } from 'src/app/_objects/card-chunk';
import { AuthService } from 'src/app/_services/auth.service';
import { CheckListService } from 'src/app/_services/check-list.service';
import { CollectionService } from 'src/app/_services/collection.service';
import { MessengerService } from 'src/app/_services/messenger.service';

@Component({
  selector: 'app-main-display',
  templateUrl: './main-display.component.html',
  styleUrls: ['./main-display.component.scss']
})
export class MainDisplayComponent implements OnInit, OnDestroy {

  cardSubscription: Subscription;

  checklists: string[];
  activeList: CardChunk[];

  whichList: FormControl;
  listSubscription: Subscription;
  activeListSubscription: Subscription;

  allowEdit = true;

  constructor(
    private fb: FormBuilder,
    private collectionserv: CollectionService,
    private checklistserv: CheckListService,
    private auth: AuthService,
    private messenger: MessengerService,
    private dialog: MatDialog
    ) { }

  ngOnInit(): void {
    // control active list
    this.collectionserv.getMaster();
    this.whichList = this.fb.control('Masterlist');

    this.cardSubscription = this.collectionserv.allCards
      .subscribe(() => this.getList());

    this.listSubscription = this.collectionserv.checkLists
      .subscribe(lists => {
        this.checklists = lists.map(list => list.name)
        this.checklists.splice(0, 0, 'Masterlist')
        this.getList();
    });

    this.activeListSubscription = this.whichList.valueChanges
      .subscribe(() => this.getList());
  }

  ngOnDestroy() {
    this.cardSubscription.unsubscribe();
    this.listSubscription.unsubscribe();
    this.activeListSubscription.unsubscribe();
  }

  lockSwitch() {
    this.allowEdit = !this.allowEdit;
  }

  getList() {
    if (this.whichList.value === 'Masterlist') {
      this.activeList = Object.assign([], this.collectionserv.getMaster());
    } else {
      this.activeList = Object.assign([], this.collectionserv.getCheckList(this.whichList.value));
    }
  }

  deleteList() {
    this.dialog.open(ConfirmComponent, {
      width: '80vw',
      maxWidth: '650px',
      data: `Are you sure you want to delete the ${this.whichList.value} checklist?`
    }).afterClosed().pipe(take(1)).subscribe(confirm => {
      if (confirm) {
        return this.checklistserv.deleteList(this.whichList.value)
        .then(res => {
          if (res) {
            this.messenger.send('Successfully deleted list.');
            this.whichList.patchValue('Masterlist')  
          } else {
            this.messenger.send('Only the Admin may delete checklists.');
          }
        });
      }
    });
  }

  updateChecklist() {
    this.checklistserv.updateList(this.whichList.value);
  }

  isLoggedIn() {
    return this.auth.isLoggedIn;
  }

}
