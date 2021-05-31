import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddListComponent } from './add-list/add-list.component';

const routes: Routes = [
  { path: '', component: AddListComponent,
    children: [
      { path: 'edit', component: AddListComponent}
    ]
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddListRoutingModule { }
