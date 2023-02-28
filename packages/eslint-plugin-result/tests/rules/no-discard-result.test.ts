import { ruleTester } from '../shared';
import { noDiscordResultRule } from '../../src/rules/no-discard-result';

ruleTester.run('no-discard-result', noDiscordResultRule, {
	valid: [
		{
			code: `import { Result } from '@sapphire/result';
				function foo(): Result<string, string> {}
				async function bar(): Promise<Result<string, string>> {}
				
				const x = foo();
				let y = await bar(), z = (void 0, foo());
				y = z = await bar();
				const complex = foo() && (((Math.random() > 0.5 ? foo() : await bar()) || foo()) ?? await bar());
			`,
			name: 'Result is not discared'
		}
	],
	invalid: [
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
