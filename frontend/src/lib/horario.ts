export const DIAS = [
  { value: "seg", label: "Seg" },
  { value: "ter", label: "Ter" },
  { value: "qua", label: "Qua" },
  { value: "qui", label: "Qui" },
  { value: "sex", label: "Sex" },
  { value: "sab", label: "Sáb" },
  { value: "dom", label: "Dom" },
] as const;

// Backend só tem um campo de texto livre pra horário de funcionamento —
// compõe os dias selecionados + abertura/fechamento numa única string.
export function formatHorarioFuncionamento(
  diasSel: string[],
  abertura: string,
  fechamento: string
): string {
  const diasLabel = DIAS.filter((d) => diasSel.includes(d.value))
    .map((d) => d.label)
    .join(", ");
  return `${diasLabel} · ${abertura} às ${fechamento}`;
}
