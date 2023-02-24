import { WebRequestService } from './web-request.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private webRequest: WebRequestService,
    private router: Router
  ) {}

  login(email: string, password: string) {
    return this.webRequest.login(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        this.setSession(
          res.body._id as string,
          res.headers.get('x-access-token') as string,
          res.headers.get('x-refresh-token') as string
        );
        console.log('logged-in');
      })
    );
  }

  signup(email: string, password: string) {
    return this.webRequest.signup(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        this.setSession(
          res.body._id as string,
          res.headers.get('x-access-token') as string,
          res.headers.get('x-refresh-token') as string
        );
        console.log('Signed-up');
      })
    );
  }

  logout() {
    this.removeSession();
    console.log('logged-out');

    this.router.navigateByUrl('/login');
  }

  getAccessToken() {
    return localStorage.getItem('x-access-token');
  }

  setAccessToken(accessToken: string) {
    return localStorage.setItem('x-access-token', accessToken);
  }

  getRefreshToken() {
    return localStorage.getItem('x-refresh-token') as string;
  }

  getUserId() {
    return localStorage.getItem('user-id') as string;
  }

  getNewAccessToken() {
    return this.http
      .get(`${this.webRequest.ROOT_URL}/users/me/access-token`, {
        headers: {
          'x-refresh-token': this.getRefreshToken(),
          _id: this.getUserId(),
        },
        observe: 'response',
      })
      .pipe(
        tap((res: HttpResponse<any>) => {
          this.setAccessToken(res.headers.get('x-access-token') as string);
        })
      );
  }

  private setSession(
    userId: string,
    accessToken: string,
    refreshToken: string
  ) {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('x-access-token', accessToken);
    localStorage.setItem('x-refresh-token', refreshToken);
  }

  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
