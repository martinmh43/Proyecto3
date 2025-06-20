from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from authapp.models import Profile

# Vista del register
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    role = request.data.get('role')  # 'profesor' o 'alumno'

    if not username or not password or not role:
        return Response({'error': 'Faltan campos'}, status=status.HTTP_400_BAD_REQUEST) # Comprobacion poner todos los campos

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Usuario ya existe'}, status=status.HTTP_400_BAD_REQUEST) #Comprobacion que no exista user

    user = User.objects.create(
    username=username,
    password=make_password(password)
)

    # Forzamos creación del perfil si el signal no ha corrido aún
    profile, created = Profile.objects.get_or_create(user=user)
    profile.role = role
    profile.save()


    return Response({'message': 'Usuario creado correctamente'})

# Vista login
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request=request, username=username, password=password)

    if user is None:
        return Response({'error': 'Usuario o contraseña incorrectos'}, status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)
    return Response({
        'refresh': str(refresh),
        'token': str(refresh.access_token),
        'role': user.profile.role,
    })

# Vista del perfil (formao por user, passw y role)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    return Response({
        'id': request.user.id,
        'username': request.user.username,
        'role': request.user.profile.role 
    })
