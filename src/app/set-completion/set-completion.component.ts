import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SetExpansion } from '../_objects/expansion';
import { CollectionService } from '../_services/collection.service';

@Component({
  selector: 'app-set-completion',
  templateUrl: './set-completion.component.html',
  styleUrls: ['./set-completion.component.scss']
})
export class SetCompletionComponent implements OnInit {

  expansions: SetExpansion[];
  expansionNames: string[];
  cards: any;
  setInfo = {};
  activeSetInfo: any;
  activeSet: FormControl;
  setSubscription: Subscription;

  constructor(
    private collectionserv: CollectionService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.activeSet = this.fb.control('Base Set');
    this.setSubscription = this.activeSet.valueChanges
      .subscribe(name => this.getSetInfo(name));
    this.expansions = this.collectionserv.expansions.value;
    this.expansionNames = this.collectionserv.getExpansionNames();
    this.cards = this.collectionserv.allCards.value;
    this.getSetInfo('Base Set');
    console.log(this.activeSetInfo)
  }

  getSetInfo(expName: string): void {
    // create set data if it does not exist
    if (!this.setInfo[expName]) {
      const exp = this.expansions[expName];
      const rarity = {};
      const ownership = [];
      let cardCount = 0;
      let unique = 0;
  
      exp.cards.forEach(card => {
        const instances = this.cards[`${expName}-${card.printNumber}`];
        if (instances) {
          const numCards = Object.keys(instances).length;
          unique += 1;
          cardCount += numCards;
          ownership.push(numCards);
          if (!rarity[card.rarity]) {
            rarity[card.rarity] = 0;
          }
          rarity[card.rarity] += 1;
        } else {
          ownership.push(0);
        }
      });
  
      this.setInfo[expName] =  { expName, rarity, cardCount,
        unique, ownership, print: exp.numCards, total: exp.cards.length };  
    }

    // set the active data
    this.activeSetInfo = this.setInfo[expName];
  }

}
