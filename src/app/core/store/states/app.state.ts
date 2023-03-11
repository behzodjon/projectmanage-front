import { AuthState, initialAuthState } from './auth.state';

export interface AppState {
  auth: AuthState;
}

export const initialAppState: AppState = {
  auth: initialAuthState,
};
