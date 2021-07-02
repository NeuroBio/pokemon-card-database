import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-expansion-viewer',
  templateUrl: './expansion-viewer.component.html',
  styleUrls: ['./expansion-viewer.component.scss']
})
export class ExpansionViewerComponent implements OnInit {

  @Input() cards = [];
  
  constructor() { }

  ngOnInit(): void {
  }

}
