import { AuthService } from './../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userEmail: string;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.user.subscribe((data: User) => {
      if (data) {
        this.userEmail = data.email;
      }
    });
  }

  onLogout() {
    this.authService.logout();
  }
}
