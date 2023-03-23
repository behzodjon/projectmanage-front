import { Component, EventEmitter, Input, OnChanges, Output, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '@app/projects/services/task.service';
import { BoardService } from '@app/projects/services/board.service';
import { UserService } from '@app/projects/services/user.service';
import { map, Subscription, switchMap, tap } from 'rxjs';
import { ToastService } from '@app/shared/toast/service/toast.service';
import { Task } from '@app/shared/models/Task';
import { User } from '@app/shared/models/User';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss'],
})
export class TaskModalComponent implements OnChanges, OnDestroy, OnInit {
  @Input() isModalVisible: boolean = false;

  @Output() isModalVisibleChange = new EventEmitter<boolean>();

  @Input() taskToEdit: Task = new Task();

  modalTitle: string = '';

  taskForm: FormGroup = new FormGroup({
    taskTitle: new FormControl<string>('', [Validators.required]),
    taskDescription: new FormControl<string>(''),
    taskUser: new FormControl<string>(''),
  });

  private boardUsers: User[] = [];

  userList: User[] = [];

  selectedUsers: User[] = [];

  selected: string = '';

  subscriptions = new Subscription();

  constructor(
    private taskService: TaskService,
    private boardService: BoardService,
    private userService: UserService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    let usersOnBoard: string[] = [];
    this.subscriptions.add(
      this.boardService.board
        .pipe(
          tap((board) => {
            usersOnBoard = board.users;
          }),
          switchMap(() => this.userService.userList),
          map((users: User[]) => users.filter((user) => usersOnBoard.includes(user._id))),
        )
        .subscribe((users: User[]) => {
          this.boardUsers = users;
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnChanges(): void {
    this.userList = [...this.boardUsers];
    this.selectedUsers = [];
    this.taskToEdit.users.forEach((userId) => {
      const user: User | undefined = this.userList.find((item) => item._id === userId);
      if (user) {
        this.userList = this.userList.filter((item) => item._id !== userId);
        this.selectedUsers.push(user);
      }
    });
    this.modalTitle = this.taskToEdit.title; // ? 'Task edit' : 'Create new task';
    this.taskForm.controls['taskTitle'].setValue(this.taskToEdit.title ?? '');
    this.taskForm.controls['taskDescription'].setValue(this.taskToEdit.description ?? '');
    this.selected = this.taskToEdit.title ? this.taskToEdit.userId : '';
  }

  closeModal(): void {
    this.isModalVisibleChange.emit(false);
  }

  submitForm(): void {
    const resultTask = this.taskToEdit;
    resultTask.title = this.taskForm.controls['taskTitle'].value;
    resultTask.description = this.taskForm.controls['taskDescription'].value;
    resultTask.users = this.selectedUsers.map((user) => user._id);
    this.taskToEdit.users = resultTask.users;
    this.closeModal();
    this.taskService.saveTask(resultTask);
  }

  selectUser(): void {
    const userId: string = this.taskForm.controls['taskUser'].value;
    if (userId === '-') return;
    if (this.selectedUsers.length === 9) {
      this.toastService.showToast({
        title: 'User limit reached',
        description: 'Maximum 10 users allowed (include owner)',
        status: 'error',
      });
      return;
    }
    const user: User | undefined = this.userList.find((item) => item._id === userId);
    if (user) {
      this.userList = this.userList.filter((item) => item._id !== userId);
      this.selectedUsers.push(user);
    }
    this.selected = '-';
  }

  removeUser(event: Event, userId: string): void {
    event.preventDefault();
    const user: User | undefined = this.selectedUsers.find((item) => item._id === userId);
    if (user) {
      this.selectedUsers = this.selectedUsers.filter((item) => item._id !== userId);
      this.userList.push(user);
    }
  }
}
