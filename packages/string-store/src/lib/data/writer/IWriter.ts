export interface IWriter {
	writeU1(value: number | bigint): void;
	writeU2(value: number | bigint): void;
	writeU4(value: number | bigint): void;
	writeU8(value: number | bigint): void;
	writeU16(value: number | bigint): void;
	writeU32(value: number | bigint): void;
	writeB64(value: number | bigint): void;
	writeF32(value: number): void;
	writeF64(value: number): void;

	writeEmpty(bits: number): void;
	finish(): void;

	toString(): string;
}

export interface IWriterConstructor {
	new (size: number): IWriter;
}
