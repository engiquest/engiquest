import assert from 'node:assert/strict';
import { projects, getPrepDefaults } from '../lib/projects.ts';
import { careers } from '../lib/careers.ts';

const fields = ['mechanical', 'civil', 'electrical', 'robotics', 'biomedical', 'green'];
assert.equal(projects.length, 18);
assert.equal(new Set(projects.map(p => p.id)).size, 18);
for (const field of fields) assert.equal(projects.filter(p => p.field === field).length, 3);
for (const project of projects) {
  assert.ok(project.steps.length >= 6 && project.materials.length >= 4 && project.safety.length >= 3);
  assert.ok(project.checklist.length >= 4 && project.prep.assumptions.length >= 2);
  const samples = [getPrepDefaults(project)];
  const combinations = (index, values) => {
    if (index === project.prep.controls.length) { samples.push(values); return; }
    const control = project.prep.controls[index];
    for (let value = control.min; value <= control.max + 1e-8; value += control.step) {
      combinations(index + 1, { ...values, [control.id]: Number(value.toFixed(6)) });
    }
  };
  combinations(0, {});
  let pass = false, fail = false;
  for (const values of samples) {
    const evaluated = project.prep.evaluate(values);
    assert.ok(Number.isFinite(evaluated.value), `${project.id}: non-finite result`);
    assert.ok(evaluated.feedback.length > 20 && evaluated.label.length > 3);
    pass ||= evaluated.pass;
    fail ||= !evaluated.pass;
  }
  assert.ok(pass && fail, `${project.id}: preparation target needs both reachable success and useful failure`);
  console.log(`${project.id}: ${samples.length} bounded input combinations, target reachable`);
}
assert.equal(careers.length, 6);
assert.deepEqual([...new Set(careers.map(c => c.field))].sort(), fields.sort());
for (const career of careers) {
  assert.ok(career.salary.percentile10 < career.salary.median && career.salary.median < career.salary.percentile90);
  assert.ok(career.salary.source.startsWith('https://www.bls.gov/'));
  assert.equal(career.salary.period, 'May 2025 annual wages');
  assert.ok(career.competitions.length >= 2 && career.summerPrograms.length >= 2);
}
console.log('PASS: 18 complete projects, finite model outputs, reachable targets, and six sourced career records.');

