import { copyFile, mkdir } from 'fs/promises';

const moduleDir = new URL('../', import.meta.url);
const tempDir = new URL('temp/', moduleDir);
const srcDir = new URL('src/', moduleDir);

const tempTsconfig = new URL('tsconfig.json', tempDir);
const moduleTsconfig = new URL('tsconfig.json', moduleDir);
const srcTsconfig = new URL('tsconfig.json', srcDir);

await mkdir(tempDir, { recursive: true });

await copyFile(moduleTsconfig, tempTsconfig);
await copyFile(srcTsconfig, moduleTsconfig);
