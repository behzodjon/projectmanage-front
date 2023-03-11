import { UserModel } from '@core/models/user.model';

export interface AuthState {
  user: UserModel | null;
  token: string | null;
  isPending: boolean;
  isFetched: boolean;
}

export const initialAuthState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') ?? 'null'),
  token: localStorage.getItem('token'),
  isPending: false,
  isFetched: false,
};
