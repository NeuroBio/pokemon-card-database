import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './confirm/confirm.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';



@NgModule({
  declarations: [
    ConfirmComponent
  ],
  imports: [
    CommonModule,

    MatButtonModule,
    MatDividerModule,
    MatIconModule
  ],
  exports: [
    ConfirmComponent
  ]
})
export class ConfirmModule { }
