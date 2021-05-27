import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'

// internal module components
import { AddCardRoutingModule } from './add-card-routing.module';
import { AddCardComponent } from './add-card/add-card.component';

// Material Imports
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from'@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmModule } from '../confirm/confirm.module';
import { CardPreviewModule } from '../card-preview/card-preview.module';

@NgModule({
  declarations: [
    AddCardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    ConfirmModule,
    CardPreviewModule,

    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,

    AddCardRoutingModule
  ],
  exports: [
    AddCardComponent
  ]
})
export class AddCardModule { }
