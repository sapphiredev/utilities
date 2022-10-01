import path from 'node:path';
import {
	findFilesRecursively,
	findFilesRecursivelyStringEndsWith,
	findFilesRecursivelyStringIncludes,
	findFilesRecursivelyStringStartsWith,
	findFilesRecursivelyRegex
} from '../src';

describe('findFilesRecursively', () => {
	test('GIVEN a directory name THEN returns all files in that directory', async () => {
		const files = [];
		for await (const file of findFilesRecursively(path.join(__dirname, 'findFilesRecursivelyDemoFiles'))) {
			files.push(file);
		}
		expect(files.length).toBe(5);
		// sort is required because the order of the files is not same on all operating systems
		expect(files.sort((a, b) => a.localeCompare(b))).toStrictEqual([
			path.join(__dirname, 'findFilesRecursivelyDemoFiles', 'a.txt'),
			path.join(__dirname, 'findFilesRecursivelyDemoFiles', 'file1.txt'),
			path.join(__dirname, 'findFilesRecursivelyDemoFiles', 'file2.csv'),
			path.join(__dirname, 'findFilesRecursivelyDemoFiles', 'file3.xml'),
			path.join(__dirname, 'findFilesRecursivelyDemoFiles', 'nested', 'b.txt')
		]);
	});
});

describe('findFilesRecursivelyStringStartsWith', () => {
	test('GIVEN a directory name and a startsWith value THEN returns all files that starts with the given value', async () => {
		const files = [];
		for await (const file of findFilesRecursivelyStringStartsWith(path.join(__dirname, 'findFilesRecursivelyDemoFiles'), 'file')) {
			files.push(file);
		}
		expect(files.length).toBe(3);
		expect(files.sort((a, b) => a.localeCompare(b))).toStrictEqual([
			path.join(__dirname, 'findFilesRecursivelyDemoFiles', 'file1.txt'),
			path.join(__dirname, 'findFilesRecursivelyDemoFiles', 'file2.csv'),
			path.join(__dirname, 'findFilesRecursivelyDemoFiles', 'file3.xml')
		]);
	});
});

describe('findFilesRecursivelyStringEndsWith', () => {
	test('GIVEN a directory name and an endsWith value THEN returns all files that ends with the given value', async () => {
		const files = [];
		for await (const file of findFilesRecursivelyStringEndsWith(path.join(__dirname, 'findFilesRecursivelyDemoFiles'), 'txt')) {
			files.push(file);
		}
		expect(files.length).toBe(3);
		expect(files.sort((a, b) => a.localeCompare(b))).toStrictEqual([
			path.join(__dirname, 'findFilesRecursivelyDemoFiles', 'a.txt'),
			path.join(__dirname, 'findFilesRecursivelyDemoFiles', 'file1.txt'),
			path.join(__dirname, 'findFilesRecursivelyDemoFiles', 'nested', 'b.txt')
		]);
	});
});

describe('findFilesRecursivelyStringIncludes', () => {
	test('GIVEN a directory name and a includes value THEN returns all files that includes the given value', async () => {
		const files = [];
		for await (const file of findFilesRecursivelyStringIncludes(path.join(__dirname, 'findFilesRecursivelyDemoFiles'), '1')) {
			files.push(file);
		}
		expect(files.length).toBe(1);
		expect(files.sort((a, b) => a.localeCompare(b))).toStrictEqual([path.join(__dirname, 'findFilesRecursivelyDemoFiles', 'file1.txt')]);
	});
});

describe('findFilesRecursivelyRegex', () => {
	test('GIVEN a directory name and a regex THEN returns all files that matches the regex', async () => {
		const files = [];
		for await (const file of findFilesRecursivelyRegex(path.join(__dirname, 'findFilesRecursivelyDemoFiles'), /^file(?:1|2)/)) {
			files.push(file);
		}
		expect(files.length).toBe(2);
		expect(files.sort((a, b) => a.localeCompare(b))).toStrictEqual([
			path.join(__dirname, 'findFilesRecursivelyDemoFiles', 'file1.txt'),
			path.join(__dirname, 'findFilesRecursivelyDemoFiles', 'file2.csv')
		]);
	});
});
