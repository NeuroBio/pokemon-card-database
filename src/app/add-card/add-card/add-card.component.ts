import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit {

  cardForm: FormGroup;
  creases: FormArray;
  dents: FormArray;
  scratches: FormArray;
  whitening: FormArray;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.cardForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      expansionName: ['', Validators.required],
      printNumber: ['', Validators.required],
      condition: '',
      type: 'standard',
      front: '',
      back: '',
      creases: this.creases,
      dents: this.dents,
      scratches: this.scratches,
      whitening: this.whitening
    });
  }

  createFlawArray(): FormArray {
    return this.fb.array([]);
  }

  addFlaw() {
    return this.fb.group({
      where: ['', Validators.required],
      landmark: ['', Validators.required],
      severity: ['', Validators.required]
    })
  }

}
