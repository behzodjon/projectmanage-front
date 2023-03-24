import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('../auth/auth.module').then((m) => m.AuthModule),
  },
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },

  { path: 'welcome', component: WelcomePageComponent },

  {
    path: 'projects',
    loadChildren: () =>
      import('../projects/projects.module').then((m) => m.ProjectsModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
