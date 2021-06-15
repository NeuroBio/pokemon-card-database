import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoBackComponent } from './go-back/go-back.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    GoBackComponent
  ],
  imports: [
    CommonModule,
    RouterModule,

    MatIconModule,
    MatButtonModule
  ],
  exports: [
    GoBackComponent
  ]
})
export class GoBackModule { }
