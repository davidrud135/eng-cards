import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from './../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private menu: MenuController,
    private authService: AuthService
  ) {
    this.menu.enable(true, 'sideMenu');
    this.menu.swipeEnable(true, 'sideMenu');
  }

  openSideMenu() {
    this.menu.open('sideMenu');
  }

  onLogout() {
    this.authService.logout();
  }

}
