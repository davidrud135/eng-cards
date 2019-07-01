import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { AuthService } from './../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSignIn(form: NgForm) {
    this.isLoading = true;
    const {email, password} = form.value;
    this.authService.signIn(email, password).subscribe(
      resp => {
        this.isLoading = false;
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
    const toast = await this.toastController.create({
      position: 'top',
      color: 'danger',
      message: text,
      showCloseButton: true
    });
    toast.present();
  }

}
