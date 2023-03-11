import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { userSelector } from '../store/selectors/auth.selectors';
import { UserModel } from '../models/user.model';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.select(userSelector).pipe(
      map((user: UserModel | null): boolean => {
        const isAuthorized: boolean = !!user;
        if (!isAuthorized) {
          this.router.navigateByUrl('welcome');
        }
        return isAuthorized;
      })
    );
  }
}
