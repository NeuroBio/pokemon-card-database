import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// packages
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

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


// Material imports
import { MatButtonModule } from '@angular/material/button';
import { AddCardModule } from './add-card/add-card.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

export function CollectionFactory(provider: CollectionService) {
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
    DisplayListsModule,
    AddCardModule,
    AddExpansionModule,

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
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
