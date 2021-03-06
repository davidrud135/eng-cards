import { Component, OnInit } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from './../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['../auth.scss'],
})
export class SignInPage implements OnInit {
  signInForm: FormGroup;
  isLoading = false;
  errorToast: any;

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private navCtrl: NavController,
  ) {
    this.onSuccessLogin();
  }

  ngOnInit() {
    this.signInForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      pass: new FormControl('', Validators.required),
    });
  }

  onSignIn() {
    if (this.signInForm.invalid) {
      this.presentToast('Invalid form data.');
      return;
    }
    this.isLoading = true;
    const { email, pass } = this.signInForm.value;
    this.authService
      .signIn(email, pass)
      .then(() => {
        this.checkToastState();
        this.isLoading = false;
      })
      .catch((errMessage: string) => {
        this.isLoading = false;
        this.presentToast(errMessage);
      });
    this.signInForm.reset();
  }

  onSuccessLogin() {
    this.authService.getUser().subscribe(() => {
      this.navCtrl.navigateRoot('');
    });
  }

  async presentToast(text: string) {
    this.checkToastState();
    this.errorToast = await this.toastController.create({
      position: 'top',
      color: 'danger',
      message: text,
      showCloseButton: true,
    });
    this.errorToast.present();
  }

  toSignUpPage() {
    this.checkToastState();
    this.navCtrl.navigateForward('/sign-up');
  }

  checkToastState() {
    if (this.errorToast) {
      this.errorToast.dismiss();
    }
  }

  focusNextInput(input: HTMLIonInputElement) {
    input.setFocus();
  }
}
