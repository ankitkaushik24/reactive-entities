import {HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../environment";

export const coreInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  return next(req.clone({
    url: req.url.startsWith('http') ? req.url : `${environment.baseUrl}/${req.url}`
  }));
}
