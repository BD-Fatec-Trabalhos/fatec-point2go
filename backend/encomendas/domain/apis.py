from django.core.exceptions import PermissionDenied, ValidationError
from django.db import transaction

from encomendas.models import Encomenda
from pontos.domain import apis as pontos_apis
from pontos.models import PontoRetirada

TRANSICOES_PERMITIDAS = {
    Encomenda.Status.EM_TRANSITO: {Encomenda.Status.AGUARDANDO_RETIRADA},
    Encomenda.Status.AGUARDANDO_RETIRADA: {Encomenda.Status.RETIRADA_CONFIRMADA, Encomenda.Status.DEVOLVIDO},
    Encomenda.Status.RETIRADA_CONFIRMADA: set(),
    Encomenda.Status.DEVOLVIDO: set(),
}

STATUS_QUE_LIBERAM_CAPACIDADE = {Encomenda.Status.RETIRADA_CONFIRMADA, Encomenda.Status.DEVOLVIDO}


def validar_transicao_status(status_atual: str, novo_status: str) -> None:
    if novo_status not in TRANSICOES_PERMITIDAS.get(status_atual, set()):
        raise ValidationError(f'Não é possível mudar o status de "{status_atual}" para "{novo_status}".')


def registrar_recebimento(*, parceiro, codigo_rastreio, destinatario, ponto: PontoRetirada, prazo_guarda=None) -> Encomenda:
    if ponto.responsavel_id != parceiro.id:
        raise PermissionDenied("Você não é o responsável por este ponto de retirada.")

    with transaction.atomic():
        encomenda = Encomenda.objects.create(
            codigo_rastreio=codigo_rastreio,
            destinatario=destinatario,
            ponto=ponto,
            status_atual=Encomenda.Status.AGUARDANDO_RETIRADA,
            prazo_guarda=prazo_guarda,
        )
        pontos_apis.atualizar_capacidade_ocupada(ponto=ponto, delta=1)
    return encomenda


def atualizar_status(*, ator, encomenda: Encomenda, novo_status: str) -> Encomenda:
    if encomenda.ponto_id is None or encomenda.ponto.responsavel_id != ator.id:
        raise PermissionDenied("Você não é o responsável pelo ponto desta encomenda.")

    validar_transicao_status(encomenda.status_atual, novo_status)

    with transaction.atomic():
        encomenda.status_atual = novo_status
        encomenda.save(update_fields=["status_atual"])
        if novo_status in STATUS_QUE_LIBERAM_CAPACIDADE:
            pontos_apis.atualizar_capacidade_ocupada(ponto=encomenda.ponto, delta=-1)
    return encomenda


def listar_encomendas_do_usuario(usuario):
    if usuario.tipo == "parceiro":
        return Encomenda.objects.filter(ponto__responsavel=usuario).select_related("ponto", "destinatario")
    return Encomenda.objects.filter(destinatario=usuario).select_related("ponto", "destinatario")


def obter_rastreio(codigo_rastreio: str) -> Encomenda:
    return (
        Encomenda.objects.select_related("ponto", "destinatario")
        .prefetch_related("movimentacoes")
        .get(codigo_rastreio=codigo_rastreio)
    )
