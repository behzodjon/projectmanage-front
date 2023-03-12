import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
})
export class SpinnerComponent {
  @HostBinding('class') class = 'spinner';
}
