import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './../auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  onSignUp(form: NgForm) {
    this.isLoading = true;
    const {email, password} = form.value;
    this.authService.signUp(email, password).subscribe(
      resp => {
        console.log(resp);
        this.isLoading = false;
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
