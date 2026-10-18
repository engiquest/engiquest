'use client';

import { useId, type ReactNode } from 'react';
import { LABS, gateOutput, type LabResult, type Values } from '@/lib/labs';

type Props = { labId: string; values: Values; result: LabResult };
const CYAN = '#54e2d2', BLUE = '#68aaff', AMBER = '#ffc56d', RED = '#ff8299', INK = '#a4b8c9', WHITE = '#e7f2ff';
const clamp = (x: number, low: number, high: number) => Math.max(low, Math.min(high, x));
const point = (x: number, y: number) => `${x.toFixed(2)},${y.toFixed(2)}`;
const linePath = (points: number[][]) => points.map(([x, y], index) => `${index ? 'L' : 'M'}${point(x, y)}`).join(' ');
const text = (x: number, y: number, value: ReactNode, color = INK, size = 15, anchor: 'start' | 'middle' | 'end' = 'start') => <text x={x} y={y} fill={color} fontSize={size} textAnchor={anchor} fontFamily="ui-monospace, SFMono-Regular, Consolas, monospace">{value}</text>;
const degrees = (radians: number) => radians * 180 / Math.PI;
const radians = (angle: number) => angle * Math.PI / 180;
const fmt = (value: number, places = 1) => value.toFixed(places);

function gearPoints(cx: number, cy: number, r: number, teeth: number) {
  return Array.from({ length: teeth * 4 }, (_, i) => {
    const angle = i * Math.PI * 2 / (teeth * 4), radius = r + (i % 4 === 1 || i % 4 === 2 ? 7 : 0);
    return point(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
  }).join(' ');
}

/** Schematics intentionally show the reduced models, not construction drawings or clinical data. */
export function LabVisualization({ labId, result }: Props) {
  const uid = useId().replace(/:/g, ''), marker = `${uid}-arrow`, grid = `${uid}-grid`;
  const n = (key: string) => Number(result.visual[key] ?? 0);
  const s = (key: string) => String(result.visual[key] ?? '');
  const arrow = (x1: number, y1: number, x2: number, y2: number, color = CYAN, dashed = false) => <line key={`${x1}-${y1}-${x2}-${y2}-${color}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2.5} markerEnd={`url(#${marker})`} strokeDasharray={dashed ? '5 5' : undefined} />;
  const plot = (points: number[][], color = CYAN, width = 2.5) => <path d={linePath(points)} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" />;
  const label = LABS.find(lab => lab.id === labId)?.title ?? 'Engineering model';
  let scene: ReactNode = null;

  switch (labId) {
    case 'airfoil-wind-tunnel': {
      const angle = n('angle'), stall = n('stall');
      scene = <>
        {Array.from({ length: 9 }, (_, i) => {
          const y = 60 + i * 25, above = y < 170, deviation = Math.max(0, 70 - Math.abs(y - 170)) * (above ? -0.6 : 0.2);
          return <path key={i} d={`M30 ${y} C150 ${y},210 ${y + deviation},290 ${y + deviation} S490 ${y + (stall ? Math.sin(i * 2) * 22 : deviation * 0.2)},690 ${y}`} fill="none" stroke={above ? BLUE : '#2c6974'} strokeWidth={1.5} strokeDasharray={stall && above ? '8 6' : undefined} opacity={0.8} />;
        })}
        <g transform={`translate(330 174) rotate(${-angle})`}><path d="M-105 0 C-90-39 8-44 139 0 C35 10-64 24-105 0Z" fill="#193b50" stroke={CYAN} strokeWidth={3} /><line x1={-105} y1={0} x2={139} y2={0} stroke={INK} strokeDasharray="5 4" /></g>
        {arrow(342, 170, 342, 170 - clamp(n('lift') / 22, 20, 115), CYAN)}
        {arrow(342, 170, 342 + clamp(n('drag') / 2, 20, 150), 170, AMBER)}
        {text(355, 61, `LIFT ${fmt(n('lift'), 0)} N`, CYAN)}
        {text(490, 196, `DRAG ${fmt(n('drag'), 0)} N`, AMBER)}
        {text(35, 318, `Air ${n('speed')} m/s  •  angle ${angle}°  •  ${stall ? 'STALL: separated-flow approximation' : 'ATTACHED FLOW'}`, stall ? AMBER : INK, 14)}
      </>; break;
    }
    case 'gear-train': {
      const total = n('driver') + n('driven'), r1 = 140 * n('driver') / total, r2 = 140 * n('driven') / total, x1 = 260 - r1, x2 = 270 + r2;
      scene = <>
        <line x1={60} y1={174} x2={660} y2={174} stroke="#304657" strokeDasharray="5 5" />
        {[{ x: x1, r: r1, teeth: n('driver'), color: AMBER, name: 'DRIVER', value: n('rpm') }, { x: x2, r: r2, teeth: n('driven'), color: CYAN, name: 'DRIVEN', value: n('speed') }].map((g, i) => <g key={g.name}>
          <polygon points={gearPoints(g.x, 170, g.r, g.teeth)} fill={i ? '#143f42' : '#473522'} stroke={g.color} strokeWidth={2} />
          <circle cx={g.x} cy={170} r={Math.max(9, g.r * 0.2)} fill="#0b1a28" stroke={g.color} strokeWidth={2} />
          <line x1={g.x} y1={170} x2={g.x + g.r * 0.6} y2={170 + (i ? -15 : 15)} stroke={g.color} strokeWidth={3} />
          {text(g.x, 320, `${g.name}: ${g.teeth} teeth`, g.color, 14, 'middle')}
          {text(g.x, 43, `${fmt(g.value, 0)} rpm ${i ? '↺' : '↻'}`, g.color, 18, 'middle')}
        </g>)}
        {text(570, 130, `${fmt(n('ratio'), 2)}:1`, WHITE, 27, 'middle')}
        {text(570, 157, 'reduction', INK, 14, 'middle')}
        {text(570, 215, `${fmt(n('torque'))} N·m`, CYAN, 20, 'middle')}
      </>; break;
    }
    case 'hydraulic-equalizer': {
      const a = 38 + n('small') * 3, b = 55 + n('large') * 1.6, lift = clamp(n('travel') * 15, 5, 60);
      scene = <>
        <path d={`M${180 - a} 65 V265 H${505 + b} V55 M${180 + a} 65 V222 H${505 - b} V55`} fill="none" stroke={INK} strokeWidth={5} />
        <path d={`M${180 - a + 3} 155 H${180 + a - 3} V225 H${505 - b + 3} V${156 - lift} H${505 + b - 3} V262 H${180 - a + 3}Z`} fill="#126b85" opacity={0.7} />
        <rect x={180 - a} y={148} width={2 * a} height={13} fill={AMBER} /><line x1={180} y1={95} x2={180} y2={148} stroke={AMBER} strokeWidth={9} />
        <rect x={505 - b} y={149 - lift} width={2 * b} height={13} fill={CYAN} /><rect x={467} y={109 - lift} width={76} height={40} rx={6} fill="#2b4352" stroke={CYAN} />
        {text(505, 134 - lift, `${n('load')} N`, WHITE, 14, 'middle')}
        {arrow(180, 58, 180, 104, AMBER)}{arrow(505 + b + 22, 185, 505 + b + 22, 110, CYAN)}
        {text(180, 294, `${n('small')} cm² input`, AMBER, 16, 'middle')}{text(505, 294, `${n('large')} cm² output`, CYAN, 16, 'middle')}
        {text(347, 245, `${fmt(n('pressure'))} kPa throughout`, WHITE, 14, 'middle')}
        {text(360, 330, 'Force multiplication exchanges force for travel', INK, 14, 'middle')}
      </>; break;
    }
    case 'thermal-expansion': {
      const expansion = clamp(n('expansion') * 5, 0, 180), gap = n('gap') * 5;
      scene = <>
        <rect x={82} y={98} width={18} height={148} fill="#314657" />
        <rect x={100} y={145} width={370} height={70} fill="#264458" stroke={BLUE} strokeWidth={2} />
        <rect x={100} y={135} width={370 + expansion} height={90} fill="none" stroke={AMBER} strokeWidth={2} strokeDasharray="6 6" />
        <rect x={470 + gap} y={98} width={18} height={148} fill="#314657" />
        <line x1={100} y1={266} x2={470} y2={266} stroke={INK} />{text(285, 290, `${n('length')} m initial beam`, BLUE, 16, 'middle')}
        {arrow(473, 105, 473 + gap, 105, CYAN)}
        {text(475 + gap / 2, 82, `${fmt(n('gap'))} mm gap`, CYAN, 14, 'middle')}
        {text(285, 181, `ΔT = ${n('temperature')}°C`, WHITE, 22, 'middle')}
        {text(285, 205, `${fmt(n('stress'))} MPa restraint stress`, n('stress') > 50 ? RED : CYAN, 14, 'middle')}
        {text(360, 330, `Dashed outline: ${fmt(n('expansion'), 2)} mm free expansion (exaggerated)`, AMBER, 14, 'middle')}
      </>; break;
    }
    case 'flywheel-storage': {
      const r = 45 + n('radius') * 85;
      scene = <>
        <circle cx={242} cy={172} r={r + 12} fill="none" stroke="#243d4b" strokeWidth={7} />
        <circle cx={242} cy={172} r={r} fill="#173b43" stroke={CYAN} strokeWidth={3} />
        {Array.from({ length: 8 }, (_, i) => <line key={i} x1={242 + 18 * Math.cos(i * Math.PI / 4)} y1={172 + 18 * Math.sin(i * Math.PI / 4)} x2={242 + (r - 10) * Math.cos(i * Math.PI / 4)} y2={172 + (r - 10) * Math.sin(i * Math.PI / 4)} stroke="#477b81" strokeWidth={6} />)}
        <circle cx={242} cy={172} r={15} fill="#0b1a28" stroke={CYAN} strokeWidth={3} />
        {arrow(242, 172, 242 + r, 172, AMBER)}{text(245 + r / 2, 156, `${n('radius')} m`, AMBER, 14, 'middle')}
        {text(500, 118, `${fmt(n('energy'), 2)} Wh`, WHITE, 30, 'middle')}
        {text(500, 148, 'rotational energy', INK, 16, 'middle')}
        <rect x={400} y={188} width={200} height={14} rx={7} fill="#1c3343" /><rect x={400} y={188} width={clamp(n('rim') / 120, 0, 1) * 200} height={14} rx={7} fill={n('rim') > 80 ? RED : CYAN} />
        <line x1={400 + 200 * 80 / 120} y1={180} x2={400 + 200 * 80 / 120} y2={211} stroke={AMBER} />
        {text(500, 240, `${fmt(n('rim'))} m/s rim speed`, INK, 16, 'middle')}
        {text(360, 324, `${n('mass')} kg disk • ${n('rpm')} rpm • no losses modeled`, INK, 14, 'middle')}
      </>; break;
    }
    case 'warren-truss': {
      const high = 245 - n('height') * 20, move = clamp(n('displacement') * 0.7, 0, 40), color = n('stress') > 150 ? RED : CYAN;
      scene = <>
        <line x1={95} y1={260} x2={625} y2={260} stroke="#314657" strokeWidth={2} />
        <path d={`M100 245 L360 ${high} L620 245 Z`} fill="none" stroke="#2b5165" strokeWidth={3} strokeDasharray="7 5" />
        <path d={`M100 245 L360 ${high + move} L620 245 L100 245`} fill="#102c36" fillOpacity={0.5} stroke={color} strokeWidth={4 + n('area') / 250} />
        {[ [100,245], [360,high + move], [620,245] ].map(([x,y],i) => <circle key={i} cx={x} cy={y} r={8} fill="#0b1a28" stroke={WHITE} strokeWidth={2} />)}
        <path d="M85 266L100 246L115 266Z M605 266L620 246L635 266Z" fill={INK} />
        {arrow(360, high - 57, 360, high + move - 13, AMBER)}
        {text(376, high - 34, `${n('load')} kN`, AMBER, 16)}
        {text(210, 180, `${fmt(n('stress'))} MPa`, color, 16, 'middle')}
        {text(530, 180, `${fmt(n('force') / 1000)} kN`, color, 16, 'middle')}
        {text(360, 299, `Span ${n('span')} m · height ${n('height')} m`, INK, 16, 'middle')}
        {text(360, 328, 'Single symmetric Warren panel · movement exaggerated', INK, 14, 'middle')}
      </>; break;
    }
    case 'retaining-wall': {
      const h = n('height') * 31, w = n('width') * 47, top = 275 - h;
      scene = <>
        <path d={`M350 ${top}H665V275H350Z`} fill="#4b3e29" />
        {Array.from({ length: 11 }, (_, i) => <line key={i} x1={360 + i * 28} y1={top + 8} x2={350 + i * 28} y2={275} stroke="#7a6440" strokeWidth={1} />)}
        <rect x={350 - w} y={top} width={w} height={h} fill="#3d5769" stroke={CYAN} strokeWidth={3} />
        <path d={`M350 ${top}L${350 + h * 0.45} 275H350Z`} fill={AMBER} fillOpacity={0.25} stroke={AMBER} />
        {Array.from({ length: 4 }, (_, i) => arrow(360 + (i + 1) * h / 12, top + (i + 1) * h / 5, 353, top + (i + 1) * h / 5, AMBER))}
        {arrow(350 - w / 2, top + 20, 350 - w / 2, top + h - 15, BLUE)}
        <line x1={60} y1={280} x2={665} y2={280} stroke={INK} strokeWidth={4} />
        {arrow(350 - w - 55, 272, 350 - w + 15, 272, CYAN)}
        {text(75, 76, `Sliding factor ${fmt(n('sliding'), 2)}`, n('sliding') < 1.3 ? RED : CYAN, 17)}
        {text(75, 107, `Overturning ${fmt(n('overturn'), 2)}`, n('overturn') < 2 ? AMBER : CYAN, 17)}
        {text(503, top - 15, `${n('height')} m retained soil`, INK, 14, 'middle')}
        {text(360, 325, `Soil thrust ${fmt(n('thrust'))} kN per meter · base ${n('width')} m`, INK, 14, 'middle')}
      </>; break;
    }
    case 'concrete-rebar': {
      const drop = clamp(n('deflection') * 4, 2, 70), depth = 40 + n('depth') / 12;
      scene = <>
        <path d={`M60 113 Q270 ${113 + drop * 2} 480 113 L480 ${113 + depth} Q270 ${113 + depth + drop * 2} 60 ${113 + depth}Z`} fill="#274354" stroke={BLUE} strokeWidth={2} />
        <path d={`M65 ${100 + depth} Q270 ${100 + depth + drop * 2} 475 ${100 + depth}`} fill="none" stroke={AMBER} strokeWidth={4} />
        <path d={`M48 ${depth + 137}L60 ${depth + 116}L72 ${depth + 137}Z M468 ${depth + 137}L480 ${depth + 116}L492 ${depth + 137}Z`} fill={INK} />
        {arrow(270, 54, 270, 108 + drop, RED)}
        {text(286, 78, `${n('load')} kN`, RED, 16)}
        <rect x={545} y={90} width={110} height={130} fill="#274354" stroke={BLUE} strokeWidth={2} />
        <rect x={545} y={90} width={110} height={clamp(n('block') / n('depth') * 130, 5, 100)} fill={CYAN} fillOpacity={0.25} />
        {Array.from({ length: n('bars') }, (_, i) => <circle key={i} cx={556 + (i + 0.5) * 88 / n('bars')} cy={200} r={4 + n('diameter') / 5} fill={AMBER} />)}
        {text(600, 248, 'CROSS SECTION', INK, 12, 'middle')}
        {text(270, 277, `Deflection ${fmt(n('deflection'), 2)} mm (exaggerated)`, BLUE, 15, 'middle')}
        {text(360, 322, `Bending capacity ${fmt(n('capacity'))} / demand ${fmt(n('demand'))} kN·m`, n('capacity') >= n('demand') ? CYAN : RED, 16, 'middle')}
      </>; break;
    }
    case 'hydrostatic-dam': {
      const h = n('height') * 9 + 35, top = 279 - h, base = n('base') * 16;
      scene = <>
        <rect x={65} y={top} width={275} height={h} fill="#124763" />
        <path d={`M65 ${top}q15 -5 30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0`} fill="none" stroke={BLUE} strokeWidth={2} />
        <path d={`M340 ${top}L${340 + base} 279H340Z`} fill="#3c5764" stroke={CYAN} strokeWidth={3} />
        {Array.from({ length: 5 }, (_, i) => arrow(335 - (i + 1) * 15, top + (i + 1) * h / 6, 337, top + (i + 1) * h / 6, AMBER))}
        <line x1={60} y1={281} x2={660} y2={281} stroke={INK} strokeWidth={4} />
        <circle cx={340 + base} cy={279} r={6} fill={AMBER} />
        {text(184, top - 17, `${n('height')} m water depth`, BLUE, 16, 'middle')}
        {text(200, 245, `${fmt(n('pressure'))} kPa at base`, WHITE, 15, 'middle')}
        {text(542, 85, `Factor ${fmt(n('overturn'), 2)}`, n('overturn') >= 2 ? CYAN : AMBER, 23, 'middle')}
        {text(542, 112, 'against overturning', INK, 14, 'middle')}
        {text(360, 323, `Pressure grows linearly with depth · total thrust ${fmt(n('thrust'))} kN`, INK, 14, 'middle')}
      </>; break;
    }
    case 'earthquake-table': {
      const sway = clamp(n('displacement') * 1.2, 2, 105);
      scene = <>
        <rect x={80} y={264} width={280} height={16} rx={5} fill="#42505e" />
        <path d="M130 260V90H305V260" fill="none" stroke="#344b60" strokeWidth={3} strokeDasharray="5 5" />
        <path d={`M130 260 L${130 + sway} 90 H${305 + sway} L305 260`} fill="#17383f" stroke={CYAN} strokeWidth={4} />
        {[135,180,225].map(y => <line key={y} x1={130 + sway * (260-y)/170} y1={y} x2={305 + sway * (260-y)/170} y2={y} stroke={CYAN} strokeWidth={3} />)}
        <rect x={122 + sway} y={77} width={192} height={18} fill={CYAN} rx={3} />
        {arrow(160, 297, 297, 297, AMBER)}{text(218, 326, `${n('frequency')} Hz shaking`, AMBER, 14, 'middle')}
        {text(532, 92, `${fmt(n('displacement'), 1)} mm`, WHITE, 26, 'middle')}
        {text(532, 120, 'peak relative sway', INK, 14, 'middle')}
        {text(532, 177, `${fmt(n('natural'), 2)} Hz`, CYAN, 22, 'middle')}
        {text(532, 204, 'natural frequency', INK, 14, 'middle')}
        {text(532, 259, `${fmt(n('amplification'), 2)}× acceleration`, n('amplification') > 1.5 ? RED : CYAN, 16, 'middle')}
        {text(360, 37, 'Steady sinusoidal response · sway exaggerated', INK, 14, 'middle')}
      </>; break;
    }
    case 'voltage-divider': {
      const wave = Array.from({ length: 100 }, (_, i) => [440 + i * 2.1, 185 - (n('ac') ? Math.sin(i / 99 * Math.PI * 4) : 1) * n('voltage') * 6]);
      const output = Array.from({ length: 100 }, (_, i) => [440 + i * 2.1, 185 - (n('ac') ? Math.sin(i / 99 * Math.PI * 4) : 1) * n('outputVoltage') * 6]);
      scene = <>
        <path d="M90 100H240V118M240 164V193M240 239V280H90V220M90 158V100" fill="none" stroke={BLUE} strokeWidth={3} />
        <circle cx={90} cy={189} r={31} fill="#193440" stroke={BLUE} strokeWidth={2} />
        {text(90, 197, n('ac') ? '~' : '+', BLUE, 28, 'middle')}
        <path d="M240 118l-9 6 18 9-18 9 18 9-9 13 M240 193l-9 6 18 9-18 9 18 9-9 13" fill="none" stroke={AMBER} strokeWidth={3} />
        <path d="M240 177H347V208M347 245V280H240" fill="none" stroke={CYAN} strokeWidth={2} /><rect x={338} y={208} width={18} height={37} fill="#26414d" stroke={CYAN} />
        <circle cx={240} cy={177} r={5} fill={CYAN} />
        {text(260, 140, `R1 ${n('r1')}Ω`, AMBER, 13)}{text(256, 225, `R2 ${n('r2')}Ω`, AMBER, 13)}
        {text(347, 303, `${n('load')}Ω load`, CYAN, 13, 'middle')}
        {text(50, 73, `${n('voltage')} V ${n('ac') ? 'peak' : 'DC'}`, BLUE, 16)}
        <line x1={435} y1={185} x2={660} y2={185} stroke="#344658" />{plot(wave, BLUE)}{plot(output, CYAN, 3)}
        {text(545, 75, `${fmt(n('outputVoltage'), 2)} V output`, CYAN, 18, 'middle')}
        {text(545, 295, 'Blue: input · mint: output', INK, 13, 'middle')}
      </>; break;
    }
    case 'logic-array': {
      const gate = n('gate');
      scene = <>
        <path d="M175 106H270 M175 230H270 M390 168H475" stroke={CYAN} strokeWidth={3} />
        {[['A',n('a'),106],['B',n('b'),230]].map(([key,value,y]) => <g key={String(key)}><circle cx={143} cy={Number(y)} r={30} fill={value ? '#17493e' : '#293542'} stroke={value ? CYAN : INK} strokeWidth={2} />{text(143,Number(y)+6,`${key}=${value}`,value?CYAN:INK,18,'middle')}</g>)}
        <path d="M269 96H324Q393 98 393 168Q393 235 324 238H269Z" fill="#223c4e" stroke={BLUE} strokeWidth={3} />
        {text(328, 177, ['AND','OR','XOR','NAND'][gate], WHITE, 22, 'middle')}
        <circle cx={470} cy={168} r={18} fill={n('output') ? CYAN : '#304351'} />
        {text(470, 218, `Y=${n('output')}`, n('output') ? CYAN : INK, 18, 'middle')}
        {text(594, 76, 'A  B  Y', WHITE, 17, 'middle')}
        {[[0,0],[0,1],[1,0],[1,1]].map(([a,b],i) => <g key={i}><rect x={545} y={95+i*39} width={100} height={32} rx={5} fill={a===n('a') && b===n('b') ? '#1a554b' : '#1b2b39'} />{text(594,117+i*39,`${a}  ${b}  ${gateOutput(gate,a,b)}`,WHITE,17,'middle')}</g>)}
        {text(360, 318, 'Active input pair highlighted in the complete truth table', INK, 14, 'middle')}
      </>; break;
    }
    case 'rc-filter': {
      const fc = n('cutoff'), highpass = n('highpass');
      const points = Array.from({ length: 150 }, (_, i) => { const f = 10 ** (i / 149 * 4), r = f / fc, gain = (highpass ? r : 1) / Math.sqrt(1 + r*r); return [85+i/149*555, 265-gain*170]; });
      const x = 85 + Math.log10(n('frequency')) / 4 * 555;
      scene = <>
        <line x1={85} y1={72} x2={85} y2={265} stroke={INK} /><line x1={85} y1={265} x2={640} y2={265} stroke={INK} />
        {[0,0.5,1].map(g => <g key={g}><line x1={85} y1={265-g*170} x2={640} y2={265-g*170} stroke="#243a4b" strokeDasharray="3 5" />{text(70,270-g*170,String(g),INK,13,'end')}</g>)}
        {[1,10,100,1000,10000].map((f,i) => <g key={f}>{text(85+i/4*555,290,f>=1000?`${f/1000}k`:String(f),INK,13,'middle')}</g>)}
        {plot(points, CYAN, 3)}<line x1={x} y1={84} x2={x} y2={266} stroke={AMBER} strokeDasharray="5 5" /><circle cx={x} cy={265-n('gain')*170} r={7} fill={AMBER} />
        {text(360, 43, `${highpass ? 'HIGH-PASS' : 'LOW-PASS'} · cutoff ${fmt(fc)} Hz`, CYAN, 18, 'middle')}
        {text(360, 326, `Frequency (Hz, logarithmic) · probe ${n('frequency')} Hz · gain ${fmt(n('gain'),3)}`, INK, 14, 'middle')}
        {text(37, 81, '|H|', INK, 14)}
      </>; break;
    }
    case 'seven-segment': {
      const segments: [string,number,number,number,number][] = [['a',454,71,542,71],['b',550,81,550,159],['c',550,178,550,256],['d',454,266,542,266],['e',445,178,445,256],['f',445,81,445,159],['g',454,168,542,168]];
      scene = <>
        <rect x={60} y={52} width={250} height={238} rx={12} fill="#1d3341" stroke="#496372" />
        {Array.from({length:56},(_,i)=><circle key={i} cx={80+(i%8)*30} cy={77+Math.floor(i/8)*30} r={2.6} fill="#758692" />)}
        <rect x={410} y={44} width={175} height={249} rx={16} fill="#091522" stroke="#325565" />
        {segments.map(([key,x1,y1,x2,y2],i) => <g key={key}>
          <path d={`M${90+(i%2)*30} ${77+i*30} H${318+i*8} V${(y1+y2)/2} H${Math.min(x1,x2)-8}`} fill="none" stroke={n(key)?CYAN:'#3a4856'} strokeWidth={n(key)?2:1} />
          <rect x={170} y={70+i*30} width={37} height={13} rx={3} fill={n(key)?'#99704a':'#454548'} stroke={AMBER} strokeWidth={0.5} />
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={n(key)?CYAN:'#223544'} strokeWidth={12} strokeLinecap="round" />
          {text(key==='b'||key==='c'?577: key==='e'||key==='f'?424:498, (y1+y2)/2+(key==='a'?-13:key==='d'?25:-10), key.toUpperCase(),n(key)?WHITE:INK,13,'middle')}
        </g>)}
        {text(180,324,`${n('resistance')} Ω per segment`,AMBER,14,'middle')}{text(500,324,`${fmt(n('current'),2)} mA per lit LED`,CYAN,14,'middle')}
      </>; break;
    }
    case 'motor-transistor': {
      scene = <>
        <path d="M350 60V108 M350 172V228 M350 272V302H160 M160 302V192H205 M251 192H312" stroke={BLUE} strokeWidth={3} fill="none" />
        <circle cx={350} cy={140} r={33} fill="#234352" stroke={CYAN} strokeWidth={3} />{text(350,149,'M',CYAN,27,'middle')}
        <circle cx={337} cy={249} r={27} fill="#1e3241" stroke={INK} strokeWidth={2} /><path d="M324 228V269 M324 237L350 225 M324 260L350 277" stroke={CYAN} strokeWidth={3} fill="none" />
        <line x1={313} y1={192} x2={313} y2={249} stroke={CYAN} strokeWidth={2}/><line x1={313} y1={249} x2={324} y2={249} stroke={CYAN} strokeWidth={2}/>
        <path d="M205 192l7-9 9 18 9-18 9 18 12-9" stroke={AMBER} strokeWidth={3} fill="none"/>
        <path d="M350 90H452V122 M452 155V193H350" stroke={n('diode')?CYAN:'#74404d'} strokeWidth={2} strokeDasharray={n('diode')?undefined:'4 5'} fill="none"/>
        <path d="M440 144L452 125L464 144Z M438 123H466" fill={n('diode')?'#1f584e':'#4a2833'} stroke={n('diode')?CYAN:RED} strokeWidth={2}/>
        {text(350,43,`${n('supply')} V motor supply`,BLUE,16,'middle')}
        {text(146,152,`${n('logic')} V PWM`,AMBER,16,'middle')}{text(222,225,`${n('base')} Ω`,AMBER,14,'middle')}
        {text(543,136,n('diode')?'Protected':'NO DIODE',n('diode')?CYAN:RED,17,'middle')}
        {text(543,163,'flyback path',INK,13,'middle')}
        {text(543,232,`${fmt(n('current'),3)} A`,WHITE,25,'middle')}
        {text(543,260,`${n('duty')}% duty`,CYAN,17,'middle')}
        {text(360,334,n('saturation')>=1?'Drive is sufficient for modeled saturation':'Base drive limits the modeled motor current',n('saturation')>=1?CYAN:AMBER,14,'middle')}
      </>; break;
    }
    case 'differential-drive': {
      const speed=n('speed'),omega=n('omega'),time=n('time');
      const raw=Array.from({length:101},(_,i)=>{const t=time*i/100;return Math.abs(omega)<1e-8?[speed*t,0]:[speed/omega*Math.sin(omega*t),speed/omega*(1-Math.cos(omega*t))];});
      const extent=Math.max(1,...raw.flatMap(([x,y])=>[Math.abs(x),Math.abs(y)])),scale=180/extent,ox=300,oy=190;
      const path=raw.map(([x,y])=>[ox+x*scale,oy-y*scale]),end=path[path.length-1];
      scene=<>
        <line x1={60} y1={oy} x2={650} y2={oy} stroke="#3b5364"/><line x1={ox} y1={40} x2={ox} y2={300} stroke="#3b5364"/>
        {text(660,oy+4,'x',INK,16)}{text(ox+10,44,'y',INK,16)}
        {plot(path,CYAN,3)}<circle cx={ox} cy={oy} r={5} fill={WHITE}/>
        <g transform={`translate(${end[0]} ${end[1]}) rotate(${-degrees(n('angle'))})`}><rect x={-22} y={-19} width={44} height={38} rx={9} fill="#275553" stroke={CYAN} strokeWidth={2}/><rect x={-15} y={-25} width={26} height={8} rx={2} fill={BLUE}/><rect x={-15} y={17} width={26} height={8} rx={2} fill={AMBER}/><path d="M0-6L15 0L0 6Z" fill={WHITE}/></g>
        {text(83,48,`Left ${n('left')} m/s`,BLUE,15)}{text(83,75,`Right ${n('right')} m/s`,AMBER,15)}
        {text(545,65,`${fmt(degrees(n('angle')))}°`,CYAN,23,'middle')}{text(545,94,'heading change',INK,13,'middle')}
        {text(360,331,`Path after ${time} s · end (${fmt(n('x'),2)}, ${fmt(n('y'),2)}) m`,INK,15,'middle')}
      </>;break;
    }
    case 'pid-line-follower': {
      const trace=JSON.parse(s('trace')||'[]') as number[], peak=Math.max(0.8,...trace.map(Math.abs)),zero=240;
      const points=trace.map((value,i)=>[75+i/(trace.length-1)*575,zero-value/peak*170]);
      scene=<>
        <line x1={75} y1={60} x2={75} y2={280} stroke={INK}/><line x1={75} y1={zero} x2={650} y2={zero} stroke={AMBER} strokeDasharray="5 5"/>
        <rect x={75} y={zero-.05/peak*170} width={575} height={.1/peak*170} fill={CYAN} opacity={.1}/>
        {plot(points,CYAN,3)}
        {[0,2,4,6,8].map((t,i)=><g key={t}><line x1={75+i/4*575} y1={zero} x2={75+i/4*575} y2={zero+7} stroke={INK}/>{text(75+i/4*575,290,`${t}s`,INK,14,'middle')}</g>)}
        {text(58,zero+4,'0',AMBER,13,'end')}{text(60,77,`${fmt(peak,2)}m`,INK,12,'end')}
        {text(360,36,'LINE ERROR OVER THE FULL 8-SECOND RUN',INK,15,'middle')}
        {text(360,329,`Final ${fmt(n('final'),3)}m · overshoot ${fmt(n('overshoot'),3)}m · mean ${fmt(n('mean'),3)}m`,CYAN,14,'middle')}
      </>;break;
    }
    case 'arm-inverse-kinematics': {
      const scale=25,ox=320,oy=275,t1=n('theta1'),t2=n('theta2'),ex=ox+n('l1')*Math.cos(t1)*scale,ey=oy-n('l1')*Math.sin(t1)*scale,hx=ex+n('l2')*Math.cos(t1+t2)*scale,hy=ey-n('l2')*Math.sin(t1+t2)*scale,tx=ox+n('x')*scale,ty=oy-n('y')*scale;
      scene=<>
        <circle cx={ox} cy={oy} r={(n('l1')+n('l2'))*scale} fill="#14393d" opacity={.27} stroke={CYAN} strokeDasharray="6 6"/>
        <circle cx={ox} cy={oy} r={Math.abs(n('l1')-n('l2'))*scale} fill="#0b1a28" stroke="#3a5561" strokeDasharray="4 4"/>
        <line x1={ox} y1={oy} x2={ex} y2={ey} stroke={BLUE} strokeWidth={14} strokeLinecap="round"/><line x1={ex} y1={ey} x2={hx} y2={hy} stroke={CYAN} strokeWidth={11} strokeLinecap="round"/>
        {[[ox,oy],[ex,ey],[hx,hy]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={9} fill="#1d3445" stroke={WHITE} strokeWidth={2}/>)}
        <path d={`M${tx-9} ${ty-9}L${tx+9} ${ty+9}M${tx-9} ${ty+9}L${tx+9} ${ty-9}`} stroke={n('reachable')?AMBER:RED} strokeWidth={3}/>
        {text(tx+13,ty-10,`(${n('x')}, ${n('y')})`,n('reachable')?AMBER:RED,15)}
        {text(65,55,n('reachable')?'TARGET REACHABLE':'TARGET UNREACHABLE',n('reachable')?CYAN:RED,17)}
        {text(65,84,'Shaded disk: outer reach',INK,13)}
        {text(360,331,n('reachable')?`Shoulder ${fmt(degrees(t1))}° · elbow ${fmt(degrees(t2))}° · links ${n('l1')}m + ${n('l2')}m`:'Change link lengths or move the target inside the reachable annulus.',INK,14,'middle')}
      </>;break;
    }
    case 'ultrasonic-map': {
      const ox=138,oy=240,scale=92,x=ox+n('x')*scale,y=oy-n('y')*scale;
      scene=<>
        {[1,2,3,4].map(r=><g key={r}><circle cx={ox} cy={oy} r={r*scale} fill="none" stroke="#2d4859" strokeDasharray="4 5"/>{text(ox+r*scale,oy+21,`${r}m`,INK,12,'middle')}</g>)}
        <line x1={ox} y1={40} x2={ox} y2={280} stroke="#456172"/><line x1={ox} y1={oy} x2={660} y2={oy} stroke="#456172"/>
        <path d={`M${ox} ${oy}L${x} ${y}`} stroke={CYAN} strokeWidth={3}/><path d={`M${x} ${y}L${x} ${oy}L${ox} ${oy}`} fill="none" stroke={AMBER} strokeDasharray="4 4"/>
        <circle cx={x} cy={y} r={10} fill={CYAN}/><rect x={ox-25} y={oy-16} width={32} height={32} rx={5} fill="#224855" stroke={BLUE}/>
        {text(x+15,y-11,`(${fmt(n('x'),2)}, ${fmt(n('y'),2)})m`,CYAN,15)}
        {text(400,42,`ROUND TRIP ${n('echo')} µs`,BLUE,17,'middle')}
        {text(400,70,`Sensor bearing ${n('angle')}° · air ${n('temperature')}°C`,INK,14,'middle')}
        {text(360,329,`Echo travels twice the obstacle range: ${fmt(n('distance'),3)} m`,INK,15,'middle')}
      </>;break;
    }
    case 'finite-state-machine': {
      const nodes=[{x:106,y:125,name:'SEARCH'},{x:284,y:125,name:'FORWARD'},{x:462,y:125,name:'TURN'},{x:640,y:125,name:'STOP'}],trace=s('trace').split(',').map(Number);
      scene=<>
        {nodes.map((node,i)=><g key={node.name}><rect x={node.x-61} y={node.y-28} width={122} height={56} rx={15} fill={n('state')===i?'#1b5448':'#1b3242'} stroke={i===3?AMBER:CYAN} strokeWidth={n('state')===i?3:1}/>{text(node.x,node.y+6,node.name,i===3?AMBER:WHITE,15,'middle')}</g>)}
        {[['clear',n('clear'),CYAN],['obstacle',n('obstacle'),AMBER],['low battery',n('low'),RED]].map(([event,destination,color],i)=>{const node=nodes[Number(destination)];return <g key={String(event)}><path d={`M${112+i*230} 235V${205-i*15}H${node.x}V156`} fill="none" stroke={String(color)} strokeWidth={2} markerEnd={`url(#${marker})`}/>{text(112+i*230,263,String(event),String(color),15,'middle')}</g>;})}
        {text(360,43,'EDITABLE EVENT → STATE TRANSITIONS',INK,16,'middle')}
        {text(360,308,'Test: clear → obstacle → clear → low battery → clear',INK,13,'middle')}
        {text(360,333,trace.map(i=>nodes[i]?.name).join(' → '),CYAN,13,'middle')}
      </>;break;
    }
    case 'synthetic-ecg': {
      const dt=.004,count=1000,interval=60/n('rate'),raw:number[][]=[],filtered:number[][]=[];let prev=0,hp=0,lp=0;
      const rcHigh=1/(2*Math.PI*n('highpass')),alphaHigh=rcHigh/(rcHigh+dt),rcLow=1/(2*Math.PI*n('cutoff')),alphaLow=dt/(rcLow+dt);
      for(let i=0;i<count;i++){const t=i*dt,phase=(t%interval)/interval,gauss=(center:number,width:number)=>Math.exp(-(((phase-center)/width)**2)),clean=.12*gauss(.16,.035)-.13*gauss(.29,.01)+.95*gauss(.32,.013)-.2*gauss(.35,.014)+.24*gauss(.55,.075),sample=clean+.2*Math.sin(2*Math.PI*.3*t)+n('noise')*Math.sin(2*Math.PI*50*t);hp=alphaHigh*(hp+sample-prev);prev=sample;lp+=alphaLow*(hp-lp);raw.push([58+i/(count-1)*600,140-sample*58]);filtered.push([58+i/(count-1)*600,276-lp*58]);}
      scene=<>
        <line x1={55} y1={140} x2={660} y2={140} stroke="#294150"/><line x1={55} y1={276} x2={660} y2={276} stroke="#294150"/>
        {plot(raw,AMBER,1.1)}{plot(filtered,CYAN,2)}
        {text(58,55,'RAW GENERATED SIGNAL',AMBER,15)}{text(58,196,'FILTERED SIGNAL',CYAN,15)}
        {text(654,55,`${n('rate')} synthetic bpm`,INK,14,'end')}
        {text(360,331,'Four seconds of generated data · no patient data or diagnosis',INK,14,'middle')}
      </>;break;
    }
    case 'heart-valve': {
      const opening=n('opening')/100,r=35+n('radius')*5;
      scene=<>
        <path d={`M55 ${174-r}H665 M55 ${174+r}H665`} stroke={BLUE} strokeWidth={5}/><rect x={55} y={174-r+3} width={610} height={r*2-6} fill="#153b4d"/>
        <line x1={348} y1={174-r} x2={348+75*opening} y2={174-r+60*(1-opening)} stroke={CYAN} strokeWidth={9} strokeLinecap="round"/>
        <line x1={348} y1={174+r} x2={348+75*opening} y2={174+r-60*(1-opening)} stroke={CYAN} strokeWidth={9} strokeLinecap="round"/>
        {[130,230,500,595].map(x=>arrow(x-25,174,x+25,174,CYAN))}
        {Array.from({length:16},(_,i)=><circle key={i} cx={75+(i*79)%563} cy={174+Math.sin(i*5)*r*.6} r={3.4} fill={RED} opacity={.7}/>)}
        {n('leak')>0&&arrow(464,174+r+35,410,174+r+35,AMBER,true)}
        {text(360,54,`${n('opening')}% open area · ${2*n('radius')} mm diameter`,CYAN,17,'middle')}
        {text(175,98,`${n('pressure')} mmHg ΔP`,BLUE,16,'middle')}
        {text(520,300,`${n('leak')}% reverse leakage`,AMBER,14,'middle')}
        {text(360,335,`${fmt(n('net'),2)} L/min net forward flow · steady engineering model`,INK,14,'middle')}
      </>;break;
    }
    case 'prosthetic-grip': {
      const force=n('normal'),safe=n('factor')>=1&&force<=20,color=safe?CYAN:AMBER;
      scene=<>
        <rect x={281} y={116} width={160} height={125} rx={24} fill="#463e38" stroke={AMBER} strokeWidth={2}/>
        <path d="M255 291V184Q255 83 304 83H321 M466 291V184Q466 83 417 83H400" fill="none" stroke={BLUE} strokeWidth={20} strokeLinecap="round"/>
        <path d="M266 288V177Q266 98 318 98 M455 288V177Q455 98 402 98" fill="none" stroke={CYAN} strokeWidth={3}/>
        <circle cx={256} cy={220} r={12} fill="#224358" stroke={WHITE}/><circle cx={465} cy={220} r={12} fill="#224358" stroke={WHITE}/>
        {arrow(204,177,279,177,color)}{arrow(517,177,444,177,color)}{arrow(362,242,362,294,AMBER)}
        {text(362,168,`${n('mass')} kg`,WHITE,25,'middle')}{text(362,198,`μ = ${n('friction')}`,INK,16,'middle')}
        {text(140,126,`${fmt(force/2)} N`,color,19,'middle')}{text(582,126,`${fmt(force/2)} N`,color,19,'middle')}
        {text(360,49,`HOLDING FACTOR ${fmt(n('factor'),2)} · tendon ${n('tendon')} N`,color,18,'middle')}
        {text(360,333,'Friction supports the weight · normal force may damage a fragile object',INK,13,'middle')}
      </>;break;
    }
    case 'microfluidic-viscosity': {
      const radius=18+n('radius')*.16;
      scene=<>
        <path d={`M75 ${173-radius}H650 M75 ${173+radius}H650`} stroke={BLUE} strokeWidth={4}/><rect x={75} y={173-radius+2} width={575} height={2*radius-4} fill="#123f4b"/>
        {[-.8,-.4,0,.4,.8].map((offset,i)=>{const y=173+offset*radius,length=(1-offset*offset)*135;return <g key={i}>{arrow(110,y,110+length,y,CYAN)}{arrow(325,y,325+length,y,CYAN)}<line x1={80} y1={y} x2={645} y2={y} stroke={CYAN} opacity={.12}/></g>;})}
        <path d={linePath(Array.from({length:51},(_,i)=>{const y=-1+i/25;return [522+(1-y*y)*92,173+y*radius];}))} fill="none" stroke={AMBER} strokeWidth={2}/>
        {text(360,64,`Radius ${n('radius')} µm · viscosity ${n('viscosity')} mPa·s`,BLUE,17,'middle')}
        {text(365,267,`Length ${n('length')} mm · ΔP ${n('pressure')} kPa`,INK,16,'middle')}
        {text(360,327,`${fmt(n('flow'),2)} µL/min · parabolic laminar velocity profile · Re ${fmt(n('reynolds'),2)}`,CYAN,14,'middle')}
      </>;break;
    }
    case 'tissue-scaffold': {
      const strain=clamp(n('strain'),0,.55),height=175*(1-strain),top=269-height,pore=5+n('porosity')*.105;
      scene=<>
        <rect x={196} y={89} width={210} height={180} fill="none" stroke={BLUE} strokeWidth={2} strokeDasharray="5 5"/>
        <rect x={196} y={top} width={210} height={height} fill="#235a53" stroke={CYAN} strokeWidth={2}/>
        {Array.from({length:35},(_,i)=><ellipse key={i} cx={216+(i%7)*28} cy={top+18+Math.floor(i/7)*(height-35)/4} rx={pore} ry={pore*(1-strain)} fill="#0d222e" stroke="#3a897d" strokeWidth={1}/>)}
        <rect x={183} y={top-15} width={237} height={15} fill={INK}/><rect x={183} y={269} width={237} height={16} fill={INK}/>
        {arrow(301,42,301,top-19,AMBER)}
        {text(345,56,`${n('force')} N`,AMBER,17)}
        {text(548,137,`${n('porosity')}%`,CYAN,32,'middle')}{text(548,166,'pore volume',INK,15,'middle')}
        {text(548,224,`${fmt(n('strain')*100,2)}% strain`,n('strain')>.05?RED:CYAN,19,'middle')}
        {text(360,328,`Effective modulus ${fmt(n('effective'),2)} MPa · pore pattern is schematic`,INK,14,'middle')}
      </>;break;
    }
    case 'solar-orientation': {
      const tilt=n('tilt'),alt=n('altitude'),cx=327,cy=213,sunx=560,suny=70+(75-alt)*1.2;
      scene=<>
        <circle cx={sunx} cy={suny} r={25} fill={AMBER}/>{Array.from({length:10},(_,i)=>{const a=i*Math.PI/5;return <line key={i} x1={sunx+34*Math.cos(a)} y1={suny+34*Math.sin(a)} x2={sunx+44*Math.cos(a)} y2={suny+44*Math.sin(a)} stroke={AMBER} strokeWidth={2}/>;})}
        {[0,1,2].map(i=>arrow(sunx-45-i*18,suny+23+i*17,cx+60-i*44,cy-30+i*8,AMBER))}
        <line x1={cx} y1={cy} x2={cx} y2={290} stroke={INK} strokeWidth={7}/>
        <g transform={`translate(${cx} ${cy}) rotate(${-tilt})`}><rect x={-115} y={-15} width={230} height={30} fill="#1b4b6e" stroke={BLUE} strokeWidth={3}/>{Array.from({length:8},(_,i)=><line key={i} x1={-105+i*30} y1={-14} x2={-105+i*30} y2={14} stroke="#558dac"/>)}{arrow(0,-15,0,-100,CYAN)}</g>
        <line x1={90} y1={295} x2={640} y2={295} stroke="#465c62"/>
        {text(115,69,`${fmt(n('power'),0)} W`,CYAN,30)}{text(115,97,'instantaneous power',INK,14)}
        {text(110,264,`Tilt ${tilt}°`,BLUE,17)}
        {text(360,330,`Incidence ${fmt(n('incidence'),3)} · azimuth offset ${n('azimuth')}° · ${n('area')}m²`,INK,14,'middle')}
      </>;break;
    }
    case 'wind-pitch': {
      const cx=330,cy=150,r=50+n('radius')*12;
      scene=<>
        <path d={`M${cx-10} 155L${cx-20} 294H${cx+20}L${cx+10} 155Z`} fill="#294857" stroke={BLUE}/>
        <circle cx={cx} cy={cy} r={r+12} fill="none" stroke="#335467" strokeDasharray="5 7"/>
        {[0,120,240].map(a=><g key={a} transform={`translate(${cx} ${cy}) rotate(${a+n('pitch')})`}><path d={`M0 0Q-16 ${-r*.5} 1 ${-r}Q18 ${-r*.55} 10 -5Z`} fill="#276766" stroke={CYAN} strokeWidth={2}/></g>)}
        <circle cx={cx} cy={cy} r={15} fill={CYAN}/>
        {[95,150,205].map(y=>arrow(58,y,165,y,BLUE))}
        {text(117,251,`${n('wind')} m/s wind`,BLUE,14,'middle')}
        {text(551,96,`${fmt(n('power'),0)} W`,WHITE,29,'middle')}
        {text(551,124,'electric power',INK,14,'middle')}
        {text(551,191,`Cp ${fmt(n('cp'),3)}`,CYAN,23,'middle')}
        {text(551,224,`Tip ratio ${fmt(n('tip'),2)}`,INK,15,'middle')}
        {text(360,332,`Pitch ${n('pitch')}° · rotor ${n('rpm')} rpm · illustrative turbine performance curve`,INK,13,'middle')}
      </>;break;
    }
    case 'water-filtration': {
      const layerScale=5,gravel=n('gravel')*layerScale,sand=n('sand')*layerScale,carbon=n('carbon')*layerScale,bottom=275,carbonY=bottom-carbon,sandY=carbonY-sand,gravelY=sandY-gravel;
      scene=<>
        <path d="M233 65V275Q233 298 307 307V324H332V307Q408 298 408 275V65" fill="#122e3d" stroke={BLUE} strokeWidth={3}/>
        <rect x={236} y={carbonY} width={169} height={carbon} fill="#303c4a"/><rect x={236} y={sandY} width={169} height={sand} fill="#967441"/><rect x={236} y={gravelY} width={169} height={gravel} fill="#758276"/>
        {n('gravel')>0&&Array.from({length:20},(_,i)=><circle key={i} cx={245+(i*37)%150} cy={gravelY+4+(i*11)%Math.max(gravel-8,1)} r={3.5} fill="#b2b5a2"/>)}
        <rect x={236} y={65} width={169} height={Math.max(0,gravelY-65)} fill="#6c603b" opacity={.45}/>
        {text(429,gravelY+Math.max(gravel/2,0),`${n('gravel')} cm gravel`,INK,14)}{text(429,sandY+Math.max(sand/2,0),`${n('sand')} cm sand`,AMBER,14)}{text(429,carbonY+Math.max(carbon/2,0),`${n('carbon')} cm carbon`,INK,14)}
        {arrow(320,29,320,72,BLUE)}
        {text(108,107,`${fmt(n('removal'),1)}%`,CYAN,27,'middle')}{text(108,133,'particles removed',INK,12,'middle')}
        {text(109,214,`${fmt(n('flow'),1)}`,BLUE,25,'middle')}{text(109,241,'mL/min',INK,14,'middle')}
        {text(526,326,'NEVER DRINK THIS WATER',RED,15,'middle')}
      </>;break;
    }
    case 'hydroelectric-flow': {
      scene=<>
        <path d="M52 92H206V259H659" stroke={BLUE} strokeWidth={4} fill="none"/><path d="M52 98H198V271H659V302H52Z" fill="#103f55"/>
        <path d="M133 103H301V230H437" fill="none" stroke="#345964" strokeWidth={24}/><path d="M133 103H301V230H437" fill="none" stroke={CYAN} strokeWidth={12}/>
        <circle cx={444} cy={230} r={42} fill="#21414c" stroke={CYAN} strokeWidth={3}/>
        {Array.from({length:8},(_,i)=>{const a=i*Math.PI/4;return <path key={i} d={`M444 230L${444+34*Math.cos(a)} ${230+34*Math.sin(a)}L${444+18*Math.cos(a+.4)} ${230+18*Math.sin(a+.4)}Z`} fill={BLUE}/>;})}
        <path d="M484 230H537" stroke={AMBER} strokeWidth={5}/><rect x={539} y={198} width={86} height={62} rx={12} fill="#31413d" stroke={AMBER}/>{text(582,237,'GEN',AMBER,19,'middle')}
        {arrow(92,135,92,238,BLUE)}{text(75,187,`${n('head')}m`,BLUE,15,'end')}
        {text(355,53,`${fmt(n('power'),2)} kW electrical output`,CYAN,23,'middle')}
        {text(350,87,`Diversion ${n('flow')} m³/s · net head ${fmt(n('netHead'))}m`,INK,14,'middle')}
        {text(360,334,`River flow left downstream: ${fmt(n('remaining'),2)} m³/s`,BLUE,16,'middle')}
      </>;break;
    }
    case 'geothermal-heat-pump': {
      scene=<>
        <path d="M62 277H653V333H62Z" fill="#353c30"/><line x1={62} y1={277} x2={653} y2={277} stroke="#77795e" strokeWidth={2}/>
        <path d="M139 222V300Q139 320 163 320H263Q286 320 286 300V222" fill="none" stroke={BLUE} strokeWidth={9}/>
        <rect x={113} y={156} width={197} height={73} rx={13} fill="#213e4b" stroke={CYAN} strokeWidth={2}/>{text(213,186,'HEAT PUMP',CYAN,18,'middle')}{text(213,213,`COP ${fmt(n('cop'),2)}`,WHITE,20,'middle')}
        <path d="M452 134L543 69L634 134V252H452Z" fill="#263b43" stroke={AMBER} strokeWidth={2}/><rect x={517} y={192} width={47} height={60} fill="#112330" stroke={INK}/>
        {arrow(310,188,450,188,AMBER)}
        {arrow(214,82,214,151,CYAN)}
        {text(214,58,`${n('power')} kW electricity`,CYAN,16,'middle')}
        {text(383,163,`${fmt(n('heat'),1)} kW heat`,AMBER,14,'middle')}
        {text(544,167,`${n('indoor')}°C inside`,AMBER,16,'middle')}
        {text(483,302,`Ground ${n('ground')}°C`,BLUE,16,'middle')}
        {text(483,327,`${fmt(n('groundHeat'),1)} kW extracted`,INK,14,'middle')}
      </>;break;
    }
  }

  return <svg viewBox="0 0 720 360" role="img" aria-labelledby={`${uid}-title ${uid}-description`} style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 16, overflow: 'hidden' }}>
    <title id={`${uid}-title`}>{`${label}: live model visualization`}</title>
    <desc id={`${uid}-description`}>{`${result.outputs.map(output => `${output.label}: ${output.value} ${output.unit}`).join('. ')}. Schematic teaching model; dimensions may be exaggerated. Numerical results and assumptions are also provided as text.`}</desc>
    <defs>
      <pattern id={grid} width={24} height={24} patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#2c4354" strokeWidth={0.5} opacity={0.35}/></pattern>
      <marker id={marker} viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="context-stroke"/></marker>
    </defs>
    <rect width={720} height={360} fill="#0b1a28"/><rect width={720} height={360} fill={`url(#${grid})`}/>
    {scene}
  </svg>;
}

export default LabVisualization;

