import type { PointerLike } from '../shared/Pointer';

export interface DuplexBuffer {
	at(index: number): number | undefined;

	get maxLength(): number;
	get maxBitLength(): number;
	get length(): number;
	get bitLength(): number;

	writeBit(value: number): void;
	writeInt2(value: number): void;
	writeInt4(value: number): void;
	writeInt8(value: number): void;
	writeInt16(value: number): void;
	writeInt32(value: number): void;
	writeInt64(value: number): void;
	writeBigInt32(value: bigint): void;
	writeBigInt64(value: bigint): void;
	writeFloat32(value: number): void;
	writeFloat64(value: number): void;

	readBit(offset: PointerLike): 0 | 1;
	readInt2(offset: PointerLike): number;
	readUint2(offset: PointerLike): number;
	readInt4(offset: PointerLike): number;
	readUint4(offset: PointerLike): number;
	readInt8(offset: PointerLike): number;
	readUint8(offset: PointerLike): number;
	readInt16(offset: PointerLike): number;
	readUint16(offset: PointerLike): number;
	readInt32(offset: PointerLike): number;
	readUint32(offset: PointerLike): number;
	readInt64(offset: PointerLike): number;
	readUint64(offset: PointerLike): number;
	readBigInt32(offset: PointerLike): bigint;
	readBigUint32(offset: PointerLike): bigint;
	readBigInt64(offset: PointerLike): bigint;
	readBigUint64(offset: PointerLike): bigint;
	readFloat32(offset: PointerLike): number;
	readFloat64(offset: PointerLike): number;

	toString(): string;
	toArray(): Uint16Array;
}
