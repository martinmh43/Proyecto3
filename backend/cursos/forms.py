from django import forms
from .models import Intercambio, CursoUsuario
from django.contrib.auth.models import User

# Formulario personalizado para intercambios
class IntercambioForm(forms.ModelForm):
    class Meta:
        model = Intercambio
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(IntercambioForm, self).__init__(*args, **kwargs)
        # Si hay emisor en datos iniciales o donde estemos cogemos el id
        if 'emisor' in self.initial:
            emisor_id = self.initial['emisor']  
        elif self.instance and self.instance.emisor_id:
            emisor_id = self.instance.emisor_id 
        else:
            emisor_id = None

        if emisor_id:   #Filtramos para que solo se pueda comartir con usuarios que esten en el mismo curso (y no con el propio)
            cursos_usuario = CursoUsuario.objects.filter(user_id=emisor_id).values_list('curso_id', flat=True)
            usuarios_mismo_curso = User.objects.filter(cursousuario__curso_id__in=cursos_usuario).exclude(id=emisor_id).distinct()
            self.fields['receptor'].queryset = usuarios_mismo_curso
        else:
            self.fields['receptor'].queryset = User.objects.none()