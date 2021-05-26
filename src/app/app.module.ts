import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DisplayListsModule } from './display-lists/display-lists.module';
import { CollectionService } from './_services/collection.service';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { AddCardModule } from './add-card/add-card.module';
import { AddExpansionModule } from './add-expansion/add-expansion.module';

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
