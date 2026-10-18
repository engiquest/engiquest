/**
 * Theme and editorial content only. Activity IDs were checked against the current
 * lib/labs.ts and components/cad/cad-model.ts catalogues on 2026-10-18.
 * Keep experiment results and completion state in their existing application models.
 */
export type DisciplineThemeId =
  | 'all'
  | 'mechanical'
  | 'civil'
  | 'electrical'
  | 'robotics'
  | 'biomedical'
  | 'green';

export type DisciplinePalette = {
  bg: `#${string}`;
  panel: `#${string}`;
  ink: `#${string}`;
  muted: `#${string}`;
  accent: `#${string}`;
  accent2: `#${string}`;
  line: `#${string}`;
  /** Text and icons placed on a solid accent background. */
  onAccent: `#${string}`;
};

export type DisciplineTheme = {
  id: DisciplineThemeId;
  code: string;
  studioName: string;
  eyebrow: string;
  headline: readonly [string, string];
  intro: string;
  tagline: string;
  catalogTitle: string;
  featuredLabId: string;
  featuredLabLabel: string;
  featuredLabGoal: string;
  missionTitle: string;
  missionText: string;
  missionCadId: string;
  missionCta: string;
  fontMood: 'editorial' | 'industrial' | 'drafting' | 'terminal' | 'geometric' | 'humanist' | 'organic';
  visual: {
    motif: 'constellation' | 'hangar' | 'blueprint' | 'circuit' | 'kinematics' | 'biomaterial' | 'ecosystem';
    subject: string;
    caption: string;
    topLabel: string;
    bottomLabel: string;
  };
  dark: DisciplinePalette;
  light: DisciplinePalette;
};

export const DISCIPLINE_THEMES = {
  all: {
    id: 'all',
    code: 'EQ / 00',
    studioName: 'The Discovery Studio',
    eyebrow: 'SIX DISCIPLINES. ONE CURIOUS MIND.',
    headline: ['Big ideas.', 'Built by you.'],
    intro: 'Test a theory. Shape a part. Build something you can hold. Find the kind of engineering that makes you want to keep going.',
    tagline: 'Follow a question. See where it leads.',
    catalogTitle: 'Choose your next experiment',
    featuredLabId: 'airfoil-wind-tunnel',
    featuredLabLabel: 'Airfoil Wind Tunnel',
    featuredLabGoal: 'Generate 250 N of lift without stalling the virtual wing.',
    missionTitle: 'Make your first real cut',
    missionText: 'Turn a 50 × 8 × 40 mm block into a mounting plate. Subtract a centered 12 mm cylindrical hole, then inspect the geometry from every angle.',
    missionCadId: 'cad-mechanical-bracket',
    missionCta: 'Build the mounting plate',
    fontMood: 'editorial',
    visual: {
      motif: 'constellation',
      subject: 'An exploded engineering object surrounded by six connected discipline markers.',
      caption: 'Explore how ideas connect across engineering.',
      topLabel: 'ENGIQUEST / DISCOVERY SYSTEM',
      bottomLabel: 'OBSERVE → TEST → DESIGN → BUILD',
    },
    dark: { bg: '#080f17', panel: '#101e2b', ink: '#f1f7ff', muted: '#a4b8c8', accent: '#59def1', accent2: '#ffb26c', line: '#667e91', onAccent: '#07212c' },
    light: { bg: '#f0f5f8', panel: '#ffffff', ink: '#102637', muted: '#4b6173', accent: '#00677d', accent2: '#9b4607', line: '#718497', onAccent: '#ffffff' },
  },
  mechanical: {
    id: 'mechanical',
    code: 'ME / 01',
    studioName: 'The Flight & Motion Hangar',
    eyebrow: 'MECHANICAL & AEROSPACE / EXPERIMENT BAY',
    headline: ['Defy gravity.', 'Master motion.'],
    intro: 'Put a wing in the wind tunnel, trade speed for torque, and discover what makes a machine move. Every adjustment tells you something new.',
    tagline: 'Forces you can see. Ideas you can move.',
    catalogTitle: 'Inside the experiment hangar',
    featuredLabId: 'airfoil-wind-tunnel',
    featuredLabLabel: 'Airfoil Wind Tunnel',
    featuredLabGoal: 'Generate 250 N of lift while keeping the angle of attack at or below 14°.',
    missionTitle: 'Engineer a mounting plate',
    missionText: 'Dimension a 50 × 8 × 40 mm plate, position a 12 mm cutting cylinder through its center, and use hole subtraction to create a through-bore.',
    missionCadId: 'cad-mechanical-bracket',
    missionCta: 'Enter the design hangar',
    fontMood: 'industrial',
    visual: {
      motif: 'hangar',
      subject: 'A suspended wing section with cyan airflow paths, an orange force arrow, and a distant hangar grid.',
      caption: 'A small change in angle can change the whole flight.',
      topLabel: 'FLIGHT SYSTEMS / WIND TUNNEL',
      bottomLabel: 'LIFT · DRAG · MOTION',
    },
    dark: { bg: '#08131b', panel: '#112630', ink: '#edf8ff', muted: '#9dbcc8', accent: '#57dcff', accent2: '#ffad66', line: '#688798', onAccent: '#082731' },
    light: { bg: '#edf6fa', panel: '#ffffff', ink: '#113342', muted: '#4d6874', accent: '#006b87', accent2: '#a14b0a', line: '#708c98', onAccent: '#ffffff' },
  },
  civil: {
    id: 'civil',
    code: 'CE / 02',
    studioName: 'The Structures Workshop',
    eyebrow: 'CIVIL & STRUCTURAL / DRAFTING FLOOR',
    headline: ['Make it stand.', 'Make it last.'],
    intro: 'Follow a load through a bridge, steady a shaking structure, and give your ideas a solid foundation. Build an understanding of the places we share.',
    tagline: 'Draw the plan. Understand the forces.',
    catalogTitle: 'Structures worth investigating',
    featuredLabId: 'warren-truss',
    featuredLabLabel: 'Warren Truss Bridge Load Tester',
    featuredLabGoal: 'Keep the truss diagonals at or below 150 MPa under the selected load.',
    missionTitle: 'Span a river',
    missionText: 'Place two piers beneath a 70 mm deck to leave a clear 40 mm span. Use dimensions and alignment to make all three parts meet correctly.',
    missionCadId: 'cad-civil-span',
    missionCta: 'Draft your bridge',
    fontMood: 'drafting',
    visual: {
      motif: 'blueprint',
      subject: 'An amber truss elevation over pale drafting lines, with a separate isometric pier-and-deck detail.',
      caption: 'Every load needs a path to the ground.',
      topLabel: 'STRUCTURAL STUDIES / DRAWING BOARD',
      bottomLabel: 'LOAD · SPAN · STABILITY',
    },
    dark: { bg: '#15130e', panel: '#262319', ink: '#fff7e4', muted: '#c2b799', accent: '#ffd076', accent2: '#a5c9ed', line: '#948467', onAccent: '#352300' },
    light: { bg: '#f8f4e8', panel: '#fffdf5', ink: '#302719', muted: '#6b5e47', accent: '#855200', accent2: '#376082', line: '#97856b', onAccent: '#ffffff' },
  },
  electrical: {
    id: 'electrical',
    code: 'EE / 03',
    studioName: 'The Signal Lab',
    eyebrow: 'ELECTRICAL & ELECTRONICS / CIRCUIT BENCH',
    headline: ['Trace the signal.', 'Power the idea.'],
    intro: 'Make logic light up. Divide a voltage, filter a signal, and find the connections that turn a few simple components into a working system.',
    tagline: 'Small components. Powerful connections.',
    catalogTitle: 'Experiments from the circuit bench',
    featuredLabId: 'voltage-divider',
    featuredLabLabel: 'AC/DC Voltage Divider',
    featuredLabGoal: 'Choose resistor values that produce a DC output between 5.7 and 6.3 V.',
    missionTitle: 'Give a sensor a home',
    missionText: 'Create a 50 × 4 × 35 mm base and two protective side walls. Align and group the parts into a simple open-ended sensor housing.',
    missionCadId: 'cad-electrical-enclosure',
    missionCta: 'Design the sensor housing',
    fontMood: 'terminal',
    visual: {
      motif: 'circuit',
      subject: 'A navy circuit board with crisp lime traces, cyan contact nodes, and one central component in an exploded view.',
      caption: 'Follow the path from input to output.',
      topLabel: 'SIGNAL SYSTEMS / CIRCUIT BENCH',
      bottomLabel: 'VOLTAGE · CURRENT · LOGIC',
    },
    dark: { bg: '#0a1024', panel: '#141e35', ink: '#f2f8ed', muted: '#acb9cf', accent: '#c1f75e', accent2: '#5ce2e8', line: '#7388a6', onAccent: '#192b09' },
    light: { bg: '#f1f6e9', panel: '#fbfff5', ink: '#1b2b1a', muted: '#4d6347', accent: '#416c0b', accent2: '#006573', line: '#74896b', onAccent: '#ffffff' },
  },
  robotics: {
    id: 'robotics',
    code: 'RS / 04',
    studioName: 'The Robotics Playground',
    eyebrow: 'ROBOTICS & SOFTWARE / CONTROL ROOM',
    headline: ['Sense the world.', 'Decide what’s next.'],
    intro: 'Steer a rover, tune a controller, and teach a machine how to respond. Explore the loop that connects sensing, decisions, and movement.',
    tagline: 'Try a rule. Watch a robot respond.',
    catalogTitle: 'Meet your next control challenge',
    featuredLabId: 'differential-drive',
    featuredLabLabel: 'Differential Drive Kinematics',
    featuredLabGoal: 'Drive the robot straight for at least 2 m with no more than 5° of heading change.',
    missionTitle: 'Give your rover a chassis',
    missionText: 'Fit two 20 mm wheels to a compact chassis. Rotate their axles along the Z axis, then check their placement against the ghost outlines.',
    missionCadId: 'cad-robotics-rover',
    missionCta: 'Build your rover',
    fontMood: 'geometric',
    visual: {
      motif: 'kinematics',
      subject: 'A compact rover with violet wheel arcs, a magenta planned path, and sparse sensor rays on a coordinate floor.',
      caption: 'One wheel. Two wheels. A whole new direction.',
      topLabel: 'ROBOT SYSTEMS / MOTION PLANNING',
      bottomLabel: 'SENSE → DECIDE → ACT',
    },
    dark: { bg: '#130d25', panel: '#251b3c', ink: '#fbf4ff', muted: '#c3afd8', accent: '#c2a2ff', accent2: '#ff99d4', line: '#987caf', onAccent: '#2b123e' },
    light: { bg: '#f7f0ff', panel: '#fffaff', ink: '#321d49', muted: '#715480', accent: '#7038b1', accent2: '#a52270', line: '#9c81a8', onAccent: '#ffffff' },
  },
  biomedical: {
    id: 'biomedical',
    code: 'BE / 05',
    studioName: 'The Human Design Lab',
    eyebrow: 'BIOMEDICAL / IDEAS WITH PEOPLE IN MIND',
    headline: ['Design with care.', 'Build for people.'],
    intro: 'Explore helpful mechanisms, flowing liquids, and porous materials. Use classroom models to ask how an engineering choice could make a difference for someone.',
    tagline: 'Curiosity, precision, and a human purpose.',
    catalogTitle: 'Explore the engineering of care',
    featuredLabId: 'prosthetic-grip',
    featuredLabLabel: 'Prosthetic Grip Controller',
    featuredLabGoal: 'Generate enough friction to hold the selected object with a holding factor of at least 1.',
    missionTitle: 'Explore a ball joint',
    missionText: 'Combine a 10 × 30 × 10 mm stem with a 24 mm sphere. Position the parts to overlap, then inspect your classroom model of a joint.',
    missionCadId: 'cad-biomedical-joint',
    missionCta: 'Model the joint',
    fontMood: 'humanist',
    visual: {
      motif: 'biomaterial',
      subject: 'A translucent teal joint study with a mint spherical head and a magnified porous-material inset.',
      caption: 'Explore a mechanism. Consider the person it could help.',
      topLabel: 'HUMAN SYSTEMS / CLASSROOM MODEL',
      bottomLabel: 'FORM · FUNCTION · CARE',
    },
    dark: { bg: '#071b1c', panel: '#102e2f', ink: '#ecfffa', muted: '#98c5bd', accent: '#65e3cd', accent2: '#b9f3b7', line: '#6b9a91', onAccent: '#07332c' },
    light: { bg: '#f0f9f6', panel: '#fbfffd', ink: '#143f3b', muted: '#477168', accent: '#067465', accent2: '#456c2d', line: '#6a9388', onAccent: '#ffffff' },
  },
  green: {
    id: 'green',
    code: 'GE / 06',
    studioName: 'The Living Systems Studio',
    eyebrow: 'GREEN TECH & ENVIRONMENTAL / FIELD STATION',
    headline: ['Think in cycles.', 'Design for Earth.'],
    intro: 'Follow energy from sunlight to a circuit and water from a river to a turbine. Explore designs that do useful work while using resources thoughtfully.',
    tagline: 'Less waste. More possibility.',
    catalogTitle: 'Discover what nature can teach us',
    featuredLabId: 'solar-orientation',
    featuredLabLabel: 'Solar Panel Orientation',
    featuredLabGoal: 'Aim the panel toward the sun to achieve an incidence factor of at least 0.90.',
    missionTitle: 'Shelter a solar station',
    missionText: 'Support a 64 × 16 × 36 mm roof canopy on two 40 mm columns. Align the parts and check that the roof meets both column tops.',
    missionCadId: 'cad-green-canopy',
    missionCta: 'Design the canopy',
    fontMood: 'organic',
    visual: {
      motif: 'ecosystem',
      subject: 'An emerald landscape section with a gold sun, solar canopy, small turbine, and a visible water path.',
      caption: 'Everything flows. Find a better way to use it.',
      topLabel: 'PLANET SYSTEMS / FIELD STATION',
      bottomLabel: 'ENERGY · WATER · RESOURCES',
    },
    dark: { bg: '#101b13', panel: '#1c3022', ink: '#f2fae9', muted: '#b0c4a7', accent: '#9de59b', accent2: '#e4c56d', line: '#7d9873', onAccent: '#173516' },
    light: { bg: '#f4f6ea', panel: '#fffff6', ink: '#243c26', muted: '#52674a', accent: '#326d31', accent2: '#855b00', line: '#7e9271', onAccent: '#ffffff' },
  },
} as const satisfies Record<DisciplineThemeId, DisciplineTheme>;

/** Deterministic fallback for older saved preferences or URL inputs. */
export function getDisciplineTheme(id: string): DisciplineTheme {
  return Object.prototype.hasOwnProperty.call(DISCIPLINE_THEMES, id)
    ? DISCIPLINE_THEMES[id as DisciplineThemeId]
    : DISCIPLINE_THEMES.all;
}
