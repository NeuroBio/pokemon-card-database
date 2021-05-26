import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddCardComponent } from '../add-card/add-card/add-card.component';
import { AddExpansionComponent } from '../add-expansion/add-expansion/add-expansion.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  addCard() {
    this.dialog.open(AddCardComponent, {
      width: '80vw',
      maxWidth: '650px'
    });
  }

  addExpansion() {
    this.dialog.open(AddExpansionComponent, {
      width: '80vw',
      maxWidth: '650px'
    });
  }

}
