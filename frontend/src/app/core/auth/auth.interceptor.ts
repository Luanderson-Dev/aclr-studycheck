import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from './auth.service';

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const auth = inject(AuthService);
  const reqComToken = adicionarToken(req, auth.getAccessToken());

  return next(reqComToken).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !req.url.includes('/auth/')) {
        return tratarErro401(req, next, auth);
      }
      return throwError(() => error);
    }),
  );
};

function adicionarToken(req: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> {
  if (!token || req.url.includes('/auth/')) return req;
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

function tratarErro401(req: HttpRequest<unknown>, next: HttpHandlerFn, auth: AuthService) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshSubject.next(null);
    return auth.refresh().pipe(
      switchMap((res) => {
        isRefreshing = false;
        refreshSubject.next(res.accessToken);
        return next(adicionarToken(req, res.accessToken));
      }),
      catchError((err) => {
        isRefreshing = false;
        auth.logout();
        return throwError(() => err);
      }),
    );
  }
  return refreshSubject.pipe(
    filter((token) => token !== null),
    take(1),
    switchMap((token) => next(adicionarToken(req, token))),
  );
}
