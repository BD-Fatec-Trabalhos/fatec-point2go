from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import F

from pontos.models import Endereco, PontoRetirada


def cadastrar_ponto(*, responsavel, nome, endereco_dados, area_restricao=None, horario_funcionamento, capacidade_total):
    with transaction.atomic():
        endereco = Endereco.objects.create(**endereco_dados)
        return PontoRetirada.objects.create(
            nome=nome,
            endereco=endereco,
            responsavel=responsavel,
            area_restricao=area_restricao,
            horario_funcionamento=horario_funcionamento,
            capacidade_total=capacidade_total,
        )


def atualizar_capacidade_ocupada(*, ponto: PontoRetirada, delta: int) -> PontoRetirada:
    if delta > 0:
        atualizados = (
            PontoRetirada.objects.filter(pk=ponto.pk, capacidade_ocupada__lt=F("capacidade_total"))
            .update(capacidade_ocupada=F("capacidade_ocupada") + delta)
        )
        if not atualizados:
            raise ValidationError("Ponto de retirada sem capacidade disponível.")
    else:
        PontoRetirada.objects.filter(pk=ponto.pk).update(
            capacidade_ocupada=F("capacidade_ocupada") + delta
        )
    ponto.refresh_from_db(fields=["capacidade_ocupada"])
    return ponto
