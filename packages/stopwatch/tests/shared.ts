import { promisify } from 'node:util';
import { setTimeout } from 'node:timers';

export const sleep = promisify(setTimeout);
