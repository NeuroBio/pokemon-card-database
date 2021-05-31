import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddExpansionComponent } from './add-expansion/add-expansion.component';

const routes: Routes = [
  { path: '', component: AddExpansionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddExpansionRoutingModule { }
