import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Respuesta {
  id: number;
  texto: string;
  correcta?: boolean;
}

interface Pregunta {
  id: number;
  texto: string;
  respuestas: Respuesta[];
  active: boolean;
  test_nombre?: string;
  test_id?: number;
}

interface TestConPreguntas {
  id: number;
  name: string;
  preguntas: Pregunta[];
}


@Component({
  selector: 'app-tests-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test-list.html',
  styleUrls: ['./test-list.css']
})
export class TestsList implements OnInit {
  cursoId!: number;
  preguntas: Pregunta[] = [];
  error = '';
  esProfesor = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('ngOnInit TestsList');
    this.cursoId = Number(this.route.snapshot.paramMap.get('cursoId'));
    console.log('cursoId:', this.cursoId);
    this.esProfesor = localStorage.getItem('role') === 'profesor';
    this.cargarPreguntas();
  }

  cargarPreguntas() {
    this.http.get<TestConPreguntas[]>(`http://localhost:8000/api/cursos/${this.cursoId}/tests/`).subscribe({
      next: (data) => {
        // Aplanamos preguntas con el nombre del test
        this.preguntas = data.flatMap(test =>
          test.preguntas.map(p => ({
            ...p,
            test_nombre: test.name,
            test_id: test.id
          }))
        );
  
        if (!this.esProfesor) {
          this.preguntas = this.preguntas.filter(p => p.active);
        }
      },
      error: err => {
        this.error = 'Error cargando preguntas';
        console.error(err);
      }
    });
  }
  
  // Guarda los cambios a traves de la api
  guardarCambios(pregunta: Pregunta) {
    const url = `http://localhost:8000/api/cursos/preguntas/${pregunta.id}/`;
    this.http.patch<Pregunta>(url, { active: pregunta.active }).subscribe({
      next: () => console.log('Estado actualizado'),
      error: err => {
        this.error = 'Error guardando cambios';
        console.error(err);
      }
    });
  }

  empezarPregunta(pregunta: Pregunta) {
    this.router.navigate(['/curso', this.cursoId, 'test', pregunta.test_id]);
  }

  // Activa pregunta si desactivada y al reves
  toggleActivePregunta(pregunta: Pregunta) {
    const nuevoEstado = !pregunta.active;
    this.http.patch<Pregunta>(`http://localhost:8000/api/preguntas/${pregunta.id}/`, { active: nuevoEstado })
      .subscribe({
        next: (updated: Pregunta) => {
          pregunta.active = updated.active;
        },
        error: () => alert('Error al cambiar estado de la pregunta')
      });
  }

  volverAlCurso() {
    this.router.navigate(['/curso', this.cursoId]);

  }
}
