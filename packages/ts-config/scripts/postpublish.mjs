import { copyFile, rm } from 'fs/promises';

const moduleDir = new URL('../', import.meta.url);
const tempDir = new URL('temp/', moduleDir);

const tempTsconfig = new URL('tsconfig.json', tempDir);
const moduleTsconfig = new URL('tsconfig.json', moduleDir);

await copyFile(tempTsconfig, moduleTsconfig);
await rm(tempDir, { recursive: true, force: true });
