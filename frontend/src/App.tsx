import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { RequireParceiro } from "@/components/layout/RequireParceiro";
import { AuthProvider } from "@/context/AuthContext";
import { Cadastro } from "@/pages/Cadastro";
import { CadastroPonto } from "@/pages/cadastro-ponto";
import { Encomendas } from "@/pages/Encomendas";
import { Login } from "@/pages/Login";
import { Mapa } from "@/pages/Mapa";
import { Rastreio } from "@/pages/Rastreio";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          <Route
            path="/mapa"
            element={
              <RequireAuth>
                <AppShell>
                  <Mapa />
                </AppShell>
              </RequireAuth>
            }
          />
          <Route
            path="/encomendas"
            element={
              <RequireAuth>
                <AppShell>
                  <Encomendas />
                </AppShell>
              </RequireAuth>
            }
          />
          <Route
            path="/rastreio"
            element={
              <RequireAuth>
                <AppShell>
                  <Rastreio />
                </AppShell>
              </RequireAuth>
            }
          />
          <Route
            path="/parceiro/novo-ponto"
            element={
              <RequireAuth>
                <RequireParceiro>
                  <AppShell>
                    <CadastroPonto />
                  </AppShell>
                </RequireParceiro>
              </RequireAuth>
            }
          />

          <Route path="/" element={<Navigate to="/mapa" replace />} />
          <Route path="*" element={<Navigate to="/mapa" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
