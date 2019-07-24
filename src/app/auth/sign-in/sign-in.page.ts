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
  isLoading: boolean = false;
  errorToast: any;

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.signInForm = new FormGroup({
      email: new FormControl(
        '',
        [Validators.required, Validators.email]
      ),
      pass: new FormControl(
        '',
        [Validators.required, Validators.minLength(6)]
      )
    });
  }

  onSignIn() {
    if (this.signInForm.invalid) {
      this.presentToast('Invalid form data.');
      return;
    }
    this.isLoading = true;
    const {email, pass} = this.signInForm.value;
    this.authService.signIn(email, pass).subscribe(
      resp => {
        this.checkToastState();
        this.navCtrl.navigateRoot('');
        this.isLoading = false;
      },
      errMessage => {
        this.isLoading = false;
        this.presentToast(errMessage);
      }
    );
    this.signInForm.reset();
  }

  async presentToast(text: string) {
    this.checkToastState();
    this.errorToast = await this.toastController.create({
      position: 'top',
      color: 'danger',
      message: text,
      showCloseButton: true
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
}