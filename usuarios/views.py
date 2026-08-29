from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView

from usuarios.serializers import CustomTokenObtainPairSerializer, UsuarioRegistroSerializer


class RegistroView(generics.CreateAPIView):
    serializer_class = UsuarioRegistroSerializer
    permission_classes = [permissions.AllowAny]


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [permissions.AllowAny]
