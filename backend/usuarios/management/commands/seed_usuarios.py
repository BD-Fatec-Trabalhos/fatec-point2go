from django.core.management.base import BaseCommand

from usuarios.domain import apis
from usuarios.models import Usuario

USUARIOS_DEMO = [
    dict(
        username="parceiro_demo",
        password="senha12345",
        email="parceiro@teste.com",
        tipo=Usuario.Tipo.PARCEIRO,
        telefone="14999990000",
        cpf="11122233344",
    ),
    dict(
        username="cliente_demo",
        password="senha12345",
        email="cliente@teste.com",
        tipo=Usuario.Tipo.DESTINATARIO,
        telefone="14999991111",
        cpf="55566677788",
    ),
]


class Command(BaseCommand):
    help = "Cria os usuários de demonstração (1 parceiro, 1 destinatário) usados nos testes manuais e no Postman."

    def handle(self, *args, **options):
        for dados in USUARIOS_DEMO:
            if Usuario.objects.filter(username=dados["username"]).exists():
                self.stdout.write(f"{dados['username']}: já existia")
                continue
            apis.registrar_usuario(**dados)
            self.stdout.write(self.style.SUCCESS(f"{dados['username']}: criado"))
