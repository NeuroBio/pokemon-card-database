import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ConfirmComponent } from 'src/app/confirm/confirm/confirm.component';
import { CardInstance, FlawInfo } from 'src/app/_objects/card-instance';
import { Card } from 'src/app/_objects/expansion';
import { CardService } from 'src/app/_services/card.service';
import { CollectionService } from 'src/app/_services/collection.service';
import { MessengerService } from 'src/app/_services/messenger.service';
import * as uuid from 'uuid';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit, OnDestroy {

  cardForm: FormGroup;
  flaws: FormArray;

  expansions: {};
  expansionNames: string[];

  conditions = ['M', 'NM', 'LP', 'MP', 'HP'];
  flawInfo = new FlawInfo();

  activeCard: Card;
  NAcard = false;
  expectedForms = ['standard', 'reverse'];

  expansionSubscription: Subscription;
  printSubscription: Subscription;


  constructor(
    private fb: FormBuilder,
    private cardserv: CardService,
    private messenger: MessengerService,
    private collectionserv: CollectionService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CardInstance
    ) { }

  ngOnInit(): void {
    this.expansions = this.collectionserv.expansions.value;
    this.expansionNames = Object.keys(this.expansions);

    this.flaws = this.createFlawArray();
    if (this.data) {
      this.cardForm = this.createEditForm(this.data);      
    } else {
      this.cardForm = this.createAddForm();

    }

    this.expansionSubscription = this.cardForm.controls.expansionName.valueChanges
      .subscribe(exp => { 
        const print = this.cardForm.controls.printNumber.value;
        this.activeCard = this.collectionserv.getActiveCard(exp, print);
        this.setForms(exp);
    });

    this.printSubscription = this.cardForm.controls.printNumber.valueChanges
      .subscribe(print => {
        const exp = this.cardForm.controls.expansionName.value;
        this.activeCard = this.collectionserv.getActiveCard(exp, print);
    });
  }

  ngOnDestroy() {
    this.expansionSubscription.unsubscribe();
    this.printSubscription.unsubscribe();
  }

  createAddForm(): FormGroup {
    return this.fb.group({
      expansionName: ['', Validators.required],
      printNumber: ['', Validators.required],
      condition: 'NM',
      form: '',
      front: '',
      back: '',
      flaws: this.flaws,
    });
  }

  createEditForm(data: CardInstance): FormGroup {
    data.flaws.forEach(flaw =>
      this.addFlaw(flaw.type, flaw.where, flaw.landmark, flaw.severity));

    return this.fb.group({
      expansionName: [
        { value: data.expansionName, disabled: true },
        Validators.required],
      printNumber: [
        { value: data.printNumber, disabled: true },
        Validators.required],
      condition: data.condition,
      form: { value: data.form, disabled: true },
      front: data.front,
      back: data.back,
      flaws: this.flaws,
    });
  }

  createFlawArray(): FormArray {
    return this.fb.array([]);
  }

  addFlaw(
    type: string = '', where: string = '',
    landmark: string = '', severity: string = ''
  ): void {
    this.flaws.push(this.fb.group({
      type: [type, Validators.required],
      where: [where, Validators.required],
      landmark: [landmark, Validators.required],
      severity: [severity, Validators.required]
    }));
  }

  removeFlaw(index: number): void {
    this.flaws.removeAt(index);
  }

  setForms(exp: string) {
    switch (exp) {
      case 'Base Set':
        this.expectedForms = ['1st', 'shadowless', 'unlimited', 'UK 2000'];
        this.cardForm.patchValue({ form: 'unlimited' });
        break;
      case 'Fossil':
      case 'Jungle':
      case 'Team Rocket':
      case 'Gym Heroes':
      case 'Gym Challenge':
      case 'Base Set 2':
      case 'Neo Genesis':
      case 'Neo Discovery':
      case 'Neo Revelation':
      case 'Neo Destiny':
        this.expectedForms = ['1st', 'unlimited'];
        this.cardForm.patchValue({ form: 'unlimited' });
        break;
      default:
        this.expectedForms = ['standard', 'reverse-holo'];
        this.cardForm.patchValue({ form: 'standard' });
        break;
    }
  }

  submit() {
    const newCard = this.cardForm.getRawValue();

    if (!newCard.uid) {
      newCard.uid = uuid.v4();
    }

    return this.cardserv.uploadCard(newCard)
      .pipe(take(1)).subscribe(() => {
        if (this.data) {
          this.messenger.send('Card edited.')
        } else {
          this.messenger.send('Card uploaded.');
        }
        this.dialogRef.close();
    });
  }

  close() {
    this.dialogRef.close();
  }

  delete() {
    const cardType: Card = this.expansions[this.data.expansionName].cards[this.data.printNumber-1];
    this.dialog.open(ConfirmComponent, {
      width: '450px',
      data: `Are you sure you want to delete this copy of ${
        cardType.cardTitle} (${cardType.printNumber}/${this.expansions[this.data.expansionName].numCards})?`
      }).afterClosed().pipe(take(1)).subscribe(confirmed => {
        if (confirmed) {
          return this.cardserv.deleteCard(
            this.data.expansionName,
            this.data.printNumber,
            this.data.uid).pipe(take(1))
            .subscribe(() => {
              this.messenger.send('Card deleted.');
              this.dialogRef.close();
            });
        }
      })
  }

}
