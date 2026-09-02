import type { ReactNode } from "react";
import { TopNav } from "./TopNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#F3F5FA", fontFamily: "Inter, system-ui, sans-serif" }}>
      <TopNav />
      <div>{children}</div>
    </div>
  );
}
