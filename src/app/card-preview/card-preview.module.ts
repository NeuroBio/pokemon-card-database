import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardPreviewComponent } from './card-preview/card-preview.component';
import { MatCardModule } from '@angular/material/card';



@NgModule({
  declarations: [
    CardPreviewComponent
  ],
  imports: [
    CommonModule,
    MatCardModule
  ],
  exports: [
    CardPreviewComponent
  ]
})
export class CardPreviewModule { }
