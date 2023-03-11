import { AbstractControl, ValidationErrors } from '@angular/forms';

export function loginValidator(
  control: AbstractControl<string>
): ValidationErrors | null {
  if (!control.value?.length) {
    return { error: 'Please enter a login' };
  }
  return null;
}
