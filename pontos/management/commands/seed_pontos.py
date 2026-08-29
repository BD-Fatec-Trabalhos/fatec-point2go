from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError

from pontos.domain import apis
from pontos.models import AreaRestricao, PontoRetirada

Usuario = get_user_model()

PONTOS_ILUSTRATIVOS = [
    {
        "nome": "Papelaria Central",
        "endereco": dict(
            rua="Rua Batista de Carvalho",
            numero="500",
            bairro="Centro",
            cidade="Bauru",
            uf="SP",
            cep="17010120",
            latitude="-22.314900",
            longitude="-49.060700",
        ),
        "area_restricao_nome": None,
        "horario_funcionamento": "08h-18h",
        "capacidade_total": 20,
    },
    {
        "nome": "Mercado Vila Falcão",
        "endereco": dict(
            rua="Rua Aviador Gomes Ribeiro",
            numero="120",
            bairro="Vila Falcão",
            cidade="Bauru",
            uf="SP",
            cep="17015130",
            latitude="-22.299400",
            longitude="-49.070800",
        ),
        "area_restricao_nome": "Zona Norte de Bauru",
        "horario_funcionamento": "07h-19h",
        "capacidade_total": 15,
    },
]


class Command(BaseCommand):
    help = "Popula pontos de retirada de demonstração, vinculados ao parceiro de seed."

    def handle(self, *args, **options):
        try:
            parceiro = Usuario.objects.get(username="parceiro_demo")
        except Usuario.DoesNotExist:
            raise CommandError("Rode 'seed_usuarios' antes de 'seed_pontos'.")

        for dados in PONTOS_ILUSTRATIVOS:
            if PontoRetirada.objects.filter(nome=dados["nome"]).exists():
                self.stdout.write(f"{dados['nome']}: já existia")
                continue

            area_restricao = None
            if dados["area_restricao_nome"]:
                area_restricao = AreaRestricao.objects.filter(nome=dados["area_restricao_nome"]).first()

            apis.cadastrar_ponto(
                responsavel=parceiro,
                nome=dados["nome"],
                endereco_dados=dados["endereco"],
                area_restricao=area_restricao,
                horario_funcionamento=dados["horario_funcionamento"],
                capacidade_total=dados["capacidade_total"],
            )
            self.stdout.write(self.style.SUCCESS(f"{dados['nome']}: criado"))
