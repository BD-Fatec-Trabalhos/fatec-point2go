from rest_framework import generics, mixins, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from common.permissions import IsParceiro
from encomendas.domain import apis
from encomendas.serializers import (
    EncomendaCreateSerializer,
    EncomendaRastreioSerializer,
    EncomendaSerializer,
    EncomendaStatusUpdateSerializer,
)


class EncomendaViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    """Sem update/destroy genéricos: mudança de status só via a action `atualizar_status`."""

    def get_queryset(self):
        return apis.listar_encomendas_do_usuario(self.request.user)

    def get_serializer_class(self):
        if self.action == "create":
            return EncomendaCreateSerializer
        if self.action == "atualizar_status":
            return EncomendaStatusUpdateSerializer
        return EncomendaSerializer

    def get_permissions(self):
        if self.action in ("create", "atualizar_status"):
            return [permissions.IsAuthenticated(), IsParceiro()]
        return [permissions.IsAuthenticated()]

    @action(detail=True, methods=["patch"], url_path="status")
    def atualizar_status(self, request, pk=None):
        encomenda = self.get_object()
        serializer = self.get_serializer(encomenda, data=request.data)
        serializer.is_valid(raise_exception=True)
        encomenda = serializer.save()
        return Response(EncomendaSerializer(encomenda).data)


class EncomendaRastreioView(generics.RetrieveAPIView):
    serializer_class = EncomendaRastreioSerializer
    lookup_url_kwarg = "codigo_rastreio"

    def get_object(self):
        return apis.obter_rastreio(self.kwargs["codigo_rastreio"])
