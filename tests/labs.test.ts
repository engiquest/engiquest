import assert from 'node:assert/strict';
import { LABS, defaultValues, evaluateLab, gateOutput, sanitizeValues } from '../lib/labs';

assert.equal(LABS.length, 30);
assert.equal(new Set(LABS.map(lab => lab.id)).size, 30);
for (const field of ['mechanical', 'civil', 'electrical', 'robotics', 'biomedical', 'green']) assert.equal(LABS.filter(lab => lab.field === field).length, 5);
let checked = 0;
for (const lab of LABS) {
  assert.equal(lab.levels.length, 3);
  assert.ok(lab.assumptions.length >= 2 && lab.equations.length && lab.source.url.startsWith('https://'));
  for (let level = 0; level < 3; level++) {
    const solution = lab.levels[level].solution;
    for (const control of lab.controls) {
      assert.ok(Number.isFinite(solution[control.key]), `${lab.id} missing solution parameter ${control.key}`);
      assert.ok(solution[control.key] >= control.min && solution[control.key] <= control.max, `${lab.id}: solution outside range`);
    }
    const result = evaluateLab(lab.id, solution, level);
    assert.ok(result.passed, `${lab.id} level ${level + 1} solution failed:\n${result.feedback.join('\n')}`);
    assert.equal(result.score, 100, `${lab.id} successful score`);
    assert.ok(result.outputs.every(output => typeof output.value === 'string' || Number.isFinite(output.value)), `${lab.id} invalid output`);
    checked++;
  }
  const defaults = defaultValues(lab);
  const extremes = [Object.fromEntries(lab.controls.map(c => [c.key, c.min])), Object.fromEntries(lab.controls.map(c => [c.key, c.max])), Object.fromEntries(lab.controls.map(c => [c.key, Number.NaN])), {}];
  for (const values of [defaults, ...extremes]) {
    const result = evaluateLab(lab.id, values, 2);
    assert.ok(Number.isFinite(result.score) && result.score >= 0 && result.score <= 100);
    assert.ok(result.outputs.every(output => typeof output.value === 'string' || Number.isFinite(output.value)), `${lab.id} has invalid extreme output`);
  }
}
const output = (id: string, values: Record<string, number>, label: string) => Number(evaluateLab(id, values).outputs.find(o => o.label === label)!.value);
const airfoil = LABS.find(lab => lab.id === 'airfoil-wind-tunnel')!;
const air = defaultValues(airfoil);
assert.ok(Math.abs(output(airfoil.id, {...air, speed: 40}, 'Lift') / output(airfoil.id, {...air, speed: 20}, 'Lift') - 4) < 0.001, 'Lift must follow speed squared');
const micro = defaultValues(LABS.find(lab => lab.id === 'microfluidic-viscosity')!);
assert.ok(Math.abs(output('microfluidic-viscosity', {...micro, radius: 200}, 'Volume flow') / output('microfluidic-viscosity', {...micro, radius: 100}, 'Volume flow') - 16) < 0.01, 'Poiseuille radius fourth-power law');
assert.deepEqual([0,1,2,3].map(g => [[0,0],[0,1],[1,0],[1,1]].map(([a,b]) => gateOutput(g,a,b)).join('')), ['0001', '0111', '0110', '1110']);
assert.equal(evaluateLab('arm-inverse-kinematics', {l1:1,l2:1,x:8,y:8,elbow:0},0).passed, false, 'Unreachable arm must fail');
assert.equal(evaluateLab('motor-transistor', {base:100,logic:5,supply:6,duty:100,diode:0},1).passed, false, 'Missing diode must fail protected-circuit challenge');
assert.equal(evaluateLab('seven-segment', {a:0,b:0,c:0,d:0,e:0,f:0,g:0,resistance:330},0).passed, false, 'Unwired display must fail');
assert.equal(evaluateLab('water-filtration', {gravel:0,sand:0,carbon:0,head:100,turbidity:100},0).passed, false, 'Empty filter must fail');
const therm = defaultValues(LABS.find(lab => lab.id === 'thermal-expansion')!);
assert.ok(output('thermal-expansion', {...therm,gap:10},'Restrained stress') <= output('thermal-expansion', {...therm,gap:0},'Restrained stress'), 'Expansion gap must relieve thermal stress');
assert.equal(sanitizeValues(airfoil, {angle:NaN,speed:Infinity,area:-10}).area,0.5);
assert.throws(() => evaluateLab('missing', {}));
console.log(`PASS: ${checked} level solutions, 150 boundary/default evaluations, six-field catalog coverage, physical trend checks, truth tables, and failure cases.`);

