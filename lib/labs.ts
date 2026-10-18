/** Educational, deterministic engineering models. Never use these reduced models for construction or clinical decisions. */
export type FieldId = 'mechanical' | 'civil' | 'electrical' | 'robotics' | 'biomedical' | 'green';
export type Values = Record<string, number>;
export type LabControl = { key: string; label: string; min: number; max: number; step: number; unit: string; initial: number; kind?: 'range' | 'toggle' | 'select'; options?: string[] };
export type LabLevel = { name: string; objective: string; target: string; steps: string[]; solution: Values };
export type Lab = { id: string; title: string; field: FieldId; summary: string; controls: LabControl[]; levels: LabLevel[]; assumptions: string[]; equations: string[]; safety?: string; source: { title: string; url: string } };
export type LabResult = { outputs: { label: string; value: number | string; unit: string }[]; score: number; passed: boolean; feedback: string[]; visual: Record<string, number | string> };

const PHYSICS = { title: 'OpenStax: University Physics', url: 'https://openstax.org/details/books/university-physics-volume-1' };
const CIRCUITS = { title: 'OpenStax: University Physics, electricity', url: 'https://openstax.org/details/books/university-physics-volume-2' };
const NASA = { title: 'NASA Glenn: Lift equation', url: 'https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/lift-equation/' };
const FLUID = { title: 'OpenStax: Viscosity and turbulence', url: 'https://openstax.org/books/university-physics-volume-1/pages/14-7-viscosity-and-turbulence' };
const c = (key: string, label: string, min: number, max: number, step: number, unit: string, initial: number): LabControl => ({ key, label, min, max, step, unit, initial });
const choice = (key: string, label: string, options: string[], initial = 0): LabControl => ({ key, label, min: 0, max: options.length - 1, step: 1, unit: '', initial, kind: 'select', options });
const toggle = (key: string, label: string, initial = 0): LabControl => ({ key, label, min: 0, max: 1, step: 1, unit: '', initial, kind: 'toggle' });
const levels = (items: [string, Values][], steps: string[]): LabLevel[] => items.map(([target, solution], i) => ({ name: ['Fundamentals', 'Optimization', 'Advanced Challenge'][i], objective: target, target, steps, solution }));
const lab = (id: string, title: string, field: FieldId, summary: string, controls: LabControl[], items: [string, Values][], steps: string[], assumptions: string[], equations: string[], source = PHYSICS, safety?: string): Lab => ({ id, title, field, summary, controls, levels: levels(items, steps), assumptions, equations, source, safety });

export const LABS: Lab[] = [
  lab('airfoil-wind-tunnel', 'Airfoil Wind Tunnel', 'mechanical', 'Balance lift, drag, and stall in a virtual wind tunnel.', [c('angle', 'Angle of attack', 0, 22, 1, '°', 3), c('speed', 'Air speed', 10, 60, 1, 'm/s', 20), c('area', 'Wing area', 0.5, 4, 0.1, 'm²', 1)], [
    ['Generate at least 250 N of lift without stalling (angle ≤ 14°).', { angle: 6, speed: 25, area: 1 }],
    ['Generate at least 700 N lift with lift-to-drag ratio ≥ 8 and no stall.', { angle: 8, speed: 30, area: 2 }],
    ['Generate at least 1,800 N lift, keep drag ≤ 150 N and speed ≤ 35 m/s, with no stall.', { angle: 8, speed: 35, area: 2.8 }],
  ], ['Start at a small angle and observe the lift arrow.', 'Double speed while holding area fixed. Notice the squared effect.', 'Explore angles above 14° to see the assumed stall response.', 'Meet the displayed target, then run the check.'], ['Steady incompressible air at density 1.225 kg/m³.', 'Lift coefficient is 2π × angle in radians until 14°; a deliberately simplified falloff models stall after 14°.', 'Drag coefficient = 0.025 + 0.06 CL², with an extra stalled-flow penalty. This is not a specific aircraft.'], ['Lift = ½ρv²A CL', 'Drag = ½ρv²A CD'], NASA),
  lab('gear-train', 'Gear Train Ratio & Torque', 'mechanical', 'Trade rotational speed for torque with two meshing gears.', [c('driver', 'Driver teeth', 10, 60, 1, 'teeth', 20), c('driven', 'Driven teeth', 10, 120, 1, 'teeth', 30), c('rpm', 'Input speed', 60, 600, 10, 'rpm', 240), c('torque', 'Input torque', 1, 10, 0.5, 'N·m', 3)], [
    ['Build a 2:1 reduction (ratio within 0.1 of 2).', { driver: 20, driven: 40, rpm: 240, torque: 3 }],
    ['Deliver at least 12 N·m torque while output speed stays ≥ 60 rpm.', { driver: 20, driven: 80, rpm: 300, torque: 4 }],
    ['Deliver at least 25 N·m and 80 rpm using no more than 350 W input power.', { driver: 20, driven: 100, rpm: 500, torque: 6 }],
  ], ['Count the driver and driven teeth.', 'Increase the driven gear and compare speed with torque.', 'Check input power: torque and speed together cost energy.', 'Find a ratio satisfying all conditions.'], ['Two ideal external spur gears; shafts are rigid.', 'Constant 95% torque-transfer efficiency, no backlash or changing friction.', 'Output rotates in the opposite direction to the input.'], ['Ratio = driven teeth / driver teeth', 'Output rpm = input rpm / ratio', 'Output torque = input torque × ratio × 0.95', 'Power = torque × 2π × rpm / 60']),
  lab('hydraulic-equalizer', 'Hydraulic Pressure Equalizer', 'mechanical', 'Use equal fluid pressure to lift a load with unequal piston areas.', [c('small', 'Input piston area', 1, 10, 0.5, 'cm²', 5), c('large', 'Output piston area', 5, 50, 1, 'cm²', 10), c('force', 'Input force', 5, 100, 1, 'N', 20), c('load', 'Load weight', 100, 1000, 10, 'N', 150)], [
    ['Produce enough output force to lift the selected load.', { small: 2, large: 20, force: 20, load: 150 }],
    ['Lift at least 250 N while keeping pressure ≤ 500 kPa.', { small: 2, large: 20, force: 30, load: 250 }],
    ['Lift at least 500 N using ≤ 40 N input force and ≤ 500 kPa pressure.', { small: 2, large: 40, force: 30, load: 500 }],
  ], ['Compare the two piston areas.', 'Press the small piston by increasing input force.', 'Observe that increasing force multiplication reduces output travel.', 'Choose a load and check that output force exceeds it.'], ['Incompressible fluid; friction, leaks, and pipe height differences ignored.', 'Input piston stroke is fixed at 10 cm; output displacement follows volume conservation.'], ['Pressure = input force / input area', 'Output force = pressure × output area', 'Output travel = 10 cm × input area / output area']),
  lab('thermal-expansion', 'Thermal Expansion Stress', 'mechanical', 'Leave room for a heated beam to expand before stress builds.', [choice('material', 'Material', ['Steel', 'Aluminum', 'Glass']), c('length', 'Original length', 0.5, 10, 0.5, 'm', 3), c('temperature', 'Temperature rise', 10, 100, 5, '°C', 40), c('gap', 'Expansion gap', 0, 20, 0.5, 'mm', 0)], [
    ['Create at least 2 mm of free thermal expansion.', { material: 0, length: 5, temperature: 40, gap: 0 }],
    ['Create ≥ 2 mm expansion while keeping restrained stress ≤ 50 MPa.', { material: 0, length: 5, temperature: 60, gap: 3 }],
    ['Use a beam ≥ 5 m long at ΔT ≥ 80°C; keep stress ≤ 35 MPa with a gap ≤ 8 mm.', { material: 0, length: 5, temperature: 80, gap: 4 }],
  ], ['Compare material expansion coefficients.', 'Increase temperature to predict the free expansion.', 'Open an expansion gap and observe stress decrease.', 'Find a gap that meets the design limit.'], ['Uniform temperature and linear elastic materials.', 'Steel: α=12 μm/(m·K), E=200 GPa; aluminum: 23 and 69; glass: 9 and 70.', 'Beam expands freely into the gap, then experiences ideal axial restraint; buckling is omitted.'], ['Free expansion = α L ΔT', 'Stress = E × max(0, α ΔT − gap/L)']),
  lab('flywheel-storage', 'Flywheel Energy Storage', 'mechanical', 'Store rotational energy while limiting the rim speed.', [c('mass', 'Disk mass', 5, 100, 5, 'kg', 10), c('radius', 'Disk radius', 0.1, 0.8, 0.05, 'm', 0.3), c('rpm', 'Rotation speed', 100, 5000, 50, 'rpm', 1000)], [
    ['Store at least 2 Wh of rotational energy.', { mass: 10, radius: 0.3, rpm: 2000 }],
    ['Store at least 10 Wh while keeping rim speed ≤ 80 m/s.', { mass: 30, radius: 0.5, rpm: 1500 }],
    ['Store at least 20 Wh with mass ≤ 50 kg and rim speed ≤ 80 m/s.', { mass: 50, radius: 0.5, rpm: 1500 }],
  ], ['Increase speed and watch energy rise with its square.', 'Compare mass and radius changes.', 'Read the rim-speed limit before increasing rpm.', 'Find a design within the mass and energy limits.'], ['Uniform solid disk, with moment of inertia I=½mr².', 'No bearing loss, enclosure mass, or material failure calculation.', 'The rim-speed limit is a fictional classroom challenge, not a safety certification.'], ['Angular speed ω = 2π rpm / 60', 'Energy = ½ I ω²', 'Rim speed = ωr'], PHYSICS, 'Do not build or spin a real high-speed flywheel. Stored rotational energy can be dangerous.'),
  lab('warren-truss', 'Warren Truss Bridge Load Tester', 'civil', 'Explore how triangular bracing carries a central load.', [c('span', 'Supported span', 4, 20, 1, 'm', 10), c('height', 'Truss height', 1, 8, 0.5, 'm', 2), c('area', 'Diagonal area', 100, 2000, 50, 'mm²', 300), c('load', 'Central load', 5, 200, 5, 'kN', 50)], [
    ['Keep diagonal axial stress ≤ 150 MPa under the selected load.', { span: 10, height: 3, area: 800, load: 50 }],
    ['Carry at least 75 kN with stress ≤ 150 MPa and center movement ≤ 10 mm.', { span: 10, height: 3, area: 1000, load: 75 }],
    ['Carry ≥ 100 kN with stress ≤ 150 MPa, movement ≤ 10 mm, and diagonal material ≤ 0.02 m³.', { span: 12, height: 4, area: 1000, load: 100 }],
  ], ['Identify the two load-carrying diagonals.', 'Raise the truss to steepen the diagonal angle.', 'Change member area and compare stress with material use.', 'Check both stress and displacement.'], ['A single symmetric triangular Warren panel with two elastic load-carrying diagonals; a teaching reduction, not a full bridge solver.', 'Pin joints, symmetric central load, E=200 GPa; chord deformation, buckling, and self-weight ignored.', 'Computed movement follows virtual work for the two diagonals.'], ['Diagonal force = load / (2 sin θ)', 'Axial stress = diagonal force / area', 'Center movement = P Ldiagonal³ / (2 E A height²)']),
  lab('retaining-wall', 'Retaining Wall Soil Stability', 'civil', 'Balance soil thrust against a gravity wall’s weight and friction.', [c('height', 'Retained height', 1, 6, 0.5, 'm', 3), c('width', 'Wall base width', 0.5, 4, 0.1, 'm', 0.7), c('phi', 'Soil friction angle', 20, 45, 1, '°', 30), c('friction', 'Base friction coefficient', 0.3, 0.8, 0.05, '', 0.5), c('density', 'Soil unit weight', 14, 22, 1, 'kN/m³', 18)], [
    ['Achieve sliding safety factor ≥ 1.3.', { height: 3, width: 1.5, phi: 35, friction: 0.6, density: 18 }],
    ['Achieve sliding safety factor ≥ 1.5 and overturning safety factor ≥ 2.', { height: 3, width: 1.5, phi: 35, friction: 0.6, density: 18 }],
    ['Retain at least 3 m of soil with base width ≤ 1.5 m, sliding factor ≥ 1.5, and overturning factor ≥ 2.', { height: 3, width: 1.2, phi: 35, friction: 0.6, density: 18 }],
  ], ['Inspect the triangular lateral soil-pressure distribution.', 'Increase width to add stabilizing weight.', 'Compare soil friction and base friction: they act in different places.', 'Check sliding and overturning separately.'], ['Rankine active pressure for dry, level, cohesionless soil and a frictionless vertical back face.', 'Rectangular concrete gravity wall, unit weight 24 kN/m³, per meter length.', 'No groundwater, surcharge, earthquake, foundation bearing, or reinforcement design.'], ['Ka = tan²(45° − φ/2)', 'Soil thrust = ½ Ka γ H²', 'Sliding factor = μW / thrust', 'Overturning factor = (W b/2) / (thrust H/3)']),
  lab('concrete-rebar', 'Concrete Beam and Rebar', 'civil', 'Compare bending demand, reinforcement capacity, and beam deflection.', [c('span', 'Beam span', 2, 8, 0.5, 'm', 4), c('depth', 'Beam depth', 200, 800, 25, 'mm', 300), c('width', 'Beam width', 150, 500, 25, 'mm', 250), c('bars', 'Rebar count', 2, 8, 1, 'bars', 2), c('diameter', 'Rebar diameter', 8, 25, 1, 'mm', 12), c('load', 'Center load', 5, 80, 5, 'kN', 40)], [
    ['Make reduced bending capacity at least equal to bending demand.', { span: 4, depth: 400, width: 250, bars: 2, diameter: 16, load: 40 }],
    ['Achieve capacity/demand ≥ 1.5 and elastic deflection ≤ span/360.', { span: 4, depth: 450, width: 300, bars: 4, diameter: 16, load: 40 }],
    ['Carry at least 60 kN with depth ≤ 450 mm, capacity/demand ≥ 1.5, and deflection ≤ span/360.', { span: 4, depth: 450, width: 300, bars: 4, diameter: 16, load: 60 }],
  ], ['Observe bending concentrated at midspan.', 'Increase depth and compare deflection.', 'Add rebar to increase the simplified bending capacity.', 'Check capacity, deflection, and reinforcement validity together.'], ['Simply supported rectangular beam and a central point load; self-weight omitted.', 'fc=25 MPa, fy=400 MPa, E=30 GPa, effective depth=depth−40 mm, capacity factor 0.9.', 'Rectangular compression-block approximation; reinforcement ≤ 4% and compression block ≤ 60% of effective depth required.', 'Uncracked elastic deflection underestimates deflection after cracking. This is not code-compliant structural design.'], ['Bending demand = P span / 4', 'a = As fy / (0.85 fc b)', 'Reduced capacity = 0.9 As fy (d − a/2)', 'Elastic deflection = P span³ / (48 E I)']),
  lab('hydrostatic-dam', 'Hydrostatic Dam Pressure', 'civil', 'See why water pressure grows with depth and total thrust grows faster.', [c('height', 'Water depth', 1, 20, 0.5, 'm', 8), c('base', 'Dam base width', 1, 15, 0.5, 'm', 3), c('length', 'Dam segment length', 1, 10, 1, 'm', 2)], [
    ['Achieve overturning safety factor ≥ 1.5.', { height: 8, base: 5, length: 2 }],
    ['Achieve overturning factor ≥ 2 and retain water at least 8 m deep.', { height: 8, base: 6, length: 2 }],
    ['Retain ≥ 8 m depth with overturning factor ≥ 2 and base width ≤ 80% of height.', { height: 10, base: 7, length: 2 }],
  ], ['Read pressure at the bottom and at the surface.', 'Double the water depth to see thrust grow fourfold.', 'Widen the triangular dam and compare stabilizing moment.', 'Check the base-width constraint.'], ['Static fresh water at 1,000 kg/m³; triangular concrete section at 2,400 kg/m³.', 'Vertical upstream face; weight acts one-third of the base from that face.', 'No uplift, seepage, sliding, wave action, foundation failure, or earthquake effects.'], ['Bottom pressure = ρgH', 'Horizontal thrust = ½ρgH² × segment length', 'Water moment = thrust × H/3', 'Stabilizing moment = dam weight × 2b/3']),
  lab('earthquake-table', 'Earthquake Shaker Table', 'civil', 'Tune stiffness and damping to avoid a resonant shaking response.', [c('mass', 'Building mass', 500, 5000, 100, 'kg', 1000), c('stiffness', 'Lateral stiffness', 100, 1000, 25, 'kN/m', 200), c('damping', 'Damping ratio', 0.01, 0.5, 0.01, '', 0.05), c('frequency', 'Ground-shaking frequency', 0.5, 6, 0.1, 'Hz', 2.2), c('acceleration', 'Ground acceleration', 0.05, 0.8, 0.05, 'g', 0.2)], [
    ['Keep peak relative sway ≤ 40 mm.', { mass: 1000, stiffness: 800, damping: 0.2, frequency: 1, acceleration: 0.2 }],
    ['Keep sway ≤ 20 mm and acceleration amplification ≤ 1.5 with damping ≤ 0.25.', { mass: 1000, stiffness: 800, damping: 0.2, frequency: 1, acceleration: 0.2 }],
    ['At ≥ 0.30 g ground acceleration, keep sway ≤ 10 mm, amplification ≤ 1.5, and damping ≤ 0.30.', { mass: 1000, stiffness: 800, damping: 0.2, frequency: 1, acceleration: 0.3 }],
  ], ['Sweep shaking frequency past the natural frequency.', 'Notice the large resonance peak with little damping.', 'Increase damping, then compare a stiffness change.', 'Check sway and acceleration amplification together.'], ['Linear single-degree-of-freedom oscillator in steady sinusoidal base excitation.', 'A single frequency is not a real earthquake time history.', 'No yielding, collapse, soil interaction, or multiple building modes.'], ['Natural angular frequency = √(k/m)', 'Relative sway = ag / √((ωn²−ω²)² + (2ζωnω)²)', 'Acceleration amplification = √(1+(2ζr)²) / √((1−r²)²+(2ζr)²)']),
  lab('voltage-divider', 'AC/DC Voltage Divider', 'electrical', 'Build a divider and investigate how an attached load changes the output.', [c('voltage', 'Input DC voltage / AC peak', 1, 12, 0.1, 'V', 12), c('r1', 'Top resistor R1', 100, 10000, 100, 'Ω', 1000), c('r2', 'Bottom resistor R2', 100, 10000, 100, 'Ω', 2000), c('load', 'Load resistance', 1000, 100000, 1000, 'Ω', 100000), choice('ac', 'Source', ['DC', 'AC, 50 Hz'])], [
    ['Make a DC output of 6.0 V ± 0.3 V.', { voltage: 12, r1: 1000, r2: 1000, load: 100000, ac: 0 }],
    ['Make a DC output of 3.3 V ± 0.15 V with total resistor dissipation ≤ 0.05 W.', { voltage: 5, r1: 500, r2: 1000, load: 100000, ac: 0 }],
    ['Make AC output peak 3.3 V ± 0.15 V into a load ≤ 10 kΩ, with average resistor dissipation ≤ 0.05 W.', { voltage: 12, r1: 2400, r2: 1000, load: 10000, ac: 1 }],
  ], ['Compare R1 and R2 with a very large load resistance.', 'Lower the load resistance to observe loading.', 'Switch to AC; distinguish peak voltage from RMS voltage.', 'Check the target voltage and resistor heating.'], ['Ideal resistive network, zero source impedance, 50 Hz sine wave for AC.', 'AC control specifies peak input voltage, not RMS.', 'Power sums heating in R1 and R2; load heating is shown separately.'], ['Rparallel = R2 × Rload / (R2 + Rload)', 'Output = input × Rparallel / (R1 + Rparallel)', 'Sine-wave RMS = peak / √2'], CIRCUITS, 'Virtual low-voltage circuits only. Never use household mains power.'),
  lab('logic-array', 'Logic Gate Array', 'electrical', 'Build truth-table intuition using selectable digital gates.', [choice('gate', 'Gate function', ['AND', 'OR', 'XOR', 'NAND']), toggle('a', 'Input A'), toggle('b', 'Input B')], [
    ['Select AND and set inputs that produce HIGH output.', { gate: 0, a: 1, b: 1 }],
    ['Select XOR and find inputs that produce HIGH output.', { gate: 2, a: 1, b: 0 }],
    ['Select NAND and find its only LOW-output input pair.', { gate: 3, a: 1, b: 1 }],
  ], ['Toggle A and B one at a time.', 'Read all four rows of the live truth table.', 'Choose the gate named in the objective.', 'Use the truth table to predict the current output before checking.'], ['Ideal Boolean gates with no timing delay, voltage thresholds, or electrical loading.', 'LOW is 0; HIGH is 1. XOR means exactly one input is HIGH.'], ['AND: A ∧ B', 'OR: A ∨ B', 'XOR: A ≠ B', 'NAND: NOT(A ∧ B)'], CIRCUITS),
  lab('rc-filter', 'RC Frequency Filter', 'electrical', 'Choose components and explore a first-order filter’s frequency response.', [c('resistance', 'Resistance', 100, 10000, 100, 'Ω', 1000), c('capacitance', 'Capacitance', 0.01, 10, 0.01, 'µF', 0.1), c('frequency', 'Signal frequency', 10, 5000, 10, 'Hz', 1000), choice('highpass', 'Filter arrangement', ['Low-pass', 'High-pass'])], [
    ['Set the cutoff frequency to 159 Hz ± 20 Hz.', { resistance: 1000, capacitance: 1, frequency: 1000, highpass: 0 }],
    ['Use a low-pass filter with cutoff ≥ 100 Hz and gain ≤ 0.20 at a 1,000 Hz signal.', { resistance: 1000, capacitance: 1, frequency: 1000, highpass: 0 }],
    ['Use a high-pass filter with cutoff ≤ 300 Hz and gain ≥ 0.95 at a 1,000 Hz signal.', { resistance: 1000, capacitance: 1, frequency: 1000, highpass: 1 }],
  ], ['Change either R or C to move the cutoff.', 'Sweep input frequency and inspect signal amplitude.', 'Compare low-pass with high-pass using the same components.', 'Check cutoff and gain together.'], ['Ideal source, ideal components, no load, steady sinusoidal signal.', 'Gain is output amplitude / input amplitude; cutoff corresponds to gain 1/√2.'], ['fc = 1/(2πRC)', 'Low-pass gain = 1/√(1+(f/fc)²)', 'High-pass gain = (f/fc)/√(1+(f/fc)²)'], CIRCUITS),
  lab('seven-segment', 'Seven-Segment Breadboard Wiring', 'electrical', 'Wire seven independently controlled LED segments to display a digit.', [...'abcdefg'.split('').map(k => toggle(k, `Segment ${k.toUpperCase()}`)), c('resistance', 'Resistor per segment', 100, 1000, 10, 'Ω', 330)], [
    ['Wire the digit 2 and keep each lit segment at 5–15 mA.', { a: 1, b: 1, c: 0, d: 1, e: 1, f: 0, g: 1, resistance: 330 }],
    ['Wire the digit 5 and keep each lit segment at 5–15 mA.', { a: 1, b: 0, c: 1, d: 1, e: 0, f: 1, g: 1, resistance: 330 }],
    ['Wire the digit 9 and keep each lit segment at 5–10 mA.', { a: 1, b: 1, c: 1, d: 1, e: 0, f: 1, g: 1, resistance: 330 }],
  ], ['Locate segments A through G on the display.', 'Connect a segment by toggling its individual wire.', 'Use one current-limiting resistor for every segment.', 'Check both the digit pattern and the segment current.'], ['Common-cathode display; ideal independent 5 V drivers and 2 V forward drop.', 'Every active segment has its own identical resistor.', 'Breadboard wiring is represented as seven explicit segment connections.'], ['Segment current = (5 V − 2 V) / R', 'Total current = active segments × segment current'], CIRCUITS, 'Use low-voltage battery circuits with adult supervision. Never omit the current-limiting resistors.'),
  lab('motor-transistor', 'Transistor Motor Switching', 'electrical', 'Control a toy motor through a transistor and protect the switching circuit.', [c('base', 'Base resistor', 100, 10000, 50, 'Ω', 1000), c('logic', 'Control voltage', 3.3, 5, 0.1, 'V', 3.3), c('supply', 'Motor supply', 3, 12, 0.5, 'V', 6), c('duty', 'PWM duty', 10, 100, 5, '%', 50), toggle('diode', 'Flyback diode connected')], [
    ['Deliver average motor current ≥ 0.10 A.', { base: 100, logic: 5, supply: 6, duty: 100, diode: 0 }],
    ['Connect the flyback diode and supply enough base current for the model to saturate.', { base: 100, logic: 5, supply: 6, duty: 100, diode: 1 }],
    ['Use the diode, keep control current ≤ 20 mA and duty ≤ 75%, and deliver 0.07–0.12 A with saturation.', { base: 150, logic: 3.3, supply: 3, duty: 60, diode: 1 }],
  ], ['Increase base current by reducing its resistor.', 'Compare requested motor current with transistor drive capability.', 'Connect a flyback diode before switching an inductive load.', 'Adjust PWM duty to control average current.'], ['Motor represented by 20 Ω; no inductive transient or back-EMF integration.', 'BJT has 0.7 V base drop, 0.2 V saturation drop, and conservative forced gain of 10.', 'Flyback diode state is checked as a circuit requirement; a spike waveform is not simulated.'], ['Base current = (Vcontrol−0.7)/Rb', 'On current = min((Vsupply−0.2)/20, 10 × base current)', 'Average current = on current × duty'], CIRCUITS, 'Use only low-voltage toy motors and a rated driver. Never connect a motor directly to a microcontroller pin.'),
  lab('differential-drive', 'Differential Drive Kinematics', 'robotics', 'Predict the curved path of a two-wheel robot.', [c('left', 'Left wheel linear speed', -1, 1, 0.05, 'm/s', 0.3), c('right', 'Right wheel linear speed', -1, 1, 0.05, 'm/s', 0.6), c('track', 'Wheel separation', 0.1, 0.8, 0.05, 'm', 0.4), c('time', 'Drive time', 1, 10, 0.5, 's', 4)], [
    ['Drive straight at least 2 m with heading change within 5°.', { left: 0.5, right: 0.5, track: 0.4, time: 4 }],
    ['Turn through 90° ± 10° and travel at least 0.5 m along the path.', { left: 0.2, right: 0.4, track: 0.4, time: 3 }],
    ['Spin in place through 180° ± 10°, keeping center travel ≤ 0.05 m.', { left: -0.2, right: 0.2, track: 0.4, time: 3 }],
  ], ['Set equal wheel speeds to travel straight.', 'Make one wheel faster to create a turning arc.', 'Reverse one wheel to spin about the robot center.', 'Use drive time to meet the required heading.'], ['Planar rigid robot starting at (0,0) facing +x.', 'Constant wheel speeds, no slip or acceleration ramps.', 'Wheel controls are contact-point linear speed, not motor rpm.'], ['v = (vL+vR)/2', 'Angular rate = (vR−vL)/track', 'For a turn: x=(v/ω)sin(ωt), y=(v/ω)(1−cos(ωt))']),
  lab('pid-line-follower', 'PID Line-Follower Tuning', 'robotics', 'Tune a simulated steering controller and inspect its full error trace.', [c('kp', 'Proportional gain Kp', 0, 8, 0.1, '', 0.3), c('ki', 'Integral gain Ki', 0, 3, 0.05, '', 0), c('kd', 'Derivative gain Kd', 0, 4, 0.1, '', 0), c('bias', 'Constant steering disturbance', 0, 0.5, 0.05, '', 0.1)], [
    ['Reduce final line error to ≤ 0.10 m over the 8-second run.', { kp: 2, ki: 0.2, kd: 1.5, bias: 0.1 }],
    ['Keep final error ≤ 0.05 m and overshoot ≤ 0.15 m.', { kp: 2, ki: 0.2, kd: 1.5, bias: 0.1 }],
    ['Reject a disturbance ≥ 0.30 with final error ≤ 0.05 m, overshoot ≤ 0.15 m, and mean absolute error ≤ 0.20 m.', { kp: 3, ki: 1, kd: 2, bias: 0.3 }],
  ], ['Run with small Kp and observe slow correction.', 'Add Kd to reduce oscillation.', 'Add a little Ki to remove steady error caused by the disturbance.', 'Compare final error, overshoot, and the full trace rather than only the last point.'], ['A teaching lateral-error plant: e″ = steering + disturbance − 0.6e′.', 'Explicit 0.02 s integration for 8 seconds, initial error 0.8 m and zero velocity.', 'Steering limited to ±5; integral clamped to ±2. No wheel or camera model.'], ['Steering = −Kp e − Ki ∫e dt − Kd e′', 'Mean absolute error = average |e(t)|']),
  lab('arm-inverse-kinematics', 'Robotic Arm Inverse Kinematics', 'robotics', 'Choose a target and solve the two joint angles of a planar robot arm.', [c('l1', 'Upper link length', 1, 5, 0.5, 'm', 2), c('l2', 'Forearm length', 1, 5, 0.5, 'm', 2), c('x', 'Target x', -8, 8, 0.5, 'm', 5), c('y', 'Target y', 0, 8, 0.5, 'm', 2), choice('elbow', 'Elbow solution', ['Positive elbow angle', 'Negative elbow angle'])], [
    ['Reach a target at least 3 m from the base.', { l1: 3, l2: 3, x: 4, y: 2, elbow: 0 }],
    ['Reach (4, 2) m with manipulability |sin θ2| ≥ 0.70.', { l1: 3, l2: 3, x: 4, y: 2, elbow: 0 }],
    ['Reach (5, 3) m with a negative elbow angle, |shoulder| ≤ 90°, and |elbow| ≤ 150°.', { l1: 3, l2: 4, x: 5, y: 3, elbow: 1 }],
  ], ['Move the target outside the reachable annulus and read the warning.', 'Lengthen a link until the target is reachable.', 'Compare the two valid elbow branches.', 'Avoid a nearly straight arm when manipulability matters.'], ['Two rigid links with ideal revolute joints in one plane.', 'No joint collision, actuator load, speed limits, or obstacle avoidance.', 'Targets outside |L1−L2| ≤ radius ≤ L1+L2 are explicitly unreachable.'], ['cos θ2 = (x²+y²−L1²−L2²)/(2L1L2)', 'θ1 = atan2(y,x) − atan2(L2 sin θ2, L1+L2 cos θ2)']),
  lab('ultrasonic-map', 'Ultrasonic Obstacle Mapping', 'robotics', 'Convert a round-trip echo into a mapped obstacle point.', [c('echo', 'Measured round-trip echo', 500, 25000, 10, 'µs', 6000), c('angle', 'Sensor direction', -80, 80, 1, '°', 0), c('temperature', 'Air temperature', 0, 40, 1, '°C', 20)], [
    ['Map an obstacle 1.0 m ± 0.1 m from the sensor.', { echo: 5830, angle: 0, temperature: 20 }],
    ['Map an obstacle at x=2.0 ± 0.15 m and y=1.0 ± 0.15 m.', { echo: 13030, angle: 27, temperature: 20 }],
    ['Map that same (2, 1) m obstacle in air at least 35°C, within 0.10 m on each axis.', { echo: 12690, angle: 27, temperature: 35 }],
  ], ['Remember that the echo time includes the outward and return trip.', 'Rotate the sensor to place the point on the x–y map.', 'Change air temperature and observe the calibrated distance.', 'Keep the measurement in the modeled 0.05–4 m sensor range.'], ['Single perfect echo from a point reflector, no false echoes or beam width.', 'Sound speed ≈ 331.3 + 0.606 × temperature (m/s).', 'Sensor range 0.05–4 m is a classroom assumption, not a product specification.'], ['Distance = sound speed × echo time / 2', 'x = distance cos(angle); y = distance sin(angle)']),
  lab('finite-state-machine', 'Finite State Machine Builder', 'robotics', 'Wire event transitions for a robot that searches, moves, turns, and stops.', [choice('clear', 'On clear path →', ['Search', 'Forward', 'Turn', 'Stop']), choice('obstacle', 'On obstacle →', ['Search', 'Forward', 'Turn', 'Stop']), choice('low', 'On low battery →', ['Search', 'Forward', 'Turn', 'Stop'])], [
    ['Route a clear-path event to Forward.', { clear: 1, obstacle: 0, low: 0 }],
    ['Route clear path to Forward and obstacle to Turn.', { clear: 1, obstacle: 2, low: 0 }],
    ['Complete the route: clear→Forward, obstacle→Turn, low battery→Stop. Stop must remain latched.', { clear: 1, obstacle: 2, low: 3 }],
  ], ['Select a destination state for each event.', 'Read the simulated sequence: clear, obstacle, clear, low battery, clear.', 'Make obstacle events turn the robot instead of moving forward.', 'Make low battery stop the robot; a stopped robot stays stopped.'], ['Global event transitions from non-stopped states; this is a small editable transition table.', 'Stop is an absorbing safety state until a new simulation run.', 'Deterministic event trace; no real sensors or concurrent events.'], ['nextState = transition[event], unless state is Stop', 'Test events = clear → obstacle → clear → low battery → clear']),
  lab('synthetic-ecg', 'Synthetic ECG Signal Filter', 'biomedical', 'Filter a generated heartbeat-like signal while preserving its sharp features.', [c('cutoff', 'Low-pass cutoff', 1, 40, 1, 'Hz', 40), c('highpass', 'High-pass cutoff', 0.05, 5, 0.05, 'Hz', 0.1), c('noise', '50 Hz noise amplitude', 0.1, 0.5, 0.05, 'mV', 0.2), c('rate', 'Synthetic pulse rate', 60, 150, 5, 'bpm', 75)], [
    ['Attenuate the 50 Hz component to ≤ 40% of its original amplitude.', { cutoff: 20, highpass: 0.5, noise: 0.2, rate: 75 }],
    ['Keep 50 Hz gain ≤ 0.40 and 0.3 Hz baseline-wander gain ≤ 0.40.', { cutoff: 20, highpass: 1, noise: 0.2, rate: 75 }],
    ['Meet both noise limits, preserve ≥ 80% amplitude at 10 Hz, and leave ≤ 0.08 mV of 50 Hz noise.', { cutoff: 20, highpass: 1, noise: 0.2, rate: 75 }],
  ], ['Inspect the raw synthetic trace and identify slow drift and fast ripple.', 'Lower low-pass cutoff to reduce fast ripple.', 'Increase high-pass cutoff to remove drift.', 'Watch the 10 Hz feature gain so the filter does not erase useful detail.'], ['Generated Gaussian pulses, not recorded patient data; no diagnostic interpretation.', 'Cascaded ideal first-order high-pass and low-pass frequency response.', 'Display uses a sampled digital approximation; metrics use steady-state analytic gains.'], ['Combined gain(f) = high-pass gain(f) × low-pass gain(f)', 'Residual noise amplitude = input amplitude × gain(50 Hz)'], CIRCUITS, 'Never connect homemade electronics to a person. This lab uses synthetic signals only.'),
  lab('heart-valve', 'Artificial Heart Valve Flow', 'biomedical', 'Explore an idealized one-way valve as an engineering fluid model.', [c('radius', 'Valve radius', 2, 8, 0.5, 'mm', 4), c('opening', 'Open area fraction', 10, 100, 5, '%', 50), c('pressure', 'Pressure difference', 2, 30, 1, 'mmHg', 8), c('leak', 'Reverse leakage fraction', 0, 20, 1, '%', 8)], [
    ['Produce net forward flow ≥ 2 L/min.', { radius: 6, opening: 80, pressure: 8, leak: 5 }],
    ['Produce 3–6 L/min net flow with pressure difference ≤ 10 mmHg and leakage ≤ 5%.', { radius: 6, opening: 80, pressure: 8, leak: 3 }],
    ['Produce 3–6 L/min with pressure ≤ 10 mmHg, leakage ≤ 2%, and diameter ≤ 12 mm.', { radius: 6, opening: 80, pressure: 8, leak: 1 }],
  ], ['Open the valve and observe its effective flow area.', 'Change pressure and compare flow: the relationship is a square root.', 'Reduce the leakage fraction and compare gross with net flow.', 'Meet the fictional engineering target.'], ['Steady orifice flow with density 1,060 kg/m³ and discharge coefficient 0.7.', 'Leakage is a user-specified fraction of gross flow, not a modeled cardiac cycle.', 'No blood damage, thrombosis, biological response, or clinical suitability calculation.'], ['Q = 0.7 × open area × √(2ΔP/ρ)', 'Net Q = gross Q × (1−leak fraction)'], FLUID, 'A classroom simulation only; it cannot guide patient care or real medical-device design.'),
  lab('prosthetic-grip', 'Prosthetic Grip Controller', 'biomedical', 'Balance grip strength with a fictional fragile-object force limit.', [c('tendon', 'Tendon pull', 1, 50, 1, 'N', 5), c('ratio', 'Mechanical advantage', 1, 6, 0.5, '', 2), c('lever', 'Tendon lever arm', 15, 60, 5, 'mm', 20), c('finger', 'Finger length', 40, 100, 5, 'mm', 80), c('mass', 'Object mass', 0.05, 1, 0.05, 'kg', 0.4), c('friction', 'Contact friction', 0.2, 1, 0.05, '', 0.7)], [
    ['Generate enough friction force to hold the selected object (factor ≥ 1).', { tendon: 8, ratio: 3, lever: 20, finger: 80, mass: 0.4, friction: 0.7 }],
    ['Achieve holding factor ≥ 1.5 while total normal grip force stays ≤ 20 N.', { tendon: 8, ratio: 3, lever: 20, finger: 80, mass: 0.4, friction: 0.7 }],
    ['Hold an object ≥ 0.5 kg with factor ≥ 2, grip ≤ 20 N, and tendon pull ≤ 10 N.', { tendon: 8, ratio: 3, lever: 20, finger: 80, mass: 0.5, friction: 0.9 }],
  ], ['Follow tendon force through the lever.', 'Compare normal grip force with available friction.', 'Try a slippery object by lowering friction.', 'Avoid exceeding the fictional 20 N fragile-object limit.'], ['Two symmetric rigid fingers and static Coulomb friction.', 'Mechanical advantage has no frictional loss; contact area and motor heating ignored.', 'The force limit is an invented classroom target, not a human comfort limit.'], ['Force per finger = tendon pull × ratio × lever / finger length', 'Holding factor = 2 × finger force × friction / object weight']),
  lab('microfluidic-viscosity', 'Microfluidic Viscosity', 'biomedical', 'Investigate the fourth-power effect of channel radius on a tiny liquid flow.', [c('radius', 'Channel radius', 50, 300, 10, 'µm', 100), c('viscosity', 'Dynamic viscosity', 1, 10, 0.5, 'mPa·s', 2), c('length', 'Channel length', 10, 100, 5, 'mm', 50), c('pressure', 'Pressure difference', 0.1, 5, 0.1, 'kPa', 1)], [
    ['Generate 10–50 µL/min while Reynolds number remains below 200.', { radius: 100, viscosity: 2, length: 50, pressure: 1 }],
    ['Generate 25 ± 5 µL/min with pressure difference ≤ 1 kPa and Re < 200.', { radius: 100, viscosity: 2, length: 50, pressure: 1 }],
    ['Generate 40–60 µL/min using viscosity ≥ 3 mPa·s, pressure ≤ 1 kPa, and Re < 200.', { radius: 150, viscosity: 3, length: 50, pressure: 0.7 }],
  ], ['Double channel radius and observe the large flow change.', 'Raise viscosity and compare flow resistance.', 'Use channel radius to compensate for a thicker liquid.', 'Check that the flow stays within the laminar teaching range.'], ['Steady laminar incompressible Newtonian liquid in a circular tube; density 1,000 kg/m³.', 'No-slip walls, fully developed flow, and no surface-tension or entrance effects.', 'Blood and real microdevices can require more complex models.'], ['Q = π r⁴ ΔP / (8 μ L)', 'Re = ρ v (2r) / μ'], FLUID),
  lab('tissue-scaffold', 'Tissue Scaffold Stress', 'biomedical', 'Explore the tradeoff between a porous structure’s stiffness and open space.', [c('porosity', 'Pore volume fraction', 20, 85, 5, '%', 70), c('modulus', 'Solid material modulus', 10, 200, 10, 'MPa', 50), c('area', 'Loaded section area', 20, 200, 10, 'mm²', 50), c('force', 'Compression force', 5, 100, 5, 'N', 40)], [
    ['Keep compressive strain ≤ 5% while porosity is ≥ 40%.', { porosity: 50, modulus: 100, area: 100, force: 40 }],
    ['Keep strain ≤ 2% while porosity is ≥ 60%.', { porosity: 60, modulus: 150, area: 150, force: 40 }],
    ['Carry ≥ 50 N with porosity ≥ 65% and strain ≤ 2%.', { porosity: 65, modulus: 200, area: 150, force: 50 }],
  ], ['Raise porosity to create more open space.', 'Observe the effective modulus fall as pores replace material.', 'Change cross-section or material stiffness to recover load capacity.', 'Check both the pore-space and strain conditions.'], ['Homogeneous linear-elastic compression model with Eeffective = Esolid(1−porosity)².', 'Relative transport index p³/(1−p)² is qualitative, not a biological permeability measurement.', 'No cells, fatigue, failure, healing, anisotropy, or clinical predictions.'], ['Stress = force / area', 'Effective modulus = solid modulus × (1−p)²', 'Strain = stress / effective modulus']),
  lab('solar-orientation', 'Solar Panel Orientation', 'green', 'Aim a solar panel toward the sun and compare useful electric power.', [c('tilt', 'Panel tilt from horizontal', 0, 90, 1, '°', 10), c('azimuth', 'Panel azimuth from sun direction', -90, 90, 1, '°', 45), c('altitude', 'Sun altitude', 15, 75, 1, '°', 45), c('area', 'Panel area', 0.5, 4, 0.1, 'm²', 2), c('efficiency', 'Conversion efficiency', 15, 25, 1, '%', 20)], [
    ['Achieve incidence factor ≥ 0.90.', { tilt: 45, azimuth: 0, altitude: 45, area: 2, efficiency: 20 }],
    ['Produce at least 300 W and achieve incidence factor ≥ 0.95.', { tilt: 45, azimuth: 0, altitude: 45, area: 2, efficiency: 20 }],
    ['Produce at least 600 W with area ≤ 3 m², efficiency ≤ 22%, and incidence factor ≥ 0.95.', { tilt: 45, azimuth: 0, altitude: 45, area: 3, efficiency: 22 }],
  ], ['Rotate azimuth until the panel faces the sun.', 'Tilt the panel so its normal points toward the sun.', 'Compare area and efficiency with alignment changes.', 'Read the clear-sky instantaneous power, not a yearly energy forecast.'], ['Direct irradiance fixed at 1,000 W/m²; no clouds, temperature loss, diffuse light, or shading.', 'Sun position stays fixed; 5-hour energy is five equivalent full-power hours, not a daily forecast.'], ['Incidence = sin(altitude) cos(tilt) + cos(altitude) sin(tilt) cos(azimuth)', 'Electric power = irradiance × area × efficiency × max(0, incidence)']),
  lab('wind-pitch', 'Wind Turbine Blade Pitch', 'green', 'Tune pitch and rotor speed to capture energy from a moving air stream.', [c('pitch', 'Blade pitch', -5, 30, 1, '°', 20), c('radius', 'Rotor radius', 1, 5, 0.5, 'm', 2), c('wind', 'Wind speed', 3, 15, 0.5, 'm/s', 6), c('rpm', 'Rotor speed', 10, 300, 10, 'rpm', 80)], [
    ['Generate at least 200 W of electrical power.', { pitch: 6, radius: 2, wind: 8, rpm: 230 }],
    ['Achieve a power coefficient ≥ 0.35 and electrical output ≥ 500 W.', { pitch: 6, radius: 2, wind: 6, rpm: 180 }],
    ['Generate ≥ 2,000 W with wind speed ≤ 10 m/s, rotor radius ≤ 3 m, and power coefficient ≥ 0.35.', { pitch: 6, radius: 3, wind: 9, rpm: 180 }],
  ], ['Tune pitch near the peak of the teaching performance curve.', 'Adjust rpm to change tip-speed ratio.', 'Compare the cube-law effect of wind speed.', 'Meet the power goal within the rotor-size limit.'], ['Air density 1.225 kg/m³ and generator efficiency 90%.', 'Invented smooth Cp curve peaks at 0.45, pitch 6°, and tip-speed ratio 6; it is not manufacturer data.', 'No blade-element aerodynamics, gusts, mechanical loads, noise, or control dynamics.'], ['Available wind power = ½ρπr²v³', 'Tip-speed ratio = ωr/v', 'Cp = 0.45 exp(−((pitch−6)/10)² − ((tip ratio−6)/3)²)', 'Electric power = available power × Cp × 0.9']),
  lab('water-filtration', 'Multi-Layer Water Filtration', 'green', 'Balance particle removal and flow through a classroom filter column.', [c('gravel', 'Gravel depth', 0, 10, 1, 'cm', 3), c('sand', 'Sand depth', 0, 20, 1, 'cm', 5), c('carbon', 'Carbon depth', 0, 10, 1, 'cm', 2), c('head', 'Water head above outlet', 10, 100, 5, 'cm', 50), c('turbidity', 'Input particle turbidity', 20, 200, 10, 'NTU', 120)], [
    ['Remove at least 70% of modeled particles with all three layers present.', { gravel: 3, sand: 8, carbon: 3, head: 60, turbidity: 120 }],
    ['Remove ≥ 90% of modeled particles and keep flow ≥ 10 mL/min with all layers present.', { gravel: 2, sand: 15, carbon: 4, head: 80, turbidity: 120 }],
    ['Remove ≥ 95% of modeled particles, maintain flow ≥ 12 mL/min, and use total layer depth ≤ 25 cm with all layers present.', { gravel: 1, sand: 20, carbon: 4, head: 90, turbidity: 120 }],
  ], ['Add gravel, sand, and carbon layers.', 'Compare modeled particle removal with the slower flow.', 'Increase water head to push flow through the same layers.', 'Read the safety notice: clear-looking water can still contain harmful microbes and chemicals.'], ['Deliberately illustrative exponential particle-capture model, not experimentally calibrated filtration performance.', 'Removal coefficient per cm: gravel 0.025, sand 0.14, carbon 0.06.', 'Hydraulic resistance is a teaching proxy; no removal of pathogens or dissolved contaminants is claimed.'], ['Particle fraction remaining = exp(−0.025g−0.14s−0.06c)', 'Flow = 8 × head / (1+0.2g+2s+1.2c)'], PHYSICS, 'Never drink experimentally filtered water. This model does not establish potability.'),
  lab('hydroelectric-flow', 'Hydroelectric Turbine Flow', 'green', 'Convert elevation and water flow into power while leaving water in the river.', [c('head', 'Gross water head', 1, 30, 1, 'm', 5), c('flow', 'Diverted flow', 0.01, 0.7, 0.01, 'm³/s', 0.1), c('efficiency', 'Turbine-generator efficiency', 30, 90, 5, '%', 60), c('loss', 'Head loss fraction', 0, 50, 5, '%', 20)], [
    ['Produce at least 1 kW.', { head: 5, flow: 0.1, efficiency: 60, loss: 20 }],
    ['Produce ≥ 10 kW with efficiency ≥ 70% and remaining river flow ≥ 0.30 m³/s.', { head: 10, flow: 0.3, efficiency: 80, loss: 10 }],
    ['Produce ≥ 30 kW with diversion ≤ 0.30 m³/s, gross head ≤ 20 m, and remaining river flow ≥ 0.30 m³/s.', { head: 15, flow: 0.3, efficiency: 80, loss: 10 }],
  ], ['Increase net head and compare power.', 'Adjust diverted flow while watching remaining river flow.', 'Reduce head loss and improve conversion efficiency.', 'Meet both the power and the fictional ecological-flow requirement.'], ['Steady freshwater flow at 1,000 kg/m³; fixed upstream river flow 0.8 m³/s.', 'Efficiency is fixed at the selected value, with no part-load turbine curve.', 'The river-flow requirement is an invented lesson target, not environmental permitting guidance.'], ['Net head = gross head × (1−loss fraction)', 'Electric power = ρgQ × net head × efficiency', 'Remaining river flow = 0.8−diverted flow']),
  lab('geothermal-heat-pump', 'Geothermal Heat Pump Efficiency', 'green', 'Move heat from the ground and distinguish heat delivered from electricity used.', [c('indoor', 'Indoor target', 20, 25, 1, '°C', 21), c('ground', 'Ground temperature', 5, 18, 1, '°C', 8), c('approach', 'Heat-exchanger approach', 3, 10, 1, 'K', 8), c('fraction', 'Fraction of ideal performance', 20, 60, 5, '%', 30), c('power', 'Compressor electric input', 0.5, 5, 0.5, 'kW', 2)], [
    ['Achieve heating coefficient of performance (COP) ≥ 3.', { indoor: 21, ground: 12, approach: 4, fraction: 30, power: 2 }],
    ['Deliver at least 8 kW of heat with COP ≥ 4.', { indoor: 21, ground: 12, approach: 4, fraction: 30, power: 2 }],
    ['Deliver ≥ 12 kW heat using ≤ 3 kW electricity with ground ≤ 12°C and approach ≤ 5 K.', { indoor: 21, ground: 12, approach: 4, fraction: 30, power: 2.5 }],
  ], ['Compare ground temperature with the indoor target.', 'Reduce heat-exchanger approach to reduce the required temperature lift.', 'Change compressor input and compare delivered heat with extracted ground heat.', 'Explain why COP above 1 does not create energy.'], ['Heating-only thermodynamic teaching model; ideal Carnot COP multiplied by an assumed performance fraction.', 'Hot-side temperature = indoor target + approach; cold side = ground − approach; calculations use kelvin.', 'No refrigerant cycle, pump power, seasonal ground depletion, or equipment sizing.'], ['Ideal heating COP = Thot / (Thot−Tcold)', 'Delivered heat = electricity × COP', 'Extracted ground heat = delivered heat−electricity']),
];

export const defaultValues = (item: Lab): Values => Object.fromEntries(item.controls.map(control => [control.key, control.initial]));
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const rad = (n: number) => n * Math.PI / 180;
const deg = (n: number) => n * 180 / Math.PI;
const rounded = (n: number) => Math.round(n * 1000) / 1000;
type Criterion = { label: string; value: number; lo?: number; hi?: number; unit?: string };
const min = (label: string, value: number, lo: number, unit = ''): Criterion => ({ label, value, lo, unit });
const max = (label: string, value: number, hi: number, unit = ''): Criterion => ({ label, value, hi, unit });
const band = (label: string, value: number, lo: number, hi: number, unit = ''): Criterion => ({ label, value, lo, hi, unit });
const exact = (label: string, value: number, goal: number): Criterion => band(label, value, goal, goal);
const out = (label: string, value: number | string, unit = '') => ({ label, value: typeof value === 'number' ? rounded(value) : value, unit });
export const gateOutput = (gate: number, a: number, b: number) => gate === 0 ? +(!!a && !!b) : gate === 1 ? +(!!a || !!b) : gate === 2 ? +(!!a !== !!b) : +!(a && b);
export const DIGITS = ['1111110', '0110000', '1101101', '1111001', '0110011', '1011011', '1011111', '1110000', '1111111', '1111011'];

export function pidTrace(v: Values): number[] {
  let error = 0.8, velocity = 0, integral = 0;
  const trace = [error];
  for (let i = 0; i < 400; i++) {
    integral = clamp(integral + error * 0.02, -2, 2);
    const steering = clamp(-v.kp * error - v.ki * integral - v.kd * velocity, -5, 5);
    velocity += (steering + v.bias - 0.6 * velocity) * 0.02;
    error += velocity * 0.02;
    trace.push(error);
  }
  return trace;
}

/** Invalid/missing input values are safely replaced or clamped before evaluation. */
export function sanitizeValues(item: Lab, incoming: Values): Values {
  return Object.fromEntries(item.controls.map(control => {
    const raw = incoming[control.key];
    const finite = typeof raw === 'number' && Number.isFinite(raw) ? raw : control.initial;
    const clipped = clamp(finite, control.min, control.max);
    const snapped = control.kind === 'toggle' || control.kind === 'select' ? Math.round(clipped) : clipped;
    return [control.key, snapped];
  }));
}

export function evaluateLab(labId: string, incoming: Values, requestedLevel = 0): LabResult {
  const item = LABS.find(candidate => candidate.id === labId);
  if (!item) throw new Error(`Unknown laboratory: ${labId}`);
  const v = sanitizeValues(item, incoming), level = clamp(Math.round(requestedLevel), 0, 2);
  const outputs: LabResult['outputs'] = [], checks: Criterion[] = [];
  const visual: LabResult['visual'] = { ...v };
  const add = (...entries: LabResult['outputs']) => outputs.push(...entries);
  switch (labId) {
    case 'airfoil-wind-tunnel': {
      const stall = v.angle > 14, cl = 2 * Math.PI * rad(Math.min(v.angle, 14)) * (stall ? Math.max(0.25, 1 - (v.angle - 14) * 0.08) : 1);
      const cd = 0.025 + 0.06 * cl * cl + (stall ? (v.angle - 14) * 0.015 : 0), q = 0.5 * 1.225 * v.speed ** 2 * v.area;
      const lift = q * cl, drag = q * cd, ratio = lift / drag;
      add(out('Lift', lift, 'N'), out('Drag', drag, 'N'), out('Lift / drag', ratio), out('Flow state', stall ? 'Stalled model' : 'Attached model'));
      checks.push(min('Lift', lift, [250, 700, 1800][level], 'N'), max('Angle before stall', v.angle, 14, '°'));
      if (level === 1) checks.push(min('Lift / drag', ratio, 8));
      if (level === 2) checks.push(max('Drag', drag, 150, 'N'), max('Air speed', v.speed, 35, 'm/s'));
      Object.assign(visual, { lift, drag, cl, stall: +stall }); break;
    }
    case 'gear-train': {
      const ratio = v.driven / v.driver, speed = v.rpm / ratio, torque = v.torque * ratio * 0.95, power = v.torque * v.rpm * 2 * Math.PI / 60;
      add(out('Reduction ratio', ratio, ':1'), out('Output speed', speed, 'rpm'), out('Output torque', torque, 'N·m'), out('Input power', power, 'W'));
      if (!level) checks.push(band('Gear reduction', ratio, 1.9, 2.1));
      else checks.push(min('Output torque', torque, level === 1 ? 12 : 25, 'N·m'), min('Output speed', speed, level === 1 ? 60 : 80, 'rpm'));
      if (level === 2) checks.push(max('Input power', power, 350, 'W'));
      Object.assign(visual, { ratio, speed, torque }); break;
    }
    case 'hydraulic-equalizer': {
      const pressure = v.force / v.small * 10, force = v.force * v.large / v.small, travel = 10 * v.small / v.large;
      add(out('Fluid pressure', pressure, 'kPa'), out('Output force', force, 'N'), out('Output travel for 10 cm input', travel, 'cm'), out('Force / load', force / v.load));
      checks.push(min('Output force / load', force / v.load, 1));
      if (level) checks.push(min('Load lifted', v.load, level === 1 ? 250 : 500, 'N'), max('Pressure', pressure, 500, 'kPa'));
      if (level === 2) checks.push(max('Input force', v.force, 40, 'N'));
      Object.assign(visual, { pressure, outputForce: force, travel }); break;
    }
    case 'thermal-expansion': {
      const alpha = [12, 23, 9][v.material] * 1e-6, elastic = [200, 69, 70][v.material] * 1000;
      const expansion = alpha * v.length * v.temperature * 1000, stress = Math.max(0, alpha * v.temperature - v.gap / (v.length * 1000)) * elastic;
      add(out('Free expansion', expansion, 'mm'), out('Restrained stress', stress, 'MPa'), out('Gap shortfall', Math.max(0, expansion - v.gap), 'mm'));
      if (level < 2) checks.push(min('Free expansion', expansion, 2, 'mm'));
      if (level) checks.push(max('Restrained stress', stress, level === 1 ? 50 : 35, 'MPa'));
      if (level === 2) checks.push(min('Beam length', v.length, 5, 'm'), min('Temperature rise', v.temperature, 80, '°C'), max('Gap', v.gap, 8, 'mm'));
      Object.assign(visual, { expansion, stress }); break;
    }
    case 'flywheel-storage': {
      const omega = v.rpm * 2 * Math.PI / 60, inertia = 0.5 * v.mass * v.radius ** 2, energy = 0.5 * inertia * omega ** 2 / 3600, rim = omega * v.radius;
      add(out('Stored energy', energy, 'Wh'), out('Rim speed', rim, 'm/s'), out('Moment of inertia', inertia, 'kg·m²'));
      checks.push(min('Stored energy', energy, [2, 10, 20][level], 'Wh'));
      if (level) checks.push(max('Rim speed', rim, 80, 'm/s'));
      if (level === 2) checks.push(max('Mass', v.mass, 50, 'kg'));
      Object.assign(visual, { energy, rim }); break;
    }
    case 'warren-truss': {
      const length = Math.hypot(v.span / 2, v.height), force = v.load * 1000 / (2 * v.height / length), stress = force / v.area;
      const displacement = v.load * 1000 * length ** 3 / (2 * 200e9 * v.area * 1e-6 * v.height ** 2) * 1000, volume = 2 * length * v.area * 1e-6;
      add(out('Diagonal axial force', force / 1000, 'kN'), out('Diagonal stress', stress, 'MPa'), out('Center movement', displacement, 'mm'), out('Diagonal material', volume, 'm³'));
      checks.push(max('Diagonal stress', stress, 150, 'MPa'));
      if (level) checks.push(min('Central load', v.load, level === 1 ? 75 : 100, 'kN'), max('Center movement', displacement, 10, 'mm'));
      if (level === 2) checks.push(max('Diagonal material', volume, 0.02, 'm³'));
      Object.assign(visual, { stress, displacement, force }); break;
    }
    case 'retaining-wall': {
      const ka = Math.tan(rad(45 - v.phi / 2)) ** 2, thrust = 0.5 * ka * v.density * v.height ** 2, weight = 24 * v.width * v.height;
      const sliding = v.friction * weight / thrust, overturn = weight * v.width / 2 / (thrust * v.height / 3);
      add(out('Active earth coefficient', ka), out('Soil thrust per meter', thrust, 'kN/m'), out('Sliding safety factor', sliding), out('Overturning safety factor', overturn));
      checks.push(min('Sliding factor', sliding, level ? 1.5 : 1.3));
      if (level) checks.push(min('Overturning factor', overturn, 2));
      if (level === 2) checks.push(min('Retained height', v.height, 3, 'm'), max('Wall width', v.width, 1.5, 'm'));
      Object.assign(visual, { thrust, sliding, overturn }); break;
    }
    case 'concrete-rebar': {
      const as = v.bars * Math.PI * (v.diameter / 2) ** 2, d = v.depth - 40, block = as * 400 / (0.85 * 25 * v.width);
      const capacity = 0.9 * as * 400 * (d - block / 2) / 1e6, demand = v.load * v.span / 4;
      const inertia = v.width * v.depth ** 3 / 12, deflection = v.load * 1000 * (v.span * 1000) ** 3 / (48 * 30000 * inertia);
      add(out('Reduced bending capacity', capacity, 'kN·m'), out('Bending demand', demand, 'kN·m'), out('Capacity / demand', capacity / demand), out('Elastic deflection', deflection, 'mm'));
      checks.push(min('Capacity / demand', capacity / demand, level ? 1.5 : 1), max('Reinforcement fraction', as / (v.width * d), 0.04), max('Compression block / effective depth', block / d, 0.6));
      if (level) checks.push(max('Deflection', deflection, v.span * 1000 / 360, 'mm'));
      if (level === 2) checks.push(min('Central load', v.load, 60, 'kN'), max('Beam depth', v.depth, 450, 'mm'));
      Object.assign(visual, { capacity, demand, deflection, block }); break;
    }
    case 'hydrostatic-dam': {
      const pressure = 9.81 * v.height, thrust = 0.5 * 9.81 * v.height ** 2 * v.length, weight = 0.5 * v.base * v.height * v.length * 2.4 * 9.81;
      const overturn = weight * (2 * v.base / 3) / (thrust * v.height / 3);
      add(out('Bottom water pressure', pressure, 'kPa'), out('Horizontal water thrust', thrust, 'kN'), out('Dam weight', weight, 'kN'), out('Overturning factor', overturn));
      checks.push(min('Overturning factor', overturn, level ? 2 : 1.5));
      if (level) checks.push(min('Water depth', v.height, 8, 'm'));
      if (level === 2) checks.push(max('Base width / depth', v.base / v.height, 0.8));
      Object.assign(visual, { pressure, thrust, overturn }); break;
    }
    case 'earthquake-table': {
      const wn = Math.sqrt(v.stiffness * 1000 / v.mass), omega = 2 * Math.PI * v.frequency, r = omega / wn;
      const denominator = Math.sqrt((1 - r * r) ** 2 + (2 * v.damping * r) ** 2), amplification = Math.sqrt(1 + (2 * v.damping * r) ** 2) / denominator;
      const displacement = v.acceleration * 9.81 / (wn * wn * denominator) * 1000;
      add(out('Natural frequency', wn / (2 * Math.PI), 'Hz'), out('Peak relative sway', displacement, 'mm'), out('Acceleration amplification', amplification), out('Roof acceleration', v.acceleration * amplification, 'g'));
      checks.push(max('Sway', displacement, [40, 20, 10][level], 'mm'));
      if (level) checks.push(max('Acceleration amplification', amplification, 1.5), max('Damping ratio', v.damping, level === 1 ? 0.25 : 0.3));
      if (level === 2) checks.push(min('Ground acceleration', v.acceleration, 0.3, 'g'));
      Object.assign(visual, { natural: wn / (2 * Math.PI), displacement, amplification }); break;
    }
    case 'voltage-divider': {
      const parallel = v.r2 * v.load / (v.r2 + v.load), current = v.voltage / (v.r1 + parallel), voltage = current * parallel;
      const power = (current * current * v.r1 + voltage * voltage / v.r2) * (v.ac ? 0.5 : 1), rms = voltage / (v.ac ? Math.sqrt(2) : 1);
      add(out(v.ac ? 'Output peak' : 'Output DC', voltage, 'V'), out('Output RMS', rms, 'V'), out('Resistor heating', power, 'W'), out('Load heating', rms * rms / v.load, 'W'));
      checks.push(band('Output voltage', voltage, level ? 3.15 : 5.7, level ? 3.45 : 6.3, 'V'), exact('AC source enabled', v.ac, level === 2 ? 1 : 0));
      if (level) checks.push(max('Resistor heating', power, 0.05, 'W'));
      if (level === 2) checks.push(max('Load resistance', v.load, 10000, 'Ω'));
      Object.assign(visual, { outputVoltage: voltage, rms, power }); break;
    }
    case 'logic-array': {
      const output = gateOutput(v.gate, v.a, v.b), truth = [0, 0, 1, 1].map((a, i) => gateOutput(v.gate, a, i % 2)).join('');
      add(out('Output Y', output ? 'HIGH (1)' : 'LOW (0)'), out('Truth table (00, 01, 10, 11)', truth), out('Selected gate', ['AND', 'OR', 'XOR', 'NAND'][v.gate]));
      checks.push(exact('Correct gate index', v.gate, [0, 2, 3][level]), exact('Required output', output, level === 2 ? 0 : 1));
      Object.assign(visual, { output, truth }); break;
    }
    case 'rc-filter': {
      const cutoff = 1 / (2 * Math.PI * v.resistance * v.capacitance * 1e-6), ratio = v.frequency / cutoff;
      const gain = (v.highpass ? ratio : 1) / Math.sqrt(1 + ratio * ratio), phase = v.highpass ? 90 - deg(Math.atan(ratio)) : -deg(Math.atan(ratio));
      add(out('Cutoff frequency', cutoff, 'Hz'), out('Amplitude gain', gain), out('Gain', 20 * Math.log10(gain), 'dB'), out('Phase shift', phase, '°'));
      if (!level) checks.push(band('Cutoff frequency', cutoff, 139, 179, 'Hz'));
      else { checks.push(exact('Filter type', v.highpass, level === 2 ? 1 : 0), band('Signal frequency', v.frequency, 995, 1005, 'Hz')); if (level === 1) checks.push(min('Cutoff frequency', cutoff, 100, 'Hz'), max('Signal gain', gain, 0.2)); else checks.push(max('Cutoff frequency', cutoff, 300, 'Hz'), min('Signal gain', gain, 0.95)); }
      Object.assign(visual, { cutoff, gain, phase }); break;
    }
    case 'seven-segment': {
      const pattern = 'abcdefg'.split('').map(k => v[k]).join(''), target = DIGITS[[2, 5, 9][level]], matches = pattern.split('').filter((bit, i) => bit === target[i]).length;
      const active = pattern.split('').filter(bit => bit === '1').length, current = 3000 / v.resistance, digit = DIGITS.indexOf(pattern);
      add(out('Displayed digit', digit < 0 ? 'Non-digit pattern' : String(digit)), out('Segment current', current, 'mA'), out('Total current', active * current, 'mA'), out('Correct segment connections', matches, '/7'));
      checks.push(exact('Correct segment connections', matches, 7), band('Segment current', current, 5, level === 2 ? 10 : 15, 'mA'));
      Object.assign(visual, { pattern, target, current }); break;
    }
    case 'motor-transistor': {
      const base = (v.logic - 0.7) / v.base, demand = (v.supply - 0.2) / 20, capability = 10 * base, on = Math.min(demand, capability), current = on * v.duty / 100, saturation = capability / demand;
      add(out('Control-pin current', base * 1000, 'mA'), out('Average motor current', current, 'A'), out('Drive capability / demand', saturation), out('Flyback protection', v.diode ? 'Diode connected' : 'Missing diode'));
      if (!level) checks.push(min('Motor average current', current, 0.1, 'A'));
      else checks.push(exact('Flyback diode', v.diode, 1), min('Saturation drive ratio', saturation, 1));
      if (level === 2) checks.push(max('Control current', base * 1000, 20, 'mA'), max('PWM duty', v.duty, 75, '%'), band('Average motor current', current, 0.07, 0.12, 'A'));
      Object.assign(visual, { current, baseCurrent: base, saturation }); break;
    }
    case 'differential-drive': {
      const speed = (v.left + v.right) / 2, omega = (v.right - v.left) / v.track, angle = omega * v.time;
      const x = Math.abs(omega) < 1e-8 ? speed * v.time : speed / omega * Math.sin(angle), y = Math.abs(omega) < 1e-8 ? 0 : speed / omega * (1 - Math.cos(angle)), travel = Math.abs(speed) * v.time;
      add(out('Center speed', speed, 'm/s'), out('Final x', x, 'm'), out('Final y', y, 'm'), out('Heading change', deg(angle), '°'));
      if (!level) checks.push(min('Forward distance', x, 2, 'm'), max('Heading deviation', Math.abs(deg(angle)), 5, '°'));
      if (level === 1) checks.push(band('Heading change', deg(angle), 80, 100, '°'), min('Arc travel', travel, 0.5, 'm'));
      if (level === 2) checks.push(band('Heading change magnitude', Math.abs(deg(angle)), 170, 190, '°'), max('Center travel', travel, 0.05, 'm'));
      Object.assign(visual, { speed, omega, angle, x, y }); break;
    }
    case 'pid-line-follower': {
      const trace = pidTrace(v), final = Math.abs(trace[trace.length - 1]), overshoot = Math.max(0, -Math.min(...trace)), mean = trace.reduce((sum, e) => sum + Math.abs(e), 0) / trace.length;
      add(out('Final absolute error', final, 'm'), out('Overshoot past line', overshoot, 'm'), out('Mean absolute error', mean, 'm'), out('Simulated duration', 8, 's'));
      checks.push(max('Final error', final, level ? 0.05 : 0.1, 'm'));
      if (level) checks.push(max('Overshoot', overshoot, 0.15, 'm'));
      if (level === 2) checks.push(min('Disturbance', v.bias, 0.3), max('Mean absolute error', mean, 0.2, 'm'));
      Object.assign(visual, { trace: JSON.stringify(trace), final, overshoot, mean }); break;
    }
    case 'arm-inverse-kinematics': {
      const distance = Math.hypot(v.x, v.y), reachable = distance <= v.l1 + v.l2 && distance >= Math.abs(v.l1 - v.l2);
      const cosine = clamp((distance * distance - v.l1 ** 2 - v.l2 ** 2) / (2 * v.l1 * v.l2), -1, 1), theta2 = Math.acos(cosine) * (v.elbow ? -1 : 1);
      const theta1 = Math.atan2(v.y, v.x) - Math.atan2(v.l2 * Math.sin(theta2), v.l1 + v.l2 * Math.cos(theta2));
      add(out('Target status', reachable ? 'Reachable' : 'Unreachable'), out('Shoulder angle', reachable ? rounded(deg(theta1)) : '—', '°'), out('Elbow angle', reachable ? rounded(deg(theta2)) : '—', '°'), out('Manipulability index', reachable ? Math.abs(Math.sin(theta2)) : 0));
      checks.push(exact('Reachable target', +reachable, 1));
      if (!level) checks.push(min('Target distance', distance, 3, 'm'));
      if (level) checks.push(band('Target x', v.x, level === 1 ? 3.99 : 4.99, level === 1 ? 4.01 : 5.01, 'm'), band('Target y', v.y, level === 1 ? 1.99 : 2.99, level === 1 ? 2.01 : 3.01, 'm'));
      if (level === 1) checks.push(min('Manipulability', Math.abs(Math.sin(theta2)), 0.7));
      if (level === 2) checks.push(exact('Negative elbow branch', v.elbow, 1), max('Shoulder magnitude', Math.abs(deg(theta1)), 90, '°'), max('Elbow magnitude', Math.abs(deg(theta2)), 150, '°'));
      Object.assign(visual, { theta1, theta2, reachable: +reachable }); break;
    }
    case 'ultrasonic-map': {
      const speed = 331.3 + 0.606 * v.temperature, distance = speed * v.echo / 2e6, x = distance * Math.cos(rad(v.angle)), y = distance * Math.sin(rad(v.angle));
      add(out('Calibrated sound speed', speed, 'm/s'), out('Obstacle range', distance, 'm'), out('Map x', x, 'm'), out('Map y', y, 'm'));
      checks.push(band('Sensor range', distance, 0.05, 4, 'm'));
      if (!level) checks.push(band('Obstacle distance', distance, 0.9, 1.1, 'm'));
      else { const tol = level === 1 ? 0.15 : 0.1; checks.push(band('Map x', x, 2 - tol, 2 + tol, 'm'), band('Map y', y, 1 - tol, 1 + tol, 'm')); }
      if (level === 2) checks.push(min('Air temperature', v.temperature, 35, '°C'));
      Object.assign(visual, { distance, x, y }); break;
    }
    case 'finite-state-machine': {
      const events = ['clear', 'obstacle', 'clear', 'low', 'clear'], names = ['Search', 'Forward', 'Turn', 'Stop']; let state = 0;
      const trace = events.map(event => { state = state === 3 ? 3 : v[event]; return state; });
      add(out('Event-run states', trace.map(s => names[s]).join(' → ')), out('Final state', names[state]), out('Safety latch', trace[3] === 3 && trace[4] === 3 ? 'Stop stays latched' : 'No stop latch reached'));
      checks.push(exact('Clear-path destination (Forward=1)', v.clear, 1));
      if (level) checks.push(exact('Obstacle destination (Turn=2)', v.obstacle, 2));
      if (level === 2) checks.push(exact('Low-battery destination (Stop=3)', v.low, 3), exact('Final latched Stop', state, 3));
      Object.assign(visual, { trace: trace.join(','), state }); break;
    }
    case 'synthetic-ecg': {
      const gain = (f: number) => (f / Math.sqrt(f * f + v.highpass * v.highpass)) / Math.sqrt(1 + (f / v.cutoff) ** 2);
      const noise = gain(50), drift = gain(0.3), feature = gain(10), residual = v.noise * noise;
      add(out('50 Hz noise gain', noise), out('0.3 Hz drift gain', drift), out('10 Hz feature gain', feature), out('Residual 50 Hz noise', residual, 'mV'));
      checks.push(max('50 Hz noise gain', noise, 0.4));
      if (level) checks.push(max('Baseline drift gain', drift, 0.4));
      if (level === 2) checks.push(min('10 Hz feature gain', feature, 0.8), max('Residual fast noise', residual, 0.08, 'mV'));
      Object.assign(visual, { noiseGain: noise, driftGain: drift, featureGain: feature }); break;
    }
    case 'heart-valve': {
      const area = Math.PI * (v.radius / 1000) ** 2 * v.opening / 100, velocity = 0.7 * Math.sqrt(2 * v.pressure * 133.322 / 1060), gross = area * velocity * 60000, net = gross * (1 - v.leak / 100);
      add(out('Gross forward flow', gross, 'L/min'), out('Net forward flow', net, 'L/min'), out('Mean opening velocity', velocity, 'm/s'), out('Effective open area', area * 1e6, 'mm²'));
      if (!level) checks.push(min('Net forward flow', net, 2, 'L/min'));
      else checks.push(band('Net forward flow', net, 3, 6, 'L/min'), max('Pressure difference', v.pressure, 10, 'mmHg'), max('Leakage fraction', v.leak, level === 1 ? 5 : 2, '%'));
      if (level === 2) checks.push(max('Valve diameter', 2 * v.radius, 12, 'mm'));
      Object.assign(visual, { gross, net, velocity }); break;
    }
    case 'prosthetic-grip': {
      const normal = 2 * v.tendon * v.ratio * v.lever / v.finger, holding = normal * v.friction, factor = holding / (v.mass * 9.81);
      add(out('Total normal grip force', normal, 'N'), out('Available friction force', holding, 'N'), out('Object weight', v.mass * 9.81, 'N'), out('Holding safety factor', factor));
      checks.push(min('Holding factor', factor, [1, 1.5, 2][level]));
      if (level) checks.push(max('Total normal grip', normal, 20, 'N'));
      if (level === 2) checks.push(min('Object mass', v.mass, 0.5, 'kg'), max('Tendon pull', v.tendon, 10, 'N'));
      Object.assign(visual, { normal, holding, factor }); break;
    }
    case 'microfluidic-viscosity': {
      const radius = v.radius * 1e-6, viscosity = v.viscosity * 0.001, length = v.length * 0.001;
      const flow = Math.PI * radius ** 4 * v.pressure * 1000 / (8 * viscosity * length), speed = flow / (Math.PI * radius * radius), reynolds = 1000 * speed * 2 * radius / viscosity, microliters = flow * 6e10;
      add(out('Volume flow', microliters, 'µL/min'), out('Mean velocity', speed * 1000, 'mm/s'), out('Reynolds number', reynolds), out('Flow regime', reynolds < 200 ? 'Within lesson laminar range' : 'Outside lesson laminar range'));
      checks.push(band('Volume flow', microliters, [10, 20, 40][level], [50, 30, 60][level], 'µL/min'), max('Reynolds number', reynolds, 199.999));
      if (level) checks.push(max('Pressure difference', v.pressure, 1, 'kPa'));
      if (level === 2) checks.push(min('Dynamic viscosity', v.viscosity, 3, 'mPa·s'));
      Object.assign(visual, { flow: microliters, speed, reynolds }); break;
    }
    case 'tissue-scaffold': {
      const p = v.porosity / 100, effective = v.modulus * (1 - p) ** 2, stress = v.force / v.area, strain = stress / effective, transport = p ** 3 / (1 - p) ** 2;
      add(out('Effective modulus', effective, 'MPa'), out('Compressive stress', stress, 'MPa'), out('Compressive strain', strain * 100, '%'), out('Relative transport index', transport));
      checks.push(max('Compressive strain', strain * 100, level ? 2 : 5, '%'), min('Porosity', v.porosity, [40, 60, 65][level], '%'));
      if (level === 2) checks.push(min('Compression force', v.force, 50, 'N'));
      Object.assign(visual, { effective, stress, strain, transport }); break;
    }
    case 'solar-orientation': {
      const incidence = Math.max(0, Math.sin(rad(v.altitude)) * Math.cos(rad(v.tilt)) + Math.cos(rad(v.altitude)) * Math.sin(rad(v.tilt)) * Math.cos(rad(v.azimuth))), power = 1000 * v.area * v.efficiency / 100 * incidence;
      add(out('Incidence factor', incidence), out('Instantaneous electrical power', power, 'W'), out('5 equivalent full-power hours', power * 5 / 1000, 'kWh'));
      checks.push(min('Incidence factor', incidence, level ? 0.95 : 0.9));
      if (level) checks.push(min('Electric power', power, level === 1 ? 300 : 600, 'W'));
      if (level === 2) checks.push(max('Panel area', v.area, 3, 'm²'), max('Conversion efficiency', v.efficiency, 22, '%'));
      Object.assign(visual, { incidence, power }); break;
    }
    case 'wind-pitch': {
      const tip = 2 * Math.PI * v.rpm / 60 * v.radius / v.wind, cp = 0.45 * Math.exp(-(((v.pitch - 6) / 10) ** 2) - ((tip - 6) / 3) ** 2), available = 0.5 * 1.225 * Math.PI * v.radius ** 2 * v.wind ** 3, power = available * cp * 0.9;
      add(out('Tip-speed ratio', tip), out('Power coefficient Cp', cp), out('Available wind power', available, 'W'), out('Electric power', power, 'W'));
      checks.push(min('Electric power', power, [200, 500, 2000][level], 'W'));
      if (level) checks.push(min('Power coefficient', cp, 0.35));
      if (level === 2) checks.push(max('Wind speed', v.wind, 10, 'm/s'), max('Rotor radius', v.radius, 3, 'm'));
      Object.assign(visual, { tip, cp, power }); break;
    }
    case 'water-filtration': {
      const remaining = Math.exp(-0.025 * v.gravel - 0.14 * v.sand - 0.06 * v.carbon), removal = 100 * (1 - remaining), flow = 8 * v.head / (1 + 0.2 * v.gravel + 2 * v.sand + 1.2 * v.carbon), depth = v.gravel + v.sand + v.carbon;
      add(out('Modeled particle removal', removal, '%'), out('Output particle turbidity', v.turbidity * remaining, 'NTU'), out('Modeled flow', flow, 'mL/min'), out('Drinking-water safety', 'NOT established'));
      checks.push(min('Particle removal', removal, [70, 90, 95][level], '%'), min('Gravel layer', v.gravel, 1, 'cm'), min('Sand layer', v.sand, 1, 'cm'), min('Carbon layer', v.carbon, 1, 'cm'));
      if (level) checks.push(min('Flow', flow, level === 1 ? 10 : 12, 'mL/min'));
      if (level === 2) checks.push(max('Total layer depth', depth, 25, 'cm'));
      Object.assign(visual, { removal, flow, depth, remaining }); break;
    }
    case 'hydroelectric-flow': {
      const netHead = v.head * (1 - v.loss / 100), power = 9.81 * v.flow * netHead * v.efficiency / 100, remaining = 0.8 - v.flow;
      add(out('Net water head', netHead, 'm'), out('Electric power', power, 'kW'), out('Remaining river flow', remaining, 'm³/s'));
      checks.push(min('Electric power', power, [1, 10, 30][level], 'kW'));
      if (level) checks.push(min('Remaining river flow', remaining, 0.3, 'm³/s'));
      if (level === 1) checks.push(min('Efficiency', v.efficiency, 70, '%'));
      if (level === 2) checks.push(max('Diverted flow', v.flow, 0.3, 'm³/s'), max('Gross head', v.head, 20, 'm'));
      Object.assign(visual, { netHead, power, remaining }); break;
    }
    case 'geothermal-heat-pump': {
      const hot = v.indoor + v.approach + 273.15, cold = v.ground - v.approach + 273.15, ideal = hot / (hot - cold), cop = ideal * v.fraction / 100, heat = v.power * cop, ground = heat - v.power;
      add(out('Heating COP', cop), out('Delivered heat', heat, 'kW'), out('Electric input', v.power, 'kW'), out('Heat extracted from ground', ground, 'kW'));
      if (level < 2) checks.push(min('Heating COP', cop, level ? 4 : 3));
      if (level) checks.push(min('Delivered heat', heat, level === 1 ? 8 : 12, 'kW'));
      if (level === 2) checks.push(max('Electric input', v.power, 3, 'kW'), max('Ground temperature', v.ground, 12, '°C'), max('Heat-exchanger approach', v.approach, 5, 'K'));
      Object.assign(visual, { cop, heat, groundHeat: ground }); break;
    }
  }
  const epsilon = 1e-8;
  const successes = checks.map(check => (check.lo === undefined || check.value >= check.lo - epsilon) && (check.hi === undefined || check.value <= check.hi + epsilon));
  const score = Math.round(checks.reduce((sum, check, i) => {
    if (successes[i]) return sum + 100;
    const bound = check.lo !== undefined && check.value < check.lo ? check.lo : check.hi!;
    const scale = Math.max(Math.abs(bound), check.lo !== undefined && check.hi !== undefined ? check.hi - check.lo : 0, 0.1);
    return sum + Math.max(0, 100 - 100 * Math.abs(check.value - bound) / scale);
  }, 0) / Math.max(checks.length, 1));
  const feedback = checks.map((check, i) => {
    const target = check.lo !== undefined && check.hi !== undefined ? check.lo === check.hi ? `= ${check.lo}` : `${check.lo}–${check.hi}` : check.lo !== undefined ? `≥ ${check.lo}` : `≤ ${check.hi}`;
    return `${successes[i] ? '✓' : 'Try again:'} ${check.label}: ${rounded(check.value)}${check.unit ? ` ${check.unit}` : ''}; target ${target}${check.unit ? ` ${check.unit}` : ''}.`;
  });
  return { outputs, score, passed: checks.length > 0 && successes.every(Boolean), feedback, visual };
}
