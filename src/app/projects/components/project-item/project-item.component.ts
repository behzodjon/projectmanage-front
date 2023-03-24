import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
} from '@angular/core';
import { Board } from '@app/shared/models/Board';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
})
export class ProjectItemComponent {
  @Output() edit = new EventEmitter();

  @Output() delete = new EventEmitter();

  @Input() project: Board = new Board();

  userList: string[] = [];

  isOwner: boolean = false;
}
