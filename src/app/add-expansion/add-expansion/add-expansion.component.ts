import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-expansion',
  templateUrl: './add-expansion.component.html',
  styleUrls: ['./add-expansion.component.scss']
})
export class AddExpansionComponent implements OnInit {

  expansionForm: FormGroup;
  private reader = new FileReader();
  parseError = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.expansionForm = this.createExpansionForm();
  }

  createExpansionForm(): FormGroup {
    return this.fb.group({
      cards: '',
      generation: 1,
      release: 1,
      numCards: 1
    });
  }

  onFileInput(fileInput: any) {
    if (!fileInput.target.files[0]) {
      return;
    }
    this.parseError = false;
    this.reader.onload = () => {
      try { // try to parse file
        const contents = this.reader.result as string;
      } catch (err) {
        this.parseError = true;
        console.error(err);
      }
    };
    return this.reader.readAsText(fileInput.target.files[0]);
  }

}
