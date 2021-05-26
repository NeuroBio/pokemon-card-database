import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddExpansionRoutingModule } from './add-expansion-routing.module';
import { AddExpansionComponent } from './add-expansion/add-expansion.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    AddExpansionComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,

    AddExpansionRoutingModule
  ],
  exports: [
    AddExpansionComponent
  ]
})
export class AddExpansionModule { }
