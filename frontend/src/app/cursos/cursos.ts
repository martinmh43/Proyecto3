import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cursos.html',
  styleUrls: ['./cursos.css']
})
export class Cursos {
  cursos: any[] = [];
  error = '';

  constructor(private http: HttpClient, private router: Router) {
    this.loadCursos();
  }

  // Carga los cursos
  loadCursos() {
    this.http.get<any[]>('http://localhost:8000/api/cursos/')
      .subscribe({
        next: data => this.cursos = data,
        error: () => this.error = 'No se pudieron cargar los cursos'
      });
  }

  //Te une al curso
  unirse(cursoId: number) {
    this.router.navigate(['/curso', cursoId]);
  }

  //Cierra sesion y borra el localStorage
  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/']);
  }
  
}
