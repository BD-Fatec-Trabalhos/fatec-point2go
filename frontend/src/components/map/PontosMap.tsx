import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type { PontoRetirada } from "@/types";

type Props = {
  pontos: PontoRetirada[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

const CENTRO_PADRAO: [number, number] = [-22.3145, -49.0605];

export function PontosMap({ pontos, selectedId, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // Monta o mapa uma única vez; limpa no unmount (essencial com StrictMode).
  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current, { zoomControl: true }).setView(CENTRO_PADRAO, 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  // Redesenha os marcadores quando a lista de pontos ou a seleção mudam.
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();

    pontos.forEach((p) => {
      const lat = Number(p.endereco.latitude);
      const lng = Number(p.endereco.longitude);
      if (Number.isNaN(lat) || Number.isNaN(lng)) return;

      const isSel = p.id === selectedId;
      const lotado = p.capacidade_ocupada >= p.capacidade_total;
      const color = lotado ? "#DC2626" : isSel ? "#1D4ED8" : "#38BDF8";
      const size = isSel ? 22 : 16;

      const icon = L.divIcon({
        className: "",
        html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2.5px solid #fff;box-shadow:0 1px 6px rgba(11,18,51,0.45)"></div>`,
        iconSize: [size, size],
      });

      L.marker([lat, lng], { icon })
        .addTo(layer)
        .on("click", () => onSelectRef.current(p.id));
    });
  }, [pontos, selectedId]);

  // Centraliza no ponto selecionado.
  useEffect(() => {
    if (selectedId == null || !mapRef.current) return;
    const p = pontos.find((x) => x.id === selectedId);
    const lat = p && Number(p.endereco.latitude);
    const lng = p && Number(p.endereco.longitude);
    if (p && lat != null && lng != null && !Number.isNaN(lat) && !Number.isNaN(lng)) {
      mapRef.current.flyTo([lat, lng], 15, { duration: 0.6 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  return (
    <div ref={containerRef} style={{ position: "absolute", inset: 0, background: "#DCE6F5", zIndex: 1 }} />
  );
}
