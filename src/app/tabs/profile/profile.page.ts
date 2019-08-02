import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userEmail: string;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getUser().subscribe((user: firebase.User) => {
      this.userEmail = user.email;
    });
  }

  onLogout() {
    this.authService.logout();
  }
}
