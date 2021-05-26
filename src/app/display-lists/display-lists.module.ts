import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DisplayListsRoutingModule } from './display-lists-routing.module';
import { CardTableComponent } from './card-table/card-table.component';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MainDisplayComponent } from './main-display/main-display.component';
import { AddCardModule } from '../add-card/add-card.module';


@NgModule({
  declarations: [
    CardTableComponent,
    MainDisplayComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    AddCardModule,

    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,

    DisplayListsRoutingModule
  ],
  exports: [
    MainDisplayComponent
  ]
})
export class DisplayListsModule { }
