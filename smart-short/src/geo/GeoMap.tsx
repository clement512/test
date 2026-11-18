/**
 * Carte plein écran façon « documentaire carto » : vraies frontières (Natural Earth, IGN),
 * régions surlignées en or lumineux, fleuves qui brillent, étiquettes, caméra animée.
 */
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { geoGraticule10, geoMercator, geoPath, type GeoPermissibleObjects } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { ANTON, BARLOW, C, clamp, easeInOut, prog } from "../theme";
import worldData from "./world.json";
import auData from "./au-states.json";
import usData from "./us-states.json";
import frData from "./fr-depts.json";
import riversData from "./fr-rivers.json";

type FC = FeatureCollection<Geometry, { name: string; code?: string; iso?: string }>;
export const WORLD = worldData as unknown as FC;
export const AU = auData as unknown as FC;
export const US = usData as unknown as FC;
export const FR = frData as unknown as FC;
export const FR_RIVERS = riversData as unknown as FC;

export const pick = (fc: FC, ...names: string[]): Feature[] => fc.features.filter((f) => names.includes(f.properties.name));
export const pickCode = (fc: FC, ...codes: string[]): Feature[] => fc.features.filter((f) => codes.includes(f.properties.code ?? ""));

/* ------------------------------------------------------------------ */
/* Caméra                                                              */
/* ------------------------------------------------------------------ */
export type Cam = { lon: number; lat: number; zoom: number };
export type CamKey = Cam & { at: number; len?: number };

const W = 1080;
const H = 1920;
/** Centre vertical de la carte à l'écran (un peu au-dessus du milieu, sous l'en-tête). */
export const MAP_CY = 900;

/** Caméra à l'image `f` : chaque clé est atteinte en `len` images (défaut 45) à partir de `at`. */
export const camAt = (keys: CamKey[], f: number): Cam => {
  let cur: Cam = keys[0];
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i];
    const len = k.len ?? 45;
    if (f <= k.at) break;
    const p = interpolate(f, [k.at, k.at + len], [0, 1], { ...clamp, easing: easeInOut });
    // zoom en échelle logarithmique, avec un léger dézoom au milieu des grands déplacements
    const dist = Math.hypot(k.lon - cur.lon, k.lat - cur.lat);
    const lift = Math.min(0.85, dist / 60);
    const z = Math.exp(Math.log(cur.zoom) + (Math.log(k.zoom) - Math.log(cur.zoom)) * p - lift * Math.sin(Math.PI * p) * 1.6);
    cur = { lon: cur.lon + (k.lon - cur.lon) * p, lat: cur.lat + (k.lat - cur.lat) * p, zoom: z };
  }
  return cur;
};

const projectionFor = (cam: Cam) =>
  geoMercator()
    .rotate([-cam.lon, 0])
    .center([0, cam.lat])
    .scale((W / (2 * Math.PI)) * cam.zoom)
    .translate([W / 2, MAP_CY])
    .clipExtent([
      [-80, -80],
      [W + 80, H + 80],
    ]);

export const useProjection = (cam: Cam) => useMemo(() => projectionFor(cam), [cam.lon, cam.lat, cam.zoom]);

/* ------------------------------------------------------------------ */
/* Couches                                                             */
/* ------------------------------------------------------------------ */
export type Highlight = { features: Feature[]; at: number; until?: number; tone?: "gold" | "soft" | "red" | "outline" };
export type River = { features: Feature[]; at: number; len?: number };
export type MapLabel = {
  lon: number;
  lat: number;
  text: string;
  at: number;
  until?: number;
  kind?: "tag" | "big" | "pin" | "soft";
  sub?: string;
  dy?: number;
};

export const GeoMap: React.FC<{
  cam: Cam;
  /** Pays/régions de fond (terres). */
  base?: Feature[];
  /** Frontières internes fines (états, départements). */
  borders?: Feature[];
  highlights?: Highlight[];
  rivers?: River[];
  labels?: MapLabel[];
  /** 0 = carte pleinement visible, 1 = très assombrie (pour poser des cartes par-dessus). */
  dim?: number;
}> = ({ cam, base = WORLD.features, borders = [], highlights = [], rivers = [], labels = [], dim = 0 }) => {
  const f = useCurrentFrame();
  const proj = projectionFor(cam);
  const path = geoPath(proj);
  const grat = path(geoGraticule10() as GeoPermissibleObjects) ?? "";
  const stroke = Math.max(1, Math.min(2.4, cam.zoom / 8));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 90% 60% at 50% 46%, #11100c 0%, #060605 75%)" }} />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="gm-gold" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0" stopColor={C.goldHi} />
            <stop offset="0.5" stopColor={C.gold} />
            <stop offset="1" stopColor={C.goldDeep} />
          </linearGradient>
          <filter id="gm-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="14" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="gm-riverglow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <pattern id="gm-hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="14" stroke="rgba(217,171,79,0.07)" strokeWidth="3" />
          </pattern>
        </defs>
        <path d={grat} fill="none" stroke="rgba(217,171,79,0.07)" strokeWidth={1.2} />
        {base.map((ft, i) => (
          <path key={`b${i}`} d={path(ft) ?? ""} fill="#17140d" stroke="rgba(217,171,79,0.42)" strokeWidth={stroke} strokeLinejoin="round" />
        ))}
        {base.map((ft, i) => (
          <path key={`h${i}`} d={path(ft) ?? ""} fill="url(#gm-hatch)" stroke="none" />
        ))}
        {borders.map((ft, i) => (
          <path key={`s${i}`} d={path(ft) ?? ""} fill="none" stroke="rgba(217,171,79,0.25)" strokeWidth={Math.max(0.8, stroke * 0.7)} strokeDasharray="5 6" />
        ))}
        {highlights.map((h, i) => {
          const p = Math.min(prog(f, h.at, 18), h.until ? 1 - prog(f, h.until - 14, 14) : 1);
          if (p <= 0) return null;
          const tone = h.tone ?? "gold";
          const pulse = 0.85 + 0.15 * Math.sin((f - h.at) / 10);
          return (
            <g key={`hl${i}`} opacity={p}>
              {h.features.map((ft, j) => {
                const d = path(ft) ?? "";
                if (tone === "outline")
                  return <path key={j} d={d} fill="rgba(217,171,79,0.10)" stroke={C.goldHi} strokeWidth={3} strokeLinejoin="round" />;
                if (tone === "soft")
                  return <path key={j} d={d} fill="rgba(217,171,79,0.28)" stroke={C.gold} strokeWidth={2.5} strokeLinejoin="round" />;
                if (tone === "red")
                  return <path key={j} d={d} fill="rgba(217,87,63,0.55)" stroke="#f3b4a6" strokeWidth={3} strokeLinejoin="round" filter="url(#gm-glow)" />;
                return (
                  <path
                    key={j}
                    d={d}
                    fill="url(#gm-gold)"
                    fillOpacity={0.88 * pulse}
                    stroke={C.goldHi}
                    strokeWidth={3.5}
                    strokeLinejoin="round"
                    filter="url(#gm-glow)"
                  />
                );
              })}
            </g>
          );
        })}
        {rivers.map((r, i) =>
          r.features.map((ft, j) => {
            const p = prog(f, r.at, r.len ?? 40, easeInOut);
            if (p <= 0) return null;
            return (
              <path
                key={`r${i}-${j}`}
                d={path(ft) ?? ""}
                pathLength={1}
                strokeDasharray={p < 1 ? `${p} 1` : undefined}
                fill="none"
                stroke="#ffe7a8"
                strokeWidth={4}
                strokeLinecap="round"
                filter="url(#gm-riverglow)"
              />
            );
          }),
        )}
      </svg>
      {labels.map((l, i) => {
        const p = Math.min(prog(f, l.at, 12), l.until ? 1 - prog(f, l.until - 10, 10) : 1);
        if (p <= 0) return null;
        const xy = proj([l.lon, l.lat]);
        if (!xy) return null;
        const [x, y] = [xy[0], xy[1] + (l.dy ?? 0)];
        return <LabelView key={`l${i}`} x={x} y={y} p={p} label={l} f={f} />;
      })}
      <AbsoluteFill style={{ background: `rgba(6,6,5,${0.72 * dim})` }} />
      {/* lisibilité de l'en-tête et des sous-titres */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(6,6,5,0.92) 0%, rgba(6,6,5,0.55) 17%, rgba(6,6,5,0) 26%, rgba(6,6,5,0) 66%, rgba(6,6,5,0.75) 80%, rgba(6,6,5,0.9) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

const LabelView: React.FC<{ x: number; y: number; p: number; label: MapLabel; f: number }> = ({ x, y, p, label, f }) => {
  const kind = label.kind ?? "tag";
  if (kind === "big")
    return (
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * p})`,
          opacity: p,
          fontFamily: ANTON,
          fontSize: 92,
          letterSpacing: 4,
          color: C.cream,
          whiteSpace: "nowrap",
          textShadow: `0 0 24px rgba(246,214,143,0.75), 0 0 4px rgba(0,0,0,0.9), 0 6px 18px rgba(0,0,0,0.8)`,
        }}
      >
        {label.text}
        {label.sub ? (
          <div style={{ fontFamily: BARLOW, fontWeight: 800, fontSize: 34, letterSpacing: 5, color: C.goldHi, textAlign: "center" }}>
            {label.sub}
          </div>
        ) : null}
      </div>
    );
  if (kind === "soft")
    return (
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: "translate(-50%, -50%)",
          opacity: p * 0.8,
          fontFamily: BARLOW,
          fontWeight: 800,
          fontSize: 34,
          letterSpacing: 6,
          color: C.muted,
          whiteSpace: "nowrap",
          textShadow: "0 2px 8px rgba(0,0,0,0.9)",
        }}
      >
        {label.text}
      </div>
    );
  if (kind === "pin") {
    const ring = ((f - 0) % 40) / 40;
    return (
      <>
        <svg style={{ position: "absolute", left: x - 60, top: y - 60, opacity: p }} width={120} height={120}>
          <circle cx={60} cy={60} r={12 + 40 * ring} fill="none" stroke={C.goldHi} strokeWidth={3} opacity={1 - ring} />
          <circle cx={60} cy={60} r={11} fill={C.goldHi} />
          <circle cx={60} cy={60} r={20} fill="none" stroke={C.gold} strokeWidth={3} />
        </svg>
        <Tag x={x} y={y - 34} p={p} text={label.text} sub={label.sub} />
      </>
    );
  }
  return <Tag x={x} y={y} p={p} text={label.text} sub={label.sub} />;
};

/** Étiquette claire avec pointe, posée au-dessus d'un point. */
export const Tag: React.FC<{ x: number; y: number; p: number; text: string; sub?: string }> = ({ x, y, p, text, sub }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(-50%, -100%) translateY(${(1 - p) * 16}px)`,
      opacity: p,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <div
      style={{
        background: C.cream,
        color: C.bg,
        fontFamily: BARLOW,
        fontWeight: 800,
        fontSize: 40,
        letterSpacing: 2,
        padding: "6px 20px 4px",
        borderRadius: 8,
        whiteSpace: "nowrap",
        boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
        borderBottom: `5px solid ${C.gold}`,
        textAlign: "center",
      }}
    >
      {text}
      {sub ? <div style={{ fontSize: 26, color: C.goldDeep, letterSpacing: 3 }}>{sub}</div> : null}
    </div>
    <div style={{ width: 0, height: 0, borderLeft: "12px solid transparent", borderRight: "12px solid transparent", borderTop: `14px solid ${C.gold}` }} />
  </div>
);
