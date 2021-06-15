import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainDisplayComponent } from './main-display/main-display.component';
import { ListResolver } from './resolvers/list.resolver';

const routes: Routes = [
  { path: '', redirectTo: 'Masterlist' },
  { path: ':ChecklistID', component: MainDisplayComponent,
    resolve: { checklist: ListResolver } },
  // { path: 'binder', component: MainDisplayComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisplayListsRoutingModule { }
