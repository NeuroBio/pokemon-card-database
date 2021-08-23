import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
    private cdRef: ChangeDetectorRef,
    private auth: AuthService
  ) {
      this.matIconRegistry.addSvgIcon(
        'google-logo',
        this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/google.svg'));
  }

  ngOnInit(): void {
    this.populationSubscription = this.collectionserv.populationCount
      .subscribe(pop => {
        this.population = pop;
        this.cdRef.detectChanges();
      });
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

  getActiveList(): string {
    return this.collectionserv.activeList;
  }

}
