import { Pointer, type PointerLike } from './shared/Pointer';

const Converter8 = new Uint8Array(8);
const ConverterFloat = new Float32Array(Converter8.buffer);
const ConverterDouble = new Float64Array(Converter8.buffer);

export class UnalignedUint16Array {
	#buffer: Uint16Array;
	#bitLength = 0;
	#wordIndex = 0;
	#wordLength = 0;

	public constructor(maxLength: number) {
		this.#buffer = new Uint16Array(maxLength);
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
		this.writeInt8(value & 0xff);
		this.writeInt8(value >> 8);
	}

	public writeInt32(value: number): void {
		this.writeInt16(value & 0xffff);
		this.writeInt16(value >> 16);
	}

	public writeInt64(value: number): void {
		this.writeBigInt64(BigInt(value));
	}

	public writeBigInt32(value: bigint): void {
		this.writeInt16(Number(value & 0xffffn));
		this.writeInt16(Number(value >> 16n));
	}

	public writeBigInt64(value: bigint): void {
		this.writeInt32(Number(value & 0xffffffffn));
		this.writeInt32(Number(value >> 32n));
	}

	public writeFloat32(value: number): void {
		ConverterFloat[0] = value;
		this.writeInt8(Converter8[0]);
		this.writeInt8(Converter8[1]);
		this.writeInt8(Converter8[2]);
		this.writeInt8(Converter8[3]);
	}

	public writeFloat64(value: number): void {
		ConverterDouble[0] = value;
		this.writeInt8(Converter8[0]);
		this.writeInt8(Converter8[1]);
		this.writeInt8(Converter8[2]);
		this.writeInt8(Converter8[3]);
		this.writeInt8(Converter8[4]);
		this.writeInt8(Converter8[5]);
		this.writeInt8(Converter8[6]);
		this.writeInt8(Converter8[7]);
	}

	public readBit(offset: PointerLike): 0 | 1 {
		const ptr = Pointer.from(offset);
		return this.#readBit(ptr) as 0 | 1;
	}

	public readInt2(offset: PointerLike): number {
		const ptr = Pointer.from(offset);
		return this.#readBit(ptr) | (this.#readBit(ptr) << 1);
	}

	public readInt4(offset: PointerLike): number {
		const ptr = Pointer.from(offset);
		return this.#readBit(ptr) | (this.#readBit(ptr) << 1) | (this.#readBit(ptr) << 2) | (this.#readBit(ptr) << 3);
	}

	public readInt8(offset: PointerLike): number {
		const ptr = Pointer.from(offset);
		return this.#readByte(ptr);
	}

	public readInt16(offset: PointerLike): number {
		const ptr = Pointer.from(offset);
		return this.#readByte(ptr) | (this.#readByte(ptr) << 8);
	}

	public readInt32(offset: PointerLike): number {
		return Number(this.readBigInt32(offset));
	}

	public readInt64(offset: PointerLike) {
		return Number(this.readBigInt64(offset));
	}

	public readBigInt32(offset: PointerLike): bigint {
		const ptr = Pointer.from(offset);
		return (
			BigInt(this.#readByte(ptr)) |
			(BigInt(this.#readByte(ptr)) << 8n) |
			(BigInt(this.#readByte(ptr)) << 16n) |
			(BigInt(this.#readByte(ptr)) << 24n)
		);
	}

	public readBigInt64(offset: PointerLike): bigint {
		const ptr = Pointer.from(offset);
		return (
			BigInt(this.#readByte(ptr)) |
			(BigInt(this.#readByte(ptr)) << 8n) |
			(BigInt(this.#readByte(ptr)) << 16n) |
			(BigInt(this.#readByte(ptr)) << 24n) |
			(BigInt(this.#readByte(ptr)) << 32n) |
			(BigInt(this.#readByte(ptr)) << 40n) |
			(BigInt(this.#readByte(ptr)) << 48n) |
			(BigInt(this.#readByte(ptr)) << 56n)
		);
	}

	public readFloat32(offset: PointerLike): number {
		const ptr = Pointer.from(offset);
		Converter8[0] = this.#readByte(ptr);
		Converter8[1] = this.#readByte(ptr);
		Converter8[2] = this.#readByte(ptr);
		Converter8[3] = this.#readByte(ptr);
		return ConverterFloat[0];
	}

	public readFloat64(offset: PointerLike): number {
		const ptr = Pointer.from(offset);
		Converter8[0] = this.#readByte(ptr);
		Converter8[1] = this.#readByte(ptr);
		Converter8[2] = this.#readByte(ptr);
		Converter8[3] = this.#readByte(ptr);
		Converter8[4] = this.#readByte(ptr);
		Converter8[5] = this.#readByte(ptr);
		Converter8[6] = this.#readByte(ptr);
		Converter8[7] = this.#readByte(ptr);
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

	public static from(value: string | UnalignedUint16Array): UnalignedUint16Array {
		if (value instanceof UnalignedUint16Array) return value;

		const buffer = new UnalignedUint16Array(value.length);
		for (let i = 0; i < value.length; i++) {
			buffer.#buffer[i] = value.charCodeAt(i);
		}

		buffer.#bitLength = value.length << 4;
		return buffer;
	}
}
