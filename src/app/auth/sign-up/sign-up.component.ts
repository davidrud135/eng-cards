import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  @ViewChild('signUpForm') signUpForm;
  constructor() { }

  ngOnInit() {
    console.log(this.signUpForm);
  }

}
