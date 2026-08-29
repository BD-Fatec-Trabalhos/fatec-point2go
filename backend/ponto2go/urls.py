from django.urls import include, path

urlpatterns = [
    path("auth/", include("usuarios.urls")),
    path("", include("pontos.urls")),
    path("", include("encomendas.urls")),
]
