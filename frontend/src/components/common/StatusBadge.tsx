import { STATUS_INFO } from "@/lib/status";
import type { StatusEncomenda } from "@/types";

export function StatusBadge({ status }: { status: StatusEncomenda }) {
  const info = STATUS_INFO[status];
  return (
    <span
      style={{
        display: "inline-flex",
        padding: "4px 12px",
        borderRadius: 99,
        fontSize: 12,
        fontWeight: 600,
        background: info.bg,
        color: info.fg,
        whiteSpace: "nowrap",
      }}
    >
      {info.label}
    </span>
  );
}
