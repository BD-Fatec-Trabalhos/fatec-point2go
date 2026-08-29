from django.test import TestCase

from encomendas.models import Encomenda, Movimentacao
from pontos.models import Endereco, PontoRetirada
from usuarios.models import Usuario


class TriggerMovimentacaoTests(TestCase):
    """
    Testa o trigger do PostgreSQL diretamente via ORM, sem passar por
    serializer/domain, para isolar o comportamento do banco.
    """

    def setUp(self):
        self.parceiro = Usuario.objects.create_user(
            username="parceiro1", password="senha12345", tipo=Usuario.Tipo.PARCEIRO, cpf="11111111111"
        )
        self.destinatario = Usuario.objects.create_user(
            username="cliente1", password="senha12345", tipo=Usuario.Tipo.DESTINATARIO, cpf="22222222222"
        )
        endereco = Endereco.objects.create(
            rua="Rua Teste", numero="100", bairro="Centro", cidade="Bauru", uf="SP", cep="17010000"
        )
        self.ponto = PontoRetirada.objects.create(
            nome="Papelaria Teste",
            endereco=endereco,
            responsavel=self.parceiro,
            horario_funcionamento="08h-18h",
            capacidade_total=10,
        )

    def test_insert_gera_primeira_movimentacao(self):
        encomenda = Encomenda.objects.create(
            codigo_rastreio="BR123456789",
            destinatario=self.destinatario,
            ponto=self.ponto,
            status_atual=Encomenda.Status.AGUARDANDO_RETIRADA,
        )

        movimentacoes = list(Movimentacao.objects.filter(encomenda=encomenda))
        self.assertEqual(len(movimentacoes), 1)
        self.assertEqual(movimentacoes[0].tipo_evento, "registrado_no_ponto")
        self.assertIn("BR123456789", movimentacoes[0].descricao)

    def test_mudanca_de_status_gera_nova_movimentacao(self):
        encomenda = Encomenda.objects.create(
            codigo_rastreio="BR000000001",
            destinatario=self.destinatario,
            ponto=self.ponto,
            status_atual=Encomenda.Status.AGUARDANDO_RETIRADA,
        )

        encomenda.status_atual = Encomenda.Status.RETIRADA_CONFIRMADA
        encomenda.save(update_fields=["status_atual"])

        movimentacoes = list(Movimentacao.objects.filter(encomenda=encomenda).order_by("id"))
        self.assertEqual(len(movimentacoes), 2)
        self.assertEqual(movimentacoes[1].tipo_evento, "mudanca_status")
        self.assertIn("aguardando_retirada", movimentacoes[1].descricao)
        self.assertIn("retirada_confirmada", movimentacoes[1].descricao)

    def test_save_sem_mudar_status_nao_gera_movimentacao_extra(self):
        encomenda = Encomenda.objects.create(
            codigo_rastreio="BR000000002",
            destinatario=self.destinatario,
            ponto=self.ponto,
            status_atual=Encomenda.Status.AGUARDANDO_RETIRADA,
        )

        encomenda.prazo_guarda = None
        encomenda.save(update_fields=["prazo_guarda"])

        self.assertEqual(Movimentacao.objects.filter(encomenda=encomenda).count(), 1)

    def test_movimentacao_nao_pode_ser_criada_via_orm(self):
        encomenda = Encomenda.objects.create(
            codigo_rastreio="BR000000003",
            destinatario=self.destinatario,
            ponto=self.ponto,
            status_atual=Encomenda.Status.AGUARDANDO_RETIRADA,
        )

        with self.assertRaises(RuntimeError):
            Movimentacao.objects.create(
                encomenda=encomenda, data_hora="2026-01-01T00:00:00Z", tipo_evento="manual", descricao="x"
            )
