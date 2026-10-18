import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { supportedNode, parseOptions, findNpmCli, dependencyFingerprint, dependencyIssues, createLogger, runLogged, findAvailablePort } from './launch.mjs';

const directory = path.dirname(fileURLToPath(import.meta.url));
function fixture() {
  const root = fs.mkdtempSync(path.join(directory, 'fixture & spaces (!)-'));
  return { root, cleanup() {
    const resolved = fs.realpathSync(root);
    const expectedParent = fs.realpathSync(directory);
    assert.equal(path.dirname(resolved), expectedParent);
    assert.ok(path.basename(resolved).startsWith('fixture & spaces (!)-'));
    fs.rmSync(resolved, { recursive: true });
  } };
}
function quietLogger(root) {
  const stdout = [], stderr = [];
  return { logger: createLogger(root, { stdout: { write: d => stdout.push(String(d)) }, stderr: { write: d => stderr.push(String(d)) } }), stdout, stderr };
}

test('Node support accepts supported LTS releases and rejects 23, old 22, and prereleases', () => {
  for (const version of ['22.13.0', '22.99.9', '24.0.0', 'v24.19.0']) assert.equal(supportedNode(version), true, version);
  for (const version of ['22.12.9', '23.9.0', '20.20.0', '25.0.0', '24.0.0-rc.1', '24', 'garbage']) assert.equal(supportedNode(version), false, version);
});

test('launcher options accept only explicit supported flags and decimal ports', () => {
  assert.deepEqual(parseOptions(['--check'], { ENGIQUEST_PORT: '3050', ENGIQUEST_NO_BROWSER: '1' }), { check: true, help: false, port: 3050, browser: false });
  assert.equal(parseOptions([], {}).port, 3000);
  assert.equal(parseOptions([], { ENGIQUEST_PORT: '65535' }).port, 65535);
  for (const port of ['', ' 3000', '3000;calc', '0xBB8', '3e3', '1023', '65536', '-3000', '3000.5']) assert.throws(() => parseOptions([], { ENGIQUEST_PORT: port }), /decimal whole number/, port);
  assert.throws(() => parseOptions(['--port=4000'], {}), /Unknown launcher argument/);
});

test('npm CLI discovery preserves paths with spaces and cmd metacharacters', () => {
  const f = fixture();
  try {
    const npm = path.join(f.root, '.tools', 'npm', 'bin', 'npm-cli.js');
    fs.mkdirSync(path.dirname(npm), { recursive: true }); fs.writeFileSync(npm, '// fixture');
    assert.equal(findNpmCli(f.root, path.join(f.root, 'node', 'node.exe'), { PATH: '' }), npm);
  } finally { f.cleanup(); }
});

test('dependency fingerprint changes with lock, manifest, Node ABI, architecture, and npm major', () => {
  const runtime = { platform: 'win32', arch: 'x64', nodeMajor: '24', nodeAbi: '137', npmMajor: '11' };
  const original = dependencyFingerprint('package', 'lock', runtime);
  assert.equal(dependencyFingerprint('package', 'lock', runtime), original);
  assert.notEqual(dependencyFingerprint('changed', 'lock', runtime), original);
  assert.notEqual(dependencyFingerprint('package', 'changed', runtime), original);
  for (const changed of [{ nodeAbi: '127' }, { arch: 'arm64' }, { npmMajor: '12' }, { platform: 'linux' }]) assert.notEqual(dependencyFingerprint('package', 'lock', { ...runtime, ...changed }), original);
});

test('dependency checks detect missing modules and stale installed versions', () => {
  const f = fixture();
  try {
    const manifest = { dependencies: { next: '1.0.0' }, devDependencies: { '@types/demo': '2.0.0' } };
    const lock = { packages: { 'node_modules/next': { version: '1.0.0' }, 'node_modules/@types/demo': { version: '2.0.0' } } };
    for (const name of ['next', '@types/demo']) {
      const target = path.join(f.root, 'node_modules', name, 'package.json'); fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, JSON.stringify({ version: name === 'next' ? '1.0.0' : '2.0.0' }));
    }
    const next = path.join(f.root, 'node_modules', 'next', 'dist', 'bin', 'next'); fs.mkdirSync(path.dirname(next), { recursive: true }); fs.writeFileSync(next, '');
    fs.writeFileSync(path.join(f.root, 'node_modules', '.engiquest-dependencies'), 'expected\n');
    assert.deepEqual(dependencyIssues(f.root, manifest, lock, 'expected'), []);
    fs.writeFileSync(path.join(f.root, 'node_modules', 'next', 'package.json'), '{"version":"9.0.0"}');
    assert.ok(dependencyIssues(f.root, manifest, lock, 'expected').includes('next does not match the lockfile'));
  } finally { f.cleanup(); }
});

test('child argument arrays preserve spaces and shell characters; stdout/stderr failures reach the log', async () => {
  const f = fixture(); const { logger, stdout, stderr } = quietLogger(f.root);
  try {
    const script = path.join(f.root, 'argument check & spaces.mjs');
    fs.writeFileSync(script, 'console.log(JSON.stringify(process.argv.slice(2))); console.error("npm fixture failure: EALLOWREMOTE"); process.exitCode = 7;');
    const args = ['space value', 'a&b', '"quoted"', '(round)', '!literal!'];
    const result = await runLogged(process.execPath, [script, ...args], { root: f.root, logger });
    assert.equal(result.code, 7); assert.deepEqual(JSON.parse(result.stdout.trim()), args);
    logger.close();
    const log = fs.readFileSync(path.join(f.root, 'logs', 'launch.log'), 'utf8');
    assert.match(log, /EALLOWREMOTE/); assert.match(log, /space value/);
    assert.ok(stdout.join('').includes('a&b')); assert.ok(stderr.join('').includes('EALLOWREMOTE'));
  } finally { logger.close(); f.cleanup(); }
});

test('child startup errors are recorded and return a failure', async () => {
  const f = fixture(); const { logger } = quietLogger(f.root);
  try {
    const result = await runLogged(path.join(f.root, 'missing-command.exe'), [], { root: f.root, logger });
    assert.notEqual(result.code, 0); assert.equal(result.error.code, 'ENOENT'); logger.close();
    assert.match(fs.readFileSync(path.join(f.root, 'logs', 'launch.log'), 'utf8'), /Could not run missing-command.exe/);
  } finally { logger.close(); f.cleanup(); }
});

test('previous launch log is preserved for failure diagnosis', () => {
  const f = fixture();
  try {
    let log = quietLogger(f.root).logger; log.say('original failure'); log.close();
    log = quietLogger(f.root).logger; log.say('new launch'); log.close();
    assert.match(fs.readFileSync(path.join(f.root, 'logs', 'launch.previous.log'), 'utf8'), /original failure/);
    assert.match(fs.readFileSync(path.join(f.root, 'logs', 'launch.log'), 'utf8'), /new launch/);
  } finally { f.cleanup(); }
});

test('occupied-port selection is bounded and reports exhaustion without binding a server', async () => {
  const seen = [];
  assert.equal(await findAvailablePort(3000, async port => { seen.push(port); return port === 3002; }), 3002);
  assert.deepEqual(seen, [3000, 3001, 3002]);
  await assert.rejects(findAvailablePort(65535, async () => false), /65535–65535/);
});

test('actual Windows cmd launcher opens its own project path containing spaces and metacharacters', { skip: process.platform !== 'win32' }, () => {
  const f = fixture();
  try {
    const launcher = path.join(f.root, 'Launch EngiQuest.cmd'); fs.copyFileSync(path.join(directory, '..', 'Launch EngiQuest.cmd'), launcher);
    fs.mkdirSync(path.join(f.root, 'scripts'));
    fs.writeFileSync(path.join(f.root, 'scripts', 'launch.mjs'), 'import fs from "node:fs";fs.writeFileSync("proof.json",JSON.stringify({cwd:process.cwd(),argv:process.argv.slice(2)}));console.log("STUB ONLY: no server started");');
    const env = { ...process.env, ENGIQUEST_SKIP_PAUSE: '1', PATH: `${path.dirname(process.execPath)}${path.delimiter}${process.env.PATH || ''}` };
    const result = spawnSync(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', `""${launcher}""`], { cwd: directory, env, encoding: 'utf8', windowsHide: true, windowsVerbatimArguments: true, timeout: 10000 });
    assert.equal(result.error, undefined, result.error?.message);
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
    const proof = JSON.parse(fs.readFileSync(path.join(f.root, 'proof.json'), 'utf8'));
    assert.equal(proof.cwd.toLowerCase(), f.root.toLowerCase()); assert.deepEqual(proof.argv, []);
    assert.match(result.stdout, /STUB ONLY/);
  } finally { f.cleanup(); }
});

test('actual Windows cmd launcher preserves a child failure exit code and visible log message', { skip: process.platform !== 'win32' }, () => {
  const f = fixture();
  try {
    const launcher = path.join(f.root, 'Launch EngiQuest.cmd'); fs.copyFileSync(path.join(directory, '..', 'Launch EngiQuest.cmd'), launcher);
    fs.mkdirSync(path.join(f.root, 'scripts')); fs.writeFileSync(path.join(f.root, 'scripts', 'launch.mjs'), 'console.error("EXPECTED FIXTURE FAILURE");process.exitCode=7;');
    const env = { ...process.env, ENGIQUEST_SKIP_PAUSE: '1', PATH: `${path.dirname(process.execPath)}${path.delimiter}${process.env.PATH || ''}` };
    const result = spawnSync(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', `""${launcher}""`], { cwd: directory, env, encoding: 'utf8', windowsHide: true, windowsVerbatimArguments: true, timeout: 10000 });
    assert.equal(result.status, 7, `${result.stdout}\n${result.stderr}`);
    assert.match(result.stdout, /could not start or stopped with an error/); assert.match(result.stdout, /launch.log/); assert.match(result.stderr, /EXPECTED FIXTURE FAILURE/);
  } finally { f.cleanup(); }
});

