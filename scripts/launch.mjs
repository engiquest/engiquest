import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

export function supportedNode(version) {
  const match = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) return false;
  const [, major, minor] = match.map(Number);
  return major === 24 || (major === 22 && minor >= 13);
}

export function parseOptions(args, env = process.env) {
  const options = { check: false, help: false, port: 3000, browser: env.ENGIQUEST_NO_BROWSER !== '1' };
  for (const argument of args) {
    if (argument === '--check') options.check = true;
    else if (argument === '--help' || argument === '-h') options.help = true;
    else throw new Error(`Unknown launcher argument: ${argument}. Use --check or --help. Set the port with ENGIQUEST_PORT.`);
  }
  const value = env.ENGIQUEST_PORT ?? '3000';
  if (!/^\d{1,5}$/.test(value) || Number(value) < 1024 || Number(value) > 65535) throw new Error('ENGIQUEST_PORT must contain a decimal whole number from 1024 to 65535, for example 3000.');
  options.port = Number(value);
  return options;
}

export function npmCandidates(root, executable = process.execPath, env = process.env) {
  const binaryDirectory = path.dirname(executable);
  const paths = (env.PATH || env.Path || '').split(path.delimiter).filter(Boolean).map(p => p.replace(/^"|"$/g, ''));
  return [...new Set([
    path.join(binaryDirectory, 'node_modules', 'npm', 'bin', 'npm-cli.js'),
    path.join(binaryDirectory, '..', 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js'),
    path.join(root, '.tools', 'npm', 'bin', 'npm-cli.js'),
    ...paths.map(p => path.join(p, 'node_modules', 'npm', 'bin', 'npm-cli.js')),
  ].map(p => path.resolve(p)))];
}

export function findNpmCli(root, executable = process.execPath, env = process.env) {
  return npmCandidates(root, executable, env).find(candidate => { try { return fs.statSync(candidate).isFile(); } catch { return false; } });
}

export function dependencyFingerprint(packageText, lockText, runtime = {}) {
  const values = {
    platform: runtime.platform ?? process.platform,
    arch: runtime.arch ?? process.arch,
    nodeMajor: runtime.nodeMajor ?? process.versions.node.split('.')[0],
    nodeAbi: runtime.nodeAbi ?? process.versions.modules,
    npmMajor: runtime.npmMajor ?? '',
  };
  return createHash('sha256').update('engiquest-dependencies-v2\0').update(JSON.stringify(values)).update('\0').update(packageText).update('\0').update(lockText).digest('hex');
}

export function dependencyIssues(root, manifest, lock, fingerprint) {
  const issues = [];
  const marker = path.join(root, 'node_modules', '.engiquest-dependencies');
  try { if (fs.readFileSync(marker, 'utf8').trim() !== fingerprint) issues.push('the dependency fingerprint changed'); }
  catch { issues.push('the dependency fingerprint is missing'); }
  for (const name of Object.keys({ ...manifest.dependencies, ...manifest.devDependencies })) {
    const packagePath = path.join(root, 'node_modules', ...name.split('/'), 'package.json');
    try {
      const installed = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      const locked = lock.packages?.[`node_modules/${name}`]?.version;
      if (locked && installed.version !== locked) issues.push(`${name} does not match the lockfile`);
    } catch { issues.push(`${name} is missing or unreadable`); }
  }
  if (!fs.existsSync(path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next'))) issues.push('the Next.js executable is missing');
  return issues;
}

export function createLogger(root, streams = { stdout: process.stdout, stderr: process.stderr }) {
  const directory = path.join(root, 'logs');
  fs.mkdirSync(directory, { recursive: true });
  const logPath = path.join(directory, 'launch.log');
  if (fs.existsSync(logPath)) fs.copyFileSync(logPath, path.join(directory, 'launch.previous.log'));
  let descriptor = fs.openSync(logPath, 'w');
  function write(value, error = false) {
    const data = Buffer.isBuffer(value) ? value : Buffer.from(String(value));
    (error ? streams.stderr : streams.stdout).write(data);
    if (descriptor === null) return;
    try { fs.writeSync(descriptor, data); }
    catch (failure) {
      try { fs.closeSync(descriptor); } catch {}
      descriptor = null;
      streams.stderr.write(`\nCould not continue writing ${logPath}: ${failure.message}. Keep this window open to read the error.\n`);
    }
  }
  return {
    path: logPath,
    write,
    say(message) { write(`[${new Date().toISOString()}] ${message}\n`); },
    error(message) { write(`[${new Date().toISOString()}] ERROR: ${message}\n`, true); },
    close() { if (descriptor !== null) { try { fs.closeSync(descriptor); } finally { descriptor = null; } } },
  };
}

/** Execute an argument array without a shell, teeing both child streams into launch.log. */
export function runLogged(command, args, { root, logger, env = process.env, onStart } = {}) {
  return new Promise(resolve => {
    let stdout = ''; let stderr = ''; let startError;
    const child = spawn(command, args, { cwd: root, shell: false, windowsHide: true, stdio: ['inherit', 'pipe', 'pipe'], env });
    onStart?.(child);
    child.stdout.on('data', data => { logger.write(data); if (stdout.length < 65536) stdout += data.toString().slice(0, 65536 - stdout.length); });
    child.stderr.on('data', data => { logger.write(data, true); if (stderr.length < 65536) stderr += data.toString().slice(0, 65536 - stderr.length); });
    child.once('error', error => { startError = error; logger.error(`Could not run ${path.basename(command)}: ${error.message}`); });
    child.once('close', (code, signal) => resolve({ code: code ?? 1, signal, stdout, stderr, error: startError }));
  });
}

export async function findAvailablePort(requested, available) {
  const last = Math.min(requested + 9, 65535);
  for (let port = requested; port <= last; port++) if (await available(port)) return port;
  throw new Error(`Ports ${requested}–${last} are unavailable. Close another EngiQuest launcher, or use a different ENGIQUEST_PORT. No other application was stopped.`);
}

function probePort(port, logger) {
  return new Promise(resolve => {
    const server = net.createServer();
    server.once('error', error => { logger.say(`Port ${port} is unavailable (${error.code || error.message}). Trying the next port.`); resolve(false); });
    server.listen({ port, host: '127.0.0.1', exclusive: true }, () => server.close(() => resolve(true)));
  });
}

function stopOwnedChild(child, logger) {
  if (!child?.pid || child.exitCode !== null || child.signalCode !== null) return;
  if (process.platform === 'win32') {
    const taskkill = path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'taskkill.exe');
    const result = spawnSync(taskkill, ['/pid', String(child.pid), '/t', '/f'], { encoding: 'utf8', windowsHide: true, shell: false, timeout: 10000 });
    if (result.error) logger.error(`Could not stop the child process tree: ${result.error.message}`);
  } else child.kill('SIGTERM');
}

function openBrowser(url, logger) {
  if (process.platform !== 'win32') { logger.say(`Open this address in your browser: ${url}`); return; }
  const executable = path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'rundll32.exe');
  const browser = spawn(executable, ['url.dll,FileProtocolHandler', url], { shell: false, stdio: 'ignore', windowsHide: true });
  browser.once('error', error => logger.say(`The browser could not open automatically (${error.message}). Open ${url} manually.`));
  browser.unref();
}

export async function main(args = process.argv.slice(2), configuration = {}) {
  const root = configuration.root || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  let logger; let activeChild; let interrupted = false; let stopping = false; let finished = false; let poll;
  const stop = () => {
    interrupted = true;
    if (stopping) return;
    stopping = true;
    logger?.say('Stopping EngiQuest and its child processes…');
    stopOwnedChild(activeChild, logger);
  };
  try {
    logger = createLogger(root);
    logger.say(`EngiQuest launcher · project: ${root}`);
    const options = parseOptions(args);
    if (options.help) { logger.say('Usage: node scripts/launch.mjs [--check]\n--check validates the runtime and dependency state without installing packages, probing ports, or starting a server.\nSet ENGIQUEST_PORT to choose a port. Set ENGIQUEST_NO_BROWSER=1 to open the browser yourself.'); return 0; }
    if (!supportedNode(process.versions.node)) throw new Error(`Node.js ${process.version} is not supported. Install Node.js 24 LTS (recommended), or Node.js 22.13.0 or newer within major 22. Node.js 23 and prereleases are not supported: https://nodejs.org/`);
    const npmCli = findNpmCli(root);
    if (!npmCli) throw new Error('npm is missing. Install Node.js 24 LTS with the npm package manager option selected, then reopen this launcher.');
    process.on('SIGINT', stop); process.on('SIGTERM', stop);
    const environment = { ...process.env, NEXT_TELEMETRY_DISABLED: '1', npm_config_update_notifier: 'false' };
    const track = child => { activeChild = child; if (interrupted) stopOwnedChild(child, logger); };
    const versionResult = await runLogged(process.execPath, [npmCli, '--version'], { root, logger, env: environment, onStart: track });
    if (interrupted) return 130;
    if (versionResult.code !== 0 || !/^\d+\.\d+\.\d+$/.test(versionResult.stdout.trim())) throw new Error('npm could not report its version. Its actual error is recorded above and in logs/launch.log. Reinstall Node.js 24 LTS with npm selected if the npm installation is damaged.');
    const npmVersion = versionResult.stdout.trim();
    if (Number(npmVersion.split('.')[0]) < 10) throw new Error(`npm ${npmVersion} is too old for this launcher. Install Node.js 24 LTS with its included npm package manager.`);
    logger.say(`Node.js ${process.version}; npm ${npmVersion}; ${process.platform}/${process.arch}`);
    let packageText, lockText, manifest, lock;
    try {
      packageText = fs.readFileSync(path.join(root, 'package.json'), 'utf8');
      lockText = fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8');
      manifest = JSON.parse(packageText); lock = JSON.parse(lockText);
    } catch (error) { throw new Error(`Could not read package.json and package-lock.json: ${error.message}. Extract the complete source ZIP, including both files.`); }
    const fingerprint = dependencyFingerprint(packageText, lockText, { npmMajor: npmVersion.split('.')[0] });
    const issues = dependencyIssues(root, manifest, lock, fingerprint);
    if (options.check) {
      logger.say(`Runtime check passed. Requested browser address: http://127.0.0.1:${options.port}`);
      logger.say(issues.length ? `Dependencies need installation: ${issues.join('; ')}. Normal launch will run npm ci.` : 'Installed dependencies match the current lockfile and runtime.');
      logger.say('Check mode did not install dependencies, probe ports, or start a server.'); return 0;
    }
    if (issues.length) {
      logger.say(`Dependency setup required: ${issues.join('; ')}.`);
      logger.say('Installing the locked dependencies. First launch needs an internet connection. Installation output is also saved in logs/launch.log.');
      const result = await runLogged(process.execPath, [npmCli, 'ci', '--include=dev', '--no-fund'], { root, logger, env: environment, onStart: track });
      if (interrupted) return 130;
      if (result.code !== 0) throw new Error(`npm ci failed (exit ${result.code}${result.signal ? `, signal ${result.signal}` : ''}). Read the npm error above or logs/launch.log; the log contains the actual failure. No tests or website server were started.`);
      const missing = dependencyIssues(root, manifest, lock, fingerprint).filter(issue => !issue.startsWith('the dependency fingerprint'));
      if (missing.length) throw new Error(`npm finished but required files are still missing: ${missing.join('; ')}. Read logs/launch.log.`);
      fs.writeFileSync(path.join(root, 'node_modules', '.engiquest-dependencies'), fingerprint + '\n');
    }
    const port = await findAvailablePort(options.port, candidate => probePort(candidate, logger));
    if (interrupted) return 130;
    if (port !== options.port) logger.say(`Port ${options.port} was unavailable. Using ${port}; no other application was stopped.`);
    const url = `http://127.0.0.1:${port}`;
    logger.say(`\nENGIQUEST BROWSER ADDRESS: ${url}\nKeep this launcher window open while using the website. Press Ctrl+C to stop.\nProgress belongs to this exact browser address. Use the same port next time.\n`);
    let checking = false; let attempts = 0;
    poll = setInterval(async () => {
      if (checking || interrupted || finished) return;
      if (++attempts > 90) { clearInterval(poll); logger.say('The site has not become ready yet. Inspect logs/launch.log for a compilation or startup error. The address above remains available if startup finishes.'); return; }
      checking = true;
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(2500) });
        if (response.ok && (await response.text()).includes('EngiQuest') && !interrupted && !finished) { clearInterval(poll); logger.say(`Ready: ${url}`); if (options.browser) openBrowser(url, logger); }
      } catch {} finally { checking = false; }
    }, 1500);
    const result = await runLogged(process.execPath, [path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next'), 'dev', '--hostname', '127.0.0.1', '--port', String(port)], { root, logger, env: environment, onStart: track });
    clearInterval(poll);
    logger.say(interrupted ? 'EngiQuest stopped by the user.' : `Website stopped (exit ${result.code}${result.signal ? `, signal ${result.signal}` : ''}).`);
    return interrupted ? 0 : result.code;
  } catch (error) {
    if (logger) logger.error(error.message); else console.error(`ERROR: ${error.message}\nThe launcher could not create its log. Move the extracted project to a writable local folder and run it again.`);
    return 1;
  } finally {
    finished = true;
    clearInterval(poll);
    process.off('SIGINT', stop); process.off('SIGTERM', stop);
    logger?.close();
  }
}

const invoked = process.argv[1] && path.resolve(process.argv[1]);
const ownPath = fileURLToPath(import.meta.url);
if (invoked && (process.platform === 'win32' ? invoked.toLowerCase() === ownPath.toLowerCase() : invoked === ownPath)) process.exitCode = await main();
