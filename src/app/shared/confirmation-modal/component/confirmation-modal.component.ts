import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { ConfirmationService } from '../service/confirmation.service';

@Component({
  selector: 'app-confirmational-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent implements AfterViewInit {
  @ViewChild('modal', { static: false }) modal: ElementRef | undefined;

  question: string = 'Are you sure you want to perform this action?';

  constructor(
    public confirmationService: ConfirmationService,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    setTimeout(
      (): void => this.renderer.addClass(this.modal?.nativeElement, 'show'),
      0
    );
  }

  closeModal(event: Event): void {
    if ((event.currentTarget as HTMLElement).dataset['closeTarget']) {
      event.stopPropagation();
      this.confirmationService.closeModal();
    }
  }

  confirm(): void {
    this.confirmationService.confirm();
  }

  reset(): void {
    this.confirmationService.reset();
  }
}
