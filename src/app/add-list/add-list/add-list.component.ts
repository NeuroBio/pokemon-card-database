import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-list',
  templateUrl: './add-list.component.html',
  styleUrls: ['./add-list.component.scss']
})
export class AddListComponent implements OnInit {

  listForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  createForm(): FormGroup {
    return this.fb.group({});
  }

}
