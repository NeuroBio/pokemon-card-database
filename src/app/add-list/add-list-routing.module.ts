import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddListComponent } from './add-list/add-list.component';
import { ChecklistResolver } from './resolvers/checklist.resolver';

const routes: Routes = [
  { path: '',
    children: [
      { path: 'add', component: AddListComponent },
      { path: 'edit/:ChecklistID', component: AddListComponent,
        resolve: { checklist: ChecklistResolver } }
    ]
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddListRoutingModule { }
