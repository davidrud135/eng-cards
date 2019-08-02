import { Component, OnInit } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from './../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['../auth.scss'],
})
export class SignUpPage implements OnInit {
  signUpForm: FormGroup;
  isLoading = false;
  errorToast: any;

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private navCtrl: NavController,
  ) {
    this.onSuccessRegister();
  }

  ngOnInit() {
    this.signUpForm = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        pass: new FormControl('', [Validators.required, Validators.minLength(6)]),
        rePass: new FormControl('', [Validators.required, Validators.minLength(6)]),
      },
      { validators: this.checkPasswords },
    );
  }

  checkPasswords(formGroup: FormGroup) {
    const { pass, rePass } = formGroup.value;
    return pass === rePass ? null : { passesMismatch: true };
  }

  onSignUp() {
    if (this.signUpForm.invalid) {
      this.presentToast('Invalid form data.');
      return;
    }
    this.isLoading = true;
    const { email, pass } = this.signUpForm.value;
    this.authService
      .signUp(email, pass)
      .then(() => {
        this.checkToastState();
        this.isLoading = false;
      })
      .catch((errMessage: string) => {
        this.isLoading = false;
        this.presentToast(errMessage);
      });
    this.signUpForm.reset();
  }

  onSuccessRegister() {
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

  toSignInPage() {
    this.checkToastState();
    this.navCtrl.navigateBack('/sign-in');
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
