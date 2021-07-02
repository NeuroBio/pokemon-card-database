import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddExpansionComponent } from './add-expansion/add-expansion.component';
import { ExpansionHomeComponent } from './expansion-home/expansion-home.component';

const routes: Routes = [
  { path: 'add', component: AddExpansionComponent },
  { path: 'view', component: ExpansionHomeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddExpansionRoutingModule { }
