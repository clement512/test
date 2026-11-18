import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useCue, useGlobalCue, useSegEnd } from "../frame";
import { AU, camAt, GeoMap, pick, US, WORLD, type CamKey } from "../geo/GeoMap";
import { ANTON, BARLOW, C, clamp, easeOut, prog, windowed } from "../theme";
import { Appear, Chip, DrawPath, Hero, Label, Layer, Panel, Profile, Question, Sfx, Stage, Stamp, Title } from "../ui";

/* ------------------------------------------------------------------ */
/* Fond de carte continu                                               */
/* ------------------------------------------------------------------ */
const TAS = pick(AU, "Tasmania");
const VIC = pick(AU, "Victoria");
const SA = pick(AU, "South Australia");
const MASS = pick(US, "Massachusetts");

export const Backdrop08: React.FC = () => {
  const f = useCurrentFrame();
  const g = useGlobalCue();
  const keys: CamKey[] = [
    { at: 0, lon: 134, lat: -26, zoom: 4.2 },
    { at: g("hook", "origine"), lon: 138, lat: -30, zoom: 5, len: 90 },
    { at: g("colonies", "remonter"), lon: 141, lat: -37.5, zoom: 13, len: 60 },
    { at: g("tasmanie"), lon: 146.6, lat: -42.1, zoom: 46, len: 40 },
    { at: g("victoria"), lon: 144.6, lat: -37.2, zoom: 34, len: 40 },
    { at: g("sa"), lon: 135.8, lat: -32.2, zoom: 13.5, len: 40 },
    { at: g("usa") - 4, lon: 288.2, lat: 42.2, zoom: 46, len: 80 },
    { at: g("myth"), lon: 288.2, lat: 42.2, zoom: 30, len: 120 },
  ];
  const cam = camAt(keys, f);
  const sb = g("sa", "bulletin");
  const dimKeys: [number, number][] = [
    [0, 0.55],
    [g("colonies") - 8, 0.55],
    [g("colonies") + 10, 0],
    [sb - 6, 0],
    [sb + 8, 0.85],
    [g("usa") - 8, 0.85],
    [g("usa") + 8, 0],
    [g("myth") - 10, 0],
    [g("myth") + 10, 0.82],
  ];
  const dim = interpolate(f, dimKeys.map((d) => d[0]), dimKeys.map((d) => d[1]), clamp);
  const colAt = g("colonies", "colonies");
  return (
    <GeoMap
      cam={cam}
      base={WORLD.features}
      borders={[...AU.features, ...US.features]}
      highlights={[
        { features: [...TAS, ...VIC, ...SA], at: colAt, until: g("tasmanie") + 6, tone: "outline" },
        { features: TAS, at: g("tasmanie", "tasmanie"), tone: "gold", until: g("victoria") + 10 },
        { features: TAS, at: g("victoria"), tone: "soft" },
        { features: VIC, at: g("victoria", "victoria"), tone: "gold", until: g("sa") + 10 },
        { features: VIC, at: g("sa"), tone: "soft" },
        { features: SA, at: g("sa", "l'australie-méridionale,"), tone: "gold" },
        { features: MASS, at: g("usa", "massachusetts"), tone: "gold" },
      ]}
      labels={[
        { lon: 134, lat: -25, text: "AUSTRALIE", at: g("colonies") - 4, until: g("colonies", "remonter") + 34, kind: "big" },
        { lon: 146.6, lat: -42.2, text: "TASMANIE", at: colAt + 6, until: g("tasmanie") - 2, kind: "tag" },
        { lon: 144.3, lat: -36.9, text: "VICTORIA", at: colAt + 12, until: g("tasmanie") - 2, kind: "tag" },
        { lon: 135.2, lat: -33.2, text: "AUSTRALIE-MÉRIDIONALE", at: colAt + 18, until: g("tasmanie") - 2, kind: "tag" },
        { lon: 146.6, lat: -42.1, text: "TASMANIE", at: g("tasmanie", "tasmanie") + 8, until: g("victoria") - 2, kind: "big" },
        { lon: 144.96, lat: -37.81, text: "MELBOURNE", at: g("victoria", "melbourne."), until: g("sa") - 2, kind: "pin" },
        { lon: 144.0, lat: -36.0, text: "VICTORIA", at: g("victoria", "victoria") + 8, until: g("sa") - 2, kind: "big" },
        { lon: 138.6, lat: -34.93, text: "ADÉLAÏDE", at: g("sa", "l'australie-méridionale,") + 10, until: sb, kind: "pin" },
        { lon: -71.8, lat: 42.3, text: "MASSACHUSETTS", at: g("usa", "massachusetts") + 8, until: g("myth") - 2, kind: "big", dy: -70 },
      ]}
      dim={dim}
    />
  );
};

/* ------------------------------------------------------------------ */
/* Dessins                                                             */
/* ------------------------------------------------------------------ */
const Booth: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const close = interpolate(f, [at + 20, at + 40], [0, 1], { ...clamp, easing: easeOut });
  return (
    <svg viewBox="0 0 300 340" width={420} height={476}>
      <DrawPath d="M30 330 L30 30 L270 30 L270 330" at={at} len={24} stroke={C.gold} strokeWidth={8} strokeLinejoin="round" />
      <DrawPath d="M20 30 L280 30" at={at + 6} len={14} stroke={C.goldHi} strokeWidth={10} strokeLinecap="round" />
      {/* rideau */}
      <g opacity={prog(f, at + 14, 12)}>
        {Array.from({ length: 7 }).map((_, i) => {
          const x = 40 + i * 34 * (0.25 + 0.75 * close);
          return <path key={i} d={`M${x} 34 Q${x + 12} 180 ${x} 320`} fill="none" stroke={C.gold} strokeWidth={6} opacity={0.85} />;
        })}
      </g>
    </svg>
  );
};

const Ballot: React.FC<{ at: number; crossAt: number }> = ({ at, crossAt }) => {
  const f = useCurrentFrame();
  const names = ["CANDIDAT A", "CANDIDAT B", "CANDIDAT C"];
  return (
    <Appear at={at} scale={0.92}>
      <div style={{ width: 760, background: `linear-gradient(170deg, ${C.paper}, #d8c69c)`, borderRadius: 10, padding: "26px 40px", color: C.ink, boxShadow: "0 40px 90px rgba(0,0,0,0.6)" }}>
        <div style={{ fontFamily: BARLOW, fontWeight: 800, fontSize: 36, letterSpacing: 4, textAlign: "center", borderBottom: `3px solid ${C.ink}`, paddingBottom: 10 }}>
          BULLETIN OFFICIEL
        </div>
        <div style={{ fontFamily: BARLOW, fontWeight: 700, fontSize: 26, letterSpacing: 3, textAlign: "center", color: "#6b5a3f", marginTop: 6 }}>
          IMPRIMÉ PAR L'ÉTAT
        </div>
        {names.map((n, i) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 22, opacity: prog(f, at + 6 + i * 4, 10) }}>
            <svg width={66} height={66} viewBox="0 0 66 66">
              <rect x={4} y={4} width={58} height={58} rx={6} fill="none" stroke={C.ink} strokeWidth={4} />
              {i === 1 ? <DrawPath d="M14 14 L52 52 M52 14 L14 52" at={crossAt} len={10} stroke="#7a1f12" strokeWidth={8} strokeLinecap="round" /> : null}
            </svg>
            <div style={{ fontFamily: ANTON, fontSize: 52 }}>{n}</div>
          </div>
        ))}
      </div>
    </Appear>
  );
};

const FlowRow: React.FC<{ items: string[]; at: number[] }> = ({ items, at }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {items.map((it, i) => {
        const p = prog(f, at[i], 12);
        const last = i === items.length - 1;
        return (
          <React.Fragment key={it}>
            {i > 0 ? <div style={{ fontFamily: ANTON, fontSize: 50, color: C.gold, opacity: p }}>→</div> : null}
            <div
              style={{
                opacity: p,
                transform: `scale(${0.85 + 0.15 * p})`,
                fontFamily: BARLOW,
                fontWeight: 800,
                fontSize: 34,
                letterSpacing: 2,
                padding: "14px 20px",
                borderRadius: 16,
                textAlign: "center",
                color: last ? C.bg : C.cream,
                background: last ? C.gold : C.panel,
                border: `3px solid ${last ? C.goldHi : C.line}`,
              }}
            >
              {it}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Scènes                                                              */
/* ------------------------------------------------------------------ */
const Top: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", top: 370, left: 70, right: 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>{children}</div>
);
const Bottom: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", top: 1165, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>{children}</div>
);

const Hook: React.FC = () => {
  const cue = useCue();
  return (
    <Stage gap={40}>
      <Booth at={2} />
      <Chip at={cue("récente,")} text="Une évidence… *récente*" size={42} />
      <Stamp at={cue("disputée")} text="ORIGINE DISPUTÉE" size={76} />
      <Sfx at={cue("disputée")} name="stamp" volume={0.45} />
    </Stage>
  );
};

const Colonies: React.FC = () => {
  const cue = useCue();
  return (
    <AbsoluteFill>
      <Top>
        <Hero at={cue("1856,")} text="1856" size={170} />
        <Chip at={cue("colonies")} text="Colonies *britanniques* du sud" size={40} />
      </Top>
      <Sfx at={cue("1856,")} name="impact" volume={0.35} />
    </AbsoluteFill>
  );
};

const Tasmanie: React.FC = () => {
  const cue = useCue();
  return (
    <AbsoluteFill>
      <Top>
        <Hero at={2} text="7 FÉVRIER 1856" size={130} sub="loi de *vote secret*" />
      </Top>
      <Bottom>
        <Chip at={cue("recherches")} text="Selon des recherches récentes" tone="ghost" size={38} />
        <Stamp at={cue("première")} text="LA PREMIÈRE" size={70} color={C.goldHi} rotate={-5} />
      </Bottom>
      <Sfx at={2} name="impact" volume={0.35} />
      <Sfx at={cue("première")} name="stamp" volume={0.45} />
    </AbsoluteFill>
  );
};

const Victoria: React.FC = () => {
  const cue = useCue();
  return (
    <AbsoluteFill>
      <Top>
        <Hero at={2} text="19 MARS 1856" size={130} sub="la Victoria promulgue *la sienne*" />
      </Top>
      <Bottom>
        <Chip at={cue("longtemps,")} text="Longtemps présentée comme *pionnière*" size={36} />
        <Profile at={cue("william") - 4} name="WILLIAM NICHOLSON" role="ANCIEN MAIRE DE MELBOURNE" compact width={880} />
      </Bottom>
      <Sfx at={2} name="impact" volume={0.35} />
      <Sfx at={cue("william")} name="pop" volume={0.3} />
    </AbsoluteFill>
  );
};

const SaScene: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const bAt = cue("bulletin");
  return (
    <AbsoluteFill>
      <Layer opacity={windowed(f, 0, bAt)}>
        <Top>
          <Hero at={2} text="2 AVRIL 1856" size={130} sub="Australie-Méridionale" />
        </Top>
        <Bottom>
          <Chip at={cue("change")} text="Elle *change le modèle*" size={42} />
        </Bottom>
      </Layer>
      <Layer opacity={windowed(f, bAt)}>
        <Stage gap={40}>
          <Ballot at={bAt} crossAt={cue("croix")} />
          <FlowRow items={["BULLETIN OFFICIEL", "ISOLOIR", "URNE"]} at={[cue("l'état,"), cue("l'électeur"), cue("choisi.")]} />
        </Stage>
      </Layer>
      <Sfx at={2} name="impact" volume={0.35} />
      <Sfx at={cue("croix")} name="tick" volume={0.45} />
    </AbsoluteFill>
  );
};

const Usa: React.FC = () => {
  const cue = useCue();
  return (
    <AbsoluteFill>
      <Top>
        <Hero at={cue("massachusetts")} text="1888" size={180} />
      </Top>
      <Bottom>
        <Label size={36}>Aux États-Unis, on l'appelle</Label>
        <Appear at={cue("d'australian") - 2} scale={0.85}>
          <div style={{ fontFamily: ANTON, fontSize: 96, color: C.goldHi, textShadow: "0 0 30px rgba(246,214,143,0.5)" }}>« AUSTRALIAN BALLOT »</div>
        </Appear>
      </Bottom>
      <Sfx at={cue("massachusetts")} name="impact" volume={0.35} />
    </AbsoluteFill>
  );
};

const Myth: React.FC = () => {
  const cue = useCue();
  return (
    <Stage gap={50}>
      <Panel at={2} width={900} pad={44}>
        <Label color={C.muted}>Ce qu'on raconte</Label>
        <div style={{ fontFamily: ANTON, fontSize: 86, color: C.cream, lineHeight: 1.06, marginTop: 10 }}>
          MODÈLE AUSTRALIEN <span style={{ color: C.gold }}>=</span> VOTE SECRET
        </div>
      </Panel>
      <Stamp at={cue("mythe")} text="MYTHE" size={110} />
      <Sfx at={cue("mythe")} name="stamp" volume={0.5} />
    </Stage>
  );
};

const Fact: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const dAt = cue("distincte.");
  return (
    <Stage gap={40}>
      <Chip at={cue("2006")} text="Article universitaire · 2006" size={42} />
      <Title at={cue("confusion")} text="Une *confusion*" size={110} />
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <Panel at={cue("bulletin") - 4} width={380} pad={30}>
          <div style={{ fontFamily: ANTON, fontSize: 60, color: C.cream, textAlign: "center", lineHeight: 1.05 }}>VOTE SECRET</div>
        </Panel>
        <div style={{ fontFamily: ANTON, fontSize: 120, color: C.red, opacity: prog(f, dAt, 10), transform: `scale(${1.6 - 0.6 * prog(f, dAt, 10)})` }}>≠</div>
        <Panel at={cue("officiel") - 2} width={380} pad={30} style={{ borderColor: C.gold }}>
          <div style={{ fontFamily: ANTON, fontSize: 60, color: C.goldHi, textAlign: "center", lineHeight: 1.05 }}>BULLETIN OFFICIEL</div>
        </Panel>
      </div>
      <Chip at={dAt} text="Deux innovations *distinctes*" tone="ghost" size={38} />
      <Sfx at={dAt} name="softHit" volume={0.4} />
    </Stage>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const qAt = useSegEnd() + 12;
  const words = [
    { t: "DÉFENDU", w: "défendu," },
    { t: "ARRACHÉ", w: "arraché," },
    { t: "COPIÉ", w: "copié." },
  ];
  return (
    <Stage>
      <Layer opacity={windowed(f, 0, qAt)} gap={36}>
        <Title at={2} text={"Pas une seule\n*date de naissance*"} size={96} />
        {words.map((w, i) => (
          <Stamp key={w.t} at={cue(w.w)} text={w.t} size={84} color={i === 2 ? C.goldHi : C.cream} rotate={[-6, 4, -3][i]} />
        ))}
      </Layer>
      <Layer opacity={windowed(f, qAt)}>
        <Question at={qAt} text={"Le secret du vote\ndoit-il rester\n*absolu* ?"} />
      </Layer>
      {words.map((w) => (
        <Sfx key={w.t} at={cue(w.w)} name="stamp" volume={0.4} />
      ))}
      <Sfx at={qAt} name="pop" volume={0.35} />
    </Stage>
  );
};

export const EP08_SCENES = {
  hook: Hook,
  colonies: Colonies,
  tasmanie: Tasmanie,
  victoria: Victoria,
  sa: SaScene,
  usa: Usa,
  myth: Myth,
  fact: Fact,
  end: End,
};
