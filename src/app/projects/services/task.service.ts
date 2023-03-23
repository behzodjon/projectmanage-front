import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '@app/shared/models/Task';
import { BehaviorSubject, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { BoardService } from './board.service';
import { ColumnService } from './column.service';

@Injectable()
export class TaskService {
  task: Subject<Task> = new Subject<Task>();

  private taskStore: Task[] = [];

  allTasks: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);

  constructor(private http: HttpClient, private boardService: BoardService, private columnService: ColumnService) {}

  editTask(task: Task): void {
    if (!task.userId) {
      task.userId = this.boardService.owner;
    }
    this.task.next(task);
  }

  getTasks(): Observable<Task[]> {
    this.boardService.loadingOn();
    return this.http.get<Task[]>(`tasksSet/${this.boardService.boardId}`).pipe(
      map((tasks) => {
        return tasks.sort((a, b) => a.order - b.order);
      }),
      tap((tasks) => {
        this.taskStore = tasks;
        this.allTasks.next(tasks);
        // this.boardService.loadingOff();
      }),
    );
  }

  createTask(task: Task): Observable<Task> {
    const { title, order, description, userId, users } = task;
    return this.http.post<Task>(`boards/${this.boardService.boardId}/columns/${task.columnId}/tasks`, {
      title,
      order,
      description,
      userId,
      users,
    });
  }

  updateTask(task: Task): Observable<Task> {
    const { title, order, columnId, description, userId, users } = task;
    this.boardService.loadingOn();
    return this.http
      .put<Task>(`boards/${this.boardService.boardId}/columns/${task.columnId}/tasks/${task._id}`, {
        title,
        order,
        columnId,
        description,
        userId,
        users,
      })
      .pipe(
        tap(() => {
          this.taskStore = this.taskStore.map((item) => {
            if (item._id === task._id) {
              return task;
            }
            return item;
          });
          this.allTasks.next(this.taskStore);
          this.boardService.loadingOff();
        }),
      );
  }

  deleteTask(task: Task): Observable<Task[]> {
    this.boardService.loadingOn();
    const endpoint = `boards/${this.boardService.boardId}/columns/${task.columnId}/tasks/${task._id}`;
    return this.http.delete<Response>(endpoint).pipe(
      switchMap(() => {
        this.taskStore = this.taskStore.filter((item) => item._id !== task._id);
        this.allTasks.next(this.taskStore);
        this.boardService.loadingOff();
        return of(this.taskStore);
      }),
    );
  }

  updateTasksSet(tasksSet: Pick<Task, '_id' | 'order' | 'columnId'>[]): Observable<Task[]> {
    return this.http.patch<Task[]>('tasksSet', tasksSet);
  }

  saveTask(task: Task): void {
    if (!task.description) {
      task.description = ' ';
    }
    this.boardService.loadingOn();
    if (task._id) {
      this.updateTask(task).subscribe(() => {
        this.taskStore = this.taskStore.map((item) => {
          if (item._id === task._id) {
            return task;
          }
          return item;
        });
        this.allTasks.next(this.taskStore);
        this.boardService.loadingOff();
      });
    } else {
      this.createTask(task).subscribe((taskResp) => {
        this.taskStore.push(taskResp);
        this.allTasks.next(this.taskStore);
        this.boardService.loadingOff();
      });
    }
  }
}
