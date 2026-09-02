from django.contrib.auth.models import AbstractUser
from django.db import models


class Usuario(AbstractUser):
    class Tipo(models.TextChoices):
        DESTINATARIO = "destinatario", "Destinatário"
        PARCEIRO = "parceiro", "Parceiro"

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    email = models.EmailField(unique=True)
    tipo = models.CharField(max_length=20, choices=Tipo.choices)
    telefone = models.CharField(max_length=20, blank=True)
    cpf = models.CharField(max_length=11, unique=True)
