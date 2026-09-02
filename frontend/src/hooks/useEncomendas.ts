import { useEffect, useState } from "react";
import { encomendasApi } from "@/lib/api/encomendas";
import type { Encomenda } from "@/types";

export function useEncomendas() {
  const [encomendas, setEncomendas] = useState<Encomenda[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    encomendasApi
      .listar()
      .then((data) => {
        if (ativo) setEncomendas(data);
      })
      .catch(() => {
        if (ativo) setErro("Não foi possível carregar as encomendas.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, []);

  return { encomendas, carregando, erro };
}
