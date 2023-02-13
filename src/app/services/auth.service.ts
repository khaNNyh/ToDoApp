import { WebRequestService } from './web-request.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private webRequest: WebRequestService, private router: Router) {}

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

  logout() {
    this.removeSession();
    console.log('logged-out');
  }

  getAccessToken() {
    return localStorage.getItem('x-access-item');
  }

  setAccessToken(accessToken: string) {
    return localStorage.setItem('x-access-item', accessToken);
  }

  getRefreshToken() {
    return localStorage.getItem('x-refresh-token');
  }

  // setAccessToken(accessToken: string) {
  //   return localStorage.setItem('x-access-item', accessToken);
  // }

  private setSession(
    userId: string,
    accessToken: string,
    refreshToken: string
  ) {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
