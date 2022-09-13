import type { U1, U2, U4 } from '../common';

export interface IReader {
	readU1(): U1;
	readU2(): U2;
	readU4(): U4;
	readU8(): number;
	readU16(): number;
	readU32(): number;
	readB64(): bigint;
	readF32(): number;
	readF64(): number;
}

export interface IReaderConstructor {
	new (input: string): IReader;
}
