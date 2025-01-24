import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  constructor() {}
  private baseUrl = 'http://localhost:3000/';
  private isProduction = true;
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      !request.url.startsWith('http') &&
      !request.url.startsWith('//') &&
      !this.isProduction
    ) {
      const modifiedRequest = request.clone({
        url: `${this.baseUrl}${request.url}`,
      });
      return next.handle(modifiedRequest);
    }
    return next.handle(request);
  }
}
