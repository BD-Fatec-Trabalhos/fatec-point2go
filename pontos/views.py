from rest_framework import permissions, viewsets

from common.permissions import IsParceiro
from pontos.models import AreaRestricao, PontoRetirada
from pontos.serializers import AreaRestricaoSerializer, PontoRetiradaSerializer


class PontoRetiradaViewSet(viewsets.ModelViewSet):
    queryset = PontoRetirada.objects.filter(ativo=True).select_related("endereco", "area_restricao")
    serializer_class = PontoRetiradaSerializer

    def get_permissions(self):
        if self.action == "create":
            return [permissions.IsAuthenticated(), IsParceiro()]
        return [permissions.IsAuthenticated()]


class AreaRestricaoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AreaRestricao.objects.all()
    serializer_class = AreaRestricaoSerializer
