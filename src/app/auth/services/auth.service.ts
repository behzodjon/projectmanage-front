import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { UserModel } from '@core/models/user.model';
import {
  TokenModel,
  SignUpRequestModel,
  SignUpResponseModel,
  LoginRequestModel,
  LoginResponseModel,
  UpdateUserRequestModel,
  UpdateUserResponseModel,
  DeleteUserResponseModel,
} from '@app/core/models/backend-api.model';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}

  signUp(data: SignUpRequestModel): Observable<SignUpResponseModel> {
    console.log('Data:', data);
    return this.http.post<SignUpResponseModel>('auth/signup', data);
  }

  logIn(data: LoginRequestModel): Observable<LoginResponseModel> {
    return this.http.post<LoginResponseModel>('auth/signin', data);
  }

  parseJwt({ token }: LoginResponseModel): TokenModel {
    const base64Url: string = token.split('.')[1];
    const base64: string = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload: string = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c: string): string {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  getUser(id: string): Observable<UserModel> {
    return this.http.get<SignUpResponseModel>(`users/${id}`).pipe(
      map(
        (resp: SignUpResponseModel): UserModel => ({
          id: resp._id,
          login: resp.login,
          name: resp.name,
        })
      )
    );
  }

  updateUser(id: string, data: UpdateUserRequestModel): Observable<UserModel> {
    return this.http.put<UpdateUserResponseModel>(`users/${id}`, data).pipe(
      map(
        (resp: UpdateUserResponseModel): UserModel => ({
          id: resp._id,
          login: resp.login,
          name: resp.name,
        })
      )
    );
  }

  deleteUser(id: string): Observable<UserModel> {
    return this.http.delete<DeleteUserResponseModel>(`users/${id}`).pipe(
      map(
        (resp: DeleteUserResponseModel): UserModel => ({
          id: resp._id,
          login: resp.login,
          name: resp.name,
        })
      )
    );
  }
}
