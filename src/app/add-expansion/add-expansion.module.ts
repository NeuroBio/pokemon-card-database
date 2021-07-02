import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


import { AddExpansionRoutingModule } from './add-expansion-routing.module';
import { AddExpansionComponent } from './add-expansion/add-expansion.component';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GoBackModule } from '../go-back/go-back.module';
import { ExpansionViewerComponent } from './expansion-viewer/expansion-viewer.component';
import { ExpansionHomeComponent } from './expansion-home/expansion-home.component';
import { MatSelectModule } from '@angular/material/select';
import { ConfirmModule } from '../confirm/confirm.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AddExpansionComponent,
    ExpansionViewerComponent,
    ExpansionHomeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    GoBackModule,
    ConfirmModule,

    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    AddExpansionRoutingModule
  ],
  exports: [
    AddExpansionComponent
  ]
})
export class AddExpansionModule { }
