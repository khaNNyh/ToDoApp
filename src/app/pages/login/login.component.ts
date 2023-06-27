import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private auth: AuthService, private router: Router) {}

  loginField = new FormControl<string>('', Validators.required);
  passwordField = new FormControl<string>('', Validators.required);

  onLoginButtonClick() {
    this.auth
      .login(
        this.loginField.value as string,
        this.passwordField.value as string
      )
      .subscribe((res: HttpResponse<any>) => {
        //ok
        this.router.navigate(['/lists']);
      })
      .add(() => {
        console.log('error');
        this.loginField.setErrors({ wrong: true });
        this.passwordField.setValue('');
      });
  }
}
