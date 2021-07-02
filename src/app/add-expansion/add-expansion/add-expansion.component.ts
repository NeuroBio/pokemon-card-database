import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Card } from 'src/app/_objects/expansion';
import { StaticData } from 'src/app/_objects/pokemon-list';
import { CollectionService } from 'src/app/_services/collection.service';
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
  private static = new StaticData();
  parseError = false;
  stringSplitter = new RegExp('(?<![\\.:]|Tapu|Mime)\\s');

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private expansionserv: ExpansionService,
    private router: Router,
    private messenger: MessengerService,
    private collectionserv: CollectionService) { }

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

  onFileInput(fileInput: any): void {
    if (!fileInput.target.files[0]) {
      return;
    }
    this.parseError = false;
    this.reader.onload = () => {
      try { // try to parse file
        const contents = this.reader.result as string;
        this.parseCSV(contents);
      } catch (err) { // TODO: give viual cues to parse errors
        this.parseError = true;
        console.error(err);
      }
    };
    return this.reader.readAsText(fileInput.target.files[0]);
  }

  parseCSV(contents: string): void {
    const numProp = 4
    const properties = contents.replace(/\r?\n|\r/g, ',').split(',');
    if (properties[properties.length - 1] === '') {
      properties.pop();
    }
    const numCards = properties.length / numProp;
    const cards = [];

    // Check if there are n properties per card
    if (numCards % 1 !== 0) {
      throw new Error('CSV file did not have the expected number of properties.');
    }

    // create cards
    for (let i = 0; i < numCards; i++) {
      // handle special characters
      const name = properties[0 + numProp * i]
        .replace('(m)', '♂').replace('(f)', '♀').replace('\'', '’').replace(new RegExp('�', 'g'), 'é');
      const type = properties[1 + numProp * i]
      if (!this.static.ValidTypes.includes(type)) {
        throw new Error (`Found unexpected type in card ${i + 1}: ${properties[1 + numProp * i]}`);
      }
      const rarity = properties[2 + numProp * i];
      const dex = this.getDexNumber(name, type);
      const newCard = new Card(name, type, dex , i + 1, rarity);
      
      // add special print info if any exists
      if (properties[3 + numProp * i]) {
        newCard.specialPrint = properties[3 + numProp * i];
      }
      cards.push(newCard);
    }

    this.expansionForm.patchValue({ cards });
  }

  getDexNumber(name: string, type: string): number {

    // early abort
    if (type !== 'Pokémon') {
      return null;
    }
    const nameParts = name.split(this.stringSplitter);

    // standard
    for(let i = 0; i < nameParts.length; i++) {
      let ind = this.static.NationalDex.findIndex(poke => poke === nameParts[i]);
      if (ind !== -1) {
        return ind;
      }
    }
    throw new Error(`Pokémon ${name} not in Pokédex.`);
  }

  clearCards(): void {
    this.expansionForm.patchValue({ cards: '' });
  }

  submit(): Promise<void> {
    this.isLoading = true;
    return this.expansionserv.addExpansion(this.expansionForm.value)
      .then(res => {
        this.isLoading = false;
        if (res) {
          this.messenger.send('Expansion uploaded.');
          this.reset();
        } else {
          this.messenger.send('Only the Admin may add or edit expansions.');
        }
    });
  }

  close(): void {
    this.router.navigate([this.collectionserv.activeList]);
  }

  reset() {
    this.expansionForm.patchValue({
      name: '',
      release: this.expansionForm.value['release'] + 1,
      numCards: 1,
      cards: ''
    })
  }

}
