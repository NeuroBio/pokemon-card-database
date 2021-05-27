import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddListRoutingModule } from './add-list-routing.module';
import { AddListComponent } from './add-list/add-list.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddListComponent
  ],
  imports: [
    CommonModule,
    AddListRoutingModule,
    ReactiveFormsModule
    
  ]
})
export class AddListModule { }
