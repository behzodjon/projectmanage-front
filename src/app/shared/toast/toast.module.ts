import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './component/toast/toast.component';

@NgModule({
  declarations: [ToastComponent],
  exports: [ToastComponent],
  imports: [CommonModule],
})
export class ToastModule {}
