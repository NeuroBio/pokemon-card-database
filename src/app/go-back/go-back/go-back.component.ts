import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CollectionService } from 'src/app/_services/collection.service';

@Component({
  selector: 'app-go-back',
  templateUrl: './go-back.component.html',
  styleUrls: ['./go-back.component.scss']
})
export class GoBackComponent implements OnInit {

  constructor(
    private router: Router,
    private collectionserv: CollectionService
    ) { }

  ngOnInit(): void {
  }

  close(): void {
    this.router.navigate([this.collectionserv.activeList]);
  }
}
