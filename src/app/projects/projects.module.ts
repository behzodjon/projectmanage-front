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
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ColumnComponent } from './components/column/column.component';
import { TaskCardComponent } from './components/task-card/task-card.component';
import { BoardPageComponent } from './pages/board-page/board-page.component';
import { ColumnService } from './services/column.service';
import { TaskService } from './services/task.service';
import { TaskModalComponent } from './components/task-modal/task-modal.component';

@NgModule({
  declarations: [
    BoardPageComponent,
    ProjectsPageComponent,
    ProjectItemComponent,
    BoardModalComponent,
    ColumnComponent,
    TaskCardComponent,
    TaskModalComponent,
  ],
  imports: [
    TranslateModule,
    CommonModule,
    ProjectsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule,
    DragDropModule,
  ],
  providers: [UserService, ColumnService, TaskService],
})
export class ProjectsModule {}
