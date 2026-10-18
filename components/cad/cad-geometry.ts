import * as THREE from "three";
import { Brush, Evaluator, SUBTRACTION } from "three-bvh-csg";
import { CadObject, uid, Vec3 } from "./cad-model";

/** All primitive geometry is centered on the origin and has a unit bounding box. */
export function partGeometry(part: Pick<CadObject, "kind" | "profile" | "mesh">): THREE.BufferGeometry {
  if (part.kind === "cube") return new THREE.BoxGeometry(1, 1, 1);
  if (part.kind === "sphere") return new THREE.SphereGeometry(0.5, 32, 20);
  if (part.kind === "cylinder") return new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
  if (part.kind === "custom" && part.mesh) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(part.mesh.positions, 3));
    geometry.computeVertexNormals();
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(new Float32Array(part.mesh.positions.length / 3 * 2), 2));
    return geometry;
  }
  const shape = new THREE.Shape();
  if (part.kind === "roof") {
    shape.moveTo(-0.5, -0.5); shape.lineTo(0.5, -0.5); shape.lineTo(0, 0.5); shape.closePath();
  } else if (part.profile === "hexagon") {
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; if (i === 0) shape.moveTo(Math.cos(a), Math.sin(a)); else shape.lineTo(Math.cos(a), Math.sin(a)); }
    shape.closePath();
  } else {
    shape.moveTo(-0.5, -0.5); shape.lineTo(0.5, -0.5); shape.lineTo(0.5, -0.15); shape.lineTo(-0.15, -0.15); shape.lineTo(-0.15, 0.5); shape.lineTo(-0.5, 0.5); shape.closePath();
  }
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false, steps: 1, curveSegments: 1 });
  geometry.computeBoundingBox();
  const box = geometry.boundingBox!; const center = box.getCenter(new THREE.Vector3()); const size = box.getSize(new THREE.Vector3());
  geometry.translate(-center.x, -center.y, -center.z); geometry.scale(1 / size.x, 1 / size.y, 1 / size.z);
  return geometry;
}
export function transformPart(mesh: THREE.Object3D, part: Pick<CadObject, "position" | "rotation" | "dimensions">) {
  mesh.position.set(...part.position); mesh.rotation.set(...part.rotation.map(THREE.MathUtils.degToRad) as Vec3); mesh.scale.set(...part.dimensions); mesh.updateMatrixWorld(true);
}
export function solidMesh(part: CadObject) {
  const mesh = new THREE.Mesh(partGeometry(part), new THREE.MeshStandardMaterial({ color: part.color, roughness: 0.4, metalness: 0.25 }));
  transformPart(mesh, part); mesh.userData.partId = part.id; return mesh;
}
function geometryVolume(geometry: THREE.BufferGeometry) {
  const p = geometry.getAttribute("position"); const index = geometry.index; const count = index ? index.count : p.count;
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(); let volume = 0;
  for (let i = 0; i < count; i += 3) { a.fromBufferAttribute(p, index ? index.getX(i) : i); b.fromBufferAttribute(p, index ? index.getX(i + 1) : i + 1); c.fromBufferAttribute(p, index ? index.getX(i + 2) : i + 2); volume += a.dot(b.cross(c)); }
  return Math.abs(volume / 6);
}
/** Bake both shapes in world space, perform a true triangle-mesh boolean, then normalize the result. */
export function subtractParts(target: CadObject, cutter: CadObject): CadObject {
  const material = new THREE.MeshStandardMaterial();
  const geometryA = partGeometry(target); const geometryB = partGeometry(cutter);
  const matrixA = new THREE.Object3D(); const matrixB = new THREE.Object3D();
  transformPart(matrixA, target); transformPart(matrixB, cutter);
  geometryA.applyMatrix4(matrixA.matrixWorld); geometryB.applyMatrix4(matrixB.matrixWorld);
  const boxA = new THREE.Box3().setFromBufferAttribute(geometryA.getAttribute("position") as THREE.BufferAttribute);
  const boxB = new THREE.Box3().setFromBufferAttribute(geometryB.getAttribute("position") as THREE.BufferAttribute);
  if (!boxA.intersectsBox(boxB)) { geometryA.dispose(); geometryB.dispose(); material.dispose(); throw new Error("The cutter does not touch the solid. Move it through the part before subtracting."); }
  const a = new Brush(geometryA, material); const b = new Brush(geometryB, material);
  a.updateMatrixWorld(true); b.updateMatrixWorld(true);
  let resultGeometry: THREE.BufferGeometry | undefined;
  let resultBrush: Brush | undefined;
  try {
    const evaluator = new Evaluator(); evaluator.useGroups = false; evaluator.attributes = ["position", "normal"];
    resultBrush = evaluator.evaluate(a, b, SUBTRACTION);
    resultGeometry = resultBrush.geometry.index ? resultBrush.geometry.toNonIndexed() : resultBrush.geometry.clone();
    if (!resultGeometry.getAttribute("position")?.count) throw new Error("The cutter removed the entire solid. Undo or use a smaller cutter.");
    if (geometryVolume(geometryA) - geometryVolume(resultGeometry) < geometryVolume(geometryA) * 0.00001) throw new Error("No material was removed. Move the cutter farther inside the solid and try again.");
    resultGeometry.computeBoundingBox();
    const box = resultGeometry.boundingBox!; const center = box.getCenter(new THREE.Vector3()); const size = box.getSize(new THREE.Vector3());
    if (Math.min(size.x, size.y, size.z) < 0.5) throw new Error("The remaining shape is too thin for this classroom editor (minimum 0.5 mm).");
    if (Math.max(size.x, size.y, size.z) > 200 || Math.max(Math.abs(center.x), Math.abs(center.y), Math.abs(center.z)) > 500) throw new Error("The cut extends beyond this editor’s size limits. Reduce the part size or move it toward the grid center.");
    resultGeometry.translate(-center.x, -center.y, -center.z); resultGeometry.scale(1 / size.x, 1 / size.y, 1 / size.z);
    const positions = Array.from(resultGeometry.getAttribute("position").array);
    if (positions.length > 180000 || !positions.every(Number.isFinite)) throw new Error("That cut is too complex. Simplify the shapes and try again.");
    return { id: uid(), name: `${target.name.slice(0, 48)} · cut`, kind: "custom", dimensions: size.toArray() as Vec3, position: center.toArray() as Vec3, rotation: [0, 0, 0], color: target.color, mesh: { positions } };
  } finally { resultGeometry?.dispose(); resultBrush?.geometry.dispose(); a.disposeCacheData(); b.disposeCacheData(); geometryA.dispose(); geometryB.dispose(); material.dispose(); }
}
