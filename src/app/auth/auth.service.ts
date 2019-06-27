import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface AuthResponseData {
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string
}

@Injectable({providedIn: 'root'})
export class AuthService {

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
      .pipe(catchError(errorResp => {
        let errorMessage = 'An unknown error occurred!';
        if (!errorResp.error || !errorResp.error.error) {
          return;
        }
        switch (errorResp.error.error.message) {
          case 'EMAIL_EXISTS':
            errorMessage = 'User with this email already exists!';
            break;
          case 'TOO_MANY_ATTEMPTS_TRY_LATER':
            errorMessage = 'Detected unusual activity. Please, try again later.';
            break;
        };
        return throwError(errorMessage);
      }));
  }

}