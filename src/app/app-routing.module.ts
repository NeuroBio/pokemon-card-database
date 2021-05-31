import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '',
    loadChildren: () => import('./display-lists/display-lists.module')
    .then(m => m.DisplayListsModule)
  },
  { path: 'expansion',
    loadChildren: () => import('./add-expansion/add-expansion.module')
      .then(m => m.AddExpansionModule)
  },
  { path: 'card',
    loadChildren: () => import('./add-card/add-card.module')
      .then(m => m.AddCardModule)
  },
  { path: 'checklist',
    loadChildren: () => import('./add-list/add-list.module')
      .then(m => m.AddListModule)
  },
  // { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
