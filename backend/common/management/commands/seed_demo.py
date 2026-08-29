from django.core.management import call_command
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Roda todos os seeds de demonstração, na ordem certa: usuários -> áreas de restrição -> pontos -> encomendas."

    def handle(self, *args, **options):
        call_command("seed_usuarios")
        call_command("seed_areas_restricao")
        call_command("seed_pontos")
        call_command("seed_encomendas")
