import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {
  private api = '/api/auth';
  private tokenKey = 'ma_token';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<any>(this.api + '/login', { username, password }).pipe(
      map(res => {
        if (res && res.token) {
          localStorage.setItem(this.tokenKey, res.token);
        }
        return res;
      })
    );
  }

  logout() { localStorage.removeItem(this.tokenKey); }

  getToken() { return localStorage.getItem(this.tokenKey); }
}
