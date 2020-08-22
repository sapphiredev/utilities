import { platform } from 'os';

export const windows = platform() === 'win32';
export const lineEndings = windows ? '\r\n' : '\n';
