import { ActionReducerMap } from '@ngrx/store';
import { AppState } from '../states/app.state';
import * as fromAuthReducer from './auth.reducer';

export const reducers: ActionReducerMap<AppState> = {
  auth: fromAuthReducer.reducer,
};
