import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { useCue } from "../frame";
import { ANTON, BARLOW, C, clamp, prog, SERIF, windowed } from "../theme";
import {
  Appear, Chip, Compare, DrawPath, Flow, Hero, Label, Layer, MapFrame, MapPin, Panel, Profile, Question, Sfx, Stage, Stamp, Title,
} from "../ui";

/* ------------------------------------------------------------------ */
/* Dessins                                                             */
/* ------------------------------------------------------------------ */
const CREATURE = [
  // corps
  "M120 380 C170 330 230 360 280 320 C330 280 300 220 350 190 C400 160 440 175 468 152",
  // queue
  "M120 380 C80 410 58 452 98 470 C128 482 142 456 118 444",
  // mâchoires ouvertes
  "M468 152 L566 104 L522 150",
  "M474 164 L556 196 L516 164",
  // ailes
  "M300 300 C278 200 220 140 150 116 C200 168 188 210 232 232 C198 244 190 272 232 282",
  "M342 256 C382 168 444 118 528 98 C474 160 474 200 432 222 C460 228 470 250 444 262",
  // pattes et griffes
  "M205 352 L182 420 L156 432 M182 420 L192 444 M182 420 L172 446",
  "M330 300 L352 370 L328 386 M352 370 L374 382 M352 370 L352 394",
  // dents
  "M498 140 L504 150 L512 134 L518 146 L528 128",
  "M500 172 L508 162 L516 178 L524 168",
];

export const Creature: React.FC<{ at: number; color?: string; width?: number; stroke?: number }> = ({
  at,
  color = C.gold,
  width = 560,
  stroke = 7,
}) => {
  const f = useCurrentFrame();
  return (
    <svg viewBox="40 60 560 440" width={width} height={(width * 440) / 560}>
      {CREATURE.map((d, i) => (
        <DrawPath key={i} d={d} at={at + i * 3} len={22} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      <circle cx={488} cy={140} r={8 * prog(f, at + 30, 8)} fill={color} />
    </svg>
  );
};

const MASS =
  "M80 230 L700 200 L740 160 L800 185 L770 235 L745 300 L790 360 L830 420 L900 430 L945 395 L930 345 L955 350 L965 410 L915 470 L840 465 L780 470 L700 455 L640 470 L610 430 L560 420 L80 420 Z";

/* ------------------------------------------------------------------ */
/* Scènes                                                              */
/* ------------------------------------------------------------------ */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const word = "GERRYMANDERING";
  const wAt = cue("gerrymandering");
  const shown = Math.floor(interpolate(f, [wAt, wAt + 18], [0, word.length], clamp));
  const mAt = cue("monstre");
  return (
    <Stage gap={34}>
      <Chip at={4} text="Un mot de politique" tone="ghost" />
      <div style={{ fontFamily: ANTON, fontSize: 118, letterSpacing: 2, color: C.goldHi, minHeight: 140 }}>
        {word.slice(0, shown)}
        <span style={{ opacity: f % 16 < 8 && shown < word.length ? 1 : 0, color: C.gold }}>|</span>
      </div>
      <div style={{ position: "relative" }}>
        <Creature at={mAt} width={620} />
        <div style={{ position: "absolute", right: -10, bottom: 10 }}>
          <Stamp at={cue("dessiné")} text={"NÉ D'UN\nDESSIN"} size={56} rotate={-9} />
        </div>
      </div>
      {Array.from({ length: word.length }).map((_, i) => (
        <Sfx key={i} at={wAt + i * 1.3} name="tick" volume={0.12} />
      ))}
      <Sfx at={cue("dessiné")} name="stamp" volume={0.45} />
    </Stage>
  );
};

const Context: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const dAt = cue("11");
  const pAt = cue("elbridge");
  return (
    <Stage gap={40}>
      <MapFrame at={0} height={520} zoom={[0, 90, 1, 1.1]} caption="MASSACHUSETTS · 1812">
        <path d={MASS} fill="rgba(217,171,79,0.10)" stroke={C.gold} strokeWidth={4} strokeLinejoin="round" />
        <path d="M560 420 L560 230" stroke="rgba(217,171,79,0.25)" strokeWidth={2} strokeDasharray="8 10" />
        <path d="M330 420 L330 216" stroke="rgba(217,171,79,0.25)" strokeWidth={2} strokeDasharray="8 10" />
        <path d="M660 210 L700 330 L790 360" stroke="rgba(217,171,79,0.25)" strokeWidth={2} strokeDasharray="8 10" fill="none" />
        <text x={150} y={335} fontFamily={ANTON} fontSize={44} fill="rgba(242,232,213,0.4)" letterSpacing={6}>
          MASSACHUSETTS
        </text>
        <MapPin x={738} y={300} at={cue("massachusetts")} label="BOSTON" side="left" />
      </MapFrame>
      <div style={{ position: "relative", width: 920, height: 330 }}>
        <Layer opacity={windowed(f, dAt, pAt)}>
          <Hero at={dAt} text="11 FÉVRIER 1812" size={130} sub="une loi redessine la carte" />
        </Layer>
        <Layer opacity={windowed(f, pAt)} gap={24}>
          <Profile at={pAt} name="ELBRIDGE GERRY" role="GOUVERNEUR DU MASSACHUSETTS" compact />
          <Chip at={cue("redessine")} text="Nouvelles circonscriptions du Sénat" size={36} />
        </Layer>
      </div>
      <Sfx at={dAt} name="impact" volume={0.35} />
      <Sfx at={pAt} name="pop" volume={0.3} />
    </Stage>
  );
};

const GRID = 8;
const CELL = 100;
const DISTRICT: [number, number][] = [
  [1, 0], [1, 1], [2, 1], [3, 1], [3, 2], [3, 3], [2, 3], [2, 4], [3, 5], [4, 5], [5, 5], [5, 4], [6, 3], [6, 2], [7, 2], [7, 3], [6, 6], [6, 7],
];
const PATH_ORDER: [number, number][] = [
  [1, 0], [1, 1], [2, 1], [3, 1], [3, 2], [3, 3], [2, 3], [2, 4], [3, 5], [4, 5], [5, 5], [5, 4], [6, 3], [6, 2], [7, 2],
];
const inDistrict = (c: number, r: number) => DISTRICT.some(([x, y]) => x === c && y === r);

const VoterGrid: React.FC<{ drawAt: number; pulseAt: number }> = ({ drawAt, pulseAt }) => {
  const f = useCurrentFrame();
  const pts = PATH_ORDER.map(([c, r]) => `${c * CELL + CELL / 2},${r * CELL + CELL / 2}`).join(" ");
  const d = "M" + pts.replace(/ /g, " L");
  const pulse = f > pulseAt ? 1 + 0.18 * Math.max(0, Math.sin((f - pulseAt) / 4)) : 1;
  return (
    <svg viewBox={`-20 -20 ${GRID * CELL + 40} ${GRID * CELL + 40}`} width={760} height={760}>
      <DrawPath d={d} at={drawAt} len={40} stroke="rgba(217,171,79,0.22)" strokeWidth={92} strokeLinecap="round" strokeLinejoin="round" />
      <DrawPath d={d} at={drawAt} len={40} stroke={C.goldHi} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" />
      {Array.from({ length: GRID * GRID }).map((_, i) => {
        const c = i % GRID;
        const r = Math.floor(i / GRID);
        const onPath = PATH_ORDER.some(([x, y]) => x === c && y === r);
        const camp = onPath || (inDistrict(c, r) && random(`d${i}`) > 0.2) || random(`v${i}`) > 0.72;
        const app = prog(f, 4 + (c + r) * 1.5, 10);
        const s = onPath && camp ? pulse : 1;
        return (
          <circle
            key={i}
            cx={c * CELL + CELL / 2}
            cy={r * CELL + CELL / 2}
            r={17 * app * s}
            fill={camp ? C.gold : "rgba(242,232,213,0.28)"}
          />
        );
      })}
    </svg>
  );
};

const Trace: React.FC = () => {
  const cue = useCue();
  const eAt = cue("étiré");
  return (
    <Stage gap={26}>
      <Chip at={2} text="Comté d'Essex" />
      <div style={{ position: "relative" }}>
        <VoterGrid drawAt={eAt - 4} pulseAt={cue("regrouper")} />
        <div style={{ position: "absolute", left: -10, top: 30 }}>
          <Stamp at={eAt} text="ÉTIRÉ" color={C.goldHi} rotate={-8} size={60} />
        </div>
        <div style={{ position: "absolute", right: -10, bottom: 60 }}>
          <Stamp at={cue("tordu")} text="TORDU" color={C.goldHi} rotate={7} size={60} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 40, fontFamily: BARLOW, fontWeight: 800, fontSize: 34, letterSpacing: 3 }}>
        <Appear at={cue("électeurs")}>
          <span style={{ color: C.gold }}>● SON CAMP</span>
        </Appear>
        <Appear at={cue("électeurs") + 6}>
          <span style={{ color: C.muted }}>● LES AUTRES</span>
        </Appear>
      </div>
      <Sfx at={eAt} name="stamp" volume={0.35} />
      <Sfx at={cue("tordu")} name="stamp" volume={0.35} />
    </Stage>
  );
};

const Gazette: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const eqAt = cue("éditeur");
  const shrink = prog(f, eqAt, 16);
  return (
    <Stage gap={30}>
      <div style={{ transform: `scale(${1 - 0.22 * shrink})`, transformOrigin: "50% 0%", marginBottom: -150 * shrink }}>
        <Appear at={0} scale={0.95}>
          <div
            style={{
              width: 860,
              background: `linear-gradient(170deg, ${C.paper}, #d6c398)`,
              borderRadius: 10,
              padding: "30px 40px 26px",
              boxShadow: "0 40px 90px rgba(0,0,0,0.65)",
              transform: "rotate(-1.5deg)",
              color: C.ink,
            }}
          >
            <div style={{ borderTop: `3px solid ${C.ink}`, borderBottom: `1px solid ${C.ink}`, padding: "10px 0 6px", textAlign: "center" }}>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 78, letterSpacing: 1, lineHeight: 1 }}>Boston Gazette</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SERIF, fontWeight: 700, fontSize: 28, padding: "8px 4px", borderBottom: `3px solid ${C.ink}` }}>
              <span>BOSTON</span>
              <span>26 MARS 1812</span>
              <span>N° 2 657</span>
            </div>
            <div style={{ display: "flex", justifyContent: "center", paddingTop: 10 }}>
              <Creature at={cue("créature")} color={C.ink} width={520} stroke={6} />
            </div>
            <div style={{ textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 46, opacity: prog(f, cue("gueule"), 12) }}>
              The Gerry-mander
            </div>
          </div>
        </Appear>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 22, fontFamily: ANTON, fontSize: 70 }}>
        <Appear at={eqAt + 4}>
          <span style={{ color: C.cream }}>GERRY</span>
        </Appear>
        <Appear at={cue("salamandre") - 6}>
          <span style={{ color: C.gold }}>+</span>
        </Appear>
        <Appear at={cue("salamandre")}>
          <span style={{ color: C.cream }}>SALAMANDRE</span>
        </Appear>
      </div>
      <Appear at={cue("salamandre") + 14} scale={0.8}>
        <div style={{ fontFamily: ANTON, fontSize: 96, color: C.goldHi, letterSpacing: 2 }}>= GERRY-MANDER</div>
      </Appear>
      <Sfx at={cue("caricature")} name="softHit" volume={0.4} />
      <Sfx at={cue("salamandre") + 14} name="impact" volume={0.35} />
    </Stage>
  );
};

const Dispute: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const iAt = cue("inventeur");
  const dAt = cue("dessinateur");
  return (
    <Stage>
      <Layer opacity={windowed(f, 0, dAt)} gap={34}>
        <Chip at={2} text="Presse → langue courante" tone="ghost" />
        <Label size={44}>L'auteur du mot</Label>
        <Hero at={iAt} text="?" size={300} />
        <Stamp at={cue("jamais")} text="JAMAIS IDENTIFIÉ" size={70} />
      </Layer>
      <Layer opacity={windowed(f, dAt)} gap={28}>
        <Label size={44}>Le dessinateur ?</Label>
        <Profile at={cue("tisdale") - 4} name="ELKANAH TISDALE" role="SELON LA BIBLIOTHÈQUE DU CONGRÈS" compact />
        <Appear at={cue("gilbert") - 8}>
          <div style={{ fontFamily: ANTON, fontSize: 64, color: C.red, textAlign: "center" }}>OU</div>
        </Appear>
        <Profile at={cue("gilbert") - 4} name="GILBERT STUART" role="SELON D'AUTRES SOURCES" compact />
        <Chip at={cue("gilbert") + 16} text="Attribution disputée" tone="red" />
      </Layer>
      <Sfx at={cue("jamais")} name="stamp" volume={0.45} />
      <Sfx at={cue("tisdale")} name="pop" volume={0.3} />
      <Sfx at={cue("gilbert")} name="pop" volume={0.3} />
    </Stage>
  );
};

const Vp: React.FC = () => {
  const cue = useCue();
  return (
    <Stage gap={50}>
      <Hero at={2} text="1812" size={260} />
      <Chip at={cue("vice-président") - 4} text="Gerry → *vice-président* des États-Unis" size={40} />
      <Title at={cue("mot")} text={"Le mot, lui,\n*est resté.*"} size={110} />
      <Sfx at={2} name="impact" volume={0.3} />
    </Stage>
  );
};

const Truth: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const dAt = cue("départ");
  return (
    <Stage>
      <Layer opacity={windowed(f, 0, dAt)}>
        <Compare at={2} strikeAt={cue("réalité")} trueAt={cue("caricature") - 4} myth="LE MOT DÉSIGNE UNE SALAMANDRE" truth="IL VIENT D'UNE *CARICATURE*" />
        <Chip at={cue("glissé")} text="…et son sens a glissé" tone="ghost" />
      </Layer>
      <Layer opacity={windowed(f, dAt)} gap={30}>
        <Label size={42}>La prononciation</Label>
        <Panel at={dAt + 2} width={900}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <Label color={C.muted}>Au départ · 1812</Label>
              <div style={{ fontFamily: ANTON, fontSize: 92, color: C.cream }}>« G » DUR</div>
            </div>
            <div style={{ fontFamily: ANTON, fontSize: 70, color: C.muted }}>GUÈ-RRY</div>
          </div>
        </Panel>
        <Panel at={cue("doux") - 4} width={900} style={{ borderColor: C.gold }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <Label>Aujourd'hui</Label>
              <div style={{ fontFamily: ANTON, fontSize: 92, color: C.goldHi }}>« G » DOUX</div>
            </div>
            <div style={{ fontFamily: ANTON, fontSize: 70, color: C.gold }}>DJÈ-RRY</div>
          </div>
        </Panel>
        <Title at={cue("s'efface")} text={"Le nom s'efface.\n*La manœuvre reste.*"} size={84} />
      </Layer>
      <Sfx at={cue("réalité")} name="softHit" volume={0.4} />
    </Stage>
  );
};

const QuestionScene: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const qAt = cue("auriez-vous");
  return (
    <Stage>
      <Layer opacity={windowed(f, 0, qAt)}>
        <Flow items={["TRACÉ TORDU", "VOTE ORIENTÉ", "*MOT NOUVEAU*"]} at={[cue("existe"), cue("dessiner"), cue("gagner")]} />
      </Layer>
      <Layer opacity={windowed(f, qAt)}>
        <Question at={qAt} text={"Auriez-vous reconnu\nune circonscription\n*tordue* ?"} />
      </Layer>
      <Sfx at={qAt} name="pop" volume={0.35} />
    </Stage>
  );
};

export const EP04_SCENES = {
  hook: Hook,
  context: Context,
  trace: Trace,
  gazette: Gazette,
  dispute: Dispute,
  vp: Vp,
  truth: Truth,
  question: QuestionScene,
};
