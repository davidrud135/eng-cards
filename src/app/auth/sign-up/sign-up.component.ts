import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['../auth.page.scss'],
})
export class SignUpComponent implements OnInit {
  isLoading: boolean = false;
  errorToast: any;

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSignUp(form: NgForm) {
    this.isLoading = true;
    const {email, password} = form.value;
    this.authService.signUp(email, password).subscribe(
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
    form.reset();
  }

  async presentToast(text: string) {
    this.errorToast = await this.toastController.create({
      position: 'top',
      color: 'danger',
      message: text,
      showCloseButton: true
    });
    this.errorToast.present();
  }
  
  onSignInPage() {
    this.checkToastState();
    this.router.navigateByUrl('/auth');
  }

  checkToastState() {
    if (this.errorToast) {
      this.errorToast.dismiss();
    }
  }
}
