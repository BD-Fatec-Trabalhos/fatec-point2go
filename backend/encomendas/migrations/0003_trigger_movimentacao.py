# Trigger de auditoria do histórico de encomendas.
#
# Atenção: as tabelas/colunas referenciadas aqui em SQL (`encomendas`,
# `movimentacoes`, `status_atual`, `codigo_rastreio`, `encomenda_id`) não são
# rastreadas pelo autodetector do Django. Qualquer rename futuro nesses
# models (RenameField/RenameModel) precisa vir acompanhado de uma migration
# `CREATE OR REPLACE FUNCTION` atualizando este SQL.
from django.db import migrations

SQL_TRIGGER_INSERT = """
CREATE OR REPLACE FUNCTION trg_encomenda_registrar_criacao()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO movimentacoes (encomenda_id, data_hora, tipo_evento, descricao)
    VALUES (
        NEW.id,
        NOW(),
        'registrado_no_ponto',
        format('Encomenda %s registrada com status inicial "%s"', NEW.codigo_rastreio, NEW.status_atual)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_after_insert_encomenda
AFTER INSERT ON encomendas
FOR EACH ROW
EXECUTE FUNCTION trg_encomenda_registrar_criacao();
"""

SQL_TRIGGER_INSERT_REVERSE = """
DROP TRIGGER IF EXISTS trg_after_insert_encomenda ON encomendas;
DROP FUNCTION IF EXISTS trg_encomenda_registrar_criacao();
"""

SQL_TRIGGER_UPDATE = """
CREATE OR REPLACE FUNCTION trg_encomenda_registrar_mudanca_status()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO movimentacoes (encomenda_id, data_hora, tipo_evento, descricao)
    VALUES (
        NEW.id,
        NOW(),
        'mudanca_status',
        format('Status alterado de "%s" para "%s"', OLD.status_atual, NEW.status_atual)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_after_update_encomenda_status
AFTER UPDATE ON encomendas
FOR EACH ROW
WHEN (NEW.status_atual IS DISTINCT FROM OLD.status_atual)
EXECUTE FUNCTION trg_encomenda_registrar_mudanca_status();
"""

SQL_TRIGGER_UPDATE_REVERSE = """
DROP TRIGGER IF EXISTS trg_after_update_encomenda_status ON encomendas;
DROP FUNCTION IF EXISTS trg_encomenda_registrar_mudanca_status();
"""


class Migration(migrations.Migration):

    dependencies = [
        ("encomendas", "0002_initial"),
    ]

    operations = [
        migrations.RunSQL(sql=SQL_TRIGGER_INSERT, reverse_sql=SQL_TRIGGER_INSERT_REVERSE),
        migrations.RunSQL(sql=SQL_TRIGGER_UPDATE, reverse_sql=SQL_TRIGGER_UPDATE_REVERSE),
    ]
