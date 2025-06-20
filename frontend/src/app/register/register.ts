import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  message = '';

  constructor(private http: HttpClient, private router: Router) {}

  register(username: string, password: string, role: string) {
    if (!username || !password || !role) {
      this.message = 'Faltan campos';
      return;
    }
  
    //Registra usando la api
    this.http.post('http://127.0.0.1:8000/api/auth/register/', { username, password, role })
      .subscribe({
        next: () => {
          setTimeout(() => this.router.navigate(['/']), 1000);
          this.message = 'Registro exitoso';
        },
        error: err => {
          this.message = err.error?.error || 'Error en el registro';
        }
      });
  }
  

  goLogin() {
    this.router.navigate(['/']);
  }
}
