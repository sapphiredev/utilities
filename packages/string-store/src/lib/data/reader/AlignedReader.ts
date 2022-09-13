import type { U1, U2, U4 } from '../common';
import type { IReader } from './IReader';

export class AlignedReader implements IReader {
	private readonly buffer: Buffer;
	private offset = 0;

	public constructor(input: string) {
		this.buffer = Buffer.from(input, 'binary');
	}

	public readU1(): U1 {
		return this.readU8() as U1;
	}

	public readU2(): U2 {
		return this.readU8() as U2;
	}

	public readU4(): U4 {
		return this.readU8() as U4;
	}

	public readU8(): number {
		const value = this.buffer.readUInt8(this.offset);
		this.offset += 1;
		return value;
	}

	public readU16(): number {
		const value = this.buffer.readUInt16LE(this.offset);
		this.offset += 2;
		return value;
	}

	public readU32(): number {
		const value = this.buffer.readUInt32LE(this.offset);
		this.offset += 4;
		return value;
	}

	public readB64(): bigint {
		const value = this.buffer.readBigUInt64LE(this.offset);
		this.offset += 8;
		return value;
	}

	public readF32(): number {
		const value = this.buffer.readFloatLE(this.offset);
		this.offset += 4;
		return value;
	}

	public readF64(): number {
		const value = this.buffer.readDoubleLE(this.offset);
		this.offset += 8;
		return value;
	}
}
