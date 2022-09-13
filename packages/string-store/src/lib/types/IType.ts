import type { IReader } from '../data/reader/IReader';
import type { IWriter } from '../data/writer/IWriter';

export interface IType<SType = unknown, DType = SType> {
	readonly size: number;
	serialize(buffer: IWriter, value: SType): void;
	deserialize(buffer: IReader): DType;
}
