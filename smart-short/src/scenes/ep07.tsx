import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useCue, useGlobalCue, useSegEnd } from "../frame";
import { camAt, FR, FR_RIVERS, GeoMap, pickCode, WORLD, type CamKey } from "../geo/GeoMap";
import { ANTON, BARLOW, C, clamp, easeInOut, easeOut, prog, SERIF, windowed } from "../theme";
import { Appear, Chip, DrawPath, Flow, Hero, Label, Layer, Panel, Profile, Question, Sfx, Stage, Stamp, Title } from "../ui";

/* ------------------------------------------------------------------ */
/* Fond de carte continu                                               */
/* ------------------------------------------------------------------ */
const SEINE_DEPT = pickCode(FR, "75", "92", "93", "94");
const PARIS = pickCode(FR, "75");
const NEIGHBOURS = WORLD.features.filter((f) => ["BEL", "LUX", "DEU", "CHE", "ITA", "ESP", "AND", "GBR", "NLD", "MCO"].includes(f.properties.iso ?? ""));

export const Backdrop07: React.FC = () => {
  const f = useCurrentFrame();
  const g = useGlobalCue();
  const keys: CamKey[] = [
    { at: 0, lon: 2.4, lat: 46.6, zoom: 22 },
    { at: g("hook", "personne"), lon: 2.4, lat: 47.2, zoom: 26, len: 80 },
    { at: g("paris", "paris,"), lon: 2.36, lat: 48.85, zoom: 330, len: 60 },
    { at: g("paris", "ordures"), lon: 2.34, lat: 48.86, zoom: 380, len: 120 },
    { at: g("arrete"), lon: 2.35, lat: 48.85, zoom: 300, len: 200 },
    { at: g("today"), lon: 2.35, lat: 48.85, zoom: 120, len: 200 },
  ];
  const cam = camAt(keys, f);
  const dimKeys: [number, number][] = [
    [0, 0.6],
    [g("paris") - 10, 0.6],
    [g("paris") + 8, 0],
    [g("arrete") - 10, 0],
    [g("arrete") + 10, 0.8],
  ];
  const dim = interpolate(f, dimKeys.map((d) => d[0]), dimKeys.map((d) => d[1]), clamp);
  return (
    <GeoMap
      cam={cam}
      base={[...NEIGHBOURS, ...FR.features]}
      highlights={[
        { features: SEINE_DEPT, at: g("paris", "paris,") + 30, tone: "soft" },
        { features: PARIS, at: g("paris", "paris,") + 40 },
      ]}
      rivers={[{ features: FR_RIVERS.features, at: g("paris", "paris,") + 30, len: 50 }]}
      labels={[
        { lon: 2.35, lat: 48.857, text: "PARIS", at: g("paris", "paris,") + 44, until: g("arrete") + 6, kind: "big" },
        { lon: 2.35, lat: 48.74, text: "DÉPARTEMENT DE LA SEINE", at: g("paris", "fin"), until: g("paris", "ordures") - 4, kind: "tag", dy: 60 },
        { lon: 2.12, lat: 48.92, text: "LA SEINE", at: g("paris", "siècle."), until: g("arrete") + 6, kind: "soft" },
        { lon: 2.4, lat: 47.2, text: "FRANCE", at: 6, until: g("hook", "millions"), kind: "big" },
      ]}
      dim={dim}
    />
  );
};

/* ------------------------------------------------------------------ */
/* Dessins                                                             */
/* ------------------------------------------------------------------ */
const Bin: React.FC<{ at: number; lid?: number; width?: number }> = ({ at, lid = 0, width = 380 }) => {
  const f = useCurrentFrame();
  const open = interpolate(f, [lid, lid + 12, lid + 30, lid + 42], [0, 1, 1, 0], { ...clamp, easing: easeInOut });
  return (
    <svg viewBox="0 0 200 240" width={width} height={(width * 240) / 200} style={{ overflow: "visible" }}>
      <g transform={`rotate(${-28 * open} 30 52)`}>
        <DrawPath d="M22 52 L178 52 L172 36 L28 36 Z" at={at + 10} len={16} stroke={C.goldHi} strokeWidth={6} strokeLinejoin="round" />
        <DrawPath d="M80 36 L84 22 L116 22 L120 36" at={at + 14} len={12} stroke={C.goldHi} strokeWidth={6} strokeLinejoin="round" />
      </g>
      <DrawPath d="M34 62 L166 62 L152 226 L48 226 Z" at={at} len={22} stroke={C.gold} strokeWidth={7} strokeLinejoin="round" />
      {[72, 100, 128].map((x, i) => (
        <DrawPath key={i} d={`M${x} 82 L${x - 4 + i * 4} 206`} at={at + 8 + i * 3} len={14} stroke={C.gold} strokeWidth={6} strokeLinecap="round" />
      ))}
    </svg>
  );
};

/** Récipient de 1883 : caisse en bois doublée de fer-blanc, avec couvercle. */
const Crate: React.FC<{ at: number; closedAt: number; woodAt: number; tinAt: number }> = ({ at, closedAt, woodAt, tinAt }) => {
  const f = useCurrentFrame();
  const lid = interpolate(f, [closedAt - 4, closedAt + 10], [-34, 0], { ...clamp, easing: easeOut });
  const tin = prog(f, tinAt, 14);
  const wood = prog(f, woodAt, 14);
  const label = (txt: string, x: number, y: number, a: number, anchor: "start" | "end") => (
    <g opacity={prog(f, a, 10)}>
      <text x={x} y={y} textAnchor={anchor} fontFamily={ANTON} fontSize={30} fill={C.goldHi} letterSpacing={2}>
        {txt}
      </text>
    </g>
  );
  return (
    <svg viewBox="-150 -60 540 380" width={860} height={(860 * 380) / 540} style={{ overflow: "visible" }}>
      <g opacity={prog(f, at, 14)}>
        {/* caisse */}
        <rect x={20} y={70} width={220} height={210} rx={6} fill={`rgba(140,98,40,${0.25 + 0.5 * wood})`} stroke={C.gold} strokeWidth={6} />
        {[110, 150, 190, 230].map((y) => (
          <line key={y} x1={20} y1={y} x2={240} y2={y} stroke="rgba(10,9,7,0.55)" strokeWidth={4} />
        ))}
        {/* doublure de fer-blanc */}
        <rect x={34} y={84} width={192} height={182} rx={4} fill="none" stroke="#dfe3e6" strokeWidth={5} strokeDasharray={`${tin * 800} 800`} opacity={0.9} />
        {/* couvercle */}
        <g transform={`rotate(${lid} 20 70)`}>
          <rect x={10} y={50} width={240} height={22} rx={6} fill={C.goldDeep} stroke={C.goldHi} strokeWidth={5} />
          <rect x={110} y={38} width={40} height={14} rx={4} fill={C.goldHi} />
        </g>
      </g>
      {label("FERMÉ", -20, 50, closedAt, "end")}
      {label("BOIS", -20, 200, woodAt, "end")}
      {label("FER-BLANC", 270, 180, tinAt, "start")}
      <line x1={-12} y1={190} x2={18} y2={190} stroke={C.gold} strokeWidth={3} opacity={prog(f, woodAt, 10)} />
      <line x1={232} y1={170} x2={262} y2={170} stroke={C.gold} strokeWidth={3} opacity={prog(f, tinAt, 10)} />
    </svg>
  );
};

/** Coupure de presse générique (sans titre inventé : des lignes de texte figurées). */
const Paper: React.FC<{ at: number; masthead: string; rotate?: number; width?: number; children?: React.ReactNode }> = ({
  at,
  masthead,
  rotate = 0,
  width = 820,
  children,
}) => (
  <Appear at={at} scale={0.92}>
    <div
      style={{
        width,
        background: `linear-gradient(170deg, ${C.paper}, #d4c194)`,
        borderRadius: 8,
        padding: "26px 36px 30px",
        transform: `rotate(${rotate}deg)`,
        color: C.ink,
        boxShadow: "0 40px 90px rgba(0,0,0,0.65)",
      }}
    >
      <div style={{ borderTop: `3px solid ${C.ink}`, borderBottom: `3px solid ${C.ink}`, padding: "8px 0 4px", textAlign: "center" }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, lineHeight: 1 }}>{masthead}</div>
      </div>
      {children}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, marginTop: 18 }}>
        {Array.from({ length: 3 }).map((_, c) => (
          <div key={c}>
            {Array.from({ length: 6 }).map((__, l) => (
              <div key={l} style={{ height: 9, margin: "9px 0", background: "rgba(43,34,23,0.35)", width: `${70 + ((c * 7 + l * 13) % 30)}%` }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  </Appear>
);

/* ------------------------------------------------------------------ */
/* Scènes                                                              */
/* ------------------------------------------------------------------ */
const Hook: React.FC = () => {
  const cue = useCue();
  const pAt = cue("poubelle");
  return (
    <Stage gap={34}>
      <Hero at={cue("millions")} text="DES MILLIONS" size={140} sub="de gestes, *chaque jour*" />
      <Bin at={pAt - 6} lid={pAt + 16} />
      <Stamp at={cue("préfet.")} text={"LE NOM\nD'UN PRÉFET"} size={64} color={C.goldHi} rotate={-6} />
      <Sfx at={pAt} name="pop" volume={0.35} />
      <Sfx at={cue("préfet.")} name="stamp" volume={0.45} />
    </Stage>
  );
};

const ParisScene: React.FC = () => {
  const cue = useCue();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 1130, left: 70, right: 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <Chip at={cue("ordures")} text="Ordures jetées dans la rue" tone="red" size={40} />
        <Chip at={cue("mauvais.")} text="La ville sent mauvais" tone="ghost" size={40} />
      </div>
      <Sfx at={cue("paris,") + 30} name="softHit" volume={0.4} />
    </AbsoluteFill>
  );
};

const Arrete: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const rAt = cue("récipient");
  return (
    <Stage>
      <Layer opacity={windowed(f, 0, rAt - 4)} gap={44}>
        <Hero at={2} text={"24 NOVEMBRE\n1883"} size={150} />
        <Profile at={cue("eugène") - 4} name="EUGÈNE POUBELLE" role="PRÉFET DE LA SEINE" note="1883 – 1896" />
        <Chip at={cue("arrêté.")} text="Il signe un *arrêté*" size={42} />
      </Layer>
      <Layer opacity={windowed(f, rAt - 4)} gap={30}>
        <Label size={40}>Chaque propriétaire fournit à ses locataires…</Label>
        <Crate at={rAt - 4} closedAt={cue("fermé,")} woodAt={cue("bois")} tinAt={cue("fer-blanc.")} />
        <Title at={rAt + 4} text="un *récipient fermé*" size={80} />
      </Layer>
      <Sfx at={2} name="impact" volume={0.35} />
      <Sfx at={cue("fermé,")} name="softHit" volume={0.35} />
    </Stage>
  );
};

const Collecte: React.FC = () => {
  const cue = useCue();
  return (
    <Stage gap={40}>
      <Hero at={2} text="7 MARS 1884" size={150} sub="un *second* arrêté" />
      <Flow items={["LE BAC", "LA CHARRETTE À CHEVAL", "*RAMASSAGE QUOTIDIEN*"]} at={[cue("impose"), cue("charrettes"), cue("chevaux.")]} size={58} />
      <Sfx at={2} name="impact" volume={0.35} />
      <Sfx at={cue("charrettes")} name="pop" volume={0.3} />
    </Stage>
  );
};

const Scandale: React.FC = () => {
  const cue = useCue();
  return (
    <Stage gap={0}>
      <div style={{ position: "relative", height: 760, width: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", transform: "translate(-40px, -50px)" }}>
          <Paper at={0} masthead="La Presse" rotate={-6} width={700} />
        </div>
        <div style={{ position: "absolute", transform: "translate(40px, 50px)" }}>
          <Paper at={6} masthead="Le Journal" rotate={4} width={700} />
        </div>
        <div style={{ position: "absolute", bottom: 40 }}>
          <Stamp at={cue("scandale")} text="SCANDALE !" size={110} rotate={-8} />
        </div>
      </div>
      <Sfx at={cue("scandale")} name="stamp" volume={0.5} />
    </Stage>
  );
};

const Figaro: React.FC = () => {
  const cue = useCue();
  const bAt = cue("boîtes");
  return (
    <Stage gap={40}>
      <Chip at={cue("moque")} text="Un journaliste *se moque*" tone="ghost" size={40} />
      <Paper at={0} masthead="Le Figaro" rotate={-2}>
        <div style={{ textAlign: "center", padding: "26px 0 6px" }}>
          <Appear at={bAt} scale={0.8}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontStyle: "italic", fontSize: 78, color: "#7a1f12", whiteSpace: "nowrap" }}>« Boîtes Poubelle »</div>
          </Appear>
        </div>
      </Paper>
      <Stamp at={cue("surnom")} text="LE SURNOM RESTE" size={78} color={C.goldHi} rotate={-5} />
      <Sfx at={bAt} name="softHit" volume={0.4} />
      <Sfx at={cue("surnom")} name="stamp" volume={0.45} />
    </Stage>
  );
};

const Today: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const pAt = cue("préfet");
  const qAt = useSegEnd() + 12;
  return (
    <Stage>
      <Layer opacity={windowed(f, 0, pAt - 4)} gap={34}>
        <Panel at={2} width={900} pad={44}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: C.cream, lineHeight: 1 }}>poubelle</div>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 38, color: C.gold, marginTop: 8 }}>n. f.</div>
          <div style={{ fontFamily: BARLOW, fontWeight: 600, fontSize: 40, color: C.cream, marginTop: 20, lineHeight: 1.25 }}>
            Récipient destiné aux ordures ménagères.
          </div>
          <div style={{ fontFamily: BARLOW, fontWeight: 700, fontSize: 38, color: C.goldHi, marginTop: 18, lineHeight: 1.25, opacity: prog(f, cue("courant"), 14) }}>
            Du nom d'Eugène Poubelle, préfet de la Seine.
          </div>
        </Panel>
        <Chip at={cue("courant")} text="Le mot *le plus courant* en français" size={40} />
      </Layer>
      <Layer opacity={windowed(f, pAt - 4, qAt)} gap={34}>
        <Panel at={pAt - 4} width={900}>
          <Label color={C.muted}>Ce que le préfet voulait</Label>
          <div style={{ fontFamily: ANTON, fontSize: 84, color: C.cream, marginTop: 8 }}>UNE VILLE PROPRE</div>
        </Panel>
        <Panel at={cue("surtout")} width={900} style={{ borderColor: C.gold, boxShadow: "0 0 60px rgba(217,171,79,0.25)" }}>
          <Label>Ce qu'il a laissé</Label>
          <div style={{ fontFamily: ANTON, fontSize: 84, color: C.goldHi, marginTop: 8 }}>SON NOM, SUR UN OBJET DU QUOTIDIEN</div>
        </Panel>
      </Layer>
      <Layer opacity={windowed(f, qAt)}>
        <Question at={qAt} text={"Quel objet de votre\nquotidien porte le nom\nde *quelqu'un* ?"} />
      </Layer>
      <Sfx at={cue("surtout")} name="softHit" volume={0.4} />
      <Sfx at={qAt} name="pop" volume={0.35} />
    </Stage>
  );
};

export const EP07_SCENES = {
  hook: Hook,
  paris: ParisScene,
  arrete: Arrete,
  collecte: Collecte,
  scandale: Scandale,
  figaro: Figaro,
  today: Today,
};
