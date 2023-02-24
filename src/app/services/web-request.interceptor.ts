import { AuthService } from 'src/app/services/auth.service';
import {
  catchError,
  EMPTY,
  Observable,
  Subject,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WebRequestInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  refreshingAccessToken!: boolean;

  accessTokenRefreshed: Subject<any> = new Subject();

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    request = this.addAuthHeader(request);

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        if (error.status === 401) {
          return this.refreshAccessToken().pipe(
            switchMap(() => {
              request = this.addAuthHeader(request);
              return next.handle(request);
            }),
            catchError((error: any) => {
              console.log(error);
              this.auth.logout();
              return EMPTY;
            })
          );
        }
        return throwError(() => new Error(error as unknown as string));
      })
    );
  }

  refreshAccessToken() {
    if (this.refreshingAccessToken) {
      return new Observable((observer) => {
        this.accessTokenRefreshed.subscribe(() => {
          observer.next();
          observer.complete();
        });
      });
    } else {
      this.refreshingAccessToken = true;
      return this.auth.getNewAccessToken().pipe(
        tap(() => {
          this.refreshingAccessToken = false;
          this.accessTokenRefreshed.next(true);
          console.log('Access Token Refreshed');
        })
      );
    }
  }

  addAuthHeader(request: HttpRequest<any>) {
    const token = this.auth.getAccessToken();

    if (token) {
      return request.clone({
        setHeaders: {
          'x-access-token': token,
        },
      });
    }
    return request;
  }
}
