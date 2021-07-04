import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ConfirmComponent } from 'src/app/confirm/confirm/confirm.component';
import { Card } from 'src/app/_objects/expansion';
import { AuthService } from 'src/app/_services/auth.service';
import { CollectionService } from 'src/app/_services/collection.service';
import { ExpansionService } from 'src/app/_services/expansion.service';
import { MessengerService } from 'src/app/_services/messenger.service';

@Component({
  selector: 'app-expansion-home',
  templateUrl: './expansion-home.component.html',
  styleUrls: ['./expansion-home.component.scss']
})
export class ExpansionHomeComponent implements OnInit, OnDestroy {

  expansionNames: string[];
  expansions: any;
  cards: Card[];
  gen = 1;
  release = 1;
  expansionName: FormControl;
  expansionSubscription: Subscription;

  constructor(
    private collectionserv: CollectionService,
    private expansionserv: ExpansionService,
    private messenger: MessengerService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private auth: AuthService,
    ) { }

  ngOnInit(): void {
    this.expansionName = this.fb.control('Base Set');
    this.expansionNames = this.collectionserv.getExpansionNames();
    this.expansions = this.collectionserv.expansions.value;
    this.cards = this.expansions['Base Set'].cards;
    this.expansionSubscription = this.expansionName.valueChanges
      .subscribe(setName => {
        this.cards = this.expansions[setName].cards;
        this.gen = this.expansions[setName].generation;
        this.release = this.expansions[setName].release;
      });
  }

  ngOnDestroy(): void {
    this.expansionSubscription.unsubscribe();
  }

  deleteSet(): void {
    this.dialog.open(ConfirmComponent, {
      width: '80vw',
      maxWidth: '650px',
      data: `Are you sure you want to delete the ${this.expansionName.value} Expansion?`
    }).afterClosed().pipe(take(1)).subscribe(confirm => {
      if (confirm) {
        const exp = this.expansionName.value
        return this.expansionserv.deleteExpansion(exp, this.expansions[exp].generation)
        .then(res => {
          if (res) {
            this.messenger.send(`Successfully deleted ${exp}.`);
            this.expansionName.patchValue('Base Set');
          } else {
            this.messenger.send('Only the Admin may delete expanions.');
          }
        });
      }
    });
  }

  isLoggedIn(): boolean {
    return !this.auth.isLoggedIn;
  }

}
