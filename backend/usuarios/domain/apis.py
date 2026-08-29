from usuarios.models import Usuario


def registrar_usuario(*, username, password, email, tipo, first_name="", last_name="", telefone="", cpf) -> Usuario:
    return Usuario.objects.create_user(
        username=username,
        password=password,
        email=email,
        tipo=tipo,
        first_name=first_name,
        last_name=last_name,
        telefone=telefone,
        cpf=cpf,
    )
