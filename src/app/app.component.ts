import { Component, HostBinding, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs';
import * as AuthActions from './core/store/actions/auth.actions';
import {
  isPendingSelector,
  isFetchedSelector,
} from '@core/store/selectors/auth.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @HostBinding('class') value = 'root';

  isPending: Observable<boolean> = this.store.select(isPendingSelector);

  isFetched: Observable<boolean> = this.store.select(isFetchedSelector);

  constructor(private store: Store) {}

  ngOnInit(): void {
    const token: string | null = localStorage.getItem('token');
    if (token) {
      this.store.dispatch(AuthActions.getUser({ token }));
    } else {
      this.store.dispatch(AuthActions.getUserFailed());
    }
  }
}
