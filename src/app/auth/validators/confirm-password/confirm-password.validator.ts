import { AbstractControl, ValidationErrors } from '@angular/forms';

export function confirmPasswordValidator(
  group: AbstractControl<string>
): ValidationErrors | null {
  const password: string = group.get('password')?.value;
  const passwordConfirm: string = group.get('passwordConfirm')?.value;
  return password === passwordConfirm
    ? {
        error:
          'This password does not match that entered in the password field',
      }
    : null;
}
