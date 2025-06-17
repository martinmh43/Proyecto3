import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-curso-detalle',
  templateUrl: './curso-detalle.html',
  standalone: true,
  styleUrls: ['./curso-detalle.css']
})
export class CursoDetalle implements OnInit {
  curso: any ={};
  cursoId!: number;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.cursoId = Number(this.route.snapshot.paramMap.get('id'));
    this.http.get(`http://localhost:8000/api/cursos/${this.cursoId}/`).subscribe({
      next: data => this.curso = data,
      error: err => console.error('Error al cargar curso', err)
    });
  }

  // Nevageas a la pestaña de test
  verTests() {
  this.router.navigate(['/curso', this.cursoId, 'tests']);
  }

  // Nevageas a la pestaña de ranking
  verRanking() {
    this.router.navigate(['/curso', this.cursoId, 'ranking']);
  }

  // Nevageas a la pestaña de pegatinas
  verPegatinas() {
    this.router.navigate(['/curso', this.cursoId, 'pegatinas']);
  }

  // Nevageas a la pestaña de intercambio
  verIntercambio() {
    this.router.navigate(['/curso', this.cursoId, 'intercambio']);
  }

  // Nevageas a la pestaña de perfil
  verPerfil() {
    this.router.navigate(['/curso', this.cursoId, 'perfil']);
  }

  // Nevageas a la pestaña de cursos
  volverACursos() {
    this.router.navigate(['/cursos']);
  }
  

}
