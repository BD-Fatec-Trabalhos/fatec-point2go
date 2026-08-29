from rest_framework.routers import DefaultRouter

from django.urls import path

from encomendas.views import EncomendaRastreioView, EncomendaViewSet

app_name = "encomendas"

router = DefaultRouter()
router.register("encomendas", EncomendaViewSet, basename="encomenda")

urlpatterns = [
    path("encomendas/<str:codigo_rastreio>/rastreio", EncomendaRastreioView.as_view(), name="encomenda-rastreio"),
] + router.urls
