import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardPreviewComponent } from './card-preview/card-preview.component';
import { MatCardModule } from '@angular/material/card';
import { IndividualCardComponent } from './individual-card/individual-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    CardPreviewComponent,
    IndividualCardComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,

  ],
  exports: [
    CardPreviewComponent,
    IndividualCardComponent
  ]
})
export class CardPreviewModule { }
