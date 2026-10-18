import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DISCIPLINE_THEMES, getDisciplineTheme, type DisciplinePalette} from '../lib/discipline-themes';
import {FIELDS} from '../lib/fields';
import {LABS} from '../lib/labs';
import {CAD_QUESTS} from '../components/cad/cad-model';

// These checks cover opaque palette tokens. Browser checks must also inspect
// actual compositing, focus styles, typography, gradients, and image overlays.
function luminance(hex: string): number {
  assert.match(hex, /^#[0-9a-f]{6}$/i, `Expected an opaque six-digit hex color: ${hex}`);
  const [r, g, b] = [1, 3, 5].map(offset => {
    const channel = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const first = luminance(a), second = luminance(b);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

function atLeast(palette: DisciplinePalette, foreground: keyof DisciplinePalette, background: keyof DisciplinePalette, minimum: number, label: string) {
  const ratio = contrast(palette[foreground], palette[background]);
  assert.ok(ratio >= minimum, `${label}: ${foreground} on ${background} is ${ratio.toFixed(2)}:1; needs ${minimum}:1`);
}

test('contrast calculation uses linearized sRGB, including reference endpoints', () => {
  assert.equal(contrast('#000000', '#ffffff'), 21);
  assert.equal(contrast('#ffffff', '#ffffff'), 1);
  assert.ok(Math.abs(contrast('#777777', '#ffffff') - 4.478) < 0.001);
});

test('theme keys cover All Disciplines and every selectable engineering field', () => {
  assert.deepEqual(Object.keys(DISCIPLINE_THEMES).sort(), ['all', ...FIELDS.map(field => field.id)].sort());
  for (const [id, theme] of Object.entries(DISCIPLINE_THEMES)) assert.equal(theme.id, id);
});

for (const theme of Object.values(DISCIPLINE_THEMES)) {
  for (const mode of ['dark', 'light'] as const) {
    test(`${theme.id} ${mode}: readable text, buttons and control boundaries`, () => {
      const palette = theme[mode];
      const label = `${theme.id} ${mode}`;
      for (const value of Object.values(palette)) assert.match(value, /^#[0-9a-f]{6}$/i);
      for (const surface of ['bg', 'panel'] as const) {
        for (const text of ['ink', 'muted', 'accent', 'accent2'] as const) {
          atLeast(palette, text, surface, 4.5, label);
        }
      }
      atLeast(palette, 'onAccent', 'accent', 4.5, label);
      atLeast(palette, 'line', 'panel', 3, label);
    });
  }

  test(`${theme.id}: featured lab and guided CAD quest resolve within the selected field`, () => {
    const labs = LABS.filter(lab => lab.id === theme.featuredLabId);
    const quests = CAD_QUESTS.filter(quest => quest.id === theme.missionCadId);
    assert.equal(labs.length, 1, `Missing or ambiguous featured lab ${theme.featuredLabId}`);
    assert.equal(quests.length, 1, `Missing or ambiguous CAD quest ${theme.missionCadId}`);
    if (theme.id !== 'all') {
      assert.equal(labs[0].field, theme.id, 'Featured lab would be hidden by the active field filter');
      assert.equal(quests[0].field, theme.id, 'CAD mission would be hidden by the active field filter');
    }
    assert.ok(FIELDS.some(field => field.id === labs[0].field));
    assert.ok(FIELDS.some(field => field.id === quests[0].field));
  });
}

test('unknown or inherited theme keys safely select All Disciplines', () => {
  for (const key of ['', 'unknown-field', '__proto__', 'constructor', 'toString']) {
    assert.equal(getDisciplineTheme(key), DISCIPLINE_THEMES.all);
  }
  for (const theme of Object.values(DISCIPLINE_THEMES)) assert.equal(getDisciplineTheme(theme.id), theme);
});
