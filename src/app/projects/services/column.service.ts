import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Column } from '@app/shared/models/Column';
import { BehaviorSubject, defer, map, Observable, tap } from 'rxjs';
import { BoardService } from './board.service';

@Injectable()
export class ColumnService {
  constructor(private http: HttpClient, private boardService: BoardService) {}

  allColumns: BehaviorSubject<Column[]> = new BehaviorSubject<Column[]>([]);

  private columnStore: Column[] = [];

  get columns(): Column[] {
    return this.columnStore;
  }

  set columns(value: Column[]) {
    this.columnStore = value;
  }

  makeColumnTemplate(): void {
    this.getColumns().subscribe((columns) => {
      const newColumn: Column = {
        _id: '',
        title: `New column (${columns.length + 1})`,
        order: columns.length,
        boardId: this.boardService.boardId,
      };
      this.createColumn(newColumn.title, newColumn.order).subscribe(
        (column) => {
          newColumn._id = column._id;
          columns.push(newColumn);
          this.allColumns.next(columns);
        }
      );
    });
  }

  dropColumn(event: CdkDragDrop<Column[]>): void {
    this.boardService.loadingOn();
    const columnSet: Pick<Column, '_id' | 'order'>[] = [];
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    this.columns.forEach((item, idx) => {
      columnSet.push({ _id: item._id, order: idx });
    });
    this.updateColumnSet(columnSet).subscribe((columns) => {
      this.columns = columns;
      this.allColumns.next(columns);
      this.boardService.loadingOff();
    });
  }

  getColumns(): Observable<Column[]> {
    return this.http
      .get<Column[]>(`boards/${this.boardService.boardId}/columns`)
      .pipe(
        map((columns) => {
          return columns.sort((a, b) => a.order - b.order);
        }),
        tap((value) => {
          this.columns = value;
          this.allColumns.next(value);
        })
      );
  }

  saveColumn(id: string, title: string, order: number): Observable<Column> {
    return defer(() =>
      Boolean(id)
        ? this.updateColumn(id, title, order)
        : this.createColumn(title, order)
    );
  }

  private createColumn(title: string, order: number): Observable<Column> {
    return this.http
      .post<Column>(`boards/${this.boardService.boardId}/columns`, {
        title,
        order,
      })
      .pipe(
        tap((column) => {
          this.columns[this.columns.length - 1] = column;
          this.allColumns.next(this.columns);
          this.boardService.loadingOff();
        })
      );
  }

  private updateColumn(
    columnId: string,
    title: string,
    order: number
  ): Observable<Column> {
    return this.http
      .put<Column>(`boards/${this.boardService.boardId}/columns/${columnId}`, {
        title,
        order,
      })
      .pipe(
        tap((column) => {
          this.columns = this.columns.map((item) => {
            if (item._id === column._id) {
              return column;
            }
            return item;
          });
          this.allColumns.next(this.columns);
          this.boardService.loadingOff();
        })
      );
  }

  private updateColumnSet(
    columnSet: Pick<Column, '_id' | 'order'>[]
  ): Observable<Column[]> {
    return this.http.patch<Column[]>('columnsSet', columnSet);
  }

  deleteColumn(columnId: string): void {
    this.boardService.loadingOn();
    this.http
      .delete<Response>(
        `boards/${this.boardService.boardId}/columns/${columnId}`
      )
      .subscribe(() => {
        const columnSet: Pick<Column, '_id' | 'order'>[] = [];
        const tempColumns = this.columns
          .filter((column) => column._id !== columnId)
          .map((item, idx) => {
            item.order = idx;
            columnSet.push({ _id: item._id, order: item.order });
            return item;
          });
        if (tempColumns.length && tempColumns.length < this.columns.length) {
          this.updateColumnSet(columnSet).subscribe((columns) => {
            this.columns = columns;
            this.allColumns.next(this.columns);
            this.boardService.loadingOff();
          });
        } else if (!tempColumns.length) {
          this.columns = [];
          this.allColumns.next(this.columns);
          this.boardService.loadingOff();
        }
      });
  }
}
