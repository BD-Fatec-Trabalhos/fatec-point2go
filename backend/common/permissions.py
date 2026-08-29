from rest_framework.permissions import BasePermission


class IsParceiro(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.tipo == "parceiro")


class IsDestinatario(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.tipo == "destinatario")
