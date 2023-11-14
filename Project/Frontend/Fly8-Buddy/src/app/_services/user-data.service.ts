import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../_models/user.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  // private url: string = environment.apiUrl;
  private url = "http://localhost:3000";

  token: string;

  constructor(private http: HttpClient) { }

  createNewUser(user: User): Observable<any> {
    return this.http.post<{ message: string }>(`${this.url}/createUser`, user);
  }

  checkLogin(user:{email:string, password:string}): Observable<{ message: string, token: string }> {
    localStorage.setItem('userEmail', user.email);
    return this.http.post<{ message: string, token: string }>(`${this.url}/login`, user);
  }

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  deleteToken() {
    delete this.token;
  }
}
