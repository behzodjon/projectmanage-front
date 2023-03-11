import { NgModule } from '@angular/core';
import { ValidatorFn } from '@angular/forms';

import { nameValidator } from './name/name.validator';
import { loginValidator } from './login/login.validator';
import { passwordValidator } from './password/password.validator';
import { confirmPasswordValidator } from './confirm-password/confirm-password.validator';

@NgModule({})
export class ValidatorsModule {
  name: ValidatorFn = nameValidator;

  login: ValidatorFn = loginValidator;

  password: ValidatorFn = passwordValidator;

  confirmPassword: ValidatorFn = confirmPasswordValidator;
}
