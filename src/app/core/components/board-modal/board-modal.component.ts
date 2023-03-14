import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BoardService } from '@app/projects/services/board.service';
import { Subscription, map, defer } from 'rxjs';
import { UserService } from '@app/projects/services/user.service';
import { ToastService } from '@app/shared/toast/service/toast.service';
import { Board } from '@app/shared/models/Board';
import { User } from '@app/shared/models/User';

@Component({
  selector: 'app-board-modal',
  templateUrl: './board-modal.component.html',
  styleUrls: ['./board-modal.component.scss'],
})
export class BoardModalComponent implements OnChanges {
  @Input() isBoardModalVisible: boolean = false;

  @Output() isBoardModalVisibleChange = new EventEmitter<boolean>();

  @Input() boardToEdit: Board = new Board();

  modalTitle: string = '';

  boardForm: FormGroup = new FormGroup({
    boardTitle: new FormControl<string>('', [Validators.required]),
    boardUser: new FormControl<string>(''),
  });

  userList: User[] = [];

  selectedUsers: User[] = [];

  selected: string = '';

  private subscriptions: Subscription = new Subscription();

  constructor(
    private boardService: BoardService,
    private userService: UserService,
    private toastService: ToastService
  ) {}

  ngOnChanges(): void {
    this.subscriptions.add(
      this.userService
        .getUsers()
        .pipe(
          map((users) =>
            users.filter((user) => user._id !== this.boardToEdit.owner)
          )
        )
        .subscribe((users) => {
          this.userList = users;
          this.selectedUsers = [];
          this.boardToEdit.users.forEach((userId) => {
            const foundedUser: User | undefined = this.userList.find(
              (item) => item._id === userId
            );
            if (foundedUser) {
              this.userList = this.userList.filter(
                (item) => item._id !== userId
              );
              this.selectedUsers.push(foundedUser);
            }
          });
          this.modalTitle = this.boardToEdit.title;
          this.boardForm.controls['boardTitle'].setValue(
            this.boardToEdit.title ?? ''
          );
          this.selected = this.boardToEdit.title ? this.boardToEdit.owner : '';
        })
    );
  }

  closeModal(): void {
    this.isBoardModalVisibleChange.emit(false);
  }

  submitForm(): void {
    const result = this.boardToEdit;
    result.title = this.boardForm.controls['boardTitle'].value;
    result.users = this.selectedUsers.map((user) => user._id);
    defer(() =>
      Boolean(this.boardToEdit._id)
        ? this.boardService.updateBoard(result)
        : this.boardService.createBoard(result)
    ).subscribe(() => {
      this.boardToEdit.users = result.users;
      this.closeModal();
    });
  }

  selectUser(): void {
    const userId: string = this.boardForm.controls['boardUser'].value;
    if (this.selectedUsers.length === 10) {
      this.toastService.showToast({
        title: 'User limit reached',
        description: 'Maximum 10 users allowed (include owner)',
        status: 'error',
      });
      return;
    }
    if (userId === '-') return;
    const user: User | undefined = this.userList.find(
      (item) => item._id === userId
    );
    if (user) {
      this.userList = this.userList.filter((item) => item._id !== userId);
      this.selectedUsers.push(user);
    }
    this.selected = '-';
  }

  removeUser(event: Event, userId: string): void {
    event.preventDefault();
    const user: User | undefined = this.selectedUsers.find(
      (item) => item._id === userId
    );
    if (user) {
      this.selectedUsers = this.selectedUsers.filter(
        (item) => item._id !== userId
      );
      this.userList.push(user);
    }
  }
}
