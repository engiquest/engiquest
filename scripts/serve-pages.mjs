import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, dirname, join, extname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'out');
const { basePath = '' } = JSON.parse(await readFile(join(root, '.pages-build', 'preview.json'), 'utf8').catch(() => {
  throw new Error('Build the GitHub Pages edition first: npm run build:pages');
}));
await stat(join(output, 'index.html'));
const port = Number(process.env.PORT || 3102);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('PORT must be an integer from 1024 to 65535.');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8' };
const server = createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (basePath && pathname !== basePath && !pathname.startsWith(`${basePath}/`)) throw Error('Missing base path');
    const local = pathname.slice(basePath.length);
    let file = resolve(output, `.${local || '/'}`);
    const rel = relative(output, file);
    if (rel === '..' || rel.startsWith(`..${sep}`) || rel.split(/[\\/]/).some(part => part.startsWith('.'))) throw Error('Invalid path');
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    const bytes = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(req.method === 'HEAD' ? undefined : bytes);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(req.method === 'HEAD' ? undefined : await readFile(join(output, '404.html')).catch(() => 'Page not found'));
  }
});
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE'
    ? `Port ${port} is occupied. In PowerShell run: $env:PORT="3103"; npm run preview:pages`
    : error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => {
  console.log(`EngiQuest GitHub Pages preview: http://127.0.0.1:${port}${basePath}/`);
  console.log('Keep this window open while using the preview. Press Ctrl+C to stop.');
});
