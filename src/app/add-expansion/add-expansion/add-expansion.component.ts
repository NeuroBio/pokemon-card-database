import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Card } from 'src/app/_objects/expansion';
import { StaticData } from 'src/app/_objects/pokemon-list';

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
        this.parseCSV(contents);
      } catch (err) {
        this.parseError = true;
        console.error(err);
      }
    };
    return this.reader.readAsText(fileInput.target.files[0]);
  }

  parseCSV(contents: string) {
    const properties = contents.split(',');
    const numCards = properties.length / 3;
    const cards = [];
    
    // Chekc if there are three properties per card
    if (numCards % 1 !== 0) {
      throw new Error('CSV file did not have the expected numer of properties.');
    }

    // create cards
    for(let i = 0; i < numCards; i++) {
      const name = properties[0 + 3 * i];
      const type = properties[1 + 3 * i];
      const rarity = properties[2 + 3 * i];
      const dex = this.getDexNumber(name, type);

      cards.push(new Card(name, type, dex ,i , rarity));
    }

    this.expansionForm.patchValue({ cards });
  }

  getDexNumber(name: string, type: string): number {
    if (type !== 'pokemon') {
      return null;
    }
    const nameParts = name.split(' ');
    let ind = this.static.NationalDex.findIndex(name => name === nameParts[0]);
    if (ind === -1) {
      ind = this.static.NationalDex.findIndex(name => name === nameParts[1]);
      if (ind === -1) {
        throw new Error('Pokemon not in Pokedex');
      }
    }
    return ind;
  }

}
