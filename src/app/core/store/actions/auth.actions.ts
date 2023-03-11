import { UserModel } from '@core/models/user.model';
import { createAction, props } from '@ngrx/store';
import {
  LoginRequestModel,
  SignUpRequestModel,
  LoginResponseModel,
  UpdateUserRequestModel,
  ErrorResponseModel,
} from '@core/models/backend-api.model';

const authAction: string = '[Auth]';
const userAction: string = '[User]';

export const SignUp = createAction(
  `${authAction} SignUp`,
  props<SignUpRequestModel>()
);

export const SignUpFailed = createAction(
  `${authAction} SignUp Failed`,
  props<ErrorResponseModel>()
);

export const LogIn = createAction(
  `${authAction} LogIn`,
  props<LoginRequestModel>()
);

export const LogInSuccess = createAction(
  `${authAction} LogIn Success`,
  props<LoginResponseModel>()
);

export const LogInFailed = createAction(
  `${authAction} LogIn Failed`,
  props<ErrorResponseModel>()
);

export const LogOut = createAction(`${authAction} LogOut`);

export const getUser = createAction(
  `${userAction} Get User`,
  props<LoginResponseModel>()
);

export const getUserSuccess = createAction(
  `${userAction} Get User Success`,
  props<UserModel>()
);

export const getUserFailed = createAction(`${userAction} Get User Failed`);

export const UpdateUser = createAction(
  `${userAction} Update User`,
  props<UpdateUserRequestModel>()
);

export const UpdateUserSuccess = createAction(
  `${userAction} Update User Success`,
  props<UserModel>()
);

export const UpdateUserFailed = createAction(
  `${userAction} Update User Failed`,
  props<ErrorResponseModel>()
);

export const DeleteUser = createAction(`${userAction} Delete User`);
