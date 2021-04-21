import { HttpCodes, MimeTypes } from '@sapphire/plugin-api';
import nock from 'nock';
import { URL } from 'url';
import fetch, { FetchResultTypes } from '../src';

describe('fetch', () => {
	let nockScope: nock.Scope;

	beforeAll(() => {
		nockScope = nock('http://localhost')
			.persist()
			.get('/simpleget')
			.times(Infinity)
			.reply(200, { test: true })
			.get('/404')
			.times(Infinity)
			.reply(404, { success: false });
	});

	afterAll(() => {
		nockScope.persist(false);
		nock.restore();
	});

	describe('Successful fetches', () => {
		test('GIVEN fetch w/ JSON response THEN returns JSON', async () => {
			const response = await fetch<{ test: boolean }>('http://localhost/simpleget', FetchResultTypes.JSON);

			expect(response.test).toBe(true);
		});

		test('GIVEN fetch w/o options w/ JSON response THEN returns JSON', async () => {
			const response = await fetch<{ test: boolean }>('http://localhost/simpleget');

			expect(response.test).toBe(true);
		});

		test('GIVEN fetch w/o options w/ JSON response THEN returns JSON', async () => {
			const response = await fetch<{ test: boolean }>(
				'http://localhost/simpleget',
				{ headers: { accept: MimeTypes.ApplicationJson } },
				FetchResultTypes.JSON
			);

			expect(response.test).toBe(true);
		});

		test('GIVEN fetch w/ options w/ No Response THEN returns JSON', async () => {
			const response = await fetch<{ test: boolean }>('http://localhost/simpleget', {
				headers: { accept: MimeTypes.ApplicationJson }
			});

			expect(response.test).toBe(true);
		});

		test('GIVEN fetch w/ Result Response THEN returns Result', async () => {
			const response = await fetch('http://localhost/simpleget', FetchResultTypes.Result);

			expect(response.ok).toBe(true);
			expect(response.bodyUsed).toBe(false);
		});

		test('GIVEN fetch w/ Buffer Response THEN returns Buffer', async () => {
			const response = await fetch('http://localhost/simpleget', FetchResultTypes.Buffer);

			expect(response).toStrictEqual(Buffer.from(JSON.stringify({ test: true })));
		});

		test('GIVEN fetch w/ Text Response THEN returns raw text', async () => {
			const response = await fetch('http://localhost/simpleget', FetchResultTypes.Text);

			expect(response).toStrictEqual(JSON.stringify({ test: true }));
		});

		test('GIVEN fetch w/ invalid type THEN throws', async () => {
			// @ts-expect-error handling error case
			await expect(fetch('http://localhost/simpleget', 'type not found')).rejects.toThrowError('Unknown type "type not found"');
		});
	});

	describe('Unsuccessful fetches', () => {
		test('GIVEN fetch w/ unknown path THEN returns FetchError', async () => {
			const url = 'http://localhost/404';
			const fetchResult = fetch(url, FetchResultTypes.JSON);

			await expect(fetchResult).rejects.toThrowError(`Failed to request '${url}' with code 404.`);
			await expect(fetchResult).rejects.toBeInstanceOf(Error);

			try {
				await fetchResult;
			} catch (error) {
				expect(error.message).toBe(`Failed to request '${url}' with code 404.`);
				expect(error.body).toBe('{"success":false}');
				expect(error.code).toBe(HttpCodes.NotFound);
				expect(error.url).toBe(url);
				expect(error.toJSON()).toStrictEqual({ success: false });
			}
		});

		test('GIVEN fetch w/ unknown path AND URL object THEN returns FetchError', async () => {
			const url = new URL('http://localhost/404');
			const fetchResult = fetch(url, FetchResultTypes.JSON);

			await expect(fetchResult).rejects.toThrowError(`Failed to request '${url}' with code 404.`);
			await expect(fetchResult).rejects.toBeInstanceOf(Error);

			try {
				await fetchResult;
			} catch (error) {
				expect(error.message).toBe(`Failed to request '${url}' with code 404.`);
				expect(error.code).toBe(HttpCodes.NotFound);
				expect(error.url).toBe(url.href);
				expect(error.toJSON()).toStrictEqual({ success: false });
			}
		});

		test('GIVEN fetch w/ calling error.toJSON() twice THEN returns FetchError', async () => {
			const url = new URL('http://localhost/404');
			const fetchResult = fetch(url, FetchResultTypes.JSON);

			await expect(fetchResult).rejects.toThrowError(`Failed to request '${url}' with code 404.`);
			await expect(fetchResult).rejects.toBeInstanceOf(Error);

			try {
				await fetchResult;
			} catch (error) {
				expect(error.toJSON()).toStrictEqual({ success: false });

				// This will use the cached value
				expect(error.toJSON()).toStrictEqual({ success: false });
			}
		});
	});
});
