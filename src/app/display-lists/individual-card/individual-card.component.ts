import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddCardComponent } from 'src/app/add-card/add-card/add-card.component';
import { CardInstance } from 'src/app/_objects/card-instance';

@Component({
  selector: 'app-individual-card',
  templateUrl: './individual-card.component.html',
  styleUrls: ['./individual-card.component.scss']
})
export class IndividualCardComponent implements OnInit {

  @Input() instance: CardInstance = new CardInstance(0, 'False Hoods', 'Spectacular', 'M', []);
  @Input() allowEdit: boolean = false;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  edit(): void {
    this.dialog.open(AddCardComponent, {
      width: '80vw',
      maxWidth: '650px',
      data: this.instance
    });
  }

}
