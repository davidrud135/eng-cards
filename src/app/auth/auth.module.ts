import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SignInPage } from './sign-in/sign-in.page';
import { SignUpPage } from './sign-up/sign-up.page';

const routes: Routes = [
  { path: 'sign-in', component: SignInPage },
  { path: 'sign-up', component: SignUpPage }
];

@NgModule({
  declarations: [
    SignInPage,
    SignUpPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ]
})
export class AuthModule {}