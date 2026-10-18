import {buildSync} from 'esbuild';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');process.chdir(root);
fs.mkdirSync('.test-cache',{recursive:true});
const files=['progress.test.ts','engibot.test.ts','labs.test.ts','content.test.mjs','theme.test.ts'];
for(const name of files)buildSync({absWorkingDir:root,entryPoints:[path.join(root,'tests',name)],outfile:path.join(root,'.test-cache',`${name}.cjs`),bundle:true,platform:'node',format:'cjs',packages:'external',logLevel:'warning'});
const test=spawnSync(process.execPath,['--test',...files.map(n=>`.test-cache/${n}.cjs`),'components/cad/cad.test.cjs','scripts/launcher.test.mjs'],{stdio:'inherit'});
process.exitCode=test.status??1;

