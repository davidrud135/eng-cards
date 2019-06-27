import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';
import { User } from './user.model';

interface AuthResponseData {
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable({providedIn: 'root'})
export class AuthService {
  user = new Subject<User>();

  constructor(private http: HttpClient) {}

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyDPCOezFSIj07NO924GvlsLDIA-1doYz7s',
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleAuthError),
        tap(resp => {
          this.handleAuthentication(
            resp.localId,
            resp.email,
            resp.idToken,
            +resp.expiresIn
          );
        })
      );
  }

  signIn(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyDPCOezFSIj07NO924GvlsLDIA-1doYz7s',
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleAuthError),
        tap(resp => {
          this.handleAuthentication(
            resp.localId,
            resp.email,
            resp.idToken,
            +resp.expiresIn
          );
        })
      );
  }

  handleAuthentication(id: string, email: string, token: string, expiresIn: number) {
    const expirationDate = new Date(
      new Date().getTime() + expiresIn * 1000
    );
    const user = new User(
      id,
      email,
      token,
      expirationDate
    );
    this.user.next(user);
  }

  handleAuthError(errorResp: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorResp.error || !errorResp.error.error) {
      return;
    }
    switch (errorResp.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'User with this email already exists.';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errorMessage = 'Detected unusual activity. Please, try again later.';
        break;
      case 'EMAIL_NOT_FOUND':
      case 'INVALID_PASSWORD':
        errorMessage = 'Wrong email or password.';
        break;
    };
    return throwError(errorMessage);
  }

}