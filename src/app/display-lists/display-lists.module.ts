import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DisplayListsRoutingModule } from './display-lists-routing.module';
import { CardTableComponent } from './card-table/card-table.component';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
  declarations: [
    CardTableComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,

    DisplayListsRoutingModule
  ],
  exports: [
    CardTableComponent
  ]
})
export class DisplayListsModule { }
