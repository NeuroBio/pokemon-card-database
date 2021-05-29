import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddCardComponent } from '../add-card/add-card/add-card.component';
import { AddExpansionComponent } from '../add-expansion/add-expansion/add-expansion.component';
import { AddListComponent } from '../add-list/add-list/add-list.component';

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
      maxWidth: '1050px'
    });
  }

  addExpansion() {
    this.dialog.open(AddExpansionComponent, {
      width: '80vw',
      maxWidth: '650px'
    });
  }

  addList() {
    this.dialog.open(AddListComponent, {
      width: '80vw',
      maxWidth: '800px'
    });
  }

}
