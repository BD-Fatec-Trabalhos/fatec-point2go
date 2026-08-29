import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { AppDataProvider } from "@/context/AppDataContext";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { Parceiros } from "@/pages/Parceiros";
import { Pontos } from "@/pages/Pontos";
import { Encomendas } from "@/pages/Encomendas";
import { Movimentacoes } from "@/pages/Movimentacoes";

function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/parceiros" element={<RequireAuth><Parceiros /></RequireAuth>} />
            <Route path="/pontos" element={<RequireAuth><Pontos /></RequireAuth>} />
            <Route path="/encomendas" element={<RequireAuth><Encomendas /></RequireAuth>} />
            <Route path="/movimentacoes" element={<RequireAuth><Movimentacoes /></RequireAuth>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppDataProvider>
    </AuthProvider>
  );
}

export default App;
