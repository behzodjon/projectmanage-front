import { createReducer, on } from '@ngrx/store';
import { UserModel } from '@core/models/user.model';
import { LoginResponseModel } from '@core/models/backend-api.model';
import { initialAuthState, AuthState } from '../states/auth.state';
import * as AuthActions from '../actions/auth.actions';

export const reducer = createReducer(
  initialAuthState,
  on(
    AuthActions.SignUp,
    (state: AuthState): AuthState => ({
      ...state,
      isPending: true,
    })
  ),
  on(
    AuthActions.SignUpFailed,
    (state: AuthState): AuthState => ({
      ...state,
      isPending: false,
    })
  ),
  on(
    AuthActions.LogIn,
    (state: AuthState): AuthState => ({
      ...state,
      isPending: true,
    })
  ),
  on(
    AuthActions.LogInSuccess,
    (state: AuthState, token: LoginResponseModel): AuthState => ({
      ...state,
      token: token.token,
      isPending: false,
    })
  ),
  on(
    AuthActions.LogInFailed,
    (state: AuthState): AuthState => ({
      ...state,
      user: null,
      isPending: false,
    })
  ),
  on(
    AuthActions.getUser,
    (state: AuthState): AuthState => ({
      ...state,
      isPending: true,
    })
  ),
  on(
    AuthActions.getUserSuccess,
    (state: AuthState, user: UserModel): AuthState => ({
      ...state,
      user: {
        id: user.id,
        name: user.name,
        login: user.login,
      },
      isPending: false,
      isFetched: true,
    })
  ),
  on(
    AuthActions.getUserFailed,
    (state: AuthState): AuthState => ({
      ...state,
      isFetched: true,
    })
  ),
  on(
    AuthActions.LogOut,
    (state: AuthState): AuthState => ({
      ...state,
      user: null,
      token: null,
      isPending: false,
    })
  ),
  on(
    AuthActions.UpdateUser,
    (state: AuthState): AuthState => ({
      ...state,
      isPending: true,
    })
  ),
  on(
    AuthActions.UpdateUserSuccess,
    (state: AuthState, user: UserModel): AuthState => ({
      ...state,
      user: {
        id: user.id,
        name: user.name,
        login: user.login,
      },
      isPending: false,
    })
  ),
  on(
    AuthActions.DeleteUser,
    (state: AuthState): AuthState => ({
      ...state,
      isPending: true,
    })
  )
);
