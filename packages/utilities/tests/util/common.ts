import { platform } from 'node:os';

export const windows = platform() === 'win32';
export const lineEndings = windows ? '\r\n' : '\n';
