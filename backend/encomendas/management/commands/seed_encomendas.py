from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError

from encomendas.domain import apis
from encomendas.models import Encomenda
from pontos.models import PontoRetirada

Usuario = get_user_model()


class Command(BaseCommand):
    help = "Popula encomendas de demonstração para o parceiro e o destinatário de seed, já exercitando a trigger."

    def handle(self, *args, **options):
        try:
            parceiro = Usuario.objects.get(username="parceiro_demo")
            destinatario = Usuario.objects.get(username="cliente_demo")
        except Usuario.DoesNotExist:
            raise CommandError("Rode 'seed_usuarios' antes de 'seed_encomendas'.")

        pontos = list(PontoRetirada.objects.filter(responsavel=parceiro).order_by("id"))
        if not pontos:
            raise CommandError("Rode 'seed_pontos' antes de 'seed_encomendas'.")

        if not Encomenda.objects.filter(codigo_rastreio="BR000000001").exists():
            apis.registrar_recebimento(
                parceiro=parceiro,
                codigo_rastreio="BR000000001",
                destinatario=destinatario,
                ponto=pontos[0],
            )
            self.stdout.write(self.style.SUCCESS("BR000000001: criada, aguardando retirada"))
        else:
            self.stdout.write("BR000000001: já existia")

        if not Encomenda.objects.filter(codigo_rastreio="BR000000002").exists():
            encomenda = apis.registrar_recebimento(
                parceiro=parceiro,
                codigo_rastreio="BR000000002",
                destinatario=destinatario,
                ponto=pontos[-1],
            )
            apis.atualizar_status(
                ator=parceiro, encomenda=encomenda, novo_status=Encomenda.Status.RETIRADA_CONFIRMADA
            )
            self.stdout.write(self.style.SUCCESS("BR000000002: criada e já marcada como retirada"))
        else:
            self.stdout.write("BR000000002: já existia")
