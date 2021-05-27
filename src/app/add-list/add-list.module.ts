import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddListRoutingModule } from './add-list-routing.module';
import { AddListComponent } from './add-list/add-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [
    AddListComponent
  ],
  imports: [
    CommonModule,
    AddListRoutingModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    DragDropModule
    
  ]
})
export class AddListModule { }
