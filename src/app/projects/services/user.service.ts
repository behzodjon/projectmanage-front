import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@app/shared/models/User';
import { BehaviorSubject, defer, Observable, of, tap } from 'rxjs';

const lifeTime = 300e3; // min interval for requests to backend - 300 sec

@Injectable()
export class UserService {
  userList: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  private userData: User[] = [];

  private requestedAt: number = 0;

  constructor(private http: HttpClient) {
    this.getUsers().subscribe(() => {});
  }

  getUsers(): Observable<User[]> {
    const currentTime = new Date().getTime();
    return defer(() =>
      Boolean(currentTime - this.requestedAt > lifeTime)
        ? this.http.get<User[]>('users').pipe(
            tap((users) => {
              this.userData = users;
              this.userList.next(users);
              this.requestedAt = currentTime;
            })
          )
        : of(this.userData)
    );
  }

  getUserById(id: string): User {
    const cacheUser =
      this.userData.find((user) => user._id === id) ?? new User('', '', '');
    return cacheUser;
  }
}
