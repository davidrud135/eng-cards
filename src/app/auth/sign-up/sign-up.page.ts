import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { AuthService } from './../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['../auth.scss'],
})
export class SignUpPage implements OnInit {
  signUpForm: FormGroup;
  isLoading: boolean = false;
  errorToast: any;

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
    this.signUpForm = new FormGroup({
      email: new FormControl(
        '',
        [Validators.required, Validators.email]
      ),
      pass: new FormControl(
        '',
        [Validators.required, Validators.minLength(6)]
      ),
      rePass: new FormControl(
        '',
        [Validators.required, Validators.minLength(6)]
      )
    }, {validators: this.checkPasswords});
  }

  checkPasswords(formGroup: FormGroup) {
    let {pass, rePass} = formGroup.value;
    return pass === rePass ? null : { passesMismatch: true };    
  }

  onSignUp() {
    if (this.signUpForm.invalid) {
      this.presentToast('Invalid form data.');
      return;
    }
    this.isLoading = true;
    const {email, pass} = this.signUpForm.value;
    this.authService.signUp(email, pass).subscribe(
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
    this.signUpForm.reset();
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
  
  toSignInPage() {
    this.checkToastState();
    this.router.navigateByUrl('/sign-in');
  }

  checkToastState() {
    if (this.errorToast) {
      this.errorToast.dismiss();
    }
  }
}
