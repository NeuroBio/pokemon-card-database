import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetCompletionComponent } from './set-completion.component';

const routes: Routes = [
  { path: '', component: SetCompletionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetCompletionRoutingModule { }
