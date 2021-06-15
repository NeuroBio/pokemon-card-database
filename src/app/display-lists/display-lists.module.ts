import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DisplayListsRoutingModule } from './display-lists-routing.module';

// Declarations
import { MainDisplayComponent } from './main-display/main-display.component';
import { CardTableComponent } from './card-table/card-table.component';

// Custom imports
import { CardPreviewModule } from '../card-preview/card-preview.module';
import { ConfirmModule } from '../confirm/confirm.module';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BinderViewComponent } from './binder-view/binder-view.component';

@NgModule({
  declarations: [
    CardTableComponent,
    MainDisplayComponent,
    BinderViewComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    CardPreviewModule,
    ConfirmModule,

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
    MatTooltipModule,

    DisplayListsRoutingModule
  ],
  exports: [
    MainDisplayComponent
  ]
})
export class DisplayListsModule { }
