import { RuleTester } from '@typescript-eslint/rule-tester';
import { fileURLToPath, URL } from 'node:url';
import { noDiscardResult } from '../../src/rules/no-discard-result';

const ruleTester = new RuleTester({
	languageOptions: {
		parserOptions: {
			ecmaVersion: 2_024,
			tsconfigRootDir: fileURLToPath(new URL('../', import.meta.url)),
			projectService: { allowDefaultProject: ['*.ts'] }
		}
	}
});

ruleTester.run('no-discard-result', noDiscardResult, {
	valid: [
		{
			code: `import { Result } from '@sapphire/result';
					function foo() { return Result.ok('value'); }
					const bar = () => Result.err('error');
					async function asyncFoo() { return await Promise.resolve(Result.ok('value')); }
					const asyncBar = async () => await Promise.resolve(Result.err('error'));
				`,
			name: 'Result is returned explicitly or implicitly'
		},
		{
			code: `import { Option } from '@sapphire/result';
					class Result {}
					function foo(): Result { return new Result(); }
					foo();
					Option.some('value');
				`,
			name: 'unrelated types are not Results'
		},
		{
			code: `import { Result } from '@sapphire/result';
					function foo(): Result<string, string> {}
					async function bar(): Promise<Result<string, string>> {}
					const x = foo();
					let y = await bar(), z = (void 0, foo());
					y = z = await bar();
					const complex = foo() && (((Math.random() > 0.5 ? foo() : await bar()) || foo()) ?? await bar());
				`,
			name: 'Result is not discarded'
		},
		{
			code: `import { Result } from '@sapphire/result';
					function foo(): Result<string, string> {}
					void foo();
				`,
			name: 'Result is intentionally discarded'
		},
		{
			code: `import { Result } from '@sapphire/result';
					function foo(): Result<string, string> {}
					function bar(result: Result<string, string>) {}
					void bar(foo());
				`,
			name: 'Result is passed into another function'
		}
	],
	invalid: [
		{
			code: `import { Result as SapphireResult } from '@sapphire/result';
					type AliasedResult = SapphireResult<string, string>;
					function foo(): AliasedResult { return SapphireResult.ok('value'); }
					foo();`,
			name: 'discarded Result through import and type aliases',
			errors: [{ messageId: 'discardedResult', line: 4 }]
		},
		{
			code: `import { Result, ok, err, type Ok, type Err } from '@sapphire/result';
					function foo(): Ok<string> { return ok('value'); }
					function bar(): Err<string> { return err('error'); }
					function inferred() { return Result.ok('value'); }
					foo();
					bar();
					inferred();
					Result.ok('value');
					Result.err('error');
					ok('value');
					err('error');`,
			name: 'discarded Result variants and inferred return types',
			errors: [
				{ messageId: 'discardedResult', line: 5 },
				{ messageId: 'discardedResult', line: 6 },
				{ messageId: 'discardedResult', line: 7 },
				{ messageId: 'discardedResult', line: 8 },
				{ messageId: 'discardedResult', line: 9 },
				{ messageId: 'discardedResult', line: 10 },
				{ messageId: 'discardedResult', line: 11 }
			]
		},
		{
			code: `import { Result } from '@sapphire/result';
					function foo(): Result<string, string> {}

					foo();`,
			name: 'simple discard',
			errors: [
				{
					messageId: 'discardedResult',
					line: 4
				}
			]
		},
		{
			code: `import { Result } from '@sapphire/result';
					async function foo(): Promise<Result<string, string>> {}

					foo();`,
			name: 'unawaited async function discarded',
			errors: [
				{
					messageId: 'discardedResult',
					line: 4
				}
			]
		},
		{
			code: `import { Result } from '@sapphire/result';
					async function foo(): Promise<Result<string, string>> {}

					await foo();`,
			name: 'awaited async function discarded',
			errors: [
				{
					messageId: 'discardedResult',
					line: 4
				}
			]
		},
		{
			code: `import { Result } from '@sapphire/result';
					function foo(): Promise<Result<string, string>> {}

					(
						foo(),
						await foo()
					);`,
			name: 'double discard',
			errors: [
				{
					messageId: 'discardedResult',
					line: 5
				},
				{
					messageId: 'discardedResult',
					line: 6
				}
			]
		},
		{
			code: `import { Result } from '@sapphire/result';
					function foo(): Promise<Result<string, string>> {}

					null ?? foo();
					`,
			name: 'potential discard (??)',
			errors: [
				{
					messageId: 'discardedResult',
					line: 4
				}
			]
		}
	]
});
