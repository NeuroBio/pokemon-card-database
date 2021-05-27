import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Card } from 'src/app/_objects/expansion';
import { StaticData } from 'src/app/_objects/pokemon-list';
import { ExpansionService } from 'src/app/_services/expansion.service';
import { MessengerService } from 'src/app/_services/messenger.service';

@Component({
  selector: 'app-add-expansion',
  templateUrl: './add-expansion.component.html',
  styleUrls: ['./add-expansion.component.scss']
})
export class AddExpansionComponent implements OnInit {

  expansionForm: FormGroup;
  private reader = new FileReader();
  private static = new StaticData()
  parseError = false;

  constructor(
    private fb: FormBuilder,
    private expansionserv: ExpansionService,
    private messenger: MessengerService,
    @Optional() public dialogRef: MatDialogRef<AddExpansionComponent>) { }

  ngOnInit(): void {
    this.expansionForm = this.createExpansionForm();
  }

  createExpansionForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      cards: ['', Validators.required],
      generation: [1, Validators.required],
      release: [1, Validators.required],
      numCards: [1, Validators.required]
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
        this.parseCSV(contents);
      } catch (err) {
        this.parseError = true;
        console.error(err);
      }
    };
    return this.reader.readAsText(fileInput.target.files[0]);
  }

  parseCSV(contents: string) {
    const properties = contents.replace(/\r?\n|\r/g, ',').split(',');
    console.log(properties.length)
    if (properties[properties.length-1] === '') {
      properties.pop();
    }
    const numCards = properties.length / 3;
    const cards = [];
    
    // Chekc if there are three properties per card
    if (numCards % 1 !== 0) {
      throw new Error('CSV file did not have the expected numer of properties.');
    }

    // create cards
    for(let i = 0; i < numCards; i++) {
      const name = properties[0 + 3 * i]
        .replace('(m)', '♂').replace('(f)', '♀').replace("'",'’').replace('�', 'é');
      const type = properties[1 + 3 * i].toLowerCase();
      if (!this.static.ValidTypes.includes(type)) {
        throw new Error (`Found unexpected type in card ${i+1}: ${properties[1 + 3 * i]}`);
      }
      const rarity = properties[2 + 3 * i];
      const dex = this.getDexNumber(name, type);

      cards.push(new Card(name, type, dex , i + 1, rarity));
    }

    this.expansionForm.patchValue({ cards });
  }

  getDexNumber(name: string, type: string): number {

    // early abort
    if (type !== 'pokemon') {
      return null;
    }

    const nameParts = name.split(' ');
    let ind = this.static.NationalDex.findIndex(name => name === nameParts[0]);
    if (ind === -1) {
      ind = this.static.NationalDex.findIndex(name => name === nameParts[1]);
      if (ind === -1) {
        throw new Error(`Pokemon ${name} not in Pokedex`);
      }
    }
    return ind;
  }

  clearCards() {
    this.expansionForm.patchValue({ cards: '' });
  }

  submit() {
    return this.expansionserv.addExpansion(this.expansionForm.value)
      .then(() => {
        this.messenger.send('Expansion uploaded.');
        this.dialogRef.close();
    });
  }

  close() {
    this.dialogRef.close();
  }

}
