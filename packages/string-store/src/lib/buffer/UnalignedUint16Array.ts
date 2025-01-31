import { Pointer, type PointerLike } from '../shared/Pointer';
import type { DuplexBuffer } from './DuplexBuffer';

const ConverterUint8 = new Uint8Array(8);
const ConverterUint16 = new Uint16Array(ConverterUint8.buffer);
const ConverterUint32 = new Uint32Array(ConverterUint8.buffer);
const ConverterUint64 = new BigUint64Array(ConverterUint8.buffer);

const ConverterInt32 = new Int32Array(ConverterUint8.buffer);
const ConverterInt64 = new BigInt64Array(ConverterUint8.buffer);

const ConverterFloat = new Float32Array(ConverterUint8.buffer);
const ConverterDouble = new Float64Array(ConverterUint8.buffer);

export class UnalignedUint16Array implements DuplexBuffer {
	#buffer: Uint16Array;
	#bitLength = 0;
	#wordIndex = 0;
	#wordLength = 0;

	public constructor(maxLength: number) {
		this.#buffer = new Uint16Array(maxLength);
	}

	public at(index: number): number | undefined {
		return this.#buffer.at(index);
	}

	public get maxLength(): number {
		return this.#buffer.length;
	}

	public get maxBitLength(): number {
		return this.#buffer.length * 16;
	}

	public get length(): number {
		return this.#wordLength;
	}

	public get bitLength(): number {
		return this.#bitLength;
	}

	public writeBit(value: number): void {
		this.#writeBit(value);
	}

	public writeInt2(value: number): void {
		this.writeBit(value & 1);
		this.writeBit(value >> 1);
	}

	public writeInt4(value: number): void {
		this.writeInt2(value & 0b11);
		this.writeInt2(value >> 2);
	}

	public writeInt8(value: number): void {
		this.writeInt4(value & 0b1111);
		this.writeInt4(value >> 4);
	}

	public writeInt16(value: number): void {
		this.#bufferWrite16(value);
	}

	public writeInt32(value: number): void {
		this.#bufferWrite16(value);
		this.#bufferWrite16(value >> 16);
	}

	public writeInt64(value: number): void {
		this.writeBigInt64(BigInt(value));
	}

	public writeBigInt32(value: bigint): void {
		ConverterInt64[0] = value;
		this.#bufferWrite16(ConverterUint16[0]);
		this.#bufferWrite16(ConverterUint16[1]);
	}

	public writeBigInt64(value: bigint): void {
		ConverterInt64[0] = value;
		this.#bufferWrite16(ConverterUint16[0]);
		this.#bufferWrite16(ConverterUint16[1]);
		this.#bufferWrite16(ConverterUint16[2]);
		this.#bufferWrite16(ConverterUint16[3]);
	}

	public writeFloat32(value: number): void {
		ConverterFloat[0] = value;
		this.#bufferWrite16(ConverterUint16[0]);
		this.#bufferWrite16(ConverterUint16[1]);
	}

	public writeFloat64(value: number): void {
		ConverterDouble[0] = value;
		this.#bufferWrite16(ConverterUint16[0]);
		this.#bufferWrite16(ConverterUint16[1]);
		this.#bufferWrite16(ConverterUint16[2]);
		this.#bufferWrite16(ConverterUint16[3]);
	}

	public readBit(offset: PointerLike): 0 | 1 {
		const ptr = Pointer.from(offset);
		return this.#readBit(ptr) as 0 | 1;
	}

	public readInt2(offset: PointerLike): number {
		// Bit shifting to convert 2-bit signed integer to 32-bit signed integer
		// 0b01 → 0b0100_0000_0000_0000 → 0b000_0000_0000_0001 (1)
		// 0b10 → 0b1000_0000_0000_0000 → 0b111_1111_1111_1110 (-2)
		return (this.readUint2(offset) << 30) >> 30;
	}

	public readUint2(offset: PointerLike): number {
		const ptr = Pointer.from(offset);
		return this.#readBit(ptr) | (this.#readBit(ptr) << 1);
	}

	public readInt4(offset: PointerLike): number {
		// Bit shifting to convert 4-bit signed integer to 32-bit signed integer,
		// as shown in `readInt2`.
		return (this.readUint4(offset) << 28) >> 28;
	}

	public readUint4(offset: PointerLike): number {
		const ptr = Pointer.from(offset);
		return this.#readBit(ptr) | (this.#readBit(ptr) << 1) | (this.#readBit(ptr) << 2) | (this.#readBit(ptr) << 3);
	}

	public readInt8(offset: PointerLike): number {
		// Bit shifting to convert 8-bit signed integer to 32-bit signed integer,
		// as shown in `readInt2`.
		return (this.readUint8(offset) << 24) >> 24;
	}

	public readUint8(offset: PointerLike): number {
		const ptr = Pointer.from(offset);
		return this.#readByte(ptr);
	}

	public readInt16(offset: PointerLike): number {
		// Bit shifting to convert 8-bit signed integer to 32-bit signed integer,
		// as shown in `readInt2`.
		return (this.readUint16(offset) << 16) >> 16;
	}

	public readUint16(offset: PointerLike): number {
		this.#bufferRead16(Pointer.from(offset));
		return ConverterUint16[0];
	}

	public readInt32(offset: PointerLike): number {
		this.#bufferRead32(Pointer.from(offset));
		return ConverterInt32[0];
	}

	public readUint32(offset: PointerLike): number {
		this.#bufferRead32(Pointer.from(offset));
		return ConverterUint32[0];
	}

	public readInt64(offset: PointerLike): number {
		return Number(this.readBigInt64(offset));
	}

	public readUint64(offset: PointerLike) {
		return Number(this.readBigUint64(offset));
	}

	public readBigInt32(offset: PointerLike): bigint {
		this.#bufferRead32(Pointer.from(offset));
		return BigInt(ConverterInt32[0]);
	}

	public readBigUint32(offset: PointerLike): bigint {
		this.#bufferRead32(Pointer.from(offset));
		return BigInt(ConverterUint32[0]);
	}

	public readBigInt64(offset: PointerLike): bigint {
		this.#bufferRead64(Pointer.from(offset));
		return ConverterInt64[0];
	}

	public readBigUint64(offset: PointerLike): bigint {
		this.#bufferRead64(Pointer.from(offset));
		return ConverterUint64[0];
	}

	public readFloat32(offset: PointerLike): number {
		this.#bufferRead32(Pointer.from(offset));
		return ConverterFloat[0];
	}

	public readFloat64(offset: PointerLike): number {
		this.#bufferRead64(Pointer.from(offset));
		return ConverterDouble[0];
	}

	public toString() {
		let result = '';
		for (let i = 0; i < this.length; i++) {
			result += String.fromCharCode(this.#buffer[i]);
		}

		return result;
	}

	public toArray(): Uint16Array {
		return this.#buffer.slice(0, this.length);
	}

	#readBit(pointer: Pointer) {
		const bitOffset = pointer.value;
		const index = bitOffset >> 4;
		const bitIndex = bitOffset & 0xf;
		pointer.add(1);
		return (this.#buffer[index] >> bitIndex) & 1;
	}

	#readByte(ptr: Pointer) {
		return (
			this.#readBit(ptr) |
			(this.#readBit(ptr) << 1) |
			(this.#readBit(ptr) << 2) |
			(this.#readBit(ptr) << 3) |
			(this.#readBit(ptr) << 4) |
			(this.#readBit(ptr) << 5) |
			(this.#readBit(ptr) << 6) |
			(this.#readBit(ptr) << 7)
		);
	}

	#bufferRead16(ptr: Pointer): void {
		ConverterUint8[0] = this.#readByte(ptr);
		ConverterUint8[1] = this.#readByte(ptr);
	}

	#bufferRead32(ptr: Pointer): void {
		ConverterUint8[0] = this.#readByte(ptr);
		ConverterUint8[1] = this.#readByte(ptr);
		ConverterUint8[2] = this.#readByte(ptr);
		ConverterUint8[3] = this.#readByte(ptr);
	}

	#bufferRead64(ptr: Pointer): void {
		ConverterUint8[0] = this.#readByte(ptr);
		ConverterUint8[1] = this.#readByte(ptr);
		ConverterUint8[2] = this.#readByte(ptr);
		ConverterUint8[3] = this.#readByte(ptr);
		ConverterUint8[4] = this.#readByte(ptr);
		ConverterUint8[5] = this.#readByte(ptr);
		ConverterUint8[6] = this.#readByte(ptr);
		ConverterUint8[7] = this.#readByte(ptr);
	}

	#writeBit(value: number) {
		if (this.#wordIndex === this.maxLength) {
			throw new RangeError(`The buffer is full`);
		}

		if (value) {
			const index = this.#wordIndex;
			const bitIndex = this.bitLength & 0xf;
			this.#buffer[index] |= 1 << bitIndex;
		}

		if ((this.#bitLength & 0xf) === 0) this.#wordLength++;
		this.#bitLength++;
		if ((this.#bitLength & 0xf) === 0) this.#wordIndex++;
	}

	#bufferWrite16(value: number) {
		const wordIndex = this.#wordIndex;
		const bitIndex = this.bitLength & 0xf;

		// If `bitIndex` is `0`:
		// - Then the value will fit in the current word.
		// - In this case, we validate that we can write the current word.
		//
		// Otherwise:
		// - The value will be split between the current word and the next word.
		// - In this case, we validate that we can write the next word.
		if (wordIndex + (bitIndex === 0 ? 0 : 1) === this.maxLength) {
			throw new RangeError(`The buffer is full`);
		}

		if (bitIndex === 0) {
			this.#buffer[wordIndex] = value;
		} else {
			value &= 0xffff;
			this.#buffer[wordIndex] |= value << bitIndex;
			this.#buffer[wordIndex + 1] = value >> (16 - bitIndex);
		}

		this.#bitLength += 16;
		this.#wordIndex++;
		this.#wordLength++;
	}

	public static from(value: string | DuplexBuffer): DuplexBuffer {
		if (typeof value !== 'string') return value;

		const buffer = new UnalignedUint16Array(value.length);
		for (let i = 0; i < value.length; i++) {
			buffer.#buffer[i] = value.charCodeAt(i);
		}

		buffer.#bitLength = value.length << 4;
		return buffer;
	}
}
