import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// declarations
import { AddListRoutingModule } from './add-list-routing.module';
import { AddListComponent } from './add-list/add-list.component';
import { PickCardComponent } from './pick-card/pick-card.component';

// custom imports
import { CardPreviewModule } from '../card-preview/card-preview.module';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GoBackModule } from '../go-back/go-back.module';


@NgModule({
  declarations: [
    AddListComponent,
    PickCardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    CardPreviewModule,
    GoBackModule,

    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSlideToggleModule,
    DragDropModule,

    AddListRoutingModule
  ]
})
export class AddListModule { }
