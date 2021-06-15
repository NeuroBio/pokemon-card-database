import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-go-back',
  templateUrl: './go-back.component.html',
  styleUrls: ['./go-back.component.scss']
})
export class GoBackComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  close(): void {
    this.router.navigate(['']);
  }
}
