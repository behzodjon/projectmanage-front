import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordValidator(
  control: AbstractControl<string>
): ValidationErrors | null {
  if (!control.value?.length) {
    return { error: 'Please enter a password' };
  }
  return null;
}
