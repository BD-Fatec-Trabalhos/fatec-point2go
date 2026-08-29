from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from usuarios.domain import apis
from usuarios.models import Usuario


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ["id", "username", "email", "tipo", "first_name", "last_name", "telefone", "cpf"]


class UsuarioRegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = Usuario
        fields = ["id", "username", "password", "email", "tipo", "first_name", "last_name", "telefone", "cpf"]

    def create(self, validated_data):
        return apis.registrar_usuario(**validated_data)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["tipo"] = user.tipo
        return token
