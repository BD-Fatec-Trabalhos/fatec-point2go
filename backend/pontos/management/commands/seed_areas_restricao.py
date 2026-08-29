from django.core.management.base import BaseCommand

from pontos.models import AreaRestricao

AREAS_ILUSTRATIVAS = [
    {
        "nome": "Zona Norte de Bauru",
        "cidade": "Bauru",
        "bairros_atendidos": "Vila Falcão, Jardim Bela Vista, Parque Paulista",
        "motivo": "Baixa cobertura operacional e histórico de restrição de circulação para entregadores.",
    },
    {
        "nome": "Zona Leste de Bauru",
        "cidade": "Bauru",
        "bairros_atendidos": "Independência, Jardim Panorama, Vila São Paulo",
        "motivo": "Restrição de acesso da transportadora em determinados horários por questões de segurança.",
    },
    {
        "nome": "Distrito Industrial de Bauru",
        "cidade": "Bauru",
        "bairros_atendidos": "Distrito Industrial, Tangará",
        "motivo": "Baixa densidade residencial e ausência de cobertura de entrega domiciliar regular.",
    },
]


class Command(BaseCommand):
    help = "Popula áreas de restrição ilustrativas (dado fictício, sem base geográfica real) para demonstração."

    def handle(self, *args, **options):
        for dados in AREAS_ILUSTRATIVAS:
            area, criada = AreaRestricao.objects.get_or_create(nome=dados["nome"], defaults=dados)
            status = "criada" if criada else "já existia"
            self.stdout.write(self.style.SUCCESS(f"{area.nome}: {status}"))
