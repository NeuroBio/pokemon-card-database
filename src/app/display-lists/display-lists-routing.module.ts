import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BinderViewComponent } from './binder-view/binder-view.component';
import { MainDisplayComponent } from './main-display/main-display.component';
import { ListResolver } from './resolvers/list.resolver';

const routes: Routes = [
  { path: '', redirectTo: 'Masterlist' },
  { path: ':ChecklistID',
    resolve: { checklist: ListResolver },
    children: [
      { path: '', component: MainDisplayComponent },
      { path: 'binder', component: BinderViewComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisplayListsRoutingModule { }
