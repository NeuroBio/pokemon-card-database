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
import { AddExpansionModule } from './add-expansion/add-expansion.module';
import { DisplayListsModule } from './display-lists/display-lists.module';

// factories
import { CollectionService } from './_services/collection.service';
import { AuthService } from './_services/auth.service';


// Material imports
import { MatButtonModule } from '@angular/material/button';
import { AddCardModule } from './add-card/add-card.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AddListModule } from './add-list/add-list.module';

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
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    AngularFireFunctionsModule, //cloud functions

    DisplayListsModule,
    AddCardModule,
    AddExpansionModule,
    AddListModule,

    MatButtonModule,
    MatDialogModule,
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
