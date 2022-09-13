import type { IWriter } from './IWriter';

export class AlignedWriter implements IWriter {
	private readonly buffer: Buffer;
	private offset = 0;

	public constructor(size: number) {
		this.buffer = Buffer.alloc(size);
	}

	public writeU1(value: number | bigint): void {
		this.offset = this.buffer.writeUInt8(Number(value), this.offset);
	}

	public writeU2(value: number | bigint): void {
		this.offset = this.buffer.writeUInt8(Number(value), this.offset);
	}

	public writeU4(value: number | bigint): void {
		this.offset = this.buffer.writeUInt8(Number(value), this.offset);
	}

	public writeU8(value: number | bigint): void {
		this.offset = this.buffer.writeUInt8(Number(value), this.offset);
	}

	public writeU16(value: number | bigint): void {
		this.offset = this.buffer.writeUInt16LE(Number(value), this.offset);
	}

	public writeU32(value: number | bigint): void {
		this.offset = this.buffer.writeUInt32LE(Number(value), this.offset);
	}

	public writeB64(value: number | bigint): void {
		this.offset = this.buffer.writeBigUInt64LE(BigInt(value), this.offset);
	}

	public writeF32(value: number): void {
		this.offset = this.buffer.writeFloatLE(value, this.offset);
	}

	public writeF64(value: number): void {
		this.offset = this.buffer.writeDoubleLE(value, this.offset);
	}

	public writeEmpty(bits: number): void {
		this.offset += Math.ceil(bits / 8);
	}

	public finish(): void {
		// NOP: Aligned writer does not use a double buffer.
	}

	public toString(): string {
		return this.buffer.toString('binary');
	}
}
