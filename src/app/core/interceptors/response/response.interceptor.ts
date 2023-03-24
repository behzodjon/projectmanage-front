import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (req.url.includes('assets')) {
      return next.handle(req);
    }
    return next.handle(req).pipe(
      tap(
        (): void => {},
        (err): void => {
          if (err instanceof HttpErrorResponse) {
          }
        }
      )
    );
  }
}
