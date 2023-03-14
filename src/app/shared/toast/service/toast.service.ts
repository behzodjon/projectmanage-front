import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { toastShowTime } from '@constants/constants';
import { ToastDataModel } from '../models/toast.model';

@Injectable()
export class ToastService {
  toastData$: Subject<ToastDataModel | null> = new Subject();
  // toastData$ = new Subject<ToastDataModel | null>();

  showToast(data: ToastDataModel): void {
    this.toastData$.next(data);
    setTimeout(() => this.hideToast(), toastShowTime);
  }

  hideToast(): void {
    this.toastData$.next(null);
  }
}
