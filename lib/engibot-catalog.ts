import type { ActivityGuide } from "./engibot-context";

// Authored activity metadata snapshot. Contains no student profiles or state.
export const ENGINEERING_CONTEXT: readonly ActivityGuide[] = [
  {
    "id": "airfoil-wind-tunnel",
    "kind": "lab",
    "field": "mechanical",
    "title": "Airfoil Wind Tunnel",
    "summary": "Balance lift, drag, and stall in a virtual wind tunnel.",
    "guidance": [
      "Start at a small angle and observe the lift arrow.",
      "Double speed while holding area fixed. Notice the squared effect.",
      "Explore angles above 14° to see the assumed stall response.",
      "Lift = ½ρv²A CL",
      "Drag = ½ρv²A CD"
    ],
    "safety": [
      "Steady incompressible air at density 1.225 kg/m³.",
      "Lift coefficient is 2π × angle in radians until 14°; a deliberately simplified falloff models stall after 14°."
    ]
  },
  {
    "id": "gear-train",
    "kind": "lab",
    "field": "mechanical",
    "title": "Gear Train Ratio & Torque",
    "summary": "Trade rotational speed for torque with two meshing gears.",
    "guidance": [
      "Count the driver and driven teeth.",
      "Increase the driven gear and compare speed with torque.",
      "Check input power: torque and speed together cost energy.",
      "Ratio = driven teeth / driver teeth",
      "Output rpm = input rpm / ratio"
    ],
    "safety": [
      "Two ideal external spur gears; shafts are rigid.",
      "Constant 95% torque-transfer efficiency, no backlash or changing friction."
    ]
  },
  {
    "id": "hydraulic-equalizer",
    "kind": "lab",
    "field": "mechanical",
    "title": "Hydraulic Pressure Equalizer",
    "summary": "Use equal fluid pressure to lift a load with unequal piston areas.",
    "guidance": [
      "Compare the two piston areas.",
      "Press the small piston by increasing input force.",
      "Observe that increasing force multiplication reduces output travel.",
      "Pressure = input force / input area",
      "Output force = pressure × output area"
    ],
    "safety": [
      "Incompressible fluid; friction, leaks, and pipe height differences ignored.",
      "Input piston stroke is fixed at 10 cm; output displacement follows volume conservation."
    ]
  },
  {
    "id": "thermal-expansion",
    "kind": "lab",
    "field": "mechanical",
    "title": "Thermal Expansion Stress",
    "summary": "Leave room for a heated beam to expand before stress builds.",
    "guidance": [
      "Compare material expansion coefficients.",
      "Increase temperature to predict the free expansion.",
      "Open an expansion gap and observe stress decrease.",
      "Free expansion = α L ΔT",
      "Stress = E × max(0, α ΔT − gap/L)"
    ],
    "safety": [
      "Uniform temperature and linear elastic materials.",
      "Steel: α=12 μm/(m·K), E=200 GPa; aluminum: 23 and 69; glass: 9 and 70."
    ]
  },
  {
    "id": "flywheel-storage",
    "kind": "lab",
    "field": "mechanical",
    "title": "Flywheel Energy Storage",
    "summary": "Store rotational energy while limiting the rim speed.",
    "guidance": [
      "Increase speed and watch energy rise with its square.",
      "Compare mass and radius changes.",
      "Read the rim-speed limit before increasing rpm.",
      "Angular speed ω = 2π rpm / 60",
      "Energy = ½ I ω²"
    ],
    "safety": [
      "Do not build or spin a real high-speed flywheel. Stored rotational energy can be dangerous.",
      "Uniform solid disk, with moment of inertia I=½mr².",
      "No bearing loss, enclosure mass, or material failure calculation."
    ]
  },
  {
    "id": "warren-truss",
    "kind": "lab",
    "field": "civil",
    "title": "Warren Truss Bridge Load Tester",
    "summary": "Explore how triangular bracing carries a central load.",
    "guidance": [
      "Identify the two load-carrying diagonals.",
      "Raise the truss to steepen the diagonal angle.",
      "Change member area and compare stress with material use.",
      "Diagonal force = load / (2 sin θ)",
      "Axial stress = diagonal force / area"
    ],
    "safety": [
      "A single symmetric triangular Warren panel with two elastic load-carrying diagonals; a teaching reduction, not a full bridge solver.",
      "Pin joints, symmetric central load, E=200 GPa; chord deformation, buckling, and self-weight ignored."
    ]
  },
  {
    "id": "retaining-wall",
    "kind": "lab",
    "field": "civil",
    "title": "Retaining Wall Soil Stability",
    "summary": "Balance soil thrust against a gravity wall’s weight and friction.",
    "guidance": [
      "Inspect the triangular lateral soil-pressure distribution.",
      "Increase width to add stabilizing weight.",
      "Compare soil friction and base friction: they act in different places.",
      "Ka = tan²(45° − φ/2)",
      "Soil thrust = ½ Ka γ H²"
    ],
    "safety": [
      "Rankine active pressure for dry, level, cohesionless soil and a frictionless vertical back face.",
      "Rectangular concrete gravity wall, unit weight 24 kN/m³, per meter length."
    ]
  },
  {
    "id": "concrete-rebar",
    "kind": "lab",
    "field": "civil",
    "title": "Concrete Beam and Rebar",
    "summary": "Compare bending demand, reinforcement capacity, and beam deflection.",
    "guidance": [
      "Observe bending concentrated at midspan.",
      "Increase depth and compare deflection.",
      "Add rebar to increase the simplified bending capacity.",
      "Bending demand = P span / 4",
      "a = As fy / (0.85 fc b)"
    ],
    "safety": [
      "Simply supported rectangular beam and a central point load; self-weight omitted.",
      "fc=25 MPa, fy=400 MPa, E=30 GPa, effective depth=depth−40 mm, capacity factor 0.9."
    ]
  },
  {
    "id": "hydrostatic-dam",
    "kind": "lab",
    "field": "civil",
    "title": "Hydrostatic Dam Pressure",
    "summary": "See why water pressure grows with depth and total thrust grows faster.",
    "guidance": [
      "Read pressure at the bottom and at the surface.",
      "Double the water depth to see thrust grow fourfold.",
      "Widen the triangular dam and compare stabilizing moment.",
      "Bottom pressure = ρgH",
      "Horizontal thrust = ½ρgH² × segment length"
    ],
    "safety": [
      "Static fresh water at 1,000 kg/m³; triangular concrete section at 2,400 kg/m³.",
      "Vertical upstream face; weight acts one-third of the base from that face."
    ]
  },
  {
    "id": "earthquake-table",
    "kind": "lab",
    "field": "civil",
    "title": "Earthquake Shaker Table",
    "summary": "Tune stiffness and damping to avoid a resonant shaking response.",
    "guidance": [
      "Sweep shaking frequency past the natural frequency.",
      "Notice the large resonance peak with little damping.",
      "Increase damping, then compare a stiffness change.",
      "Natural angular frequency = √(k/m)",
      "Relative sway = ag / √((ωn²−ω²)² + (2ζωnω)²)"
    ],
    "safety": [
      "Linear single-degree-of-freedom oscillator in steady sinusoidal base excitation.",
      "A single frequency is not a real earthquake time history."
    ]
  },
  {
    "id": "voltage-divider",
    "kind": "lab",
    "field": "electrical",
    "title": "AC/DC Voltage Divider",
    "summary": "Build a divider and investigate how an attached load changes the output.",
    "guidance": [
      "Compare R1 and R2 with a very large load resistance.",
      "Lower the load resistance to observe loading.",
      "Switch to AC; distinguish peak voltage from RMS voltage.",
      "Rparallel = R2 × Rload / (R2 + Rload)",
      "Output = input × Rparallel / (R1 + Rparallel)"
    ],
    "safety": [
      "Virtual low-voltage circuits only. Never use household mains power.",
      "Ideal resistive network, zero source impedance, 50 Hz sine wave for AC.",
      "AC control specifies peak input voltage, not RMS."
    ]
  },
  {
    "id": "logic-array",
    "kind": "lab",
    "field": "electrical",
    "title": "Logic Gate Array",
    "summary": "Build truth-table intuition using selectable digital gates.",
    "guidance": [
      "Toggle A and B one at a time.",
      "Read all four rows of the live truth table.",
      "Choose the gate named in the objective.",
      "AND: A ∧ B",
      "OR: A ∨ B"
    ],
    "safety": [
      "Ideal Boolean gates with no timing delay, voltage thresholds, or electrical loading.",
      "LOW is 0; HIGH is 1. XOR means exactly one input is HIGH."
    ]
  },
  {
    "id": "rc-filter",
    "kind": "lab",
    "field": "electrical",
    "title": "RC Frequency Filter",
    "summary": "Choose components and explore a first-order filter’s frequency response.",
    "guidance": [
      "Change either R or C to move the cutoff.",
      "Sweep input frequency and inspect signal amplitude.",
      "Compare low-pass with high-pass using the same components.",
      "fc = 1/(2πRC)",
      "Low-pass gain = 1/√(1+(f/fc)²)"
    ],
    "safety": [
      "Ideal source, ideal components, no load, steady sinusoidal signal.",
      "Gain is output amplitude / input amplitude; cutoff corresponds to gain 1/√2."
    ]
  },
  {
    "id": "seven-segment",
    "kind": "lab",
    "field": "electrical",
    "title": "Seven-Segment Breadboard Wiring",
    "summary": "Wire seven independently controlled LED segments to display a digit.",
    "guidance": [
      "Locate segments A through G on the display.",
      "Connect a segment by toggling its individual wire.",
      "Use one current-limiting resistor for every segment.",
      "Segment current = (5 V − 2 V) / R",
      "Total current = active segments × segment current"
    ],
    "safety": [
      "Use low-voltage battery circuits with adult supervision. Never omit the current-limiting resistors.",
      "Common-cathode display; ideal independent 5 V drivers and 2 V forward drop.",
      "Every active segment has its own identical resistor."
    ]
  },
  {
    "id": "motor-transistor",
    "kind": "lab",
    "field": "electrical",
    "title": "Transistor Motor Switching",
    "summary": "Control a toy motor through a transistor and protect the switching circuit.",
    "guidance": [
      "Increase base current by reducing its resistor.",
      "Compare requested motor current with transistor drive capability.",
      "Connect a flyback diode before switching an inductive load.",
      "Base current = (Vcontrol−0.7)/Rb",
      "On current = min((Vsupply−0.2)/20, 10 × base current)"
    ],
    "safety": [
      "Use only low-voltage toy motors and a rated driver. Never connect a motor directly to a microcontroller pin.",
      "Motor represented by 20 Ω; no inductive transient or back-EMF integration.",
      "BJT has 0.7 V base drop, 0.2 V saturation drop, and conservative forced gain of 10."
    ]
  },
  {
    "id": "differential-drive",
    "kind": "lab",
    "field": "robotics",
    "title": "Differential Drive Kinematics",
    "summary": "Predict the curved path of a two-wheel robot.",
    "guidance": [
      "Set equal wheel speeds to travel straight.",
      "Make one wheel faster to create a turning arc.",
      "Reverse one wheel to spin about the robot center.",
      "v = (vL+vR)/2",
      "Angular rate = (vR−vL)/track"
    ],
    "safety": [
      "Planar rigid robot starting at (0,0) facing +x.",
      "Constant wheel speeds, no slip or acceleration ramps."
    ]
  },
  {
    "id": "pid-line-follower",
    "kind": "lab",
    "field": "robotics",
    "title": "PID Line-Follower Tuning",
    "summary": "Tune a simulated steering controller and inspect its full error trace.",
    "guidance": [
      "Run with small Kp and observe slow correction.",
      "Add Kd to reduce oscillation.",
      "Add a little Ki to remove steady error caused by the disturbance.",
      "Steering = −Kp e − Ki ∫e dt − Kd e′",
      "Mean absolute error = average |e(t)|"
    ],
    "safety": [
      "A teaching lateral-error plant: e″ = steering + disturbance − 0.6e′.",
      "Explicit 0.02 s integration for 8 seconds, initial error 0.8 m and zero velocity."
    ]
  },
  {
    "id": "arm-inverse-kinematics",
    "kind": "lab",
    "field": "robotics",
    "title": "Robotic Arm Inverse Kinematics",
    "summary": "Choose a target and solve the two joint angles of a planar robot arm.",
    "guidance": [
      "Move the target outside the reachable annulus and read the warning.",
      "Lengthen a link until the target is reachable.",
      "Compare the two valid elbow branches.",
      "cos θ2 = (x²+y²−L1²−L2²)/(2L1L2)",
      "θ1 = atan2(y,x) − atan2(L2 sin θ2, L1+L2 cos θ2)"
    ],
    "safety": [
      "Two rigid links with ideal revolute joints in one plane.",
      "No joint collision, actuator load, speed limits, or obstacle avoidance."
    ]
  },
  {
    "id": "ultrasonic-map",
    "kind": "lab",
    "field": "robotics",
    "title": "Ultrasonic Obstacle Mapping",
    "summary": "Convert a round-trip echo into a mapped obstacle point.",
    "guidance": [
      "Remember that the echo time includes the outward and return trip.",
      "Rotate the sensor to place the point on the x–y map.",
      "Change air temperature and observe the calibrated distance.",
      "Distance = sound speed × echo time / 2",
      "x = distance cos(angle); y = distance sin(angle)"
    ],
    "safety": [
      "Single perfect echo from a point reflector, no false echoes or beam width.",
      "Sound speed ≈ 331.3 + 0.606 × temperature (m/s)."
    ]
  },
  {
    "id": "finite-state-machine",
    "kind": "lab",
    "field": "robotics",
    "title": "Finite State Machine Builder",
    "summary": "Wire event transitions for a robot that searches, moves, turns, and stops.",
    "guidance": [
      "Select a destination state for each event.",
      "Read the simulated sequence: clear, obstacle, clear, low battery, clear.",
      "Make obstacle events turn the robot instead of moving forward.",
      "nextState = transition[event], unless state is Stop",
      "Test events = clear → obstacle → clear → low battery → clear"
    ],
    "safety": [
      "Global event transitions from non-stopped states; this is a small editable transition table.",
      "Stop is an absorbing safety state until a new simulation run."
    ]
  },
  {
    "id": "synthetic-ecg",
    "kind": "lab",
    "field": "biomedical",
    "title": "Synthetic ECG Signal Filter",
    "summary": "Filter a generated heartbeat-like signal while preserving its sharp features.",
    "guidance": [
      "Inspect the raw synthetic trace and identify slow drift and fast ripple.",
      "Lower low-pass cutoff to reduce fast ripple.",
      "Increase high-pass cutoff to remove drift.",
      "Combined gain(f) = high-pass gain(f) × low-pass gain(f)",
      "Residual noise amplitude = input amplitude × gain(50 Hz)"
    ],
    "safety": [
      "Never connect homemade electronics to a person. This lab uses synthetic signals only.",
      "Generated Gaussian pulses, not recorded patient data; no diagnostic interpretation.",
      "Cascaded ideal first-order high-pass and low-pass frequency response."
    ]
  },
  {
    "id": "heart-valve",
    "kind": "lab",
    "field": "biomedical",
    "title": "Artificial Heart Valve Flow",
    "summary": "Explore an idealized one-way valve as an engineering fluid model.",
    "guidance": [
      "Open the valve and observe its effective flow area.",
      "Change pressure and compare flow: the relationship is a square root.",
      "Reduce the leakage fraction and compare gross with net flow.",
      "Q = 0.7 × open area × √(2ΔP/ρ)",
      "Net Q = gross Q × (1−leak fraction)"
    ],
    "safety": [
      "A classroom simulation only; it cannot guide patient care or real medical-device design.",
      "Steady orifice flow with density 1,060 kg/m³ and discharge coefficient 0.7.",
      "Leakage is a user-specified fraction of gross flow, not a modeled cardiac cycle."
    ]
  },
  {
    "id": "prosthetic-grip",
    "kind": "lab",
    "field": "biomedical",
    "title": "Prosthetic Grip Controller",
    "summary": "Balance grip strength with a fictional fragile-object force limit.",
    "guidance": [
      "Follow tendon force through the lever.",
      "Compare normal grip force with available friction.",
      "Try a slippery object by lowering friction.",
      "Force per finger = tendon pull × ratio × lever / finger length",
      "Holding factor = 2 × finger force × friction / object weight"
    ],
    "safety": [
      "Two symmetric rigid fingers and static Coulomb friction.",
      "Mechanical advantage has no frictional loss; contact area and motor heating ignored."
    ]
  },
  {
    "id": "microfluidic-viscosity",
    "kind": "lab",
    "field": "biomedical",
    "title": "Microfluidic Viscosity",
    "summary": "Investigate the fourth-power effect of channel radius on a tiny liquid flow.",
    "guidance": [
      "Double channel radius and observe the large flow change.",
      "Raise viscosity and compare flow resistance.",
      "Use channel radius to compensate for a thicker liquid.",
      "Q = π r⁴ ΔP / (8 μ L)",
      "Re = ρ v (2r) / μ"
    ],
    "safety": [
      "Steady laminar incompressible Newtonian liquid in a circular tube; density 1,000 kg/m³.",
      "No-slip walls, fully developed flow, and no surface-tension or entrance effects."
    ]
  },
  {
    "id": "tissue-scaffold",
    "kind": "lab",
    "field": "biomedical",
    "title": "Tissue Scaffold Stress",
    "summary": "Explore the tradeoff between a porous structure’s stiffness and open space.",
    "guidance": [
      "Raise porosity to create more open space.",
      "Observe the effective modulus fall as pores replace material.",
      "Change cross-section or material stiffness to recover load capacity.",
      "Stress = force / area",
      "Effective modulus = solid modulus × (1−p)²"
    ],
    "safety": [
      "Homogeneous linear-elastic compression model with Eeffective = Esolid(1−porosity)².",
      "Relative transport index p³/(1−p)² is qualitative, not a biological permeability measurement."
    ]
  },
  {
    "id": "solar-orientation",
    "kind": "lab",
    "field": "green",
    "title": "Solar Panel Orientation",
    "summary": "Aim a solar panel toward the sun and compare useful electric power.",
    "guidance": [
      "Rotate azimuth until the panel faces the sun.",
      "Tilt the panel so its normal points toward the sun.",
      "Compare area and efficiency with alignment changes.",
      "Incidence = sin(altitude) cos(tilt) + cos(altitude) sin(tilt) cos(azimuth)",
      "Electric power = irradiance × area × efficiency × max(0, incidence)"
    ],
    "safety": [
      "Direct irradiance fixed at 1,000 W/m²; no clouds, temperature loss, diffuse light, or shading.",
      "Sun position stays fixed; 5-hour energy is five equivalent full-power hours, not a daily forecast."
    ]
  },
  {
    "id": "wind-pitch",
    "kind": "lab",
    "field": "green",
    "title": "Wind Turbine Blade Pitch",
    "summary": "Tune pitch and rotor speed to capture energy from a moving air stream.",
    "guidance": [
      "Tune pitch near the peak of the teaching performance curve.",
      "Adjust rpm to change tip-speed ratio.",
      "Compare the cube-law effect of wind speed.",
      "Available wind power = ½ρπr²v³",
      "Tip-speed ratio = ωr/v"
    ],
    "safety": [
      "Air density 1.225 kg/m³ and generator efficiency 90%.",
      "Invented smooth Cp curve peaks at 0.45, pitch 6°, and tip-speed ratio 6; it is not manufacturer data."
    ]
  },
  {
    "id": "water-filtration",
    "kind": "lab",
    "field": "green",
    "title": "Multi-Layer Water Filtration",
    "summary": "Balance particle removal and flow through a classroom filter column.",
    "guidance": [
      "Add gravel, sand, and carbon layers.",
      "Compare modeled particle removal with the slower flow.",
      "Increase water head to push flow through the same layers.",
      "Particle fraction remaining = exp(−0.025g−0.14s−0.06c)",
      "Flow = 8 × head / (1+0.2g+2s+1.2c)"
    ],
    "safety": [
      "Never drink experimentally filtered water. This model does not establish potability.",
      "Deliberately illustrative exponential particle-capture model, not experimentally calibrated filtration performance.",
      "Removal coefficient per cm: gravel 0.025, sand 0.14, carbon 0.06."
    ]
  },
  {
    "id": "hydroelectric-flow",
    "kind": "lab",
    "field": "green",
    "title": "Hydroelectric Turbine Flow",
    "summary": "Convert elevation and water flow into power while leaving water in the river.",
    "guidance": [
      "Increase net head and compare power.",
      "Adjust diverted flow while watching remaining river flow.",
      "Reduce head loss and improve conversion efficiency.",
      "Net head = gross head × (1−loss fraction)",
      "Electric power = ρgQ × net head × efficiency"
    ],
    "safety": [
      "Steady freshwater flow at 1,000 kg/m³; fixed upstream river flow 0.8 m³/s.",
      "Efficiency is fixed at the selected value, with no part-load turbine curve."
    ]
  },
  {
    "id": "geothermal-heat-pump",
    "kind": "lab",
    "field": "green",
    "title": "Geothermal Heat Pump Efficiency",
    "summary": "Move heat from the ground and distinguish heat delivered from electricity used.",
    "guidance": [
      "Compare ground temperature with the indoor target.",
      "Reduce heat-exchanger approach to reduce the required temperature lift.",
      "Change compressor input and compare delivered heat with extracted ground heat.",
      "Ideal heating COP = Thot / (Thot−Tcold)",
      "Delivered heat = electricity × COP"
    ],
    "safety": [
      "Heating-only thermodynamic teaching model; ideal Carnot COP multiplied by an assumed performance fraction.",
      "Hot-side temperature = indoor target + approach; cold side = ground − approach; calculations use kelvin."
    ]
  },
  {
    "id": "hydraulic-crane",
    "kind": "project",
    "field": "mechanical",
    "title": "Cardboard Hydraulic Crane",
    "summary": "Lift a paper load with linked water-filled syringes and discover the force–distance trade-off.",
    "guidance": [
      "Ideal output force = input force × (output diameter / input diameter)². Try to lift the modeled 0.5 N load using no more than 1 N at the input.",
      "Sketch a triangular support on a 25 × 25 cm base. Fold and glue two cardboard gussets to keep it upright; let the glue set.",
      "Overlap the two arm strips by 3 cm and join them with a loose paper fastener so the arm can pivot.",
      "Fill the syringes and tubing over a tray. Connect them with minimal trapped air; gently push one plunger to observe the other move.",
      "Tape one syringe barrel to the support and its plunger end to the arm. Leave the other syringe free as the hand control; do not force a stalled plunger."
    ],
    "safety": [
      "Use needle-free syringes only. Never attach needles or point tubing toward a face.",
      "Use gentle hand pressure, water only and an open spill tray. Stop if a tube loosens or the cardboard bends.",
      "Keep fingers out of the pivot and the small load close to the tray. This model is not a lifting device for people or heavy objects."
    ]
  },
  {
    "id": "balloon-car",
    "kind": "project",
    "field": "mechanical",
    "title": "Balloon-Powered Car",
    "summary": "Build a rolling chassis and separate thrust from wheel resistance.",
    "guidance": [
      "Net acceleration = (thrust − rolling resistance) / mass. Aim for at least 0.3 m/s² without changing the assumed 0.025 N wheel resistance.",
      "Cut a 10 × 18 cm cardboard body. Tape two axle straws underneath, parallel and 12 cm apart.",
      "Slide blunt dowels through the axle straws and attach wheels so they do not rub the chassis. Push-test the car before adding propulsion.",
      "Tape the balloon neck snugly around the wide straw. Attach the straw on top with the opening pointing straight backward, clear of the wheels.",
      "Use a hand pump to inflate to a small, repeatable size; pinch the straw closed. Place the car on a clear floor lane and release."
    ],
    "safety": [
      "An adult handles puncturing wheel holes. Cover axle ends with tape.",
      "Use a pump rather than sharing mouth-inflated balloons. Check latex allergies and collect broken balloon pieces immediately; keep them from younger children and pets.",
      "Keep the lane away from stairs, traffic and faces. Do not overinflate."
    ]
  },
  {
    "id": "stick-catapult",
    "kind": "project",
    "field": "mechanical",
    "title": "Popsicle Stick Catapult",
    "summary": "Use a gentle hand-powered lever to explore how release angle changes a soft projectile's path.",
    "guidance": [
      "Ideal range = speed² × sin(2 × angle) / 9.81. Find an angle giving more than 0.10 m at 1.2 m/s; then compare equal angles either side of 45°.",
      "Tape five craft sticks into a low fulcrum stack on a cardboard base.",
      "Lay the sixth stick across the fulcrum and tape it loosely to make a hinge. Tape a teaspoon to the long end. Do not add rubber bands or other stored-energy mechanisms.",
      "Place the large open box 20 cm in front of the lever as a backstop. Clear the flight path and put on safety glasses.",
      "Place one cotton ball in the spoon. Gently press the short end with a fingertip so the cotton ball lands inside the box."
    ],
    "safety": [
      "Only launch one soft cotton ball or loose paper pom-pom. Never use stones, food, metal, pencils or sharp objects.",
      "Never aim at people, animals or breakable objects. Wear eye protection, keep an adult nearby, and use a box backstop.",
      "Use gentle hand power only; no elastic bands. Keep the flight under 1 m and stop if a stick cracks."
    ]
  },
  {
    "id": "suspension-bridge",
    "kind": "project",
    "field": "civil",
    "title": "Balsa Wood Suspension Bridge",
    "summary": "Create a miniature suspended deck and investigate cable sag and anchor forces.",
    "guidance": [
      "For an ideal center load on one cable, horizontal anchor force H = load × span / (4 × sag). Keep the modeled horizontal force below 1 N.",
      "Draw a 25 cm span on a broad cardboard base. Glue triangular braces to two towers and allow all glue to dry.",
      "Run two equal strings over the tower tops. Tape and tie their ends to reinforced anchors on the base, leaving about 5 cm sag.",
      "Cut a narrow cardboard deck. Use six pairs of equal string hangers to connect it to the main cables.",
      "Place a tray immediately below the deck. Add one 10 g bean packet at its center and observe sag and tower movement."
    ],
    "safety": [
      "Adults pre-cut balsa; do not use a craft knife unsupervised. Sand or tape splinters.",
      "Use bean packets, not heavy weights. Keep the model on a tray and never stand on it.",
      "Stop loading if a joint moves or a tower leans. This model does not certify a real bridge."
    ]
  },
  {
    "id": "earthquake-tower",
    "kind": "project",
    "field": "civil",
    "title": "Spaghetti & Marshmallow Earthquake Tower",
    "summary": "Brace a lightweight tower and compare its movement on a gentle hand-operated shaker.",
    "guidance": [
      "Natural frequency f = √(stiffness / mass) / (2π). Add braces to keep the model's natural frequency at least 0.5 Hz away from a 2 Hz shaker.",
      "Make a 12 × 12 cm square base and build two 12 cm stories using spaghetti columns and marshmallow joints.",
      "Add a paper roof flag. Sketch the unbraced shape and measure its total height.",
      "Tape foam pads between two cardboard sheets to make a soft shaker. Secure the tower base to the top sheet.",
      "Wearing glasses, gently move the bottom sheet side to side by about 1 cm for ten seconds, keeping hands clear of falling pieces."
    ],
    "safety": [
      "Do not eat construction materials. Check food allergies; use clay joints if needed.",
      "Wear eye protection and sweep up sharp spaghetti fragments.",
      "Use a low tower over a tray and gentle manual motion; no powered shaker."
    ]
  },
  {
    "id": "bottle-press",
    "kind": "project",
    "field": "civil",
    "title": "Water Bottle Hydraulic Press",
    "summary": "Build a low-force piston press in an open bottle frame and compare piston travel.",
    "guidance": [
      "Output travel = input travel × (input diameter / output diameter)². Can a 30 mm input stroke give at least 8 mm of output movement?",
      "Ask an adult to cut a large side opening in the bottle and cover every cut edge with tape. Keep the bottle permanently vented; it is a frame, never a sealed pressure vessel.",
      "Tape the larger syringe barrel vertically to the bottle frame with the plunger facing the foam. Tape a small cardboard pad to the plunger end.",
      "Fill the two syringes and tubing with water over a tray. Connect them, remove visible bubbles, and leave room for the output plunger to move.",
      "Place a foam square beneath the pad. Gently press the smaller syringe until the foam starts to compress."
    ],
    "safety": [
      "Only an adult cuts the bottle. Tape sharp edges and use needle-free syringes.",
      "Never seal, heat, pump air into or pressurize the bottle. It is an open supporting frame.",
      "Press soft foam only. Keep fingers away from the pad, apply gentle force and stop at any leak."
    ]
  },
  {
    "id": "led-card",
    "kind": "project",
    "field": "electrical",
    "title": "Copper Tape LED Greeting Card",
    "summary": "Turn a folded paper flap into a switch in a current-limited low-voltage circuit.",
    "guidance": [
      "For a red LED modeled at 2 V, current = (3 V − 2 V) / resistance. Choose a resistor giving 2–8 mA.",
      "Draw a circuit loop on the card with a gap for a folded paper switch. Mark battery plus, the resistor and the LED.",
      "Lay two separate copper-tape tracks, leaving gaps for the resistor and LED. Fold tape at corners rather than cutting the conductive path.",
      "Attach the 220 Ω resistor in series. Place the LED long lead toward battery plus and tape the leads firmly to their tracks.",
      "With the holder switched off, connect its red lead to the plus track and black lead to the return track. Ask an adult to check that the tracks do not touch directly."
    ],
    "safety": [
      "Use only two AA cells in an enclosed holder; no coin cells, rechargeable packs or wall outlets.",
      "Keep the 220 Ω resistor in series. Never join battery plus directly to minus; disconnect immediately if anything warms.",
      "Do not put circuit parts in your mouth or connect homemade electronics to a body."
    ]
  },
  {
    "id": "saltwater-battery",
    "kind": "project",
    "field": "electrical",
    "title": "Saltwater Battery",
    "summary": "Measure an electrochemical cell and learn why open-circuit voltage differs from useful loaded output.",
    "guidance": [
      "A model cell has 0.8 V open-circuit voltage and 600 Ω internal resistance. Loaded voltage = 0.8 × load resistance / (600 + load resistance). Aim for at least 0.5 V.",
      "Place two cups on a tray and add 100 mL water plus half a teaspoon of salt to each; stir with a disposable stirrer.",
      "Place one copper and one zinc strip in each cup, with the metals separated so they do not touch.",
      "With adult help, set the multimeter to low DC voltage and measure one cell across the two metals. Do not use the meter's current socket.",
      "Clip the 1 kΩ resistor across the cell and measure voltage again. Record the drop under load."
    ],
    "safety": [
      "Do not taste or drink the solution. Wash hands after handling metal and saltwater.",
      "Use clean classroom copper and zinc strips only; never dismantle household batteries or use unknown scrap.",
      "Never connect this cell to wall power, rechargeable batteries, a charger or the body. Keep it on a spill tray."
    ]
  },
  {
    "id": "paper-logic",
    "kind": "project",
    "field": "electrical",
    "title": "Paper Circuit Logic Game",
    "summary": "Make two paper switches act as physical AND and OR gates.",
    "guidance": [
      "Set switch A and switch B to 0 (open) or 1 (closed). Mode 0 is AND; mode 1 is OR. Make the lamp turn on with exactly one switch closed.",
      "Draw an AND truth table with columns A, B and light. Predict all four on/off combinations before wiring.",
      "Make two paper switches with separated copper-tape contacts. Wire both switches in series with the LED and 220 Ω resistor.",
      "With battery power off, ask an adult to check for shorts and LED polarity. Connect the two-AA holder.",
      "Test A and B in all four combinations and record whether the LED lights. Switch off before changing wiring."
    ],
    "safety": [
      "Use only a two-AA enclosed holder. No coin cells, mains electricity or body connections.",
      "Always keep a current-limiting resistor in series with the LED. Turn power off before rewiring.",
      "Disconnect if batteries or wires warm; have an adult inspect accidental tape bridges."
    ]
  },
  {
    "id": "robotic-claw",
    "kind": "project",
    "field": "robotics",
    "title": "Cardboard Robotic Claw",
    "summary": "Use linked cardboard jaws to turn handle movement into a gentle grasp.",
    "guidance": [
      "Ideal jaw force = handle force × input lever arm / output lever arm. With 1 N handle force, target 0.5–1.5 N at a jaw.",
      "Draw and cut two matching 15 cm jaws with rounded tips; ask an adult to make pivot holes.",
      "Join the jaws at a center pivot using a loose paper fastener. Tape foam pads to the gripping ends.",
      "Attach two 10 cm handle links to the rear of the jaws with paper fasteners. Connect the links to one sliding cardboard handle.",
      "Move the handle slowly and adjust the fasteners until both jaws move freely and symmetrically."
    ],
    "safety": [
      "Adults make holes. Cover fastener backs and all sharp edges with tape.",
      "Keep fingers, hair and skin out of pivots. Grip lightweight objects only, never people or pets.",
      "Do not add motors or high-tension elastic to this cardboard model."
    ]
  },
  {
    "id": "bristlebot",
    "kind": "project",
    "field": "robotics",
    "title": "Obstacle-Avoiding Bristlebot",
    "summary": "Build a vibrating brush robot with a passive bumper that helps it turn away from obstacles.",
    "guidance": [
      "A simple turning model gives turn radius = speed / turn rate (in radians per second). Aim for a radius below 8 cm in the test tray.",
      "Have an adult prepare a flat brush base with no sharp edges. Tape the matched low-voltage motor module securely to its top.",
      "Attach the battery holder and route wires away from bristles. Check the motor supplier's voltage rating before connecting.",
      "Set the robot in a shallow tray and briefly switch on. Rebalance the battery position until it stays upright.",
      "Bend a pipe cleaner into a wide rounded front bumper; fold and tape all wire ends. Angle the bumper so touching a block tends to turn the robot."
    ],
    "safety": [
      "Use an adult-prepared brush and an enclosed pre-wired motor; do not cut a brush with a handheld blade.",
      "Use only the motor's rated low-voltage AA supply, never coin cells or wall power. Switch off if a component warms.",
      "Keep hair and fingers clear of motion, enclose the robot in a tray, and remove batteries after testing."
    ]
  },
  {
    "id": "servo-arm",
    "kind": "project",
    "field": "robotics",
    "title": "Servo Arm with Arduino/Pico",
    "summary": "Command a single-joint cardboard arm using a documented beginner servo kit.",
    "guidance": [
      "Horizontal tip position = arm length × cos(angle). Find an angle placing the tip between −2 cm and +2 cm from the pivot's vertical line.",
      "Choose one board and its manufacturer's beginner servo example. With all power unplugged, have an adult verify the exact board pinout, servo voltage and separate servo supply wiring; Arduino and Pico pins are not interchangeable.",
      "Connect the servo signal to the pin named in that example. Connect grounds as specified and use the kit's rated external servo supply; never power a motor from a GPIO pin or connect a servo's supply to a Pico 3.3 V pin.",
      "Secure the servo body to the foam base. Leave the horn and arm detached for the first powered test.",
      "Run the official example with its travel restricted to 60–120°. Verify a slow sweep, then unplug all power."
    ],
    "safety": [
      "Adult supervision is required for wiring and software upload. Follow the chosen kit's exact voltage and current ratings; this page is not a universal wiring diagram.",
      "Never connect motor power to a logic GPIO. Use only a compatible low-voltage kit supply, no mains wiring or loose lithium batteries.",
      "Keep fingers, hair and cables out of the arm path. No loads, body attachments or unattended running; unplug before adjusting."
    ]
  },
  {
    "id": "prosthetic-hand",
    "kind": "project",
    "field": "biomedical",
    "title": "Mechanical Prosthetic Hand Model",
    "summary": "Model tendons with string in a tabletop cardboard hand and explore how joint moment arms affect grip.",
    "guidance": [
      "Joint torque = tendon tension × tendon offset. With 1 N tension, target at least 4 N·mm without increasing the pull.",
      "Trace a hand-sized outline on cardboard and mark three hinge lines along each long finger. Fold the hinges gently; do not cut fingers apart completely at the joints.",
      "Tape short straw guides to each finger segment, leaving clear gaps at the folds.",
      "Run one string through each finger's guides and tape its end at the fingertip. Leave the other ends loose below the wrist.",
      "Add weak folded-paper return springs behind the fingers. Fix the wrist to a tabletop cardboard stand; never fasten the model to a person."
    ],
    "safety": [
      "This is a tabletop teaching model, not a medical device or a wearable prosthesis.",
      "Keep string away from necks and fingers; never tie loops around the body.",
      "Use gentle pulls and soft objects. Adults handle holes and sharp tools; no powered electronics are needed."
    ]
  },
  {
    "id": "stethoscope",
    "kind": "project",
    "field": "biomedical",
    "title": "DIY Stethoscope",
    "summary": "Explore sound transmission through a tube using a ticking clock as the sound source.",
    "guidance": [
      "An ideal open tube's first resonance is f = sound speed / (2 × tube length). Aim for a resonance between 250 and 400 Hz.",
      "Fit one funnel to each end of the tube and tape the joints so air gaps are small.",
      "Stretch a thin paper membrane over one funnel's wide opening and tape the rim; compare with an uncovered funnel.",
      "Place the membrane funnel next to a ticking clock. Hold the other funnel near, but not against or inside, your ear.",
      "Compare a straight tube with a gently curved tube, keeping the source and volume unchanged."
    ],
    "safety": [
      "Never insert tubing or funnels into ears, nose or mouth. Do not share ear-contact parts.",
      "Use a quiet clock or low-volume speaker; do not amplify sound directly into the ear.",
      "This activity is not a medical test. Do not use it to judge anyone's health, and do not attach homemade electronics to the body."
    ]
  },
  {
    "id": "hydraulic-lung",
    "kind": "project",
    "field": "biomedical",
    "title": "Syringe Hydraulic Lung Model",
    "summary": "Use water-linked syringes to move a diaphragm in a bottle-and-balloon lung model.",
    "guidance": [
      "Displaced volume = piston area × stroke. Target a gentle 2–5 mL movement before testing your model.",
      "Have an adult cut and tape the bottle's bottom edge. Put one balloon on a straw, pass the straw through the bottle neck and seal around the straw with putty; keep the straw itself open to room air.",
      "Stretch the second balloon membrane over the open bottle bottom and tape it to form a movable diaphragm. Attach a small pull tab to the membrane.",
      "Fill the linked syringes and tubing with water, keeping this hydraulic circuit outside the bottle. Do not connect water tubing to the lung balloon or air straw.",
      "Secure one syringe barrel to the stand and connect its plunger to the diaphragm tab with tape. Gently move the control syringe to pull the diaphragm down."
    ],
    "safety": [
      "Adult cuts the bottle; cover all cut edges. Use needle-free syringes and gentle water pressure only.",
      "Do not blow into, inhale from or connect the model to anyone's airway or body. The air straw stays open to room air.",
      "Check latex allergies and collect balloon fragments. This is a simplified non-medical model, not breathing equipment."
    ]
  },
  {
    "id": "solar-oven",
    "kind": "project",
    "field": "green",
    "title": "Pizza Box Solar Oven",
    "summary": "Trap sunlight in a small insulated box and compare reflector angles without cooking food.",
    "guidance": [
      "Absorbed power = sunlight × area × absorptivity × cos(incidence angle). With 700 W/m², 0.08 m² and absorptivity 0.8, find an angle delivering at least 35 W.",
      "Ask an adult to cut a three-sided flap in the lid, leaving a 3 cm border. Cover the flap underside with smooth foil.",
      "Tape clear plastic across the lid opening to form a window. Line the box floor with black paper and add newspaper insulation around the sides.",
      "Place a classroom thermometer inside, visible through the window. Do not put food or living things in the box.",
      "Set the box on a stable outdoor surface away from foot traffic. Prop the reflector so it sends sunlight through the window; avoid reflected light toward faces."
    ],
    "safety": [
      "Adult cutting and supervision are required. Avoid sharp foil edges and hot surfaces.",
      "Never look into reflected sunlight or use a magnifying lens. Do not leave the oven unattended.",
      "This activity measures temperature only. It does not establish safe food cooking or pasteurization."
    ]
  },
  {
    "id": "water-filtration",
    "kind": "project",
    "field": "green",
    "title": "Bottle Water Filtration Column",
    "summary": "Compare how layers remove visible particles while learning why clear water can still be unsafe.",
    "guidance": [
      "In this Darcy-flow model, flow is inversely proportional to sand depth. Flow = 90 / depth (cm) in mL/min. Choose 4–8 cm depth while maintaining at least 12 mL/min.",
      "Have an adult prepare and tape the cut bottle funnel. Place a coffee filter at the neck and stand the funnel over a collecting cup inside a tray.",
      "Add 2 cm washed gravel, then 3 cm clean sand and another 2 cm gravel so the inlet layer helps spread the flow.",
      "Label every cup 'NOT FOR DRINKING.' Mix 100 mL tap water with a small spoonful of clean sand; do not use pond, sewage or biologically contaminated water.",
      "Pour the mixture slowly into the top without overflowing. Time how long 50 mL takes to collect and compare visible particles against a white background."
    ],
    "safety": [
      "Never drink, taste or use the filtered water for cooking, pets or hygiene, even if it looks clear.",
      "Use only a clean classroom sand-and-water mixture, not unknown outdoor water or household chemicals.",
      "Adult cuts the bottle; tape edges, avoid breathing sand dust, and wash hands after cleanup."
    ]
  },
  {
    "id": "wind-generator",
    "kind": "project",
    "field": "green",
    "title": "Mini Wind Turbine Generator",
    "summary": "Turn a small DC hobby motor by airflow and measure open-circuit voltage.",
    "guidance": [
      "Available wind power = 0.5 × air density × swept area × wind speed³. Estimate 15% conversion and target at least 0.01 W.",
      "Cut three identical soft cardstock blades, each no more than 8 cm long with rounded tips. Tape them evenly to a pre-made hub; do not use metal blades.",
      "Attach the hub securely to the motor shaft and fasten the motor to a wide stable cardboard stand.",
      "With the fan off, connect the multimeter to the motor leads in DC voltage mode. Ask an adult to check the meter sockets and wiring.",
      "Place the turbine at least 50 cm from the guarded fan and keep the fan guard fitted. Clear the area before the adult turns the fan to its lowest speed."
    ],
    "safety": [
      "An adult operates the guarded fan. Never put fingers, hair or tools near spinning blades, and stop fully before adjustments.",
      "Use only soft small cardstock blades, a secure hub and a stable base. Wear eye protection.",
      "Do not connect the generator to a wall outlet, battery charger, rechargeable battery or body. Measure only with the supervised low-voltage meter setup."
    ]
  },
  {
    "id": "cad-mechanical-bracket",
    "kind": "cad",
    "field": "mechanical",
    "title": "Bore a mounting plate",
    "summary": "Create a real hole in a 50 × 8 × 40 mm mounting plate.",
    "guidance": [
      "Add a cube. Set dimensions X 50, Y 8, Z 40 mm; center X 0, Y 4, Z 0.",
      "Add a cylinder. Set dimensions 12 × 20 × 12 mm; center 0, 4, 0.",
      "Deselect all. In the object list, tick the plate first, then the cylinder. Choose Subtract hole.",
      "The cylinder is consumed and the plate becomes a cut mesh. Inspect the bore, then Check quest."
    ],
    "safety": [
      "This is a geometry learning exercise, not a structural, medical or manufacturing certification."
    ]
  },
  {
    "id": "cad-civil-span",
    "kind": "cad",
    "field": "civil",
    "title": "Span a river",
    "summary": "Build two piers and a deck with a clear 40 mm span.",
    "guidance": [
      "Add two cubes, each 10 × 30 × 20 mm. Place their centers at (-25, 15, 0) and (25, 15, 0).",
      "Add a deck cube, 70 × 6 × 24 mm, centered at (0, 33, 0).",
      "The piers touch the underside of the deck. Use Align Z to center all three across the river.",
      "Check the assembled geometry. This is a shape exercise, not a structural safety test."
    ],
    "safety": [
      "This is a geometry learning exercise, not a structural, medical or manufacturing certification."
    ]
  },
  {
    "id": "cad-electrical-enclosure",
    "kind": "cad",
    "field": "electrical",
    "title": "Give a sensor a home",
    "summary": "Model a base with two protective side walls.",
    "guidance": [
      "Add a base cube, 50 × 4 × 35 mm, centered at (0, 2, 0).",
      "Add two wall cubes, each 4 × 20 × 35 mm, centered at (-23, 14, 0) and (23, 14, 0).",
      "Select all three and Group to keep the assembly together when moving it.",
      "Check the quest. This simplified housing has open ends and is not weatherproof."
    ],
    "safety": [
      "This is a geometry learning exercise, not a structural, medical or manufacturing certification."
    ]
  },
  {
    "id": "cad-robotics-rover",
    "kind": "cad",
    "field": "robotics",
    "title": "Design a rover chassis",
    "summary": "Fit two axle wheels to a compact rover chassis.",
    "guidance": [
      "Add a chassis cube, 40 × 8 × 28 mm, centered at (0, 16, 0).",
      "Add two cylinders, each 20 × 6 × 20 mm. Rotate X by 90° so their axles run along Z.",
      "Set wheel centers at (0, 10, -18) and (0, 10, 18).",
      "Check wheel size, orientation, and placement against the ghost outlines."
    ],
    "safety": [
      "This is a geometry learning exercise, not a structural, medical or manufacturing certification."
    ]
  },
  {
    "id": "cad-biomedical-joint",
    "kind": "cad",
    "field": "biomedical",
    "title": "Explore a ball joint",
    "summary": "Build a teaching model with a spherical joint and stem.",
    "guidance": [
      "Add a cylinder stem, 10 × 30 × 10 mm, centered at (0, 15, 0).",
      "Add a sphere, 24 × 24 × 24 mm, centered at (0, 36, 0).",
      "The sphere overlaps the stem to form an assembly. Group the two parts if you want to move them together.",
      "Check the geometry. This classroom model is not a medical device or an implant."
    ],
    "safety": [
      "This is a geometry learning exercise, not a structural, medical or manufacturing certification."
    ]
  },
  {
    "id": "cad-green-canopy",
    "kind": "cad",
    "field": "green",
    "title": "Shelter a solar station",
    "summary": "Create a roof canopy supported by two columns.",
    "guidance": [
      "Add two cylinder columns, each 8 × 40 × 8 mm, centered at (-22, 20, 0) and (22, 20, 0).",
      "Add a roof, 64 × 16 × 36 mm, centered at (0, 48, 0).",
      "The roof underside meets the column tops. Use the front view to inspect the connection.",
      "Check the geometry. This shape model does not calculate solar output or certify a structure."
    ],
    "safety": [
      "This is a geometry learning exercise, not a structural, medical or manufacturing certification."
    ]
  }
];
