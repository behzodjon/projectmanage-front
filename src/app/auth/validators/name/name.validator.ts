import { AbstractControl, ValidationErrors } from '@angular/forms';

export function nameValidator(
  control: AbstractControl<string>
): ValidationErrors | null {
  if (!control.value?.length) {
    return { error: 'Please enter a name' };
  }
  return null;
}
