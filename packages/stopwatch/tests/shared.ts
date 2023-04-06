import { promisify } from 'node:util';

export const sleep = promisify(setTimeout);
