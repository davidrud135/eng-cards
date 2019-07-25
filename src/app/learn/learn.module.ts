import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LearnPage } from './learn.page';
import { FlipCardComponent } from './flip-card/flip-card.component';

const routes: Routes = [
  {
    path: '',
    component: LearnPage,
  },
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [LearnPage, FlipCardComponent],
})
export class LearnPageModule {}
