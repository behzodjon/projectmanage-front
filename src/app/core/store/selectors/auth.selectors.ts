import { UserModel } from '@core/models/user.model';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../states/auth.state';

export const authSelector = createFeatureSelector<AuthState>('auth');
export const userSelector = createSelector(
  authSelector,
  (state: AuthState): UserModel | null => state.user
);
export const tokenSelector = createSelector(
  authSelector,
  (state: AuthState): string | null => state.token
);
export const isPendingSelector = createSelector(
  authSelector,
  (state: AuthState): boolean => state.isPending
);
export const isFetchedSelector = createSelector(
  authSelector,
  (state: AuthState): boolean => state.isFetched
);
