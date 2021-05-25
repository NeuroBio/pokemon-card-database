import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FlawInfo } from 'src/app/_objects/card-instance';
import { Card } from 'src/app/_objects/expansion';
import { StaticData } from 'src/app/_objects/pokemon-list';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit, OnDestroy {

  cardForm: FormGroup;
  flaws: FormArray;
  static = new StaticData();

  expansions = Object.keys(this.static.Expansions);
  conditions = ['M', 'NM', 'LP', 'MP', 'HP'];
  flawInfo = new FlawInfo();

  activeCard: Card;
  NAcard = false;
  expectedForms = ['standard', 'reverse'];

  expansionSubscription: Subscription;
  printSubscription: Subscription;


  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.flaws = this.createFlawArray();
    this.cardForm = this.createForm();

    this.expansionSubscription = this.cardForm.controls.expansionName.valueChanges
      .subscribe(exp => { 
        const print = this.cardForm.controls.printNumber.value;
        this.getActiveCard(exp, print);
        this.setForms(exp);
    });

    this.printSubscription = this.cardForm.controls.printNumber.valueChanges
      .subscribe(print => {
        const exp = this.cardForm.controls.expansionName.value;
        this.getActiveCard(exp, print);
      })
  }

  ngOnDestroy() {
    this.expansionSubscription.unsubscribe();
    this.printSubscription.unsubscribe();
  }

  createForm(): FormGroup {
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

  createFlawArray(): FormArray {
    return this.fb.array([]);
  }

  addFlaw(): void {
    this.flaws.push(this.fb.group({
      type: ['whitening', Validators.required],
      where: ['top-right', Validators.required],
      landmark: ['corner', Validators.required],
      severity: ['negligible', Validators.required]
    }));
  }

  removeFlaw(index: number): void {
    this.flaws.removeAt(index);
  }

  getActiveCard(exp: string, print: number) {
    if (print && exp) {
      this.activeCard = this.static.Expansions[exp].cards[print-1];
      this.NAcard = !this.activeCard
    } else {
      this.activeCard = undefined;
      this.NAcard = false;
    }
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

}
