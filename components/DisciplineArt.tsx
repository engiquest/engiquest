"use client";

import { useId, type CSSProperties } from "react";

export type ArtDiscipline = "all" | "mechanical" | "civil" | "electrical" | "robotics" | "biomedical" | "green";
export type DisciplineArtProps = {
  field?: ArtDiscipline;
  variant?: "hero" | "card";
  decorative?: boolean;
  title?: string;
  className?: string;
  style?: CSSProperties;
};
type SceneProps = { id: string; miniature?: boolean };
const accent = "var(--accent, #48d9d0)";
const secondary = "var(--accent-2, #91b8ff)";
const ink = "var(--art-ink, #a7c0d1)";
const edge = "var(--art-edge, #6a91ab)";
const dark = "var(--art-dark, #0b1c2b)";
const names: Record<ArtDiscipline, string> = {
  all: "An engineering atlas: six disciplines around a shared design space",
  mechanical: "A cutaway jet turbine with an aerodynamic wing and airflow guides",
  civil: "An isometric suspension bridge showing towers, cables, and a river crossing",
  electrical: "A layered circuit board with a microprocessor, copper traces, and a signal display",
  robotics: "A wheeled exploration rover with an articulated arm and a gripper",
  biomedical: "A tissue scaffold, a synthetic ECG display, and a DNA double helix",
  green: "A renewable energy landscape with solar panels and wind turbines",
};

function Dimension({ x1, y1, x2, y2, label, id }: { x1: number; y1: number; x2: number; y2: number; label: string; id: string }) {
  return <g stroke={ink} fill={ink} opacity=".7" strokeWidth=".7">
    <path d={`M${x1},${y1 - 5}v10M${x2},${y2 - 5}v10`} />
    <path d={`M${x1 + 3},${y1}L${x2 - 3},${y2}`} markerStart={`url(#${id}-measure)`} markerEnd={`url(#${id}-measure)`} />
    <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 7} stroke="none" textAnchor="middle" fontSize="8" letterSpacing="1.2">{label}</text>
  </g>;
}
function Target({ x, y, size = 8 }: { x: number; y: number; size?: number }) {
  return <g transform={`translate(${x} ${y})`} fill="none" stroke={accent} strokeWidth=".8" opacity=".7"><circle r={size} /><path d={`M${-size - 4} 0H${-size + 2}M${size - 2} 0H${size + 4}M0 ${-size - 4}V${-size + 2}M0 ${size - 2}V${size + 4}`} /></g>;
}
function Bolt({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}><circle r="2.3" fill={dark} stroke={edge} strokeWidth=".8" /><path d="M-1 0h2" stroke={ink} strokeWidth=".5" /></g>;
}

function Mechanical({ id, miniature }: SceneProps) {
  return <g>
    <ellipse cx="239" cy="261" rx="152" ry="25" fill={`url(#${id}-shadow)`} />
    <path d="M79 239 251 185 395 226 224 282Z" fill={`url(#${id}-glass)`} stroke={accent} strokeOpacity=".16" />
    <path d="M244 147 367 87 412 115 299 184Z" fill={`url(#${id}-metal)`} stroke={edge} strokeWidth="1.2" />
    <path d="m258 147 109-52 32 20-104 57" fill="none" stroke={accent} strokeWidth="1.4" />
    <path d="m303 143 36-18 29 13-34 19" fill={dark} opacity=".55" />
    <path d="M176 106 325 139C357 145 359 199 326 216L176 245Z" fill={`url(#${id}-metal)`} stroke={edge} strokeWidth="1.2" />
    <ellipse cx="325" cy="177" rx="30" ry="39" fill={dark} stroke={edge} strokeWidth="2" />
    <ellipse cx="325" cy="177" rx="19" ry="29" fill={`url(#${id}-hot)`} stroke={secondary} strokeOpacity=".7" />
    <ellipse cx="328" cy="177" rx="9" ry="19" fill={secondary} opacity=".45" filter={`url(#${id}-glow)`} />
    <path d="m199 116 105 29m-105-9 109 26m-109 41 109-7m-105 30 100-18" fill="none" stroke={ink} strokeOpacity=".5" strokeWidth="1" />
    <path d="m229 122-1 106m27-98-1 87m24-80-1 73" fill="none" stroke={dark} strokeWidth="2" opacity=".5" />
    <path d="M229 218 352 266 402 246 285 186" fill={`url(#${id}-metal)`} stroke={edge} />
    <path d="m254 222 98 36 33-13-99-46" fill="none" stroke={accent} strokeOpacity=".65" />
    <ellipse cx="166" cy="174" rx="66" ry="74" fill={`url(#${id}-metal)`} stroke={ink} strokeWidth="1.5" />
    <ellipse cx="166" cy="174" rx="57" ry="65" fill={dark} stroke={accent} strokeOpacity=".8" strokeWidth="2" />
    <ellipse cx="166" cy="174" rx="49" ry="56" fill={`url(#${id}-cavity)`} stroke={edge} strokeOpacity=".7" />
    <g transform="translate(166 174) scale(.88 1)">
      {Array.from({ length: 12 }, (_, i) => <path key={i} d="M4-8C10-28 21-45 35-39L24-12 8 6Z" transform={`rotate(${i * 30})`} fill={`url(#${id}-blade)`} stroke={edge} strokeWidth=".8" />)}
      <circle r="16" fill={`url(#${id}-metal)`} stroke={ink} /><circle r="8" fill={accent} opacity=".65" /><circle r="3" fill={dark} />
    </g>
    {Array.from({ length: 8 }, (_, i) => { const angle = i * Math.PI / 4; return <Bolt key={i} x={166 + Math.cos(angle) * 61} y={174 + Math.sin(angle) * 69} />; })}
    <g fill="none" stroke={accent} strokeWidth="1.2" opacity=".8"><path d="M31 129c24-8 43-5 66 5M24 164c29-8 45-6 70 0M37 202c20-8 37-8 59-5" /><path d="m90 130 7 4-8 2m-3 27 8 1-7 4m1 24 8 5-8 2" /><path d="m358 166 45 10m-45 12 53 14" strokeDasharray="4 5" /></g>
    {!miniature && <g className="discipline-art__annotations"><Dimension x1={111} y1={278} x2={322} y2={295} label="COMPRESS · IGNITE · EXPAND" id={id} /><path d="M161 84V59h-38" fill="none" stroke={accent} strokeWidth=".8" /><text x="54" y="62" fill={ink} fontSize="8.5" letterSpacing="1.4">AIRFLOW STUDY</text><Target x={366} y={87} size={7} /><text x="320" y="59" fill={ink} fontSize="8" letterSpacing="1">LIFT / DRAG</text></g>}
  </g>;
}

function Civil({ id, miniature }: SceneProps) {
  const deckY = (x: number) => 250 - x * .4;
  return <g>
    <ellipse cx="229" cy="263" rx="167" ry="32" fill={`url(#${id}-shadow)`} />
    <path d="M43 227 266 137 412 214 187 305Z" fill={`url(#${id}-water)`} stroke={accent} strokeOpacity=".2" />
    {[0, 1, 2, 3].map(i => <path key={i} d={`m${92 + i * 47} ${252 + i * 3} 33-13 22 4 37-15`} fill="none" stroke={accent} strokeOpacity=".3" strokeWidth="1.2" />)}
    <path d="m48 225 50-20 52 24-51 22Z" fill={`url(#${id}-metal)`} /><path d="m315 123 31-12 49 26-32 12Z" fill={`url(#${id}-metal)`} />
    <path d="m52 229 274-109 51 27-275 110Z" fill={`url(#${id}-metal)`} stroke={edge} />
    <path d="m102 257 275-110v11L102 268 52 240v-11" fill={dark} stroke={edge} strokeOpacity=".7" />
    <path d="m78 242 274-109" fill="none" stroke={ink} strokeWidth="1.2" strokeDasharray="7 7" opacity=".8" />
    <path d="m56 226 275-109m-228 136 274-109" fill="none" stroke={accent} strokeWidth="1.4" />
    <g fill={`url(#${id}-metal)`} stroke={edge} strokeWidth="1">
      <path d="m132 199 9 5V89l-9-5Zm9 5 8-3V87l-8 2Zm33 16 9 5V111l-9-5Zm9 5 8-4V108l-8 3Z" />
      <path d="m132 84 9-4 50 27-8 4Zm0 0v12l51 27v-12Z" />
      <path d="m271 143 8 4V40l-8-5Zm8 4 8-3V38l-8 2Zm42 20 8 5V65l-8-4Zm8 5 8-3V62l-8 3Z" />
      <path d="m271 35 8-4 58 31-8 3Zm0 0v12l58 30V65Z" />
      <path d="m133 218 15 8v43l-15-8Zm42 19 15 8v43l-15-8Zm97-75 15 7v45l-15-8Zm51 26 15 8v43l-15-8Z" />
    </g>
    <g fill="none" stroke={accent} strokeWidth="2">
      <path d="M59 226Q102 162 141 90Q210 180 280 40Q311 107 350 133" />
      <path d="M103 251Q145 187 184 113Q258 206 330 65Q353 130 374 145" />
    </g>
    {Array.from({ length: 8 }, (_, i) => { const t = (i + 1) / 9; const x = 141 + t * 139; const y = (1 - t) ** 2 * 90 + 2 * (1 - t) * t * 180 + t * t * 40; return <g key={i} stroke={ink} strokeOpacity=".7" strokeWidth=".8"><path d={`M${x} ${y}V${deckY(x)}`} /><path d={`M${x + 44} ${y + 24}V${deckY(x) + 24}`} /></g>; })}
    <path d="m210 190 15-6 8 4-15 6Z" fill={secondary} /><path d="m238 164 13-5 7 4-13 5Z" fill={accent} />
    {!miniature && <g className="discipline-art__annotations"><Dimension x1={72} y1={285} x2={302} y2={193} label="LOAD PATH → FOUNDATIONS" id={id} /><path d="M222 111v-31h-35" fill="none" stroke={accent} strokeWidth=".8" /><text x="114" y="76" fill={ink} fontSize="8.5" letterSpacing="1.3">CABLE TENSION</text><Target x={280} y={40} size={7} /></g>}
  </g>;
}

function Electrical({ id, miniature }: SceneProps) {
  const traces = ["M95 170 148 141 180 158", "M123 187 156 169 181 181", "M156 209 178 196 199 207 222 194", "M220 238 245 224 245 212", "M280 230 301 218 277 204", "M347 195 315 178 294 190", "M375 170 339 150 311 165", "M330 145 291 123 275 132", "M286 119 255 102 236 113", "M186 109 201 118 177 132", "M107 157 124 148 113 142"];
  return <g>
    <ellipse cx="236" cy="258" rx="155" ry="30" fill={`url(#${id}-shadow)`} />
    <path d="m76 167 160-90 162 90-161 93Z" fill={`url(#${id}-board)`} stroke={accent} strokeWidth="1.2" />
    <path d="m76 167 161 93 161-93v13l-161 93L76 180Z" fill={dark} stroke={accent} strokeOpacity=".5" />
    <path d="m86 168 151 85 151-86M237 260v13" fill="none" stroke={edge} strokeOpacity=".6" />
    <g fill="none" stroke={accent} strokeWidth="1.4" opacity=".8">{traces.map((d, i) => <path key={d} d={d} stroke={i % 3 === 0 ? secondary : accent} />)}</g>
    {[[95, 170], [156, 209], [220, 238], [347, 195], [330, 145], [186, 109], [375, 170]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="3.2" fill={dark} stroke={i % 2 ? secondary : accent} /><circle cx={x} cy={y} r="1" fill={accent} /></g>)}
    <path d="m181 153 57-32 57 32-57 33Z" fill={`url(#${id}-metal)`} stroke={ink} />
    <path d="m181 153 57 33v22l-57-33Zm57 33 57-33v22l-57 33Z" fill={dark} stroke={edge} />
    <path d="m194 153 44-25 44 25-44 25Z" fill={`url(#${id}-glass)`} stroke={accent} strokeWidth="1.1" />
    <path d="m217 153 21-12 21 12-21 12Z" fill={accent} opacity=".15" /><path d="m226 153 12-7 12 7-12 7Z" fill="none" stroke={accent} strokeWidth="1.5" />
    {Array.from({ length: 7 }, (_, i) => <g key={i} stroke={ink} strokeWidth="2"><path d={`m${184 + i * 7.5} ${177 + i * 4.3} -8 4`} /><path d={`m${243 + i * 7.5} ${204 - i * 4.3} 8 4`} /><path d={`m${184 + i * 7.5} ${148 - i * 4.3} -7-4`} /><path d={`m${243 + i * 7.5} ${125 + i * 4.3} 7-4`} /></g>)}
    <g transform="translate(132 119)"><path d="m-10 0 13-7 27 15-13 7Z" fill={secondary} stroke={edge} /><path d="m-10 0v7l27 15v-7m13-7v7l-13 7" fill={dark} stroke={edge} /><path d="m-2-3 27 15m-20-19 27 15" stroke={dark} strokeWidth="3" opacity=".5" /></g>
    <g transform="translate(315 194)"><path d="M-8-17v17a8 4 0 0 0 16 0v-17" fill={`url(#${id}-metal)`} stroke={edge} /><ellipse cy="-17" rx="8" ry="4" fill={secondary} opacity=".8" /><path d="M-4-17h8" stroke={dark} /></g>
    <g transform="translate(335 182)"><path d="M-6-13v13a6 3 0 0 0 12 0v-13" fill={`url(#${id}-metal)`} stroke={edge} /><ellipse cy="-13" rx="6" ry="3" fill={accent} /></g>
    <path d="M81 95 157 53v62l-76 43Z" fill={`url(#${id}-glass)`} stroke={accent} strokeOpacity=".65" />
    <path d="m91 123 10-6 4-20 7 29 7-24 9-5 4-14 8 15 8-5" fill="none" stroke={accent} strokeWidth="1.5" />
    <path d="m89 99 60-33m-60 47 60-33m-60 47 60-33m-60 47 60-33" fill="none" stroke={edge} strokeWidth=".6" opacity=".35" />
    <g fill="none" stroke={secondary} strokeWidth="1" opacity=".75"><path d="M305 85h63v41" strokeDasharray="3 4" /><circle cx="305" cy="85" r="3" /><circle cx="368" cy="126" r="3" /></g>
    {!miniature && <g className="discipline-art__annotations"><Dimension x1={96} y1={282} x2={350} y2={282} label="INPUT → PROCESS → OUTPUT" id={id} /><text x="280" y="65" fill={ink} fontSize="8.5" letterSpacing="1.4">SIGNAL INTEGRITY</text><Target x={238} y={153} size={22} /></g>}
  </g>;
}

function Robotics({ id, miniature }: SceneProps) {
  return <g>
    <ellipse cx="236" cy="267" rx="148" ry="28" fill={`url(#${id}-shadow)`} />
    <path d="M52 265c52-7 54-35 87-42s42-2 66-19 27-47 55-63 83-4 120-32" fill="none" stroke={accent} strokeOpacity=".45" strokeDasharray="4 6" />
    <path d="m109 203 119-58 127 63-121 67Z" fill={`url(#${id}-glass)`} stroke={accent} strokeOpacity=".18" />
    <g fill={dark} stroke={edge} strokeWidth="1.5"><ellipse cx="144" cy="226" rx="19" ry="26" transform="rotate(-27 144 226)" /><ellipse cx="302" cy="232" rx="19" ry="26" transform="rotate(27 302 232)" /><ellipse cx="205" cy="256" rx="19" ry="26" transform="rotate(-27 205 256)" /></g>
    <g fill="none" stroke={accent} strokeWidth="2"><ellipse cx="144" cy="226" rx="10" ry="16" transform="rotate(-27 144 226)" /><ellipse cx="302" cy="232" rx="10" ry="16" transform="rotate(27 302 232)" /><ellipse cx="205" cy="256" rx="10" ry="16" transform="rotate(-27 205 256)" /></g>
    <path d="m126 196 106-51 105 52-107 56Z" fill={`url(#${id}-metal)`} stroke={ink} />
    <path d="m126 196 104 57v19l-104-56Zm104 57 107-56v19l-107 56Z" fill={dark} stroke={edge} />
    <path d="m139 197 93-45 91 45-93 49Z" fill="none" stroke={accent} strokeWidth="1.2" /><path d="m148 213 68 36m29 0 55-29" stroke={secondary} strokeWidth="2" />
    <ellipse cx="237" cy="187" rx="30" ry="16" fill={dark} stroke={edge} /><path d="M207 187v-12a30 15 0 0 1 60 0v12" fill={`url(#${id}-metal)`} stroke={edge} /><ellipse cx="237" cy="175" rx="30" ry="15" fill={`url(#${id}-glass)`} stroke={accent} />
    <path d="m225 175 4-64 18-4 3 67-11 8Z" fill={`url(#${id}-metal)`} stroke={ink} /><path d="m234 168 2-49" stroke={accent} strokeWidth="3" />
    <path d="m232 120-58-30 9-17 64 30Z" fill={`url(#${id}-metal)`} stroke={ink} /><path d="m231 110-45-23" stroke={secondary} strokeWidth="3" />
    <path d="m171 82-31 47 12 9 36-43Z" fill={`url(#${id}-metal)`} stroke={ink} /><path d="m176 91-26 38" stroke={accent} strokeWidth="2" />
    <g stroke={ink}><circle cx="239" cy="112" r="12" fill={dark} /><circle cx="239" cy="112" r="6" fill={accent} /><circle cx="179" cy="86" r="12" fill={dark} /><circle cx="179" cy="86" r="5" fill={secondary} /><circle cx="147" cy="133" r="8" fill={dark} /></g>
    <path d="m144 137-15 9v18l9 4m13-29 8 14-5 16-9 3" fill="none" stroke={ink} strokeWidth="5" /><path d="m144 137-15 9m22-7 8 14" stroke={accent} strokeWidth="1.5" />
    <path d="m109 168 24-13 23 13-24 14Z" fill={`url(#${id}-glass)`} stroke={secondary} /><path d="m109 168 23 14v24l-23-14Zm23 14 24-14v24l-24 14Z" fill={secondary} fillOpacity=".12" stroke={secondary} strokeOpacity=".65" />
    <g transform="translate(299 183)"><path d="M-12 0v-16l20-9 13 8v16L1 9Z" fill={`url(#${id}-metal)`} stroke={edge} /><ellipse cx="7" cy="-9" rx="6" ry="8" fill={dark} stroke={accent} /><ellipse cx="7" cy="-9" rx="3" ry="4" fill={accent} filter={`url(#${id}-glow)`} /></g>
    <path d="M318 160q28-37 66-39M326 166q26-25 60-26M333 174q22-14 50-13" fill="none" stroke={accent} strokeWidth="1" strokeOpacity=".5" />
    <g fill={secondary} opacity=".8"><circle cx="350" cy="129" r="2" /><circle cx="378" cy="138" r="2" /><circle cx="365" cy="164" r="2" /></g>
    {!miniature && <g className="discipline-art__annotations"><path d="M178 69V45h51" fill="none" stroke={accent} strokeWidth=".8" /><text x="237" y="48" fill={ink} fontSize="8.5" letterSpacing="1.2">SENSE · PLAN · ACT</text><Dimension x1={137} y1={291} x2={323} y2={291} label="AUTONOMOUS EXPLORATION" id={id} /><Target x={133} y={169} size={25} /></g>}
  </g>;
}

function Biomedical({ id, miniature }: SceneProps) {
  const rung = (i: number) => { const y = 78 + i * 12; const wave = Math.sin(i * Math.PI / 6); return { y, left: 325 + wave * 28, right: 325 - wave * 28 }; };
  return <g>
    <ellipse cx="224" cy="267" rx="147" ry="28" fill={`url(#${id}-shadow)`} />
    <path d="M79 210 165 161 262 213 176 265Z" fill={`url(#${id}-glass)`} stroke={accent} strokeOpacity=".3" />
    <path d="m86 181 79-45 91 48-80 48Z" fill={`url(#${id}-metal)`} stroke={edge} /><path d="m86 181 90 51v19l-90-52Zm90 51 80-48v19l-80 48Z" fill={dark} stroke={edge} />
    <g stroke={accent} strokeWidth="1" opacity=".7">
      {Array.from({ length: 7 }, (_, i) => <g key={i}><path d={`m${94 + i * 12} ${177 - i * 6.8} 76 42`} /><path d={`m${98 + i * 13} ${188 + i * 7.2} 64-36`} /></g>)}
    </g>
    {Array.from({ length: 5 }, (_, row) => Array.from({ length: 5 }, (_, col) => <g key={`${row}-${col}`}><path d={`M${112 + col * 14 + row * 15} ${181 - col * 8 + row * 8}v-14`} stroke={edge} strokeWidth="1" /><circle cx={112 + col * 14 + row * 15} cy={167 - col * 8 + row * 8} r={3 + ((row + col) % 2)} fill={row % 2 ? secondary : accent} fillOpacity=".45" stroke={accent} strokeOpacity=".6" /></g>))}
    <g transform="translate(143 145)"><circle r="31" fill={`url(#${id}-cell)`} stroke={accent} strokeWidth="1.2" /><ellipse rx="25" ry="13" transform="rotate(-32)" fill="none" stroke={ink} strokeOpacity=".5" /><circle cx="4" cy="-3" r="10" fill={secondary} fillOpacity=".35" stroke={secondary} strokeOpacity=".8" /><circle cx="-12" cy="-11" r="3" fill={accent} opacity=".8" /><circle cx="12" cy="13" r="4" fill={accent} opacity=".45" /><path d="M-17-20a27 27 0 0 1 29-3" fill="none" stroke={ink} strokeOpacity=".75" /></g>
    <g transform="translate(95 53)"><rect width="158" height="61" rx="7" fill={`url(#${id}-glass)`} stroke={edge} /><path d="M12 15h134M12 30h134M12 45h134M29 8v45M55 8v45M81 8v45M107 8v45M133 8v45" stroke={edge} strokeWidth=".5" opacity=".25" /><path d="M11 36h20l7-7 7 9h10l6-24 8 38 9-22 8 6h14l5-6 7 6h33" fill="none" stroke={accent} strokeWidth="1.8" /><circle cx="145" cy="12" r="2" fill={accent} /></g>
    <g strokeWidth="1.5">{Array.from({ length: 15 }, (_, i) => { const r = rung(i); return <g key={i}><path d={`M${r.left} ${r.y}H${r.right}`} stroke={i % 2 ? accent : secondary} strokeOpacity=".65" /><circle cx={r.left} cy={r.y} r="2.3" fill={accent} /><circle cx={r.right} cy={r.y} r="2.3" fill={secondary} /></g>; })}</g>
    <path d="M325 78C363 95 363 133 325 150S287 204 325 222 363 258 325 276" fill="none" stroke={accent} strokeWidth="4" /><path d="M325 78C287 95 287 133 325 150S363 204 325 222 287 258 325 276" fill="none" stroke={secondary} strokeWidth="4" />
    <path d="M325 78v198" stroke={edge} strokeDasharray="3 6" strokeWidth=".6" opacity=".45" />
    {!miniature && <g className="discipline-art__annotations"><Dimension x1={90} y1={280} x2={259} y2={280} label="STRUCTURE × BIOLOGY" id={id} /><path d="M359 140h27v-25" fill="none" stroke={accent} strokeWidth=".8" /><text x="285" y="55" fill={ink} fontSize="8.5" letterSpacing="1.2">ENGINEERED FOR LIFE</text><Target x={143} y={145} size={39} /></g>}
  </g>;
}

function SolarPanel({ x, y, id }: { x: number; y: number; id: string }) {
  return <g transform={`translate(${x} ${y})`}><path d="M8 13v13m36-7v13" stroke={edge} strokeWidth="2" /><path d="M0 4 27-12 57 4 30 21Z" fill={`url(#${id}-solar)`} stroke={ink} strokeWidth=".8" /><path d="m9-1 30 16m-21-21 30 16M10 10 37-6M20 15 47-1" stroke={accent} strokeOpacity=".7" strokeWidth=".6" /><path d="m0 4 30 17 27-17" stroke={secondary} strokeOpacity=".8" strokeWidth="1.2" /></g>;
}
function WindTurbine({ x, y, scale = 1, id }: { x: number; y: number; scale?: number; id: string }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><ellipse cy="94" rx="19" ry="7" fill={dark} opacity=".3" /><path d="M-3 0-6 91q6 6 12 0L3 0" fill={`url(#${id}-metal)`} stroke={edge} strokeWidth=".8" />{[-18, 102, 222].map(angle => <path key={angle} transform={`rotate(${angle})`} d="M-2-2-6-42-1-58 3-12 8-1Z" fill={`url(#${id}-blade)`} stroke={ink} strokeWidth=".7" />)}<circle r="7" fill={dark} stroke={accent} /><circle r="3" fill={accent} /><path d="M-15 2a15 15 0 0 1 21-16" stroke={secondary} fill="none" strokeWidth="1" strokeDasharray="2 3" /></g>;
}
function Green({ id, miniature }: SceneProps) {
  return <g>
    <ellipse cx="237" cy="270" rx="160" ry="31" fill={`url(#${id}-shadow)`} />
    <path d="M64 215 232 134 399 216 229 298Z" fill={`url(#${id}-land)`} stroke={accent} strokeOpacity=".6" />
    <path d="m64 215 165 83 170-82v12l-170 83-165-84Z" fill={dark} stroke={edge} strokeOpacity=".6" />
    <path d="M198 158q39-37 65-11t49 16q34 2 61 39l-102 51-105-57Z" fill={secondary} fillOpacity=".12" />
    <path d="M98 216c36 4 40 42 92 42s53-49 105-43 41 16 69 14" stroke={accent} fill="none" strokeWidth="2.2" strokeOpacity=".55" />
    <path d="M88 224c38 6 47 43 98 43s57-46 100-43 48 18 65 14" stroke={accent} fill="none" strokeWidth=".7" strokeOpacity=".3" />
    <SolarPanel x={101} y={205} id={id} /><SolarPanel x={134} y={186} id={id} /><SolarPanel x={159} y={235} id={id} /><SolarPanel x={192} y={216} id={id} />
    <WindTurbine x={244} y={115} scale={.72} id={id} /><WindTurbine x={317} y={88} scale={1} id={id} />
    <g transform="translate(300 239)"><path d="m-13-5 25-13 16 8-25 14Z" fill={`url(#${id}-metal)`} stroke={edge} /><path d="m-13-5 16 9v27l-16-9Zm16 9 25-14v27L3 31Z" fill={dark} stroke={edge} /><path d="m8 11 12-7v12l-12 7Z" fill={accent} opacity=".6" /><path d="m13 8-3 8 6-3-3 9" stroke={dark} fill="none" /></g>
    <g fill="none" stroke={accent} strokeOpacity=".5" strokeWidth="1.1"><path d="M72 112h39q12 0 12-9t-15-4M54 128h64q17 0 17 11t-20 5M84 144h20" /><circle cx="381" cy="67" r="15" stroke={secondary} /><path d="M381 45v-6m0 50v6m-22-28h-6m50 0h6m-44-16-4-4m36 36 4 4m-36-4-4 4m36-36 4-4" stroke={secondary} /></g>
    {!miniature && <g className="discipline-art__annotations"><text x="61" y="74" fill={ink} fontSize="8.5" letterSpacing="1.4">CLEAN ENERGY SYSTEMS</text><path d="M62 84h116v25" fill="none" stroke={accent} strokeWidth=".8" /><Dimension x1={114} y1={298} x2={298} y2={298} label="CAPTURE · STORE · REGENERATE" id={id} /></g>}
  </g>;
}

function AllDisciplines({ id }: SceneProps) {
  const orbit = [[79, 130], [225, 73], [368, 127], [364, 235], [224, 283], [84, 236]];
  return <g>
    <path d="M79 130 225 73 368 127 364 235 224 283 84 236Z" fill="none" stroke={accent} strokeOpacity=".25" strokeDasharray="3 6" />
    <path d="M79 130 225 167 368 127M225 73v94l139 68M224 283l1-116L84 236" stroke={edge} strokeOpacity=".2" fill="none" />
    <g transform="translate(6 60) scale(.29)"><Mechanical id={id} miniature /></g>
    <g transform="translate(160 2) scale(.29)"><Civil id={id} miniature /></g>
    <g transform="translate(298 59) scale(.29)"><Electrical id={id} miniature /></g>
    <g transform="translate(295 165) scale(.29)"><Robotics id={id} miniature /></g>
    <g transform="translate(158 213) scale(.29)"><Green id={id} miniature /></g>
    <g transform="translate(10 168) scale(.29)"><Biomedical id={id} miniature /></g>
    <ellipse cx="226" cy="214" rx="56" ry="16" fill={`url(#${id}-shadow)`} />
    <path d="m165 167 61-34 61 34-61 36Z" fill={`url(#${id}-glass)`} stroke={accent} strokeWidth="1.2" /><path d="m165 167 61 36v17l-61-35Zm61 36 61-36v17l-61 36Z" fill={dark} stroke={edge} />
    <path d="m191 145 35-20 35 20-35 21Z" fill={`url(#${id}-metal)`} stroke={ink} /><path d="m191 145 35 21v36l-35-20Zm35 21 35-21v36l-35 21Z" fill={`url(#${id}-glass)`} stroke={accent} />
    <path d="m203 145 23-13 23 13-23 14Z" fill={accent} fillOpacity=".15" /><path d="m226 125v-20m-35 40-17-10m87 10 17-10" stroke={secondary} strokeWidth="1" strokeDasharray="3 4" />
    <Target x={226} y={145} size={11} />
    {orbit.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill={i % 2 ? secondary : accent} opacity=".7" />)}
    <g className="discipline-art__annotations" fill={ink} fontSize="8" letterSpacing="1.25"><text x="225" y="33" textAnchor="middle">SIX WAYS TO SHAPE WHAT’S NEXT</text><text x="226" y="246" textAnchor="middle">ONE CURIOUS MIND</text></g>
  </g>;
}

export default function DisciplineArt({ field = "all", variant = "hero", decorative = true, title, className = "", style }: DisciplineArtProps) {
  const unique = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const id = `engi-art-${unique}`;
  const fieldName = Object.prototype.hasOwnProperty.call(names, field) ? field : "all";
  const card = variant === "card";
  const scenes = { all: AllDisciplines, mechanical: Mechanical, civil: Civil, electrical: Electrical, robotics: Robotics, biomedical: Biomedical, green: Green };
  const Scene = scenes[fieldName];
  return <svg xmlns="http://www.w3.org/2000/svg" className={`discipline-art discipline-art--${fieldName} discipline-art--${variant} ${className}`} data-discipline={fieldName} width={card ? 320 : 450} height={card ? 140 : 320} viewBox={card ? "0 44 450 197" : "0 0 450 320"} fill="none" role={decorative ? undefined : "img"} aria-hidden={decorative ? true : undefined} aria-labelledby={decorative ? undefined : `${id}-title ${id}-description`} focusable="false" style={{ display: "block", maxWidth: "100%", overflow: "hidden", ...style }}>
    {!decorative && <><title id={`${id}-title`}>{title || names[fieldName]}</title><desc id={`${id}-description`}>Decorative engineering concept illustration with isometric geometry, technical construction lines, and illuminated details. It is an illustration, not a simulation or a measured engineering drawing.</desc></>}
    <defs>
      <linearGradient id={`${id}-metal`} x1="0" y1="0" x2=".8" y2="1"><stop stopColor="var(--art-metal-light, #516d83)" /><stop offset=".45" stopColor="var(--art-metal, #284359)" /><stop offset="1" stopColor="var(--art-metal-dark, #132b3d)" /></linearGradient>
      <linearGradient id={`${id}-blade`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--art-blade, #bad4df)" /><stop offset=".5" stopColor={accent} stopOpacity=".65" /><stop offset="1" stopColor="var(--art-metal, #284359)" /></linearGradient>
      <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={accent} stopOpacity=".14" /><stop offset="1" stopColor={secondary} stopOpacity=".035" /></linearGradient>
      <linearGradient id={`${id}-board`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--art-board, #123a43)" /><stop offset="1" stopColor={dark} /></linearGradient>
      <linearGradient id={`${id}-solar`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--art-solar, #153d60)" /><stop offset="1" stopColor={dark} /></linearGradient>
      <linearGradient id={`${id}-water`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={accent} stopOpacity=".09" /><stop offset="1" stopColor={secondary} stopOpacity=".22" /></linearGradient>
      <linearGradient id={`${id}-land`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--art-land, #214d40)" /><stop offset="1" stopColor="var(--art-land-dark, #122f30)" /></linearGradient>
      <radialGradient id={`${id}-shadow`}><stop stopColor="var(--art-shadow, #020b13)" stopOpacity=".42" /><stop offset="1" stopColor="var(--art-shadow, #020b13)" stopOpacity="0" /></radialGradient>
      <radialGradient id={`${id}-cavity`}><stop stopColor={accent} stopOpacity=".14" /><stop offset=".7" stopColor={dark} /><stop offset="1" stopColor={dark} /></radialGradient>
      <radialGradient id={`${id}-hot`}><stop stopColor={secondary} stopOpacity=".8" /><stop offset=".45" stopColor={secondary} stopOpacity=".2" /><stop offset="1" stopColor={dark} /></radialGradient>
      <radialGradient id={`${id}-cell`} cx=".3" cy=".25"><stop stopColor="var(--art-cell-light, #b1eeeb)" stopOpacity=".8" /><stop offset=".45" stopColor={accent} stopOpacity=".35" /><stop offset="1" stopColor={secondary} stopOpacity=".08" /></radialGradient>
      <radialGradient id={`${id}-ambient`}><stop stopColor={accent} stopOpacity=".075" /><stop offset="1" stopColor={accent} stopOpacity="0" /></radialGradient>
      <pattern id={`${id}-grid`} width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="matrix(1 .45 -1 .45 225 60)"><path d="M28 0H0v28" stroke={edge} strokeWidth=".6" strokeOpacity=".14" /></pattern>
      <filter id={`${id}-glow`} x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="3" /></filter>
      <marker id={`${id}-measure`} markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto-start-reverse"><path d="m0 0 4 2-4 2" fill="none" stroke={ink} strokeWidth=".7" /></marker>
    </defs>
    <g aria-hidden="true" strokeLinecap="round" strokeLinejoin="round" fontFamily="ui-monospace, SFMono-Regular, Consolas, monospace">
      <ellipse cx="232" cy="164" rx="210" ry="151" fill={`url(#${id}-ambient)`} />
      <path d="M20 208 231 102 431 208 224 316Z" fill={`url(#${id}-grid)`} />
      <g transform={card ? "translate(45 0) scale(.8)" : undefined}><Scene id={id} /></g>
      {!card && <g fill="none" stroke={edge} strokeWidth=".7" opacity=".3"><path d="M26 63V49h14M424 63V49h-14M26 275v14h14M424 275v14h-14" /><path d="M30 167h9m372 0h9" /></g>}
    </g>
  </svg>;
}
