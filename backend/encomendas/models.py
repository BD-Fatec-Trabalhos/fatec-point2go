from django.conf import settings
from django.db import models


class Encomenda(models.Model):
    class Status(models.TextChoices):
        EM_TRANSITO = "em_transito", "Em trânsito"
        AGUARDANDO_RETIRADA = "aguardando_retirada", "Aguardando retirada"
        RETIRADA_CONFIRMADA = "retirada_confirmada", "Retirada confirmada"
        DEVOLVIDO = "devolvido", "Devolvido"

    codigo_rastreio = models.CharField(max_length=30, unique=True)
    destinatario = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="encomendas"
    )
    ponto = models.ForeignKey(
        "pontos.PontoRetirada", on_delete=models.PROTECT, related_name="encomendas", null=True, blank=True
    )
    status_atual = models.CharField(max_length=25, choices=Status.choices, default=Status.AGUARDANDO_RETIRADA)
    data_criacao = models.DateTimeField(auto_now_add=True)
    prazo_guarda = models.DateField(null=True, blank=True)

    class Meta:
        db_table = "encomendas"

    def __str__(self):
        return self.codigo_rastreio


class MovimentacaoManager(models.Manager):
    """Movimentacao é gerada automaticamente por trigger do PostgreSQL — nunca via ORM."""

    def create(self, *args, **kwargs):
        raise RuntimeError("Movimentacao é gerada automaticamente por trigger; não crie via ORM.")

    def bulk_create(self, *args, **kwargs):
        raise RuntimeError("Movimentacao é gerada automaticamente por trigger; não crie via ORM.")


class Movimentacao(models.Model):
    encomenda = models.ForeignKey(Encomenda, on_delete=models.CASCADE, related_name="movimentacoes")
    data_hora = models.DateTimeField()
    tipo_evento = models.CharField(max_length=50)
    descricao = models.TextField()

    objects = MovimentacaoManager()

    class Meta:
        db_table = "movimentacoes"
        ordering = ["data_hora"]

    def __str__(self):
        return f"{self.encomenda_id} - {self.tipo_evento} ({self.data_hora})"
