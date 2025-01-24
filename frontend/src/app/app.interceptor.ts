import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      !request.url.startsWith('http') &&
      !request.url.startsWith('//') &&
      !environment.isProduction
    ) {
      const modifiedRequest = request.clone({
        url: `${environment.baseUrl}${request.url}`,
      });
      return next.handle(modifiedRequest);
    }
    return next.handle(request);
  }
}
