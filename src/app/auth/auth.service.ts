import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user$: Observable<firebase.User> = null;

  constructor(private navCtrl: NavController, private afAuth: AngularFireAuth) {
    this.user$ = this.afAuth.user;
  }

  public getUser(): Observable<firebase.User> {
    return this.user$.pipe(filter((user: firebase.User) => !!user));
  }

  public isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(
      map((user: firebase.User) => {
        return !!user;
      }),
    );
  }

  public signUp(email: string, password: string): Promise<firebase.auth.UserCredential | string> {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .catch(this.handleAuthError);
  }

  public signIn(email: string, password: string): Promise<firebase.auth.UserCredential | string> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password).catch(this.handleAuthError);
  }

  private handleAuthError(error: firebase.auth.Error): Promise<string> {
    let errorMessage = 'An unknown error occurred!';
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'User with given email already exists.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Given email is not valid.';
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        errorMessage = 'Wrong email or password.';
    }
    return Promise.reject(errorMessage);
  }

  public logout(): void {
    this.afAuth.auth.signOut().then(() => {
      this.navCtrl.navigateRoot('/sign-in');
    });
  }
}
