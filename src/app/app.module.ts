import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// packages
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AngularFireStorageModule }   from '@angular/fire/storage';

// declarations
import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';

// custom modules
// import { DisplayListsModule } from './display-lists/display-lists.module';

// factories
import { CollectionService } from './_services/collection.service';
import { AuthService } from './_services/auth.service';


// Material imports
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';

export function CollectionFactory(provider: CollectionService) {
  return () => provider.load();
}

export function AuthFactory(provider: AuthService) {
  return () => provider.load();
}
@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    AngularFireFunctionsModule, //cloud functions

    // DisplayListsModule,

    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,

    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
    CollectionService,
    { provide: APP_INITIALIZER, useFactory: CollectionFactory,
      deps: [CollectionService], multi: true },

    AuthService,
    { provide: APP_INITIALIZER, useFactory: AuthFactory,
      deps: [AuthService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
