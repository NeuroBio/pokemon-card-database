import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCardComponent } from './add-card/add-card.component';
import { CardResolver } from './resolvers/card.resolver';

const routes: Routes = [
  { path: '',
    children: [
      { path: 'add', component: AddCardComponent },
      { path: 'edit/:CardID', component: AddCardComponent,
        resolve: { card: CardResolver } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCardRoutingModule { }
