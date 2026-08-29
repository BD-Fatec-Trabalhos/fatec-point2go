from django.conf import settings
from django.db import models

from common.models import ModeloBase


class Endereco(ModeloBase):
    rua = models.CharField(max_length=255)
    numero = models.CharField(max_length=20)
    bairro = models.CharField(max_length=100)
    cidade = models.CharField(max_length=100)
    uf = models.CharField(max_length=2)
    cep = models.CharField(max_length=8)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    def __str__(self):
        return f"{self.rua}, {self.numero} - {self.bairro}, {self.cidade}/{self.uf}"


class AreaRestricao(ModeloBase):
    nome = models.CharField(max_length=100)
    cidade = models.CharField(max_length=100)
    bairros_atendidos = models.TextField()
    motivo = models.TextField()

    def __str__(self):
        return self.nome


class PontoRetirada(ModeloBase):
    nome = models.CharField(max_length=150)
    endereco = models.OneToOneField(Endereco, on_delete=models.PROTECT, related_name="ponto")
    responsavel = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="pontos_responsavel"
    )
    area_restricao = models.ForeignKey(
        AreaRestricao, on_delete=models.SET_NULL, null=True, blank=True, related_name="pontos"
    )
    horario_funcionamento = models.CharField(max_length=100)
    capacidade_total = models.PositiveIntegerField()
    capacidade_ocupada = models.PositiveIntegerField(default=0)
    ativo = models.BooleanField(default=True)

    def __str__(self):
        return self.nome
