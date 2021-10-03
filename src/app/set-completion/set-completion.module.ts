import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetCompletionComponent } from './set-completion.component';
import { SetCompletionRoutingModule } from './set-completion-routing-module';
import { GoBackModule } from '../go-back/go-back.module';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    SetCompletionComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SetCompletionRoutingModule,
    GoBackModule,

    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule
  ]
})
export class SetCompletionModule { }
