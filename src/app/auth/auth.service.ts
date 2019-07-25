import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { User } from './user.model';
import { environment } from 'src/environments/environment';

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private FIREBASE_URL =
    'https://www.googleapis.com/identitytoolkit/v3/relyingparty';
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private navCtrl: NavController) {}

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `${this.FIREBASE_URL}/signupNewUser?key=${environment.firebaseConfig.apiKey}`,
        { email, password, returnSecureToken: true },
      )
      .pipe(
        catchError(this.handleAuthError),
        tap((resp: AuthResponseData) => {
          this.handleAuthentication(
            resp.localId,
            resp.email,
            resp.idToken,
            +resp.expiresIn,
          );
        }),
      );
  }

  signIn(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `${this.FIREBASE_URL}/verifyPassword?key=${environment.firebaseConfig.apiKey}`,
        { email, password, returnSecureToken: true },
      )
      .pipe(
        catchError(this.handleAuthError),
        tap((resp: AuthResponseData) => {
          this.handleAuthentication(
            resp.localId,
            resp.email,
            resp.idToken,
            +resp.expiresIn,
          );
        }),
      );
  }

  handleAuthentication(
    id: string,
    email: string,
    token: string,
    expiresIn: number,
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(id, email, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userAuthData', JSON.stringify(user));
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
    }
    return throwError(errorMessage);
  }

  logout() {
    this.user.next(null);
    this.navCtrl.navigateRoot('/sign-in');
    localStorage.removeItem('userAuthData');
    if (!this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    },                                     expirationDuration);
  }

  autoLogin() {
    const userAuthData: {
      id: string;
      email: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userAuthData'));
    if (!userAuthData) {
      return;
    }

    const loadedUser = new User(
      userAuthData.id,
      userAuthData.email,
      userAuthData._token,
      new Date(userAuthData._tokenExpirationDate),
    );
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userAuthData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }
}
