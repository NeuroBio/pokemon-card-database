import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCardComponent } from './add-card/add-card.component';

const routes: Routes = [
  { path: '', component: AddCardComponent,
    children: [
      { path: 'edit/:CardID', component: AddCardComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCardRoutingModule { }
