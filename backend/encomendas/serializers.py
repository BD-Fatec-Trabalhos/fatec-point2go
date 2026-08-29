from rest_framework import serializers

from encomendas.domain import apis
from encomendas.models import Encomenda, Movimentacao
from pontos.models import PontoRetirada
from usuarios.models import Usuario


class MovimentacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movimentacao
        fields = ["id", "data_hora", "tipo_evento", "descricao"]


class EncomendaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Encomenda
        fields = ["id", "codigo_rastreio", "destinatario", "ponto", "status_atual", "data_criacao", "prazo_guarda"]
        read_only_fields = fields


class EncomendaCreateSerializer(serializers.ModelSerializer):
    destinatario_id = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.all(), source="destinatario")
    ponto_id = serializers.PrimaryKeyRelatedField(queryset=PontoRetirada.objects.all(), source="ponto")

    class Meta:
        model = Encomenda
        fields = ["id", "codigo_rastreio", "destinatario_id", "ponto_id", "prazo_guarda"]

    def create(self, validated_data):
        return apis.registrar_recebimento(parceiro=self.context["request"].user, **validated_data)


class EncomendaStatusUpdateSerializer(serializers.Serializer):
    novo_status = serializers.ChoiceField(choices=Encomenda.Status.choices)

    def update(self, instance, validated_data):
        return apis.atualizar_status(
            ator=self.context["request"].user, encomenda=instance, novo_status=validated_data["novo_status"]
        )


class EncomendaRastreioSerializer(serializers.ModelSerializer):
    movimentacoes = MovimentacaoSerializer(many=True, read_only=True)

    class Meta:
        model = Encomenda
        fields = [
            "id",
            "codigo_rastreio",
            "destinatario",
            "ponto",
            "status_atual",
            "data_criacao",
            "prazo_guarda",
            "movimentacoes",
        ]
        read_only_fields = fields
