import { useEffect, useState } from "react";
import { pontosApi } from "@/lib/api/pontos";
import type { PontoRetirada } from "@/types";

export function usePontos() {
  const [pontos, setPontos] = useState<PontoRetirada[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    pontosApi
      .listar()
      .then((data) => {
        if (ativo) setPontos(data);
      })
      .catch(() => {
        if (ativo) setErro("Não foi possível carregar os pontos de retirada.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, []);

  return { pontos, carregando, erro };
}
