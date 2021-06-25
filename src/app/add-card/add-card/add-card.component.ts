import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ConfirmComponent } from 'src/app/confirm/confirm/confirm.component';
import { CardInstance, FlawInfo } from 'src/app/_objects/card-instance';
import { Card } from 'src/app/_objects/expansion';
import { CardService } from 'src/app/_services/card.service';
import { CollectionService } from 'src/app/_services/collection.service';
import { MessengerService } from 'src/app/_services/messenger.service';
import { ResizeService } from 'src/app/_services/resize.service';
import * as uuid from 'uuid';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit, OnDestroy {

  @ViewChild('frontInput') frontInput: ElementRef;
  @ViewChild('backInput') backInput: ElementRef; 
  editData: CardInstance;
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
  isLoading = false;

  maxHeight = 500;
  maxWidth = 500;
  images: any = {};

  constructor(
    private fb: FormBuilder,
    private cardserv: CardService,
    private messenger: MessengerService,
    private collectionserv: CollectionService,
    private resizer: ResizeService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => this.editData = data.card);
    this.expansions = this.collectionserv.expansions.value;
    this.expansionNames = this.collectionserv.getExpansionNames();

    this.flaws = this.createFlawArray();
    if (this.editData) {
      this.cardForm = this.createEditForm(this.editData);
      this.setForms(this.editData.expansionName);
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

  ngOnDestroy(): void {
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
      notes: ''
    });
  }

  createEditForm(data: CardInstance): FormGroup {
    data.flaws.forEach(flaw =>
      this.addFlaw(flaw.type, flaw.where, flaw.landmark, flaw.severity));

    return this.fb.group({
      expansionName: [ data.expansionName,
        Validators.required],
      printNumber: [ data.printNumber,
        Validators.required],
      condition: data.condition,
      form: data.form,
      front: data.front,
      back: data.back,
      flaws: this.flaws,
      uid: data.uid,
      notes: data.notes? data.notes : ''
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

  onFile(event: any, where: string): Promise<void> {
    return this.resizer.resizeandPreviewImage(event, this.maxHeight, this.maxWidth)
      .then(result => {
        this.images[where] = result;
        this.cardForm.controls[where].patchValue(result.urlString);
      });
  }

  inputReset(input: any, where: string): void {
    input.value = '';
    this.cardForm.controls[where].patchValue('');
    delete this.images[where];
  }

  setForms(exp: string): void {
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

  submit(): Subscription {
    this.isLoading = true;
    const newCard = this.cardForm.getRawValue();

    if (!newCard.uid) {
      newCard.uid = uuid.v4();
    }

    const images: Blob[] = new Array(2).fill(undefined);
    if (this.images.front) {
      images[0] = this.images.front.imageBlob;
    }

    if (this.images.back) {
      images[1] = this.images.back.imageBlob;
    }

    return this.cardserv.uploadCard(newCard, images)
      .pipe(take(1)).subscribe(res => {
        this.isLoading = false;
        if (res) {
          if (this.editData) {
            this.messenger.send('Card edited.');
          } else {
            this.messenger.send('Card uploaded.');
          }
          if (this.editData) {
            this.close();
          } else {
            this.reset();
          }
        } else {
          this.messenger.send('Only the Admin may add or edit cards.');
        }
    });
  }

  close(): void {
    this.router.navigate([this.collectionserv.activeList]);
  }

  delete(): void {
    const cardType: Card = this.expansions[this.editData.expansionName].cards[this.editData.printNumber - 1];
    // check whether to delete
    this.dialog.open(ConfirmComponent, {
      width: '450px',
      data: `Are you sure you want to delete this copy of ${
        cardType.cardTitle} (${cardType.printNumber}/${this.expansions[this.editData.expansionName].numCards})?`
      }).afterClosed().pipe(take(1)).subscribe(confirmed => {
        if (confirmed) { // actually delete
          this.isLoading = true;
          return this.cardserv.deleteCard(
            this.editData.expansionName,
            this.editData.printNumber,
            this.editData.uid).pipe(take(1))
            .subscribe(res => {
              this.isLoading = false;
              if (res) {
                this.messenger.send('Card deleted.');
                this.close();
              } else {
                this.messenger.send('Only the Admin may delete cards.');
              }
            });
        }
      });
  }

  reset() {
    while (this.flaws.controls.length > 0) {
      this.removeFlaw(0);
    }
    
    this.cardForm.reset({
      expansionName: this.cardForm.controls.expansionName.value,
      printNumber: this.cardForm.controls.printNumber.value,
      condition: 'NM',
      form: this.cardForm.controls.form.value,
      front: '',
      back: '',
      flaws: this.flaws,
      notes: ''
    });
    this.inputReset(this.frontInput, 'front')
    this.inputReset(this.backInput, 'back')
  }

}
