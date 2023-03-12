import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { LoginRequestModel } from '@app/core/models/backend-api.model';
import * as AuthActions from '@core/store/actions/auth.actions';
import { TranslateService } from '@ngx-translate/core';
import { AppLanguage } from '@shared/enums/AppLanguage';
import { LocalStorageKeys } from '@shared/enums/LocalStorageKeys';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  loginForm: FormGroup = new FormGroup({
    login: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  appLanguage: string =
    localStorage.getItem(LocalStorageKeys.LANG) || AppLanguage.En;

  constructor(
    private store: Store,
    private translateService: TranslateService
  ) {
    this.translateService.use(this.appLanguage);
  }

  submitForm(): void {
    const data: LoginRequestModel = this.loginForm.value;
    this.store.dispatch(AuthActions.LogIn(data));
  }
}
