import { DOCUMENT } from '@angular/common';
import { Inject, Component, Input, OnChanges } from '@angular/core';
import {
  CdkDragDrop,
  CdkDragMove,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { BoardService } from '@app/projects/services/board.service';
import { ColumnService } from '@app/projects/services/column.service';
import { TaskService } from '@app/projects/services/task.service';
import { Subscription, switchMap } from 'rxjs';
import { Column } from '@app/shared/models/Column';
import { Task } from '@app/shared/models/Task';
import { ConfirmationService } from '@app/shared/confirmation-modal/service/confirmation.service';
import { ConfirmationTitles } from '@app/shared/confirmation-modal/enum/confirmation-titles';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
})
export class ColumnComponent implements OnChanges {
  @Input() column: Column = new Column();

  searchTerm = this.boardService.search;

  color: string = '';

  columnTitle: string = '';

  tasks: Task[] = [];

  userList: string[] = [];

  columnId: string = '';

  itemToRemove: Task | Column = new Task();

  private currentTitle: string = '';

  disableAutoFocus: boolean = true;

  subscriptions: Subscription = new Subscription();

  constructor(
    private boardService: BoardService,
    private columnService: ColumnService,
    private taskService: TaskService,
    public confirmationService: ConfirmationService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  onDragMoved(event: CdkDragMove<Task[]>): void {
    const scrollSpeed = 30;
    const containerClassName = 'board__all-columns';

    const div = <HTMLElement>(
      this.document.querySelector(`.${containerClassName}`)
    );
    const x = event.pointerPosition.x;
    const clientWidth = div.clientWidth;
    const scrollWidth = div.scrollWidth;
    const scrollDelta = scrollWidth - clientWidth;
    if (clientWidth - x < clientWidth / 4 && event.delta.x !== -1) {
      div.scrollLeft += (scrollDelta - div.scrollLeft) / scrollSpeed;
    }
    if (x < clientWidth / 4 && event.delta.x !== 1) {
      div.scrollLeft -= div.scrollLeft / scrollSpeed;
    }
  }

  ngOnChanges(): void {
    this.columnTitle = this.column.title ?? '';
    if (!this.column._id) {
      this.disableAutoFocus = false;
    }
    this.columnId = this.column._id ?? '';
    this.currentTitle = this.columnTitle;
    this.taskService.allTasks.subscribe((value) => {
      this.tasks = [];
      this.tasks = value.filter((task) => task.columnId === this.columnId);
    });
    this.chooseColor();
  }

  private chooseColor(): void {
    const colorNum = this.columnService.getColor(this.columnId);
    enum Colors {
      indigo,
      red,
      gold,
      blue,
      green,
      orange,
      pink,
    }

    const keys = Object.keys(Colors);
    const realKeys = keys.slice(keys.length / 2, keys.length);
    const random = realKeys[colorNum % (realKeys.length - 1)];

    this.color = `color-${random}`;
  }

  columnNameChange(event?: Event): void {
    if (event) {
      (event.target as HTMLInputElement).blur();
    }
    this.columnTitle = this.columnTitle.trim();
    if (this.columnTitle.length) {
      this.currentTitle = this.columnTitle;
    } else {
      this.columnTitle = this.currentTitle;
    }
    this.columnService
      .saveColumn(this.column._id, this.columnTitle, this.column.order)
      .subscribe((columnResp) => {
        if (!this.columnId) {
          this.columnId = columnResp._id;
        }
      });
  }

  onOpenConfirmModal(itemToRemove: Task | Column): void {
    this.itemToRemove = itemToRemove;
    this.confirmationService.openModal(ConfirmationTitles.Null);
    this.subscriptions.add(
      this.confirmationService.isModalConfirmed$.subscribe(
        (value: boolean): void => {
          if (value) {
            if ('columnId' in this.itemToRemove) {
              this.deleteTask(this.itemToRemove as Task);
            } else {
              this.deleteColumn();
            }
          }
        }
      )
    );
  }

  deleteColumn(): void {
    this.columnService.deleteColumn(this.column._id);
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task).subscribe((tasks) => {
      this.tasks = tasks.filter((item) => item.columnId === this.columnId);
    });
  }

  drop(event: CdkDragDrop<Task[]>): void {
    const tasksSet: Pick<Task, '_id' | 'order' | 'columnId'>[] = [];
    if (event.previousContainer === event.container) {
      if (event.previousIndex === event.currentIndex) {
        return;
      }
      this.boardService.loadingOn();
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    if (event.previousContainer !== event.container) {
      this.boardService.loadingOn();
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      if (event.previousContainer.data.length) {
        event.previousContainer.data.forEach((item, idx) => {
          tasksSet.push({
            _id: item._id,
            order: idx,
            columnId: event.previousContainer.id,
          });
        });
      }
    }
    event.container.data.forEach((item, idx) => {
      tasksSet.push({
        _id: item._id,
        order: idx,
        columnId: event.container.id,
      });
    });
    this.taskService
      .updateTasksSet(tasksSet)
      .pipe(switchMap(() => this.taskService.getTasks()))
      .subscribe((tasks) => {
        this.tasks = tasks.filter(
          (task) => task.columnId === event.container.id
        );
        this.boardService.loadingOff();
      });
  }

  taskRemoved(): void {
    if (this.tasks.length) {
      const tasksSet: Pick<Task, '_id' | 'order' | 'columnId'>[] = [];
      this.boardService.loadingOn();
      this.tasks.forEach((item, idx) => {
        tasksSet.push({ _id: item._id, order: idx, columnId: this.columnId });
      });
      this.taskService.updateTasksSet(tasksSet).subscribe((tasks) => {
        this.tasks = tasks;
        this.boardService.loadingOff();
      });
    }
  }

  newTask(): void {
    const task = new Task();
    task.columnId = this.columnId;
    task.boardId = this.column.boardId;
    this.taskService.editTask(task);
  }
}
