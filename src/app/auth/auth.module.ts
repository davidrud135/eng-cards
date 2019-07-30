import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { SignInPage } from './sign-in/sign-in.page';
import { SignUpPage } from './sign-up/sign-up.page';
import { AnonymousGuard } from './anonymous.guard';

const routes: Routes = [
  { path: 'sign-in', component: SignInPage, canActivate: [AnonymousGuard] },
  { path: 'sign-up', component: SignUpPage, canActivate: [AnonymousGuard] },
];

@NgModule({
  declarations: [SignInPage, SignUpPage],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
  ],
})
export class AuthModule {}
