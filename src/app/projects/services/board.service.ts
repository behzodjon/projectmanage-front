import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  Observable,
  Subject,
  tap,
  map,
} from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { userSelector } from '@app/core/store/selectors/auth.selectors';
import { Board } from '@app/shared/models/Board';
import { User } from '@app/shared/models/User';

@Injectable()
export class BoardService {
  private boardObj: Board = new Board();

  boards: Board[] = [];

  board: BehaviorSubject<Board> = new BehaviorSubject<Board>(this.boardObj);

  search: Subject<string> = new Subject();

  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  private _trigger: Subject<boolean> = new Subject<boolean>();

  trigger$: Observable<boolean> = this._trigger.asObservable();

  private readonly userData = this.store.select(userSelector);

  currentUser: User = new User('', '', '');

  constructor(
    private http: HttpClient,
    private router: Router,
    private readonly store: Store
  ) {
    this.userData
      .pipe(
        map((user): User => {
          if (user) {
            return { _id: user.id, name: user.name, login: user.login };
          }
          return new User('', '', '');
        })
      )
      .subscribe((user) => {
        this.currentUser = user;
      });
  }

  setSearch(value: string): void {
    this.search.next(value);
  }

  get owner(): string {
    return this.boardObj.owner;
  }

  get users(): string[] {
    return this.boardObj.users;
  }

  private set owner(id: string) {
    this.boardObj.owner = id;
  }

  get boardId(): string {
    return this.boardObj._id;
  }

  loadingOn(): void {
    this.isLoading.next(true);
  }

  loadingOff(): void {
    this.isLoading.next(false);
  }

  getBoard(id: string): Observable<Board> {
    return this.http.get<Board>(`boards/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (!error.ok) {
          this.router.navigateByUrl('/error404');
        }
        return [];
      }),
      tap((value) => {
        this.boardObj._id = value._id;
        this.boardObj.title = value.title;
        this.boardObj.owner = value.owner;
        this.owner = value.owner;
        this.boardObj.users = value.users;
        this.board.next(this.boardObj);
      })
    );
  }

  get allBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`boardsSet/${this.currentUser._id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (!error.ok) {
          this.router.navigateByUrl('/error404');
        }
        return [];
      }),
      tap((boards) => (this.boards = boards))
    );
  }

  updateBoard(board: Board): Observable<Board> {
    const { title, owner, users } = board;
    return this.http
      .put<Board>(`boards/${board._id}`, { title, owner, users })
      .pipe(
        tap((value) => {
          this.boardObj = value;
          this.board.next(value);
        })
      );
  }

  deleteBoard(boardId: string): Observable<Response> {
    return this.http.delete<Response>(`boards/${boardId}`);
  }

  createBoard(board: Board): Observable<Board> {
    const { title, owner, users } = board;
    return this.http.post<Board>('boards', { title, owner, users });
  }

  onNewBoardButton(isOpenModal: boolean): void {
    this._trigger.next(isOpenModal);
  }
}
