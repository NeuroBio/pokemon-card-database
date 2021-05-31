import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'expansion',
    loadChildren: () => import('./add-expansion/add-expansion.module')
      .then(m => m.AddExpansionModule)
  },
  { path: 'checklist',
    loadChildren: () => import('./add-list/add-list.module')
      .then(m => m.AddListModule)
  },
  { path: 'card',
    loadChildren: () => import('./add-card/add-card.module')
      .then(m => m.AddCardModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
