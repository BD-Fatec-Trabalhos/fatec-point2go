import { createContext, useContext, useState, type ReactNode } from "react";
import type { Parceiro, PontoRetirada, Encomenda, Movimentacao } from "@/types";
import { parceirosSeed, pontosSeed, encomendasSeed, movimentacoesSeed } from "@/data/mockData";

type AppDataContextValue = {
  parceiros: Parceiro[];
  pontos: PontoRetirada[];
  encomendas: Encomenda[];
  movimentacoes: Movimentacao[];
  addParceiro: (p: Parceiro) => void;
  addPonto: (p: PontoRetirada) => void;
  addEncomenda: (e: Encomenda) => void;
  addMovimentacao: (m: Movimentacao) => void;
  updateEncomendaStatus: (id: string, status: Encomenda["status"]) => void;
};

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [parceiros, setParceiros] = useState<Parceiro[]>(parceirosSeed);
  const [pontos, setPontos] = useState<PontoRetirada[]>(pontosSeed);
  const [encomendas, setEncomendas] = useState<Encomenda[]>(encomendasSeed);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>(movimentacoesSeed);

  const addParceiro = (p: Parceiro) => setParceiros((prev) => [p, ...prev]);
  const addPonto = (p: PontoRetirada) => setPontos((prev) => [p, ...prev]);
  const addEncomenda = (e: Encomenda) => setEncomendas((prev) => [e, ...prev]);
  const addMovimentacao = (m: Movimentacao) => setMovimentacoes((prev) => [m, ...prev]);
  const updateEncomendaStatus = (id: string, status: Encomenda["status"]) =>
    setEncomendas((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status, atualizadaEm: new Date().toISOString() } : e))
    );

  return (
    <AppDataContext.Provider
      value={{
        parceiros,
        pontos,
        encomendas,
        movimentacoes,
        addParceiro,
        addPonto,
        addEncomenda,
        addMovimentacao,
        updateEncomendaStatus,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData precisa estar dentro de um AppDataProvider");
  return ctx;
}
