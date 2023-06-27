import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss'],
})
export class SignupPageComponent {
  constructor(private auth: AuthService, private router: Router) {}

  loginField = new FormControl<string>('', Validators.required);
  passwordField = new FormControl<string>('', Validators.required);

  onSignUpButtonClick() {
    this.auth
      .signup(
        this.loginField.value as string,
        this.passwordField.value as string
      )
      .subscribe(() => {
        this.router.navigate(['/lists']);
      })
      .add(() => {
        this.loginField.setErrors({ wrong: true });
        this.passwordField.setValue('');
      });
  }
}
