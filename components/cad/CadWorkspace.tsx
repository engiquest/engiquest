"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { STLExporter } from "three/addons/exporters/STLExporter.js";
import { CAD_QUESTS, CadDocument, CadObject, CadQuest, checkQuest, createPart, EMPTY_DOCUMENT, fieldKey, MAX_OBJECTS, ShapeKind, SHAPE_NAMES, translateSelection, uid, validateDocument, Vec3 } from "./cad-model";
import { partGeometry, solidMesh, subtractParts, transformPart } from "./cad-geometry";
import "./cad.css";

const STORE_KEY = "engiquest-cad-document-v1";
const SNAPSHOT_KEY = "engiquest-cad-snapshot-v1";
type CameraAction = "iso" | "front" | "top" | "left" | "right" | "up" | "down" | "in" | "out" | "panLeft" | "panRight";
type ViewApi = { camera: (action: CameraAction) => void };
function download(name: string, data: string, type = "application/json") {
  const url = URL.createObjectURL(new Blob([data], { type })); const link = document.createElement("a");
  link.href = url; link.download = name; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function disposeGroup(group: THREE.Group) {
  group.traverse(child => { if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) { child.geometry.dispose(); const materials = Array.isArray(child.material) ? child.material : [child.material]; materials.forEach(m => m.dispose()); } });
  group.clear();
}

function CadViewport({ objects, selected, quest, hints, onSelect, onError, apiRef }: {
  objects: CadObject[]; selected: string[]; quest?: CadQuest; hints: boolean;
  onSelect: (id: string | null, additive: boolean) => void; onError: (message: string) => void;
  apiRef: React.RefObject<ViewApi | null>;
}) {
  const host = useRef<HTMLDivElement>(null);
  const resources = useRef<{ scene: THREE.Scene; parts: THREE.Group; ghosts: THREE.Group; render: () => void } | null>(null);
  const selectRef = useRef(onSelect); const errorRef = useRef(onError);
  useEffect(() => { selectRef.current = onSelect; errorRef.current = onError; }, [onSelect, onError]);
  useEffect(() => {
    const element = host.current; if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false }); }
    catch { errorRef.current("The 3D view could not start. Enable hardware acceleration in your browser, then reload. Your saved model is kept."); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); renderer.setClearColor("#091925");
    renderer.domElement.setAttribute("aria-label", "Interactive 3D modeling canvas. Use the camera buttons and object list for keyboard access.");
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xc9f8ff, 0x173042, 2.8));
    const key = new THREE.DirectionalLight(0xffffff, 3.3); key.position.set(60, 100, 80); scene.add(key);
    const grid = new THREE.GridHelper(200, 20, 0x28556b, 0x173746); grid.position.y = -0.05; scene.add(grid);
    const axes = new THREE.AxesHelper(45); scene.add(axes);
    const parts = new THREE.Group(); const ghosts = new THREE.Group(); scene.add(parts, ghosts);
    const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 3000); camera.position.set(110, 95, 125);
    const controls = new OrbitControls(camera, renderer.domElement); controls.target.set(0, 15, 0); controls.minDistance = 8; controls.maxDistance = 800; controls.enableDamping = false; controls.update();
    const render = () => renderer.render(scene, camera);
    const applyTheme = () => {
      const style = getComputedStyle(window.document.documentElement);
      renderer.setClearColor(style.getPropertyValue('--bg').trim() || '#091925');
      const color = new THREE.Color(style.getPropertyValue('--line').trim() || '#688798');
      const colors = grid.geometry.getAttribute('color');
      for (let i = 0; i < colors.count; i++) colors.setXYZ(i, color.r, color.g, color.b);
      colors.needsUpdate = true;
      (grid.material as THREE.LineBasicMaterial).opacity = .38;
      (grid.material as THREE.LineBasicMaterial).transparent = true;
      render();
    };
    const themeObserver = new MutationObserver(applyTheme);
    themeObserver.observe(window.document.documentElement, {attributes:true, attributeFilter:['data-field','data-theme','style']});
    applyTheme();
    controls.addEventListener("change", render);
    const resize = () => { const width = Math.max(element.clientWidth, 1); const height = Math.max(element.clientHeight, 1); camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height, false); render(); };
    const observer = new ResizeObserver(resize); observer.observe(element); resize();
    let pointerStart = [0, 0];
    const pointerDown = (e: PointerEvent) => { pointerStart = [e.clientX, e.clientY]; };
    const pointerUp = (e: PointerEvent) => {
      if (e.button !== 0 || Math.hypot(e.clientX - pointerStart[0], e.clientY - pointerStart[1]) > 5) return;
      const rect = renderer.domElement.getBoundingClientRect(); const pointer = new THREE.Vector2((e.clientX - rect.left) / rect.width * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      const ray = new THREE.Raycaster(); ray.setFromCamera(pointer, camera);
      const hit = ray.intersectObjects(parts.children, false).find(h => h.object.userData.partId);
      selectRef.current(hit ? hit.object.userData.partId as string : null, e.shiftKey || e.ctrlKey || e.metaKey);
    };
    renderer.domElement.addEventListener("pointerdown", pointerDown); renderer.domElement.addEventListener("pointerup", pointerUp);
    const contextLost = (event: Event) => { event.preventDefault(); errorRef.current("The browser lost its 3D graphics context. Save/export your model, then reload this page to restore the view."); };
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    apiRef.current = { camera(action) {
      const offset = camera.position.clone().sub(controls.target); const distance = offset.length();
      if (action === "iso") { controls.target.set(0, 15, 0); camera.position.set(110, 95, 125); }
      else if (action === "front") camera.position.copy(controls.target).add(new THREE.Vector3(0, 0, distance));
      else if (action === "top") camera.position.copy(controls.target).add(new THREE.Vector3(0, distance, 0.001));
      else if (action === "in" || action === "out") camera.position.copy(controls.target).add(offset.multiplyScalar(action === "in" ? 0.8 : 1.25));
      else if (action === "panLeft" || action === "panRight") { const delta = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 0).multiplyScalar(action === "panLeft" ? -10 : 10); camera.position.add(delta); controls.target.add(delta); }
      else { const spherical = new THREE.Spherical().setFromVector3(offset); if (action === "left" || action === "right") spherical.theta += action === "left" ? -0.2 : 0.2; else spherical.phi = THREE.MathUtils.clamp(spherical.phi + (action === "up" ? -0.2 : 0.2), 0.02, Math.PI - 0.02); camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical)); }
      controls.update(); render();
    } };
    resources.current = { scene, parts, ghosts, render };
    return () => { themeObserver.disconnect(); resources.current = null; apiRef.current = null; observer.disconnect(); controls.dispose(); disposeGroup(parts); disposeGroup(ghosts); grid.geometry.dispose(); (grid.material as THREE.Material).dispose(); axes.geometry.dispose(); (axes.material as THREE.Material).dispose(); renderer.domElement.removeEventListener("pointerdown", pointerDown); renderer.domElement.removeEventListener("pointerup", pointerUp); renderer.domElement.removeEventListener("webglcontextlost", contextLost); renderer.dispose(); renderer.domElement.remove(); };
  }, [apiRef]);
  useEffect(() => {
    const current = resources.current; if (!current) return;
    disposeGroup(current.parts); disposeGroup(current.ghosts);
    objects.forEach(part => {
      const mesh = solidMesh(part);
      if (selected.includes(part.id)) { (mesh.material as THREE.MeshStandardMaterial).emissive.set("#075471"); (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.7; }
      current.parts.add(mesh);
      if (selected.includes(part.id)) {
        const edge = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), new THREE.LineBasicMaterial({ color: 0x8eefff })); transformPart(edge, part); current.parts.add(edge);
      }
    });
    if (hints && quest) quest.targets.forEach(target => {
      const geometry = partGeometry({ kind: target.kind === "custom" ? "cube" : target.kind });
      const edges = new THREE.EdgesGeometry(geometry); geometry.dispose();
      const outline = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xa5d851, transparent: true, opacity: 0.55, depthTest: false }));
      transformPart(outline, { ...target, rotation: target.rotation || [0, 0, 0] }); current.ghosts.add(outline);
      if (target.hole) {
        const ringGeometry = new THREE.CylinderGeometry(6, 6, 12, 32); const ringEdges = new THREE.EdgesGeometry(ringGeometry); ringGeometry.dispose();
        const hole = new THREE.LineSegments(ringEdges, new THREE.LineBasicMaterial({ color: 0xf6bd60, transparent: true, opacity: 0.6, depthTest: false })); hole.position.set(...target.position); current.ghosts.add(hole);
      }
    });
    current.render();
  }, [objects, selected, quest, hints]);
  return <div className="cad-canvas" ref={host} data-testid="cad-canvas"><div className="cad-canvas-label">MODELING SPACE <span>millimeters · 10 mm grid</span></div><div className="cad-axes"><span>X →</span><span>Y ↑</span><span>Z ↗</span></div></div>;
}

export default function CadWorkspace({ field = "all", initialQuestId, onComplete, onQuestChange }: { field?: string; initialQuestId?:string; onComplete: (id: string, score: number) => void; onQuestChange?: (id: string) => void }) {
  const [document, setDocument] = useState<CadDocument>(EMPTY_DOCUMENT);
  const [past, setPast] = useState<CadDocument[]>([]); const [future, setFuture] = useState<CadDocument[]>([]);
  const [ready, setReady] = useState(false); const [storageEnabled, setStorageEnabled] = useState(true);
  const [selected, setSelected] = useState<string[]>([]); const [snap, setSnap] = useState(1);
  const [hints, setHints] = useState(true); const [questId, setQuestId] = useState(initialQuestId ?? CAD_QUESTS[0].id);
  const [status, setStatus] = useState("Loading your saved workspace…");
  const [check, setCheck] = useState<ReturnType<typeof checkQuest> | null>(null);
  const api = useRef<ViewApi | null>(null); const importInput = useRef<HTMLInputElement>(null);
  const filteredQuests = CAD_QUESTS.filter(q => fieldKey(field) === "all" || q.field === fieldKey(field));
  const quest = filteredQuests.find(q => q.id === questId) || filteredQuests[0];
  useEffect(() => { if (quest) onQuestChange?.(quest.id); }, [quest?.id, onQuestChange]);
  const active = document.objects.find(o => o.id === selected[0]);
  useEffect(() => {
    try { const saved = localStorage.getItem(STORE_KEY); if (saved) setDocument(validateDocument(JSON.parse(saved))); setStatus(saved ? "Your last workspace is restored. Changes save in this browser." : "Start with a shape or follow a guided quest. Changes save in this browser."); }
    catch { setStorageEnabled(false); setStatus("Saved CAD data could not be read. It has not been overwritten. You can still model and export a JSON file; Save snapshot retries local storage."); }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready || !storageEnabled) return;
    try { localStorage.setItem(STORE_KEY, JSON.stringify(document)); }
    catch { setStorageEnabled(false); setStatus("Your browser could not save the model (storage may be full or blocked). Export JSON now to keep a copy."); }
  }, [document, ready, storageEnabled]);
  const commit = useCallback((next: CadDocument, message?: string) => {
    if (!ready) return false;
    try { validateDocument(next); } catch (error) { setStatus(`Edit stopped: ${error instanceof Error ? error.message : "document limits exceeded"}. Your current model is unchanged.`); return false; }
    setPast(p => [...p.slice(-31), document]); setFuture([]); setDocument(next); setCheck(null); if (message) setStatus(message); return true;
  }, [document, ready]);
  const select = useCallback((id: string | null, additive: boolean) => {
    if (!id) { if (!additive) setSelected([]); return; }
    const object = document.objects.find(o => o.id === id); const ids = object?.group ? document.objects.filter(o => o.group === object.group).map(o => o.id) : [id];
    setSelected(previous => additive ? previous.includes(id) ? previous.filter(v => !ids.includes(v)) : [...previous, ...ids.filter(v => !previous.includes(v))] : ids);
  }, [document.objects]);
  const undo = () => { if (!past.length) return; const previous = past[past.length - 1]; setFuture(f => [document, ...f].slice(0, 32)); setPast(p => p.slice(0, -1)); setDocument(previous); setSelected([]); setCheck(null); setStatus("Undo complete."); };
  const redo = () => { if (!future.length) return; setPast(p => [...p, document].slice(-32)); setDocument(future[0]); setFuture(f => f.slice(1)); setSelected([]); setCheck(null); setStatus("Redo complete."); };
  const add = (kind: Exclude<ShapeKind, "custom">) => { if (document.objects.length >= MAX_OBJECTS) { setStatus(`Limit reached: ${MAX_OBJECTS} parts. Delete some parts or start a new document.`); return; } const part = createPart(kind, document.objects.length); commit({ version: 1, objects: [...document.objects, part] }, `${SHAPE_NAMES[kind]} added at the center. Edit its dimensions and position.`); setSelected([part.id]); };
  const edit = (property: "position" | "dimensions" | "rotation", axis: number, value: number) => {
    if (!active || !Number.isFinite(value)) return;
    let nextValue = property === "position" && snap ? Math.round(value / snap) * snap : value;
    const min = property === "dimensions" ? 0.5 : property === "position" ? -500 : -360;
    const max = property === "dimensions" ? 200 : property === "position" ? 500 : 360;
    nextValue = Math.min(max, Math.max(min, nextValue)); const delta = nextValue - active[property][axis];
    const nextObjects = property === "position" ? translateSelection(document.objects, selected, axis, delta) : document.objects.map(o => { if (!selected.includes(o.id)) return o; const vector = [...o[property]] as Vec3; vector[axis] = nextValue; return { ...o, [property]: vector }; });
    commit({ version: 1, objects: nextObjects });
  };
  const changeColor = (color: string) => commit({ version: 1, objects: document.objects.map(o => selected.includes(o.id) ? { ...o, color } : o) });
  const group = () => { const groupId = uid(); commit({ version: 1, objects: document.objects.map(o => selected.includes(o.id) ? { ...o, group: groupId } : o) }, "Selected parts are grouped. Selecting one selects the group; position edits move them together."); };
  const ungroup = () => commit({ version: 1, objects: document.objects.map(o => { if (!selected.includes(o.id)) return o; const { group: _group, ...rest } = o; return rest; }) }, "Selected parts are ungrouped.");
  const align = (axis: number) => { if (!active) return; commit({ version: 1, objects: document.objects.map(o => { if (!selected.includes(o.id)) return o; const position = [...o.position] as Vec3; position[axis] = active.position[axis]; return { ...o, position }; }) }, `Aligned centers on ${["X", "Y", "Z"][axis]} to the first selected part.`); };
  const subtract = () => {
    if (selected.length !== 2) return;
    const target = document.objects.find(o => o.id === selected[0]); const cutter = document.objects.find(o => o.id === selected[1]); if (!target || !cutter) return;
    try { const cut = subtractParts(target, cutter); if (commit({ version: 1, objects: [...document.objects.filter(o => !selected.includes(o.id)), cut] }, `Real mesh subtraction complete: ${cutter.name} removed from ${target.name}. Undo restores both originals.`)) setSelected([cut.id]); }
    catch (error) { setStatus(error instanceof Error ? error.message : "The cut failed. Adjust the overlap and try again."); }
  };
  const duplicate = () => {
    const sources = document.objects.filter(o => selected.includes(o.id)); if (sources.length + document.objects.length > MAX_OBJECTS) { setStatus(`Duplicating would exceed the ${MAX_OBJECTS}-part limit.`); return; }
    const groupMap = new Map<string, string>(); const copies = sources.map(o => { if (o.group && !groupMap.has(o.group)) groupMap.set(o.group, uid()); return { ...o, id: uid(), name: `${o.name.slice(0, 50)} copy`, position: [Math.min(o.position[0] + 5, 500), o.position[1], o.position[2]] as Vec3, ...(o.group ? { group: groupMap.get(o.group) } : {}) }; });
    if (commit({ version: 1, objects: [...document.objects, ...copies] }, "Selection duplicated 5 mm along X.")) setSelected(copies.map(o => o.id));
  };
  const save = () => { try { localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(document)); localStorage.setItem(STORE_KEY, JSON.stringify(document)); setStorageEnabled(true); setStatus("Snapshot saved in this browser. Export JSON for a portable backup."); } catch { setStatus("Browser storage is unavailable or full. Export JSON to keep your model."); } };
  const load = () => { try { const saved = localStorage.getItem(SNAPSHOT_KEY); if (!saved) { setStatus("No snapshot yet. Use Save snapshot first, or Import JSON."); return; } commit(validateDocument(JSON.parse(saved)), "Snapshot loaded. Undo returns to your previous model."); setSelected([]); } catch (error) { setStatus(`Snapshot could not be loaded: ${error instanceof Error ? error.message : "invalid data"}`); } };
  const importFile = async (file?: File) => {
    if (!file) return;
    try { if (file.size > 16 * 1024 * 1024) throw new Error("Choose a CAD JSON file smaller than 16 MB."); const next = validateDocument(JSON.parse(await file.text())); commit(next, "JSON imported and validated. Undo returns to your previous model."); setSelected([]); }
    catch (error) { setStatus(`Import stopped: ${error instanceof Error ? error.message : "invalid JSON"}. Your current model is unchanged.`); }
    if (importInput.current) importInput.current.value = "";
  };
  const exportStl = () => {
    const group = new THREE.Group();
    try { document.objects.forEach(o => group.add(solidMesh(o))); group.updateMatrixWorld(true); const text = new STLExporter().parse(group); download("engiquest-model.stl", text, "model/stl"); setStatus("STL exported in millimeter coordinates. Overlapping parts remain separate shells: inspect/repair them in a slicer before printing."); }
    catch (error) { setStatus(`STL export failed: ${error instanceof Error ? error.message : "unknown error"}`); }
    finally { disposeGroup(group); }
  };
  const runCheck = () => { if (!quest) return; const result = checkQuest(document.objects, quest); setCheck(result); if (result.passed) { onComplete(quest.id, result.score); setStatus("Quest complete! Your geometry matches all target dimensions and positions. Completion saved to My Journey."); } else setStatus(`${result.checks.filter(c => c.passed).length} of ${result.checks.length} target parts match. Follow the dimensions, positions, and rotations in the guide.`); };
  return <section className="cad-workspace" aria-label="Quest DStudios CAD workspace">
    <div className="cad-heading"><div><p className="cad-eyebrow">QUEST DSTUDIOS / 3D DESIGN LAB</p><h2>Make your ideas take shape.</h2><p>Build, measure, and iterate in a real 3D workspace.</p></div><span className="cad-save-indicator">{ready ? storageEnabled ? "● Autosave on this device" : "● Export to save" : "Loading…"}</span></div>
    <fieldset className="cad-controls" disabled={!ready} aria-label="CAD controls">
      <div className="cad-toolbar"><div className="cad-button-group"><button onClick={undo} disabled={!past.length}>↶ Undo</button><button onClick={redo} disabled={!future.length}>↷ Redo</button><button onClick={save}>Save snapshot</button><button onClick={load}>Load snapshot</button></div><div className="cad-button-group"><button onClick={() => download("engiquest-model.json", JSON.stringify(document, null, 2))}>Export JSON</button><button onClick={() => importInput.current?.click()}>Import JSON</button><button onClick={exportStl} disabled={!document.objects.length}>Export STL</button><button onClick={() => { commit(EMPTY_DOCUMENT, "New empty document. Undo restores your previous model."); setSelected([]); }}>New</button></div><input ref={importInput} type="file" accept=".json,application/json" hidden onChange={e => void importFile(e.target.files?.[0])} aria-label="Import CAD JSON file" /></div>
      <div className="cad-main-grid">
        <aside className="cad-panel cad-parts-panel"><h3>Add a shape</h3><div className="cad-shape-grid">{(["cube", "cylinder", "sphere", "roof", "extrusion"] as const).map(kind => <button key={kind} onClick={() => add(kind)} aria-label={`Add ${kind}`}><span aria-hidden="true">{{ cube: "▧", cylinder: "▤", sphere: "◉", roof: "△", extrusion: "⌑" }[kind]}</span>{SHAPE_NAMES[kind]}</button>)}</div><label className="cad-form-label">Position snap<select value={snap} onChange={e => setSnap(Number(e.target.value))}><option value={0}>Off</option><option value={0.5}>0.5 mm</option><option value={1}>1 mm</option><option value={5}>5 mm</option><option value={10}>10 mm</option></select></label><h3>Objects <span>{document.objects.length}/{MAX_OBJECTS}</span></h3><p className="cad-small">First selected = alignment anchor / cut target.</p><div className="cad-object-list">{document.objects.length === 0 ? <p className="cad-empty">Your canvas is ready.<br />Add your first shape above.</p> : document.objects.map(o => <label key={o.id} className={`cad-object-row ${selected.includes(o.id) ? "cad-selected" : ""}`}><input type="checkbox" checked={selected.includes(o.id)} onChange={() => select(o.id, true)} aria-label={`Select ${o.name}`} /><span className="cad-color-dot" style={{ backgroundColor: o.color }} /><span>{o.name}{o.group ? <small>grouped</small> : null}</span></label>)}</div><button className="cad-full" onClick={() => setSelected(document.objects.map(o => o.id))} disabled={!document.objects.length}>Select all</button><button className="cad-full" onClick={() => setSelected([])} disabled={!selected.length}>Deselect all</button></aside>
        <div className="cad-center"><CadViewport objects={document.objects} selected={selected} quest={quest} hints={hints} onSelect={select} onError={setStatus} apiRef={api} /><div className="cad-camera" aria-label="Camera controls"><button onClick={() => api.current?.camera("iso")}>Isometric</button><button onClick={() => api.current?.camera("front")}>Front</button><button onClick={() => api.current?.camera("top")}>Top</button><button aria-label="Orbit camera left" onClick={() => api.current?.camera("left")}>↶</button><button aria-label="Orbit camera right" onClick={() => api.current?.camera("right")}>↷</button><button aria-label="Orbit camera up" onClick={() => api.current?.camera("up")}>↑</button><button aria-label="Orbit camera down" onClick={() => api.current?.camera("down")}>↓</button><button aria-label="Zoom in" onClick={() => api.current?.camera("in")}>＋</button><button aria-label="Zoom out" onClick={() => api.current?.camera("out")}>−</button><button aria-label="Pan camera left" onClick={() => api.current?.camera("panLeft")}>← Pan</button><button aria-label="Pan camera right" onClick={() => api.current?.camera("panRight")}>Pan →</button></div><p className="cad-small cad-gesture-guide">Drag: orbit · right-drag: pan · scroll: zoom · Shift-click: multi-select · touch: one finger orbit, two fingers pan/zoom. All actions also have buttons or numeric controls.</p><div className="cad-edit-tools"><button disabled={selected.length < 2} onClick={group}>Group</button><button disabled={!selected.some(id => document.objects.find(o => o.id === id)?.group)} onClick={ungroup}>Ungroup</button>{["X", "Y", "Z"].map((axis, i) => <button key={axis} disabled={selected.length < 2} onClick={() => align(i)}>Align {axis}</button>)}<button className="cad-accent-button" disabled={selected.length !== 2} onClick={subtract}>Subtract hole</button><button disabled={!selected.length} onClick={duplicate}>Duplicate</button><button className="cad-danger" disabled={!selected.length} onClick={() => { commit({ version: 1, objects: document.objects.filter(o => !selected.includes(o.id)) }, "Selected parts deleted. Undo restores them."); setSelected([]); }}>Delete</button></div><p className="cad-small">To cut a hole: select the solid first, then select a second shape that overlaps it. Subtract consumes both shapes and creates an editable cut mesh.</p></div>
        <aside className="cad-panel cad-properties"><h3>Inspector <span>{selected.length ? `${selected.length} selected` : ""}</span></h3>{active ? <><label className="cad-form-label">Part name<input maxLength={60} value={active.name} onChange={e => commit({ version: 1, objects: document.objects.map(o => o.id === active.id ? { ...o, name: e.target.value } : o) })} /></label><p className="cad-small">{selected.length > 1 ? "Position edits move all selected parts by the same amount. Size and rotation edits set that axis on every selected part." : "X = width, Y = height, Z = depth. Positions locate the center of a part."}</p>{(["dimensions", "position", "rotation"] as const).map(property => <div className="cad-vector-group" key={property}><h4>{property === "dimensions" ? "Dimensions (mm)" : property === "position" ? "Center position (mm)" : "Rotation (degrees)"}</h4><div className="cad-vector">{["X", "Y", "Z"].map((axis, i) => <label key={axis}>{axis}<input type="number" aria-label={`${property} ${axis}`} value={Math.round(active[property][i] * 1000) / 1000} min={property === "dimensions" ? 0.5 : property === "position" ? -500 : -360} max={property === "dimensions" ? 200 : property === "position" ? 500 : 360} step={property === "rotation" ? 5 : snap || 0.5} onChange={e => { if (e.target.value !== "") edit(property, i, Number(e.target.value)); }} /></label>)}</div></div>)}<label className="cad-form-label">Color<input type="color" value={active.color} onChange={e => changeColor(e.target.value)} /></label>{active.kind === "extrusion" ? <label className="cad-form-label">Extruded profile<select value={active.profile || "L"} onChange={e => commit({ version: 1, objects: document.objects.map(o => o.id === active.id ? { ...o, profile: e.target.value as "L" | "hexagon" } : o) })}><option value="L">L section</option><option value="hexagon">Hexagon</option></select><span className="cad-small">Z dimension controls extrusion depth.</span></label> : null}<p className="cad-small">{active.kind === "custom" ? "A cut mesh can be moved, rotated, colored, and scaled. Undo returns to the original solids." : "Dimensions are measured along the part’s own axes before rotation."}</p></> : <p className="cad-empty">Select a part in the canvas or object list to edit its properties.</p>}</aside>
      </div>
      <div className="cad-status" role="status" aria-live="polite">{status}</div>
      <div className="cad-quest-panel"><div className="cad-quest-heading"><div><p className="cad-eyebrow">GUIDED MODELING QUEST</p><h3>{quest?.title || "Select an engineering field"}</h3></div><label className="cad-form-label">Quest<select aria-label="Guided CAD quest" value={quest?.id || ""} onChange={e => { setQuestId(e.target.value); setCheck(null); }}>{filteredQuests.map(q => <option key={q.id} value={q.id}>{q.title}</option>)}</select></label></div>{quest ? <><p>{quest.brief}</p><ol className="cad-steps">{quest.steps.map(step => <li key={step}>{step}</li>)}</ol><div className="cad-quest-actions"><label><input type="checkbox" checked={hints} onChange={e => setHints(e.target.checked)} /> Show ghost outlines</label><button className="cad-primary" onClick={runCheck}>Check quest geometry</button></div><p className="cad-small">Checks match part type, size (±1 mm), center (±1 mm), and rotation (±2°); the mounting plate must have a centered 12 mm through-bore, checked by removed volume and vertical ray samples. Extra parts are allowed.</p>{check ? <ul className="cad-check-results">{check.checks.map(c => <li key={c.name} className={c.passed ? "cad-pass" : "cad-needs-work"}>{c.passed ? "✓" : "○"} {c.name}: {c.passed ? "geometry matches" : "compare with guide"}</li>)}</ul> : null}</> : null}</div>
    </fieldset>
    <details className="cad-limitations"><summary>What this classroom CAD workspace supports</summary><p>Real 3D primitives, L/hexagon profile extrusions, measured transforms, grouping, center alignment, and triangle-mesh hole subtraction. Grouping keeps parts selectable and movable together; it does not fuse their surfaces. Rotation edits rotate each selected part about its own center, not the whole assembly about a shared pivot. Boolean cuts can fail on tangent or nearly coincident faces; extend the cutter fully through the solid and inspect the result.</p><p>There is no chamfer, fillet, sketch constraint solver, arbitrary sketch drawing, Boolean union, or engineering/manufacturing certification. STL exports have no color and may contain separate overlapping shells. Models are limited to 48 objects and bounded mesh sizes. Undo retains the most recent 32 edits during this session. CAD autosaves and snapshots stay only in this browser; JSON is your portable backup.</p></details>
  </section>;
}
