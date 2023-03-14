import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProjectsPageComponent } from './pages/projects-page/projects-page.component';
import { BoardPageComponent } from './pages/board-page/board-page.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectsPageComponent,
  },
  {
    path: 'board/:id',
    component: BoardPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsRoutingModule {}
