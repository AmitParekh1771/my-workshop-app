import { Component } from '@angular/core';
import { AuthService } from '../main-app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private authService: AuthService) { }

  googleSignin() {
    this.authService.googleSignin();
  }

  githubSignin() {
    this.authService.githubSignin();
  }

  facebookSignin() {
    this.authService.facebookSignin();
  }

  microsoftSignin() {
    this.authService.microsoftSignin();
  }

}
