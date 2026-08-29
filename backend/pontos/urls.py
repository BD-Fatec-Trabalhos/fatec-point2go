from rest_framework.routers import DefaultRouter

from pontos.views import AreaRestricaoViewSet, PontoRetiradaViewSet

app_name = "pontos"

router = DefaultRouter()
router.register("pontos", PontoRetiradaViewSet, basename="ponto")
router.register("areas-restricao", AreaRestricaoViewSet, basename="area-restricao")

urlpatterns = router.urls
