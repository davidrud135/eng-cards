import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'sign-in', loadChildren: './auth/sign-in/sign-in.module#SignInPageModule' },
  { path: 'sign-up', loadChildren: './auth/sign-up/sign-up.module#SignUpPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ]
})
export class AuthModule {}