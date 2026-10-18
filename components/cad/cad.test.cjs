// Run from the installed EngiQuest project: node path/to/cad.test.cjs
// Transpiles only these local TS helpers with esbuild (installed with tsx).
const { createRequire, Module } = require("node:module");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const projectRequire = createRequire(path.join(process.cwd(), "package.json"));
const esbuild = projectRequire("esbuild");
const oldLoader = require.extensions[".ts"];
require.extensions[".ts"] = function(module, filename) {
  if (path.dirname(filename) !== __dirname) {
    if (oldLoader) return oldLoader(module, filename);
    throw new Error(`Unexpected test import: ${filename}`);
  }
  module.paths = [...Module._nodeModulePaths(process.cwd()), ...module.paths];
  const compiled = esbuild.transformSync(fs.readFileSync(filename, "utf8"), { loader: "ts", format: "cjs", target: "es2020", sourcefile: filename });
  module._compile(compiled.code, filename);
};
const { createPart, validateDocument, checkQuest, CAD_QUESTS, meshVolume, fieldKey, hasCentralBore, translateSelection } = require("./cad-model.ts");
const { subtractParts, partGeometry, solidMesh } = require("./cad-geometry.ts");
function part(kind, dimensions, position, rotation = [0, 0, 0]) { return { ...createPart(kind, 0), dimensions, position, rotation }; }
const plate = () => part("cube", [50, 8, 40], [0, 4, 0]);
const cutter = () => part("cylinder", [12, 20, 12], [0, 4, 0]);
test("valid document round-trips and strips unexpected fields", () => {
  const p = { ...plate(), unexpected: "discard this" };
  const clean = validateDocument(JSON.parse(JSON.stringify({ version: 1, objects: [p] })));
  assert.equal(clean.objects.length, 1); assert.equal(clean.objects[0].unexpected, undefined);
});
test("imports reject duplicated IDs, invalid kind, infinite or excessive coordinates", () => {
  const p = plate(); assert.throws(() => validateDocument({ version: 1, objects: [p, p] }), /unique/);
  assert.throws(() => validateDocument({ version: 1, objects: [{ ...p, kind: "toString" }] }), /invalid/);
  assert.throws(() => validateDocument({ version: 1, objects: [{ ...p, position: [Infinity, 0, 0] }] }), /invalid/);
  assert.throws(() => validateDocument({ version: 1, objects: [{ ...p, dimensions: [100000, 2, 3] }] }), /invalid/);
});
test("imports reject object counts and malformed custom geometry", () => {
  assert.throws(() => validateDocument({ version: 1, objects: Array.from({ length: 49 }, () => plate()) }), /48/);
  assert.throws(() => validateDocument({ version: 1, objects: [{ ...plate(), kind: "custom", mesh: { positions: [0, 0, 0] } }] }), /geometry/);
});
test("all primitive types have bounded, finite, nonempty geometry", () => {
  for (const kind of ["cube", "cylinder", "sphere", "roof", "extrusion"]) {
    const geometry = partGeometry({ kind }); geometry.computeBoundingBox();
    assert.ok(geometry.getAttribute("position").count > 10);
    assert.ok(Array.from(geometry.getAttribute("position").array).every(Number.isFinite));
    assert.ok(Math.abs(geometry.boundingBox.max.x - geometry.boundingBox.min.x - 1) < 0.001);
    geometry.dispose();
  }
});
test("real CSG subtraction removes the expected cylinder volume and completes mechanical quest", () => {
  const result = subtractParts(plate(), cutter());
  const remaining = meshVolume(result.mesh.positions) * result.dimensions.reduce((a, b) => a * b, 1);
  const theoretical = 50 * 8 * 40 - Math.PI * 6 * 6 * 8;
  assert.ok(Math.abs(remaining - theoretical) / theoretical < 0.002, `${remaining} vs ${theoretical}`);
  assert.equal(result.kind, "custom");
  assert.equal(checkQuest([result], CAD_QUESTS[0]).passed, true);
  assert.deepEqual(validateDocument({ version: 1, objects: [result] }).objects[0].mesh.positions, result.mesh.positions);
});
test("mechanical quest rejects an off-center bore with the correct removed volume", () => {
  const shiftedCutter = cutter(); shiftedCutter.position = [3, 4, 0];
  const result = subtractParts(plate(), shiftedCutter);
  assert.equal(hasCentralBore(result), false);
  assert.equal(checkQuest([result], CAD_QUESTS[0]).passed, false);
});
test("mechanical quest rejects undersized and oversized through-bores", () => {
  for (const diameter of [4, 10, 14, 20]) {
    const wrongCutter = cutter(); wrongCutter.dimensions = [diameter, 20, diameter];
    const result = subtractParts(plate(), wrongCutter);
    assert.equal(checkQuest([result], CAD_QUESTS[0]).passed, false, `diameter ${diameter}`);
  }
});
test("mechanical quest rejects a blind pocket with the same removed volume", () => {
  // Half-depth pocket with twice the bore cross-sectional area has the same removed volume.
  const diameter = 12 * Math.SQRT2;
  const pocket = part("cylinder", [diameter, 8, diameter], [0, 8, 0]);
  const result = subtractParts(plate(), pocket);
  const expectedVolume = Math.PI * 36 * 8;
  const removedVolume = (1 - meshVolume(result.mesh.positions)) * 50 * 8 * 40;
  assert.ok(Math.abs(removedVolume - expectedVolume) / expectedVolume < 0.02);
  assert.equal(checkQuest([result], CAD_QUESTS[0]).passed, false);
});
test("mechanical quest rejects an edge nick with the same removed volume", () => {
  const notchWidth = Math.PI * 36 / 10;
  const notch = part("cube", [notchWidth, 20, 10], [25 - notchWidth / 2, 4, 0]);
  const result = subtractParts(plate(), notch);
  assert.ok(Math.abs((1 - meshVolume(result.mesh.positions)) * 2000 - Math.PI * 36) < 0.02);
  assert.equal(checkQuest([result], CAD_QUESTS[0]).passed, false);
});
test("group movement remains rigid when a part reaches a workspace boundary", () => {
  const a = part("cube", [20, 20, 20], [490, 10, 0]);
  const b = part("cube", [20, 20, 20], [480, 10, 0]);
  const unselected = part("cube", [20, 20, 20], [0, 10, 0]);
  const originals = [a, b, unselected]; const before = JSON.stringify(originals);
  const moved = translateSelection(originals, [a.id, b.id], 0, 30);
  assert.equal(moved[0].position[0], 500); assert.equal(moved[1].position[0], 490);
  assert.equal(moved[0].position[0] - moved[1].position[0], 10);
  assert.equal(moved[2], unselected); assert.equal(JSON.stringify(originals), before);
});
test("disjoint CSG cutter reports a clear error and does not mutate source", () => {
  const original = plate(), tool = cutter(); tool.position = [100, 4, 0]; const before = JSON.stringify(original);
  assert.throws(() => subtractParts(original, tool), /does not touch/); assert.equal(JSON.stringify(original), before);
});
test("entire-part removal is rejected", () => {
  assert.throws(() => subtractParts(plate(), part("cube", [100, 100, 100], [0, 4, 0])), /entire solid/);
});
test("five assembly quests accept correct geometry and reject displaced parts", () => {
  for (const quest of CAD_QUESTS.slice(1)) {
    const objects = quest.targets.map(t => part(t.kind, t.dimensions, t.position, t.rotation || [0, 0, 0]));
    assert.equal(checkQuest(objects, quest).passed, true, quest.title);
    objects[0].position = [objects[0].position[0] + 5, objects[0].position[1], objects[0].position[2]];
    assert.equal(checkQuest(objects, quest).passed, false, quest.title);
  }
});
test("rover geometry check rejects wheels with wrong axle orientation", () => {
  const q = CAD_QUESTS.find(q => q.field === "robotics");
  const objects = q.targets.map(t => part(t.kind, t.dimensions, t.position));
  assert.equal(checkQuest(objects, q).passed, false);
});
test("engineering field labels and slugs consistently filter", () => {
  assert.equal(fieldKey("Mechanical & Aerospace"), "mechanical"); assert.equal(fieldKey("Green Tech & Environmental"), "green"); assert.equal(fieldKey("all"), "all");
  assert.equal(new Set(CAD_QUESTS.map(q => q.field)).size, 6);
});
test("JSON export preserves cut geometry without changing quest completion", () => {
  const original = { version: 1, objects: [subtractParts(plate(), cutter())] };
  const restored = validateDocument(JSON.parse(JSON.stringify(original)));
  assert.deepEqual(restored, original);
  assert.equal(checkQuest(restored.objects, CAD_QUESTS[0]).passed, true);
});
test("STL export includes world dimensions and drilled faces", () => {
  const THREE = projectRequire("three");
  const { STLExporter } = projectRequire("three/addons/exporters/STLExporter.js");
  const group = new THREE.Group(); const cut = subtractParts(plate(), cutter()); const mesh = solidMesh(cut);
  group.add(mesh); group.updateMatrixWorld(true);
  const stl = new STLExporter().parse(group);
  assert.equal(typeof stl, "string"); assert.match(stl, /solid exported/); assert.match(stl, /facet normal/);
  const vertices = [...stl.matchAll(/vertex\s+([\d.e+-]+)\s+([\d.e+-]+)\s+([\d.e+-]+)/g)].map(m => m.slice(1).map(Number));
  assert.ok(vertices.length > 50);
  const xs = vertices.map(v => v[0]), ys = vertices.map(v => v[1]), zs = vertices.map(v => v[2]);
  assert.ok(Math.abs(Math.max(...xs) - Math.min(...xs) - 50) < 0.001);
  assert.ok(Math.abs(Math.max(...ys) - Math.min(...ys) - 8) < 0.001);
  assert.ok(Math.abs(Math.max(...zs) - Math.min(...zs) - 40) < 0.001);
  mesh.geometry.dispose(); mesh.material.dispose();
});
