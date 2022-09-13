import { AlignedReader } from './data/reader/AlignedReader';
import type { IReaderConstructor } from './data/reader/IReader';
import { AlignedWriter } from './data/writer/AlignedWriter';
import type { IWriterConstructor } from './data/writer/IWriter';
import { StringStoreEntry } from './StringStoreEntry';

export class StringStore {
	private reader: IReaderConstructor = AlignedReader;
	private writer: IWriterConstructor = AlignedWriter;
	private readonly names = new Map<string, StringStoreEntry>();
	private readonly ids = new Map<number, StringStoreEntry>();

	public setReader(reader: IReaderConstructor) {
		this.reader = reader;
		return this;
	}

	public setWriter(writer: IWriterConstructor) {
		this.writer = writer;
		return this;
	}

	public get size(): number {
		return this.ids.size;
	}

	public add(name: string, cb: (entry: StringStoreEntry) => void): this {
		const entry = new StringStoreEntry(this.names.size, name);
		this.names.set(entry.name, entry);
		this.ids.set(entry.id, entry);

		cb(entry);

		return this;
	}

	public serialize(name: string, ...parameters: readonly unknown[]): string {
		const entry = this.names.get(name);
		if (entry === undefined) throw new Error(`There is no entry named ${name}.`);

		const writer = new this.writer(entry.size === -1 ? 100 : entry.size + 8);
		writer.writeU8(entry.id);
		entry.serialize(writer, ...parameters);
		writer.finish();
		return writer.toString();
	}

	public deserialize(content: string): Record<string, unknown> {
		const reader = new this.reader(content);
		const id = reader.readU8();

		const entry = this.ids.get(id);
		if (entry === undefined) throw new Error(`Could not find a string store with the ID of ${id}.`);

		return entry.deserialize(reader);
	}
}
