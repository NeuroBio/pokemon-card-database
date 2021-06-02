import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Population } from '../_objects/card-instance';
import { AuthService } from '../_services/auth.service';
import { CollectionService } from '../_services/collection.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit{

  population: Population;
  populationSubscription: Subscription;

  constructor(
    private collectionserv: CollectionService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private auth: AuthService
  ) {
      this.matIconRegistry.addSvgIcon(
        'google-logo',
        this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/google.svg'));
  }

  ngOnInit() {
    this.populationSubscription = this.collectionserv.populationCount
      .subscribe(pop => this.population = pop);
  }

  changelogin(): void {
    if (this.isLoggedIn()) {
      this.auth.logout();
    } else {
      this.auth.googleLogin();
    }
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn;
  }

}
