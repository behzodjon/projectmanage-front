import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ConfirmationTitles } from '../enum/confirmation-titles';

@Injectable()
export class ConfirmationService {
  isModalOpened$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  isModalConfirmed$: Subject<boolean> = new Subject<boolean>();

  private confirmationTitle: ConfirmationTitles = ConfirmationTitles.Null;

  openModal(title: ConfirmationTitles): void {
    this.confirmationTitle = title;
    this.isModalOpened$.next(true);
  }

  closeModal(): void {
    this.isModalOpened$.next(false);
    this.confirmationTitle = ConfirmationTitles.Null;
  }

  confirm(): void {
    this.isModalConfirmed$.next(true);
    this.closeModal();
  }

  reset(): void {
    this.isModalConfirmed$.next(false);
    this.closeModal();
  }

  get currentConfirmationTitle(): ConfirmationTitles {
    return this.confirmationTitle;
  }
}
