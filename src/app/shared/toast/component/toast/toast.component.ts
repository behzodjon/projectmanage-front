import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastDataModel } from '../../models/toast.model';
import { ToastService } from '../../service/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  constructor(private toastService: ToastService) {}

  data$: Subject<ToastDataModel | null> = this.toastService.toastData$;
}
