import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsPageComponent } from './pages/projects-page/projects-page.component';
import { ProjectItemComponent } from './components/project-item/project-item.component';
import { UserService } from './services/user.service';
import { TranslateModule } from '@ngx-translate/core';
import { SpinnerModule } from '@app/shared/spinner/spinner.module';
import { BoardModalComponent } from '@app/core/components/board-modal/board-modal.component';

@NgModule({
  declarations: [
    ProjectsPageComponent,
    ProjectItemComponent,
    BoardModalComponent,
  ],
  imports: [
    TranslateModule,
    CommonModule,
    ProjectsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule,
  ],
  providers: [UserService],
})
export class ProjectsModule {}
