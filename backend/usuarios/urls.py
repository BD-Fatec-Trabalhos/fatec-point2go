from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from usuarios.views import LoginView, RegistroView

app_name = "usuarios"

urlpatterns = [
    path("registro", RegistroView.as_view(), name="registro"),
    path("login", LoginView.as_view(), name="login"),
    path("login/refresh", TokenRefreshView.as_view(), name="login-refresh"),
]
