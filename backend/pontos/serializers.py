from rest_framework import serializers

from pontos.domain import apis
from pontos.models import AreaRestricao, Endereco, PontoRetirada


class EnderecoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Endereco
        fields = ["id", "rua", "numero", "bairro", "cidade", "uf", "cep", "latitude", "longitude"]


class AreaRestricaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AreaRestricao
        fields = ["id", "nome", "cidade", "bairros_atendidos", "motivo"]


class PontoRetiradaSerializer(serializers.ModelSerializer):
    endereco = EnderecoSerializer()
    area_restricao = AreaRestricaoSerializer(read_only=True)
    area_restricao_id = serializers.PrimaryKeyRelatedField(
        queryset=AreaRestricao.objects.all(), source="area_restricao", write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = PontoRetirada
        fields = [
            "id",
            "nome",
            "endereco",
            "area_restricao",
            "area_restricao_id",
            "horario_funcionamento",
            "capacidade_total",
            "capacidade_ocupada",
            "ativo",
        ]
        read_only_fields = ["capacidade_ocupada", "ativo"]

    def create(self, validated_data):
        endereco_dados = validated_data.pop("endereco")
        area_restricao = validated_data.pop("area_restricao", None)
        return apis.cadastrar_ponto(
            responsavel=self.context["request"].user,
            endereco_dados=endereco_dados,
            area_restricao=area_restricao,
            **validated_data,
        )
