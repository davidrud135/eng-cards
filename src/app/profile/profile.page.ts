import { AuthService } from './../auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userEmail: string;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.user.subscribe(data => {
      if (data) {
        this.userEmail = data.email;
      }
    });
  }

  onLogout() {
    this.authService.logout();
  }

}
