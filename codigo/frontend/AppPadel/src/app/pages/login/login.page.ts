import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from 'src/app/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonicModule
  ]
})
export class LoginPage {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: Auth, private router: Router) {}

  async login() {
    this.errorMessage = '';
    console.log('Intentando login con:', this.email);

    try {
      const { data, error } = await this.authService.login(this.email, this.password);

      if (error) {
        console.error('Error en login:', error.message);
        this.errorMessage = error.message;
        return;
      }

      console.log('Login exitoso:', data);
   this.router.navigateByUrl('/tabs/home', { replaceUrl: true });

    } catch (err: any) {
      console.error('Error inesperado:', err);
      this.errorMessage = 'Error al intentar iniciar sesión.';
    }
  }
}
