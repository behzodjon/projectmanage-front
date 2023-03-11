import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../../../constants/constants';

@Injectable()
export class UrlInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (req.url.includes('assets')) {
      // это временные танцы с бубном из-за непонятно для чего сделанной подгрузки svg из asset'ов
      return next.handle(req);
    }
    const httpRequest: HttpRequest<unknown> = req.clone({
      url: `${API_URL}${req.url}`,
    });
    return next.handle(httpRequest);
  }
}
