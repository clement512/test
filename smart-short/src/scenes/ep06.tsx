import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { useCue } from "../frame";
import { ANTON, BARLOW, C, clamp, easeOut, prog, windowed } from "../theme";
import {
  Appear, Chip, Compare, Flow, Hero, Label, Layer, MapFrame, MapPin, Panel, Profile, Question, Sfx, Stage, Stamp, Title,
} from "../ui";

/* ------------------------------------------------------------------ */
/* Silhouette avec bicorne                                             */
/* ------------------------------------------------------------------ */
/** Silhouette (hauteur = `h` px pour la personne, hors chapeau). */
const Figure: React.FC<{ h: number; hat?: number; color?: string; outline?: boolean; bicorne?: boolean }> = ({
  h,
  hat = 1,
  color = C.gold,
  outline,
  bicorne = true,
}) => {
  const hatW = 46 * hat;
  const hatH = 16 * hat;
  return (
    <svg viewBox={`-60 ${-10 - hatH * 1.6} 120 ${210 + hatH * 1.6}`} height={h * (1 + (hatH * 1.6 + 10) / 200)} width={(h * 120) / 200} style={{ overflow: "visible" }}>
      <g fill={outline ? "none" : color} stroke={color} strokeWidth={outline ? 3 : 0} strokeLinejoin="round">
        {bicorne ? (
          <path d={`M${-hatW} 14 C${-hatW * 0.6} ${10 - hatH * 1.2} ${hatW * 0.6} ${10 - hatH * 1.2} ${hatW} 14 C${hatW * 0.4} 4 ${-hatW * 0.4} 4 ${-hatW} 14 Z`} />
        ) : (
          <path d="M-16 12 C-14 0 14 0 16 12 Z" />
        )}
        <circle cx={0} cy={26} r={13} />
        <path d="M-26 46 C-24 40 24 40 26 46 L32 112 L20 112 L18 196 L4 196 L2 120 L-2 120 L-4 196 L-18 196 L-20 112 L-32 112 Z" />
      </g>
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Scènes                                                              */
/* ------------------------------------------------------------------ */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const mAt = cue("minuscule.");
  const shrink = interpolate(f, [mAt - 6, mAt + 10], [1, 0.42], { ...clamp, easing: easeOut });
  const cAt = cue("contemporains,");
  const regrow = interpolate(f, [cAt, cAt + 18], [0, 1], { ...clamp, easing: easeOut });
  const h = 520 * (shrink + (1 - shrink) * regrow);
  return (
    <Stage gap={30}>
      <Title at={2} text={"Napoléon\n*Bonaparte*"} size={110} />
      <div style={{ height: 600, display: "flex", alignItems: "flex-end", justifyContent: "center", position: "relative", width: 900 }}>
        <Figure h={h} />
        <div style={{ position: "absolute", bottom: 90, right: 20 }}>
          <Stamp at={mAt} text="MINUSCULE ?" size={64} />
        </div>
      </div>
      <Chip at={cAt} text="Ses contemporains : *jamais* décrit ainsi" size={38} />
      <Sfx at={mAt} name="stamp" volume={0.45} />
    </Stage>
  );
};

const Island: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const aAt = cue("antommarchi,");
  const tAt = cue("5");
  return (
    <Stage gap={36}>
      <MapFrame at={0} height={500} zoom={[0, 80, 1, 1.15]} caption="ATLANTIQUE SUD · 1821">
        <path d="M0 60 L120 80 C180 120 240 200 250 250 C240 300 200 360 170 430 C150 500 120 600 100 700 L0 700 Z" fill="rgba(242,232,213,0.08)" stroke="rgba(217,171,79,0.45)" strokeWidth={3} />
        <path d="M1000 0 L700 0 C680 60 690 120 720 170 C760 220 820 230 840 280 C860 360 850 450 880 520 C900 600 940 660 960 700 L1000 700 Z" fill="rgba(242,232,213,0.08)" stroke="rgba(217,171,79,0.45)" strokeWidth={3} />
        <text x={110} y={330} fontFamily={BARLOW} fontWeight={800} fontSize={30} letterSpacing={4} fill={C.dim}>AMÉRIQUE DU SUD</text>
        <text x={880} y={360} textAnchor="end" fontFamily={BARLOW} fontWeight={800} fontSize={30} letterSpacing={4} fill={C.dim}>AFRIQUE</text>
        <circle cx={560} cy={460} r={7} fill={C.cream} />
        <MapPin x={560} y={460} at={cue("sainte-hélène,")} label="SAINTE-HÉLÈNE" sub="SOUS CONTRÔLE BRITANNIQUE" side="left" />
      </MapFrame>
      <div style={{ position: "relative", width: 920, height: 380 }}>
        <Layer opacity={windowed(f, 0, aAt)}>
          <Hero at={cue("meurt")} text="1821" size={200} sub="mort de *Napoléon*" />
        </Layer>
        <Layer opacity={windowed(f, aAt)} gap={26}>
          <Profile at={aAt} name="FRANÇOIS ANTOMMARCHI" role="SON MÉDECIN · L'AUTOPSIE" compact />
          <Appear at={tAt} scale={0.8}>
            <div style={{ fontFamily: ANTON, fontSize: 120, color: C.goldHi, textAlign: "center", lineHeight: 1 }}>5 PIEDS 2 POUCES</div>
          </Appear>
        </Layer>
      </div>
      <Sfx at={tAt} name="impact" volume={0.35} />
    </Stage>
  );
};

const Ruler: React.FC<{ at: number; cm: number; label: string; gold?: boolean }> = ({ at, cm, label, gold }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 22);
  const unit = 300; // px par cm
  const w = cm * unit * p;
  return (
    <div style={{ width: 900 }}>
      <Label color={gold ? C.gold : C.muted} size={36}>{label}</Label>
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 12 }}>
        <div style={{ position: "relative", height: 90, width: 2.75 * unit, background: "rgba(255,255,255,0.04)", border: "2px dashed rgba(217,171,79,0.25)", borderRadius: 8 }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: 90,
              width: w,
              background: gold ? `linear-gradient(180deg, ${C.goldHi}, ${C.gold})` : "rgba(242,232,213,0.25)",
              borderRadius: 8,
            }}
          />
          {Array.from({ length: Math.floor(cm * 10) + 1 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: i * (unit / 10),
                top: 0,
                width: 2,
                height: i % 10 === 0 ? 50 : i % 5 === 0 ? 34 : 20,
                background: C.bg,
                opacity: i * (unit / 10) <= w ? 0.7 : 0,
              }}
            />
          ))}
        </div>
      </div>
      <div style={{ fontFamily: ANTON, fontSize: 64, color: gold ? C.goldHi : C.cream, marginTop: 8, opacity: p }}>
        ≈ {cm.toString().replace(".", ",")} CM
      </div>
    </div>
  );
};

const Units: React.FC = () => {
  const cue = useCue();
  return (
    <Stage gap={40}>
      <Chip at={cue("françaises.") - 6} text="Des unités *françaises*" size={44} />
      <Panel at={cue("pouce") - 6} width={960} pad={34}>
        <Ruler at={cue("2,7")} cm={2.7} label="1 pouce français" gold />
        <div style={{ height: 34 }} />
        <Ruler at={cue("2,54.")} cm={2.54} label="1 pouce anglais" />
      </Panel>
      <Title at={cue("long")} text={"Le pouce français\nest *plus long*"} size={84} />
      <Sfx at={cue("2,7")} name="softHit" volume={0.35} />
      <Sfx at={cue("2,54.")} name="softHit" volume={0.35} />
    </Stage>
  );
};

const Convert: React.FC = () => {
  const cue = useCue();
  return (
    <Stage gap={40}>
      <Flow
        items={["5′2″ FRANÇAIS", "≈ 1,68 – 1,70 M", "*5′6″ – 5′7″ ANGLAIS*"]}
        at={[2, cue("1,68"), cue("1,70")]}
        size={70}
      />
      <Chip at={cue("moyenne,")} text="Taille *moyenne* pour l'époque, voire au-dessus" size={36} />
      <Sfx at={cue("1,68")} name="pop" volume={0.3} />
      <Sfx at={cue("moyenne,")} name="softHit" volume={0.35} />
    </Stage>
  );
};

const Propaganda: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const pAt = cue("petit");
  return (
    <Stage>
      <Layer opacity={windowed(f, 0, pAt - 4)} gap={30}>
        <Chip at={cue("caricaturistes") - 4} text="Caricatures britanniques" tone="red" />
        <Panel at={cue("caricaturistes")} width={760} pad={30} style={{ background: "linear-gradient(170deg, #e8dabb, #d2bf93)" }}>
          <div style={{ height: 520, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            <Figure h={190} hat={interpolate(f, [cue("énorme"), cue("énorme") + 14], [1, 3.4], { ...clamp, easing: easeOut })} color={C.ink} />
          </div>
          <div style={{ textAlign: "center", fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 700, fontSize: 40, color: C.ink }}>
            « Little Boney »
          </div>
        </Panel>
      </Layer>
      <Layer opacity={windowed(f, pAt - 4)} gap={40}>
        <Label size={40}>Pour ses soldats</Label>
        <Hero at={pAt - 4} text={"« LE PETIT\nCAPORAL »"} size={130} />
        <Stamp at={cue("d'affection,")} text={"AFFECTION\n≠ DESCRIPTION"} size={62} color={C.goldHi} rotate={-5} />
        <Chip at={cue("caricature,")} text="La caricature fait le reste" tone="red" />
      </Layer>
      <Sfx at={cue("énorme")} name="pop" volume={0.35} />
      <Sfx at={cue("d'affection,")} name="stamp" volume={0.4} />
    </Stage>
  );
};

const Wellington: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const wAt = cue("wellington,");
  const scale = 4.2; // px par cm
  const base = 150;
  const grid = [150, 160, 170, 180];
  return (
    <Stage gap={30}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <Chip at={2} text="Un chiffre mal converti" tone="ghost" size={38} />
        <Chip at={cue("caricatures,")} text="+ des caricatures" tone="ghost" size={38} />
        <Appear at={cue("légende")} scale={0.85}>
          <div style={{ fontFamily: ANTON, fontSize: 84, color: C.goldHi }}>= UNE LÉGENDE</div>
        </Appear>
      </div>
      <Panel at={wAt - 8} width={900} pad={26}>
        <div style={{ position: "relative", height: 400 }}>
          {grid.map((g) => (
            <div key={g} style={{ position: "absolute", left: 0, right: 0, bottom: (g - base) * scale * 2.2 + 20, borderTop: "2px dashed rgba(217,171,79,0.25)" }}>
              <span style={{ position: "absolute", left: 0, top: -40, fontFamily: BARLOW, fontWeight: 800, fontSize: 28, color: C.muted }}>
                {(g / 100).toFixed(2).replace(".", ",")} M
              </span>
            </div>
          ))}
          {[
            { name: "NAPOLÉON", cm: 168, at: wAt, gold: true, x: 260 },
            { name: "WELLINGTON", cm: 173, at: wAt + 8, gold: false, x: 560 },
          ].map((p) => {
            const k = prog(f, p.at, 16);
            const top = (p.cm - base) * scale * 2.2 + 20;
            return (
              <div key={p.name} style={{ position: "absolute", left: p.x, bottom: 0, opacity: k, textAlign: "center", width: 200 }}>
                <div style={{ position: "absolute", left: 0, right: 0, bottom: top - 6, borderTop: `4px solid ${p.gold ? C.goldHi : C.cream}` }} />
                <div style={{ position: "absolute", left: 0, right: 0, bottom: top + 6, fontFamily: ANTON, fontSize: 44, color: p.gold ? C.goldHi : C.cream }}>
                  {(p.cm / 100).toFixed(2).replace(".", ",")} M
                </div>
                <div style={{ position: "absolute", left: 0, right: 0, bottom: -4, fontFamily: BARLOW, fontWeight: 800, fontSize: 30, letterSpacing: 2, color: C.muted }}>
                  {p.name}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
      <Chip at={cue("peine")} text="À peine *5 cm* de plus" size={40} />
      <Sfx at={wAt} name="pop" volume={0.3} />
    </Stage>
  );
};

const Truth: React.FC = () => {
  const cue = useCue();
  return (
    <Stage gap={40}>
      <Compare at={2} strikeAt={cue("sources")} trueAt={cue("sources") + 4} myth="NAPOLÉON ÉTAIT PETIT" truth="IL ÉTAIT DANS LA *MOYENNE*" />
      <Stamp at={cue("propagande.")} text={"EFFACÉ PAR\nLA PROPAGANDE"} size={60} />
      <Sfx at={cue("sources")} name="softHit" volume={0.4} />
      <Sfx at={cue("propagande.")} name="stamp" volume={0.4} />
    </Stage>
  );
};

const Complex: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const qAt = cue("vous,");
  return (
    <Stage>
      <Layer opacity={windowed(f, 0, qAt)} gap={40}>
        <Title at={cue("complexe")} text={"« Le complexe\nde *Napoléon* »"} size={104} />
        <Chip at={cue("petits")} text="Petit → compense par l'*agressivité* ?" size={40} />
        <Stamp at={cue("étiquette")} text={"NÉE D'UNE ERREUR\nDE CONVERSION"} size={58} color={C.goldHi} rotate={-4} />
      </Layer>
      <Layer opacity={windowed(f, qAt)}>
        <Question at={qAt} text={"Faites-vous confiance\naux *chiffres d'époque* ?"} />
      </Layer>
      <Sfx at={cue("étiquette")} name="stamp" volume={0.4} />
      <Sfx at={qAt} name="pop" volume={0.35} />
    </Stage>
  );
};

export const EP06_SCENES = {
  hook: Hook,
  island: Island,
  units: Units,
  convert: Convert,
  propaganda: Propaganda,
  wellington: Wellington,
  truth: Truth,
  complex: Complex,
};
