import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { useCue } from "../frame";
import { ANTON, BARLOW, C, clamp, easeOut, prog, windowed } from "../theme";
import {
  Appear, Chip, Compare, DrawPath, Hero, Label, Layer, MapFrame, MapPin, Panel, Question, Sfx, Stage, Stamp, Title,
} from "../ui";

/* ------------------------------------------------------------------ */
/* Icônes                                                              */
/* ------------------------------------------------------------------ */
const School: React.FC = () => (
  <svg viewBox="0 0 120 120" width={150} height={150}>
    <path d="M14 56 L60 22 L106 56" fill="none" stroke={C.gold} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
    <rect x={24} y={56} width={72} height={48} fill="none" stroke={C.gold} strokeWidth={6} />
    <rect x={50} y={76} width={20} height={28} fill={C.gold} />
    <circle cx={60} cy={46} r={7} fill={C.gold} />
  </svg>
);
const Plane: React.FC = () => (
  <svg viewBox="0 0 120 120" width={150} height={150}>
    <path
      d="M60 10 C66 10 68 18 68 26 L68 48 L108 70 L108 80 L68 68 L68 92 L82 102 L82 110 L60 104 L38 110 L38 102 L52 92 L52 68 L12 80 L12 70 L52 48 L52 26 C52 18 54 10 60 10 Z"
      fill="none"
      stroke={C.gold}
      strokeWidth={5}
      strokeLinejoin="round"
    />
  </svg>
);
const Fish: React.FC = () => (
  <svg viewBox="0 0 120 120" width={150} height={150}>
    <path d="M14 60 C34 30 74 28 94 60 C74 92 34 90 14 60 Z" fill="none" stroke={C.gold} strokeWidth={6} strokeLinejoin="round" />
    <path d="M94 60 L114 40 L114 80 Z" fill="none" stroke={C.gold} strokeWidth={6} strokeLinejoin="round" />
    <circle cx={36} cy={54} r={6} fill={C.gold} />
  </svg>
);

const ICELAND =
  "M180 330 C150 300 170 250 220 250 C230 210 280 200 300 230 C330 180 380 190 400 220 C440 170 500 190 520 160 C560 150 600 190 640 170 C700 150 760 180 800 210 C850 230 870 280 840 320 C870 350 860 400 820 420 C800 470 740 480 700 500 C640 530 560 520 500 540 C440 555 380 530 330 520 C290 510 250 490 240 450 C200 440 190 410 230 390 C190 380 170 360 180 330 Z";

/* ------------------------------------------------------------------ */
/* Scènes                                                              */
/* ------------------------------------------------------------------ */
const Hook: React.FC = () => {
  const cue = useCue();
  const tiles: { icon: React.ReactNode; label: string; stamp: string; at: number }[] = [
    { icon: <School />, label: "ÉCOLES", stamp: "FERMÉES", at: cue("ferment") },
    { icon: <Plane />, label: "VOLS", stamp: "ANNULÉS", at: cue("annulés") },
    { icon: <Fish />, label: "USINES DE POISSON", stamp: "À L'ARRÊT", at: cue("s'arrêtent") },
  ];
  return (
    <Stage gap={30}>
      <Hero at={2} text="OCTOBRE 1975" size={120} sub="un vendredi, en *Islande*" />
      {tiles.map((t, i) => (
        <Panel key={i} at={cue(i === 0 ? "écoles" : i === 1 ? "vols" : "usines") - 4} width={900} pad={22}>
          <div style={{ display: "flex", alignItems: "center", gap: 30, height: 150 }}>
            {t.icon}
            <div style={{ fontFamily: ANTON, fontSize: 58, color: C.cream, flex: 1 }}>{t.label}</div>
            <Stamp at={t.at} text={t.stamp} size={46} rotate={-6} />
          </div>
        </Panel>
      ))}
      {tiles.map((t, i) => (
        <Sfx key={i} at={t.at} name="stamp" volume={0.4} />
      ))}
    </Stage>
  );
};

const Hemicycle: React.FC<{ at: number; women: number; total: number }> = ({ at, women, total }) => {
  const f = useCurrentFrame();
  const rows = [12, 15, 16, 17];
  const seats: { x: number; y: number }[] = [];
  rows.forEach((n, r) => {
    const rad = 150 + r * 62;
    for (let i = 0; i < n; i++) {
      const a = Math.PI - (Math.PI * i) / (n - 1);
      seats.push({ x: 400 + rad * Math.cos(a), y: 380 - rad * Math.sin(a) });
    }
  });
  seats.sort((a, b) => Math.atan2(380 - b.y, b.x - 400) - Math.atan2(380 - a.y, a.x - 400));
  return (
    <svg viewBox="0 0 800 400" width={760} height={380}>
      {seats.slice(0, total).map((s, i) => {
        const p = prog(f, at + i * 0.5, 8);
        const w = i < women;
        return <circle key={i} cx={s.x} cy={s.y} r={21 * p} fill={w ? C.goldHi : "rgba(242,232,213,0.22)"} />;
      })}
    </svg>
  );
};

const Context: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const sAt = cue("60");
  const pAt = cue("parlementaires");
  const bar = prog(f, sAt, 24);
  return (
    <Stage gap={34}>
      <Chip at={cue("l'ONU") - 4} text="ONU · 1975 · Année internationale de la femme" size={34} />
      <Panel at={cue("gagnent") - 6} width={900}>
        <Label>Salaire, pour le même travail</Label>
        {[
          { who: "HOMMES", v: 1, txt: "100 %", col: "rgba(242,232,213,0.35)" },
          { who: "FEMMES", v: 0.58, txt: "< 60 %", col: C.gold },
        ].map((b, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 22 }}>
            <div style={{ width: 170, fontFamily: BARLOW, fontWeight: 800, fontSize: 38, color: C.cream, letterSpacing: 2 }}>{b.who}</div>
            <div style={{ flex: 1, height: 58, background: "rgba(255,255,255,0.05)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${b.v * bar * 100}%`, background: b.col, borderRadius: 10 }} />
            </div>
            <div style={{ width: 150, fontFamily: ANTON, fontSize: 52, color: i ? C.goldHi : C.cream, textAlign: "right", opacity: bar }}>
              {b.txt}
            </div>
          </div>
        ))}
      </Panel>
      <Panel at={pAt - 20} width={900} pad={26}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Label>Le Parlement islandais</Label>
          <Hemicycle at={pAt - 16} women={3} total={60} />
          <div style={{ fontFamily: ANTON, fontSize: 64, color: C.goldHi, marginTop: -40 }}>
            5 % <span style={{ color: C.cream, fontSize: 44 }}>DE FEMMES</span>
          </div>
        </div>
      </Panel>
      <Sfx at={sAt} name="softHit" volume={0.4} />
    </Stage>
  );
};

const Plan: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const items = [
    { t: "TRAVAILLER À L'USINE", at: cue("l'usine") },
    { t: "TRAVAILLER AU BUREAU", at: cue("bureau,") },
    { t: "LE MÉNAGE", at: cue("ménage") },
    { t: "LA GARDE D'ENFANTS", at: cue("garde") },
  ];
  return (
    <Stage gap={30}>
      <Title at={2} text={"Une action\n*inédite*"} size={100} />
      <Chip at={cue("bords")} text="Femmes de tous bords politiques" tone="ghost" size={36} />
      <Panel at={cue("ne") - 6} width={900} pad={30}>
        {items.map((it, i) => {
          const p = prog(f, it.at, 10);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, padding: "14px 0", opacity: 0.25 + 0.75 * p }}>
              <svg width={64} height={64} viewBox="0 0 64 64">
                <rect x={4} y={4} width={56} height={56} rx={10} fill="none" stroke={C.gold} strokeWidth={4} />
                <DrawPath d="M16 16 L48 48 M48 16 L16 48" at={it.at} len={8} stroke={C.red} strokeWidth={7} strokeLinecap="round" />
              </svg>
              <div style={{ fontFamily: ANTON, fontSize: 56, color: C.cream, textDecoration: p > 0.9 ? "line-through" : "none", textDecorationColor: C.red }}>
                {it.t}
              </div>
            </div>
          );
        })}
      </Panel>
      {items.map((it, i) => (
        <Sfx key={i} at={it.at} name="tick" volume={0.35} />
      ))}
    </Stage>
  );
};

const Day: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const hAt = cue("hommes");
  return (
    <Stage gap={34}>
      <MapFrame at={0} height={470} zoom={[0, 60, 0.92, 0.98]} caption="ISLANDE · 24 OCTOBRE 1975">
        <path d={ICELAND} fill="rgba(217,171,79,0.10)" stroke={C.gold} strokeWidth={4} />
        <MapPin x={285} y={440} at={4} label="REYKJAVÍK" sub="LÆKJARTORG" />
      </MapFrame>
      <div style={{ position: "relative", width: 920, height: 450 }}>
        <Layer opacity={windowed(f, cue("90"), hAt)}>
          <Hero at={cue("90")} text="90 %" size={250} sub="des femmes suivent le mot d'ordre" />
        </Layer>
        <Layer opacity={windowed(f, hAt)} gap={26}>
          <Panel at={hAt} width={900} pad={28}>
            <Label color={C.muted}>Pour les hommes</Label>
            <div style={{ fontFamily: ANTON, fontSize: 74, color: C.cream }}>« THE LONG FRIDAY »</div>
          </Panel>
          <Panel at={cue("kvennafrídagurinn") - 4} width={900} pad={28} style={{ borderColor: C.gold }}>
            <Label>Pour les organisatrices</Label>
            <div style={{ fontFamily: ANTON, fontSize: 74, color: C.goldHi }}>KVENNAFRÍDAGURINN</div>
            <div style={{ fontFamily: BARLOW, fontWeight: 800, fontSize: 40, color: C.cream, letterSpacing: 3, opacity: prog(f, cue("congé"), 10) }}>
              = « JOUR DE CONGÉ DES FEMMES »
            </div>
          </Panel>
        </Layer>
      </div>
      <Sfx at={cue("90")} name="impact" volume={0.35} />
    </Stage>
  );
};

const Crowd: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const cols = 22;
  const total = 220;
  const gold = 25;
  return (
    <svg viewBox={`0 0 ${cols * 38} ${Math.ceil(total / cols) * 38}`} width={836} height={(Math.ceil(total / cols) * 38 * 836) / (cols * 38)}>
      {Array.from({ length: total }).map((_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const isGold = i < gold;
        const p = isGold ? prog(f, at + 10 + i * 0.6, 8) : prog(f, at + (c + r) * 0.4, 8);
        return <circle key={i} cx={c * 38 + 19} cy={r * 38 + 19} r={13 * Math.max(p, isGold ? 0 : 0)} fill={isGold && p > 0 ? C.goldHi : "rgba(242,232,213,0.2)"} />;
      })}
    </svg>
  );
};

const Myth: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const cAt = cue("jour-là,");
  return (
    <Stage>
      <Layer opacity={windowed(f, 0, cAt)}>
        <Title at={2} text="Le choix des mots compte" size={70} />
        <Compare
          at={cue("officiellement") - 4}
          strikeAt={cue("faits,")}
          trueAt={cue("faits,") + 4}
          mythLabel="OFFICIELLEMENT"
          truthLabel="DANS LES FAITS"
          myth="UN « JOUR DE CONGÉ », PAS UNE GRÈVE"
          truth="LE PAYS *S'ARRÊTE*"
        />
      </Layer>
      <Layer opacity={windowed(f, cAt)} gap={30}>
        <Hero at={cue("25")} text="25 000" size={200} sub="rassemblés à *Reykjavík*" />
        <Panel at={cue("pays", 2) - 6} width={900} pad={28}>
          <Crowd at={cue("pays", 2) - 4} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontFamily: BARLOW, fontWeight: 800, fontSize: 34, letterSpacing: 2 }}>
            <span style={{ color: C.goldHi }}>● 25 000 DANS LA RUE</span>
            <span style={{ color: C.muted }}>220 000 HABITANTS</span>
          </div>
        </Panel>
      </Layer>
      <Sfx at={cue("faits,")} name="softHit" volume={0.4} />
      <Sfx at={cue("25")} name="impact" volume={0.35} />
    </Stage>
  );
};

const After: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const years = ["1985", "2005", "2010", "2016", "2018", "2023", "2025"];
  const repAt = cue("répète");
  const line = interpolate(f, [repAt, cue("2025") + 6], [0, 1], { ...clamp, easing: easeOut });
  return (
    <Stage gap={36}>
      <div style={{ display: "flex", gap: 24, width: 900 }}>
        <Panel at={2} width={438} pad={28}>
          <Label color={C.muted}>1975</Label>
          <div style={{ fontFamily: ANTON, fontSize: 52, color: C.cream, lineHeight: 1.05 }}>LE JOUR DE CONGÉ</div>
        </Panel>
        <Panel at={cue("parlement") - 4} width={438} pad={28} style={{ borderColor: C.gold }}>
          <Label>1976</Label>
          <div style={{ fontFamily: ANTON, fontSize: 52, color: C.goldHi, lineHeight: 1.05 }}>LOI SUR L'ÉGALITÉ</div>
        </Panel>
      </div>
      <Title at={repAt - 6} text="Et l'événement *se répète*" size={72} />
      <div style={{ position: "relative", width: 900, height: 420 }}>
        <div style={{ position: "absolute", left: 60, top: 20, bottom: 20, width: 6, background: "rgba(217,171,79,0.2)", borderRadius: 3 }}>
          <div style={{ width: 6, height: `${line * 100}%`, background: C.gold, borderRadius: 3 }} />
        </div>
        <div style={{ position: "absolute", left: 110, right: 0, top: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 24px" }}>
          {years.map((y) => {
            const at = cue(y);
            const p = prog(f, at, 10);
            const last = y === "2025";
            return (
              <div
                key={y}
                style={{
                  opacity: p,
                  transform: `scale(${0.7 + 0.3 * p})`,
                  fontFamily: ANTON,
                  fontSize: 70,
                  textAlign: "center",
                  borderRadius: 18,
                  padding: "6px 0 2px",
                  color: last ? C.bg : C.goldHi,
                  background: last ? C.gold : "rgba(217,171,79,0.10)",
                  border: `3px solid ${last ? C.goldHi : C.line}`,
                }}
              >
                {y}
              </div>
            );
          })}
        </div>
      </div>
      {years.map((y) => (
        <Sfx key={y} at={cue(y)} name="pop" volume={0.25} />
      ))}
    </Stage>
  );
};

const QuestionScene: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const qAt = cue("vous,");
  return (
    <Stage>
      <Layer opacity={windowed(f, 0, qAt)} gap={40}>
        <Hero at={2} text="2025" size={240} sub="toujours là, 50 ans après" />
        <Title at={cue("suffi")} text={"Une journée\na suffi."} size={96} />
      </Layer>
      <Layer opacity={windowed(f, qAt)}>
        <Question at={qAt} text={"Quelle journée\nauriez-vous\n*arrêtée* ?"} />
      </Layer>
      <Sfx at={qAt} name="pop" volume={0.35} />
    </Stage>
  );
};

export const EP05_SCENES = {
  hook: Hook,
  context: Context,
  plan: Plan,
  day: Day,
  myth: Myth,
  after: After,
  question: QuestionScene,
};
