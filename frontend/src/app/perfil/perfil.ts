import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class Perfil implements OnInit {
  usuario: any = {};
  intercambios: any[] = [];
  pegatinas: any[] = [];
  cursoId!: number;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const urlParams = this.router.url.split('/');
    this.cursoId = Number(urlParams[2]);
    //Coge los datos del perfil usando la api
    this.http.get('http://localhost:8000/api/auth/profile/').subscribe(data => {
      this.usuario = data;
      if (this.usuario.role === 'profesor') {
        this.cargarHistorial();
      } else if (this.usuario.role === 'alumno') {
        this.cargarPegatinas();
      }
    });
  }

  cargarHistorial() {
    if (!this.cursoId) {
      console.error('cursoId inválido');
      return;
    }

    //Muestra el historial de intercambios segun el curso en el que estes
    this.http.get<any[]>(`http://localhost:8000/api/cursos/historial-intercambios/?curso=${this.cursoId}`)
      .subscribe(data => {
        this.intercambios = data;
      });
  }

  //Muestra dos pegatinas aleatorias (si tienes) para que el perfil sea mas animado
  cargarPegatinas() {
    this.http.get<any[]>('http://localhost:8000/api/cursos/mis-pegatinas/').subscribe(data => {
      this.pegatinas = data.sort(() => 0.5 - Math.random()).slice(0, 2);
    });
  }

  //Vuelves al curso
  volverAlCurso() {
    this.router.navigate(['/curso', this.cursoId]);
  }
}
