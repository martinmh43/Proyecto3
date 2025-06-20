from django.contrib.auth.models import User
from django.db import models

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=[('alumno', 'Alumno'), ('profesor', 'Profesor')])

    def __str__(self):
        return f"{self.user.username} - {self.role}"