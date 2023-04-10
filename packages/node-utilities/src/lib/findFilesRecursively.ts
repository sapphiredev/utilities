import type { PathLike } from 'node:fs';
import { opendir } from 'node:fs/promises';
import { join } from 'node:path';

/**
 *
 * @param path The path in which to find files.
 * @param predicate A predicate function receives the path as a parameter. Truthy values will have the path included, falsey values will have the file excluded.
 *
 * @return An {@link AsyncIterableIterator} of all the files. To loop over these use `for await (const file of findFilesRecursively(path, predicate)) {}`
 *
 * @example
 * ```typescript
 * // With CommonJS: To find all files ending with `.ts` in the src directory:
 * const path = require('node:path');
 *
 * for await (const file of findFilesRecursively(path.join(__dirname, 'src'), (filePath) => filePath.endsWith('.ts'))) {
 *   console.log(file);
 * }
 * ```
 *
 * @example
 * ```typescript
 * // With ESM: To find all files ending with `.ts` in the src directory:
 * for await (const file of findFilesRecursively(new URL('src', import.meta.url), (filePath) => filePath.endsWith('.ts'))) {
 *   console.log(file);
 * }
 * ```
 */
export async function* findFilesRecursively(path: PathLike, predicate: (filePath: string) => boolean = () => true): AsyncIterableIterator<string> {
	const dir = await opendir(path);

	for await (const item of dir) {
		if (item.isFile() && predicate(item.name)) {
			yield join(dir.path, item.name);
		} else if (item.isDirectory()) {
			yield* findFilesRecursively(join(dir.path, item.name), predicate);
		}
	}
}

/**
 *
 * @param path The path in which to find files. This can be a string, buffer, or {@link URL}.
 * @param fileStartsWith The string pattern with which the file name must start.
 *
 * Note that we do **not** support a full globby pattern using asterisk for wildcards. It has to be an exact match with {@link String.startsWith}
 *
 * @return An {@link AsyncIterableIterator} of all the files. To loop over these use `for await (const file of findFilesRecursivelyStringStartsWith(path, fileNameEndsWith)) {}`
 */
export function findFilesRecursivelyStringStartsWith(path: PathLike, fileStartsWith: string) {
	return findFilesRecursively(path, (filePath) => filePath.startsWith(fileStartsWith));
}

/**
 *
 * @param path The path in which to find files. This can be a string, buffer, or {@link URL}.
 * @param fileEndsWith The string pattern with which the file name must end.
 * Ideally this is a file extension, however you can also provide more parts of the end of the file.
 *
 * Note that we do **not** support a full globby pattern using asterisk for wildcards. It has to be an exact match with {@link String.endsWith}
 *
 * @return An {@link AsyncIterableIterator} of all the files. To loop over these use `for await (const file of findFilesRecursivelyStringEndsWith(path, fileNameEndsWith)) {}`
 */
export function findFilesRecursivelyStringEndsWith(path: PathLike, fileEndsWith: string) {
	return findFilesRecursively(path, (filePath) => filePath.endsWith(fileEndsWith));
}

/**
 * @param path The path in which to find files. This can be a string, buffer, or {@link URL}.
 * @param include The string pattern which must be present in the file name.
 *
 * Note that we do **not** support a full globby pattern using asterisk for wildcards. It has to be an exact match with {@link String.includes}
 *
 * @return An {@link AsyncIterableIterator} of all the files. To loop over these use `for await (const file of findFilesRecursivelyStringIncludes(path, fileNameEndsWith)) {}`
 */
export function findFilesRecursivelyStringIncludes(path: PathLike, include: string) {
	return findFilesRecursively(path, (filePath) => filePath.includes(include));
}

/**
 * @param path The path in which to find files. This can be a string, buffer, or {@link URL}.
 * @param regex The regex pattern that the file name must match.
 *
 * @return An {@link AsyncIterableIterator} of all the files. To loop over these use `for await (const file of findFilesRecursivelyRegex(path, fileNameEndsWith)) {}`
 */
export function findFilesRecursivelyRegex(path: PathLike, regex: RegExp) {
	return findFilesRecursively(path, (filePath) => regex.test(filePath));
}
