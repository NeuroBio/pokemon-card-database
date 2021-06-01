import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private auth: AuthService
  ) {
      this.matIconRegistry.addSvgIcon(
        'google-logo',
        this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/google.svg'));
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
