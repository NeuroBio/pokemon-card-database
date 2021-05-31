import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainDisplayComponent } from './main-display/main-display.component';

const routes: Routes = [
  { path: '', component: MainDisplayComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisplayListsRoutingModule { }
