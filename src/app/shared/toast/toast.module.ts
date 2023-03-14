import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './component/toast/toast.component';
import { ToastService } from './service/toast.service';

@NgModule({
  declarations: [ToastComponent],
  exports: [ToastComponent],
  imports: [CommonModule],
  providers: [ToastService],
})
export class ToastModule {}
