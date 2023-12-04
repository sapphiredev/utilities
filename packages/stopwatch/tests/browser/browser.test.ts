/**
 * @vitest-environment jsdom
 */

import { type DOMWindow, JSDOM } from 'jsdom';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

describe('browser-bundle-test', () => {
	let window: DOMWindow;

	beforeAll(async () => {
		window = new JSDOM(
			`
				 <!DOCTYPE html>
				 <html lang="en">
				 <head>
					 <meta charset="UTF-8">
					 <meta http-equiv="X-UA-Compatible" content="IE=edge">
					 <meta name="viewport" content="width=device-width, initial-scale=1.0">
					 <title>BrowserBundleTest</title>
					 <script>${await readFile(join(__dirname, '../../dist/iife/index.global.js'), 'utf8')}</script>
				 </head>
				 <body></body>
				 </html>
		 `,
			{
				runScripts: 'dangerously'
			}
		).window;
	});

	test('Stopwatch should be available in browser', () => {
		expect(new window.SapphireStopwatch.Stopwatch().stop().toString()).toBeDefined();
	});
});

declare global {
	interface Window {
		SapphireStopwatch: typeof import('../../src');
	}
}
