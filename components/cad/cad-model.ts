export type Vec3 = [number, number, number];
export type ShapeKind = "cube" | "cylinder" | "sphere" | "roof" | "extrusion" | "custom";
export type CadObject = {
  id: string; name: string; kind: ShapeKind; dimensions: Vec3; position: Vec3;
  rotation: Vec3; color: string; group?: string; profile?: "L" | "hexagon";
  mesh?: { positions: number[]; normals?: number[] };
};
export type CadDocument = { version: 1; objects: CadObject[] };
export type Ghost = { name: string; kind: ShapeKind; dimensions: Vec3; position: Vec3; rotation?: Vec3; hole?: boolean };
export type CadQuest = { id: string; field: string; title: string; brief: string; steps: string[]; targets: Ghost[] };
export const MAX_OBJECTS = 48;
export const EMPTY_DOCUMENT: CadDocument = { version: 1, objects: [] };
export const SHAPE_NAMES: Record<ShapeKind, string> = { cube: "Cube", cylinder: "Cylinder", sphere: "Sphere", roof: "Roof", extrusion: "Extrusion", custom: "Cut solid" };
export function uid() { return typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `part-${Date.now()}-${Math.random().toString(36).slice(2)}`; }
export function createPart(kind: Exclude<ShapeKind, "custom">, count: number): CadObject {
  return { id: uid(), name: `${SHAPE_NAMES[kind]} ${count + 1}`, kind, dimensions: [20, 20, 20], position: [0, 10, 0], rotation: [0, 0, 0], color: "#31bfd7", ...(kind === "extrusion" ? { profile: "L" as const } : {}) };
}
export function fieldKey(value: string) {
  const s = value.toLowerCase();
  if (s.includes("mechan") || s.includes("aero")) return "mechanical";
  if (s.includes("civil") || s.includes("struct")) return "civil";
  if (s.includes("electr")) return "electrical";
  if (s.includes("robot") || s.includes("software")) return "robotics";
  if (s.includes("bio")) return "biomedical";
  if (s.includes("green") || s.includes("environ")) return "green";
  return "all";
}
export function validateDocument(input: unknown): CadDocument {
  if (!input || typeof input !== "object" || (input as CadDocument).version !== 1 || !Array.isArray((input as CadDocument).objects)) throw new Error("This is not an EngiQuest CAD version 1 file.");
  const raw = (input as CadDocument).objects;
  if (raw.length > MAX_OBJECTS) throw new Error(`A document can contain at most ${MAX_OBJECTS} objects.`);
  const ids = new Set<string>(); let totalCoordinates = 0;
  const vector = (v: unknown, min: number, max: number): v is Vec3 => Array.isArray(v) && v.length === 3 && v.every(n => typeof n === "number" && Number.isFinite(n) && n >= min && n <= max);
  const objects = raw.map((o): CadObject => {
    if (!o || typeof o !== "object" || typeof o.id !== "string" || o.id.length > 100 || !o.id || ids.has(o.id)) throw new Error("Object IDs must be unique short strings.");
    ids.add(o.id);
    if (!Object.prototype.hasOwnProperty.call(SHAPE_NAMES, o.kind) || !vector(o.dimensions, 0.5, 200) || !vector(o.position, -500, 500) || !vector(o.rotation, -360, 360) || !/^#[0-9a-f]{6}$/i.test(o.color)) throw new Error("An object contains invalid dimensions, coordinates, rotation, color, or shape.");
    if (typeof o.name !== "string" || o.name.length > 60) throw new Error("Object names must be 60 characters or fewer.");
    const clean: CadObject = { id: o.id, name: o.name, kind: o.kind, dimensions: [...o.dimensions], position: [...o.position], rotation: [...o.rotation], color: o.color };
    if (typeof o.group === "string" && o.group.length <= 100) clean.group = o.group;
    if (o.kind === "extrusion") clean.profile = o.profile === "hexagon" ? "hexagon" : "L";
    if (o.kind === "custom") {
      const p = o.mesh?.positions;
      if (!Array.isArray(p) || p.length < 9 || p.length % 9 || p.length > 180000 || !p.every(v => Number.isFinite(v) && Math.abs(v) <= 1.001)) throw new Error("Cut geometry is invalid or too complex.");
      totalCoordinates += p.length;
      clean.mesh = { positions: [...p] };
    }
    return clean;
  });
  if (totalCoordinates > 500000) throw new Error("This document has too much cut geometry. Split it into smaller documents.");
  return { version: 1, objects };
}
export function meshVolume(positions: number[]): number {
  let volume = 0;
  for (let i = 0; i < positions.length; i += 9) {
    const [ax, ay, az, bx, by, bz, cx, cy, cz] = positions.slice(i, i + 9);
    volume += ax * (by * cz - bz * cy) + ay * (bz * cx - bx * cz) + az * (bx * cy - by * cx);
  }
  return Math.abs(volume / 6);
}
/** Tests whether a vertical line meets a triangle surface in normalized local coordinates. */
function columnHitsSurface(positions: number[], x: number, z: number): boolean {
  for (let i = 0; i < positions.length; i += 9) {
    const ax = positions[i], az = positions[i + 2], bx = positions[i + 3], bz = positions[i + 5], cx = positions[i + 6], cz = positions[i + 8];
    const denominator = (bz - cz) * (ax - cx) + (cx - bx) * (az - cz);
    if (Math.abs(denominator) < 1e-12) continue; // A vertical wall is parallel to this ray.
    const a = ((bz - cz) * (x - cx) + (cx - bx) * (z - cz)) / denominator;
    const b = ((cz - az) * (x - cx) + (ax - cx) * (z - cz)) / denominator;
    const c = 1 - a - b;
    if (a >= -1e-8 && b >= -1e-8 && c >= -1e-8) return true;
  }
  return false;
}
/** Require the intended centered, approximately 12 mm cylindrical through-bore, not just any cut. */
export function hasCentralBore(part: CadObject): boolean {
  if (part.kind !== "custom" || !part.mesh) return false;
  const positions = part.mesh.positions;
  const boxVolume = part.dimensions[0] * part.dimensions[1] * part.dimensions[2];
  const removedVolume = (1 - meshVolume(positions)) * boxVolume;
  const expectedVolume = Math.PI * 6 * 6 * part.dimensions[1];
  // The 32-sided cylinder is an approximation; allow 8% volume tolerance.
  if (Math.abs(removedVolume - expectedVolume) / expectedVolume > 0.08) return false;
  if (columnHitsSurface(positions, 0, 0)) return false;
  // Inner rays must all pass through the plate; outer rays must still encounter it.
  // Sampling both rings catches off-center bores, blind pockets, slits, and wrong radii.
  for (let i = 0; i < 16; i++) {
    const angle = i * Math.PI / 8;
    const innerX = Math.cos(angle) * 5.25 / part.dimensions[0];
    const innerZ = Math.sin(angle) * 5.25 / part.dimensions[2];
    const outerX = Math.cos(angle) * 6.75 / part.dimensions[0];
    const outerZ = Math.sin(angle) * 6.75 / part.dimensions[2];
    if (columnHitsSurface(positions, innerX, innerZ) || !columnHitsSurface(positions, outerX, outerZ)) return false;
  }
  return true;
}
/** Apply one shared movement delta so a grouped assembly cannot distort at workspace limits. */
export function translateSelection(objects: CadObject[], selected: string[], axis: number, requestedDelta: number): CadObject[] {
  const members = objects.filter(o => selected.includes(o.id));
  if (!members.length || !Number.isFinite(requestedDelta)) return objects;
  const minimumDelta = Math.max(...members.map(o => -500 - o.position[axis]));
  const maximumDelta = Math.min(...members.map(o => 500 - o.position[axis]));
  const delta = Math.min(maximumDelta, Math.max(minimumDelta, requestedDelta));
  return objects.map(o => { if (!selected.includes(o.id)) return o; const position = [...o.position] as Vec3; position[axis] += delta; return { ...o, position }; });
}
const g = (name: string, kind: ShapeKind, dimensions: Vec3, position: Vec3, rotation?: Vec3, hole?: boolean): Ghost => ({ name, kind, dimensions, position, rotation, hole });
export const CAD_QUESTS: CadQuest[] = [
  { id: "cad-mechanical-bracket", field: "mechanical", title: "Bore a mounting plate", brief: "Create a real hole in a 50 × 8 × 40 mm mounting plate.", steps: ["Add a cube. Set dimensions X 50, Y 8, Z 40 mm; center X 0, Y 4, Z 0.", "Add a cylinder. Set dimensions 12 × 20 × 12 mm; center 0, 4, 0.", "Deselect all. In the object list, tick the plate first, then the cylinder. Choose Subtract hole.", "The cylinder is consumed and the plate becomes a cut mesh. Inspect the bore, then Check quest."], targets: [g("Bored plate", "custom", [50, 8, 40], [0, 4, 0], undefined, true)] },
  { id: "cad-civil-span", field: "civil", title: "Span a river", brief: "Build two piers and a deck with a clear 40 mm span.", steps: ["Add two cubes, each 10 × 30 × 20 mm. Place their centers at (-25, 15, 0) and (25, 15, 0).", "Add a deck cube, 70 × 6 × 24 mm, centered at (0, 33, 0).", "The piers touch the underside of the deck. Use Align Z to center all three across the river.", "Check the assembled geometry. This is a shape exercise, not a structural safety test."], targets: [g("Left pier", "cube", [10, 30, 20], [-25, 15, 0]), g("Right pier", "cube", [10, 30, 20], [25, 15, 0]), g("Deck", "cube", [70, 6, 24], [0, 33, 0])] },
  { id: "cad-electrical-enclosure", field: "electrical", title: "Give a sensor a home", brief: "Model a base with two protective side walls.", steps: ["Add a base cube, 50 × 4 × 35 mm, centered at (0, 2, 0).", "Add two wall cubes, each 4 × 20 × 35 mm, centered at (-23, 14, 0) and (23, 14, 0).", "Select all three and Group to keep the assembly together when moving it.", "Check the quest. This simplified housing has open ends and is not weatherproof."], targets: [g("Base", "cube", [50, 4, 35], [0, 2, 0]), g("Left wall", "cube", [4, 20, 35], [-23, 14, 0]), g("Right wall", "cube", [4, 20, 35], [23, 14, 0])] },
  { id: "cad-robotics-rover", field: "robotics", title: "Design a rover chassis", brief: "Fit two axle wheels to a compact rover chassis.", steps: ["Add a chassis cube, 40 × 8 × 28 mm, centered at (0, 16, 0).", "Add two cylinders, each 20 × 6 × 20 mm. Rotate X by 90° so their axles run along Z.", "Set wheel centers at (0, 10, -18) and (0, 10, 18).", "Check wheel size, orientation, and placement against the ghost outlines."], targets: [g("Chassis", "cube", [40, 8, 28], [0, 16, 0]), g("Back wheel", "cylinder", [20, 6, 20], [0, 10, -18], [90, 0, 0]), g("Front wheel", "cylinder", [20, 6, 20], [0, 10, 18], [90, 0, 0])] },
  { id: "cad-biomedical-joint", field: "biomedical", title: "Explore a ball joint", brief: "Build a teaching model with a spherical joint and stem.", steps: ["Add a cylinder stem, 10 × 30 × 10 mm, centered at (0, 15, 0).", "Add a sphere, 24 × 24 × 24 mm, centered at (0, 36, 0).", "The sphere overlaps the stem to form an assembly. Group the two parts if you want to move them together.", "Check the geometry. This classroom model is not a medical device or an implant."], targets: [g("Stem", "cylinder", [10, 30, 10], [0, 15, 0]), g("Ball", "sphere", [24, 24, 24], [0, 36, 0])] },
  { id: "cad-green-canopy", field: "green", title: "Shelter a solar station", brief: "Create a roof canopy supported by two columns.", steps: ["Add two cylinder columns, each 8 × 40 × 8 mm, centered at (-22, 20, 0) and (22, 20, 0).", "Add a roof, 64 × 16 × 36 mm, centered at (0, 48, 0).", "The roof underside meets the column tops. Use the front view to inspect the connection.", "Check the geometry. This shape model does not calculate solar output or certify a structure."], targets: [g("Left column", "cylinder", [8, 40, 8], [-22, 20, 0]), g("Right column", "cylinder", [8, 40, 8], [22, 20, 0]), g("Canopy", "roof", [64, 16, 36], [0, 48, 0])] },
];
export function checkQuest(objects: CadObject[], quest: CadQuest) {
  const used = new Set<string>();
  const checks = quest.targets.map(target => {
    const match = objects.find(o => !used.has(o.id) && o.kind === target.kind && o.dimensions.every((v, i) => Math.abs(v - target.dimensions[i]) <= 1) && o.position.every((v, i) => Math.abs(v - target.position[i]) <= 1) && o.rotation.every((v, i) => Math.abs(v - (target.rotation?.[i] || 0)) <= 2) && (!target.hole || hasCentralBore(o)));
    if (match) used.add(match.id);
    return { name: target.name, passed: Boolean(match) };
  });
  return { checks, passed: checks.every(c => c.passed), score: Math.round(checks.filter(c => c.passed).length / checks.length * 100) };
}
