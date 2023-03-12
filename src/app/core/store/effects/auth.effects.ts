import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { of, Observable } from 'rxjs';
import { switchMap, map, catchError, tap, mergeMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AuthService } from '@auth/services/auth.service';

import * as AuthActions from '../actions/auth.actions';

import {
  LoginRequestModel,
  LoginResponseModel,
  ErrorResponseModel,
} from '@core/models/backend-api.model';
import { UserModel } from '@core/models/user.model';

import { userSelector } from '@app/core/store/selectors/auth.selectors';
import { LocalStorageKeys } from '@app/shared/enums/LocalStorageKeys';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private store: Store
  ) {}

  private signUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.SignUp),
      switchMap((action) => {
        console.log('Data:', action);

        return this.authService
          .signUp({
            name: action.name,
            login: action.login,
            password: action.password,
          })
          .pipe(
            map(
              (): LoginRequestModel => ({
                login: action.login,
                password: action.password,
              })
            ),
            map((data: LoginRequestModel) => AuthActions.LogIn(data)),
            catchError(({ error }) => of(AuthActions.SignUpFailed(error)))
          );
      })
    )
  );

  private signUpFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.SignUpFailed),
        tap((error: ErrorResponseModel): void => {})
      ),
    { dispatch: false }
  );

  private logIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LogIn),
      switchMap((action) => {
        return this.authService
          .logIn({
            login: action.login,
            password: action.password,
          })
          .pipe(
            tap((data: LoginResponseModel): void =>
              localStorage.setItem(LocalStorageKeys.TOKEN, data.token)
            ),
            map((data: LoginResponseModel) => AuthActions.LogInSuccess(data)),
            catchError(({ error }) => of(AuthActions.LogInFailed(error)))
          );
      })
    )
  );

  private logInSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LogInSuccess),
      map((data: LoginResponseModel) => AuthActions.getUser(data))
    )
  );

  private logInFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.LogInFailed),
        tap((error: ErrorResponseModel): void => {})
      ),
    { dispatch: false }
  );

  private logOut$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.LogOut),
        tap((): void => {
          localStorage.removeItem(LocalStorageKeys.USER);
          localStorage.removeItem(LocalStorageKeys.TOKEN);
        })
      ),
    { dispatch: false }
  );

  private getUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.getUser),
      switchMap((action) => {
        const id: string = this.authService.parseJwt(action).id;
        return this.authService.getUser(id).pipe(
          tap((user: UserModel) =>
            localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(user))
          ),
          map((user: UserModel) => AuthActions.getUserSuccess(user)),
          catchError(() => of(AuthActions.getUserFailed()))
        );
      })
    )
  );

  private getUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.getUserSuccess),
        // tap((): void => {
        //   if (
        //     this.router.url === '/auth/login' ||
        //     this.router.url === '/auth/sign-up'
        //   ) {
        //     this.router.navigateByUrl('');
        //   }
        // }),
        tap((user: UserModel): void => {})
      ),
    { dispatch: false }
  );

  private getUserFailed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.getUserFailed),
      tap((): void => {}),
      switchMap(async () => AuthActions.LogOut())
    )
  );

  private updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.UpdateUser),
      concatLatestFrom(
        (): Observable<UserModel | null> => this.store.select(userSelector)
      ),
      mergeMap(([action, user]) => {
        return this.authService
          .updateUser(user?.id!, {
            name: action.name,
            login: action.login,
            password: action.password,
          })
          .pipe(
            tap((response: UserModel) =>
              localStorage.setItem(
                LocalStorageKeys.USER,
                JSON.stringify(response)
              )
            ),
            map((response: UserModel) =>
              AuthActions.UpdateUserSuccess(response)
            ),
            tap((): Promise<boolean> => this.router.navigateByUrl('')),
            catchError((error: ErrorResponseModel) =>
              of(AuthActions.UpdateUserFailed(error))
            )
          );
      })
    )
  );

  private updateUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.UpdateUserSuccess),
        tap((user: UserModel): void => {})
      ),
    { dispatch: false }
  );

  private updateUserFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.UpdateUserFailed),
        tap((error: ErrorResponseModel): void => {})
      ),
    { dispatch: false }
  );

  private deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.DeleteUser),
      concatLatestFrom(
        (): Observable<UserModel | null> => this.store.select(userSelector)
      ),
      mergeMap(([, user]) => {
        return this.authService.deleteUser(user?.id!).pipe(
          tap((): void => {}),
          map(() => AuthActions.LogOut())
        );
      })
    )
  );
}
