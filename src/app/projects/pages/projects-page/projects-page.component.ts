import { Component, OnDestroy, OnInit } from '@angular/core';
import { BoardService } from '@app/projects/services/board.service';
import { UserService } from '@app/projects/services/user.service';
import { ConfirmationTitles } from '@app/shared/confirmation-modal/enum/confirmation-titles';
import { ConfirmationService } from '@app/shared/confirmation-modal/service/confirmation.service';
import { Board } from '@app/shared/models/Board';
import { Subscription, BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.scss'],
})
export class ProjectsPageComponent implements OnInit, OnDestroy {
  boards: BehaviorSubject<Board[]> = new BehaviorSubject<Board[]>([]);

  private _isModalVisible: boolean = false;

  private isNeedToRefresh: boolean = false;

  boardToEdit: Board = new Board();

  boardToDelete: Board = new Board();

  _filter!: string;

  isLoading = this.boardService.isLoading;

  constructor(
    private boardService: BoardService,
    private userService: UserService,
    public confirmationService: ConfirmationService
  ) {}

  subscriptions: Subscription = new Subscription();

  set filter(value: string) {
    this._filter = value;
  }

  get filter(): string {
    return this._filter;
  }

  get isBoardModalVisible(): boolean {
    return this._isModalVisible;
  }

  set isBoardModalVisible(value: boolean) {
    this._isModalVisible = value;
    if (this.isNeedToRefresh) {
      this.getBoards();
    }
    if (value) {
      this.isNeedToRefresh = true;
    }
  }

  ngOnInit(): void {
    this.boardService.loadingOn();
    this.subscriptions.add(
      this.userService.getUsers().subscribe(() => this.getBoards())
    );
    this.subscriptions.add(
      this.boardService.trigger$.subscribe((value) => {
        this.isBoardModalVisible = value;
        this.addBoard();
      })
    );
  }

  getBoards(): void {
    this.boardService.allBoards.subscribe((boards) => {
      this.boards.next(boards);
      this.boardService.loadingOff();
    });
  }

  addBoard(): void {
    this.boardToEdit = new Board();
    this.boardToEdit.title = 'New board';
    this.boardToEdit.owner = this.boardService.currentUser._id;
    this.isBoardModalVisible = true;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  editProject(board: Board): void {
    this.boardToEdit = board;
    this.isBoardModalVisible = true;
  }

  onOpenConfirmModal(board: Board): void {
    this.boardToDelete = board;
    this.confirmationService.openModal(ConfirmationTitles.DeleteBoard);
    this.subscriptions.add(
      this.confirmationService.isModalConfirmed$.subscribe(
        (value: boolean): void => {
          if (value) {
            this.deleteProject();
          }
        }
      )
    );
  }

  deleteProject(): void {
    this.boardService.deleteBoard(this.boardToDelete._id).subscribe(() => {
      this.getBoards();
    });
  }
}
