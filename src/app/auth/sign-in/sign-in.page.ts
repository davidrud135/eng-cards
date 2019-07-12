import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
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
    private router: Router
  ) { }

  ngOnInit() {
    this.signInForm = new FormGroup({
      email: new FormControl(
        null,
        [Validators.required, Validators.email]
      ),
      pass: new FormControl(
        null,
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
        this.isLoading = false;
        this.checkToastState();
        this.router.navigateByUrl('');
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
    this.router.navigateByUrl('/sign-up');
  }

  checkToastState() {
    if (this.errorToast) {
      this.errorToast.dismiss();
    }
  }
}