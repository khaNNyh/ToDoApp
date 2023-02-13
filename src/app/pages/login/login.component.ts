import { FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private auth: AuthService) {}

  loginField = new FormControl<string>('', Validators.required);
  passwordField = new FormControl<string>('', Validators.required);

  onLoginButtonClick() {
    console.log(this.loginField.value, this.passwordField.value);
    this.auth
      .login(
        this.loginField.value as string,
        this.passwordField.value as string
      )
      .subscribe();
  }
}
