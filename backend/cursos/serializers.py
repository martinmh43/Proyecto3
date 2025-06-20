from rest_framework import serializers
from .models import Cursos, Test, Pregunta, Respuesta, CursoUsuario, Pegatina, Intercambio, User

class CursosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cursos
        fields = ['id', 'name']

class RespuestaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Respuesta
        fields = ['id', 'texto']

class PreguntaSerializer(serializers.ModelSerializer):
    respuestas = RespuestaSerializer(many=True, read_only=True)
    test_nombre = serializers.CharField(source='test.name', read_only=True)

    class Meta:
        model = Pregunta
        fields = ['id', 'texto', 'respuestas', 'active', 'test_nombre'] 

class TestSerializer(serializers.ModelSerializer):
    preguntas = PreguntaSerializer(many=True, read_only=True)

    class Meta:
        model = Test
        fields = ['id', 'name', 'content', 'active', 'preguntas']

class PegatinaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pegatina
        fields = ['id', 'nombre', 'imagen']

class CursoUsuarioSerializer(serializers.ModelSerializer):
    pegatinas = PegatinaSerializer(many=True, read_only=True)

    class Meta:
        model = CursoUsuario
        fields = ['id', 'user', 'curso', 'puntos', 'pegatinas']


class IntercambioSerializer(serializers.ModelSerializer):
    emisor = serializers.PrimaryKeyRelatedField(read_only=True)
    receptor = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    pegatina_emisor = serializers.PrimaryKeyRelatedField(queryset=Pegatina.objects.all())
    pegatina_receptor = serializers.PrimaryKeyRelatedField(queryset=Pegatina.objects.all(), allow_null=True)
    curso = serializers.PrimaryKeyRelatedField(queryset=Cursos.objects.all())

    class Meta:
        model = Intercambio
        fields = '__all__'



