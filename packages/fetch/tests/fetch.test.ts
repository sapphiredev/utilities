import nock from 'nock';
import { URL as NodeUrl } from 'node:url';
import { fetch, FetchResultTypes, QueryError, FetchMediaContentTypes } from '../dist/esm/index.mjs';

describe('fetch', () => {
	let nockScopeHttp: nock.Scope;
	let nockScopeHttps: nock.Scope;

	beforeAll(() => {
		nockScopeHttp = nock('http://localhost')
			.persist()
			.get('/simpleget')
			.times(Infinity)
			.reply(200, { test: true })
			.post('/simplepost', { sapphire: 'isAwesome' })
			.times(Infinity)
			.reply(200, { test: true })
			.get('/404')
			.times(Infinity)
			.reply(404, { success: false });

		nockScopeHttps = nock('https://localhost') //
			.persist()
			.get('/simpleget')
			.times(Infinity)
			.reply(200, { test: true })
			.post('/simplepost', { sapphire: 'isAwesome' })
			.times(Infinity)
			.reply(200, { test: true });
	});

	afterAll(() => {
		nockScopeHttp.persist(false);
		nockScopeHttps.persist(false);
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
				{ headers: { accept: 'application/json' } },
				FetchResultTypes.JSON
			);

			expect(response.test).toBe(true);
		});

		test('GIVEN fetch w/ options w/ No Response THEN returns JSON', async () => {
			const response = await fetch<{ test: boolean }>('http://localhost/simpleget', {
				headers: { accept: 'application/json' }
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

		test('GIVEN fetch w/ Buffer Response THEN returns Buffer', async () => {
			const response = await fetch('http://localhost/simpleget', FetchResultTypes.Blob);
			const jsonData = await response.text();

			expect(jsonData).toStrictEqual(JSON.stringify({ test: true }));
		});

		test('GIVEN fetch w/ Text Response THEN returns raw text', async () => {
			const response = await fetch('http://localhost/simpleget', FetchResultTypes.Text);

			expect(response).toStrictEqual(JSON.stringify({ test: true }));
		});

		test('GIVEN fetch w/ NodeJS URL class THEN returns result', async () => {
			const url = new NodeUrl('http://localhost/simpleget');
			const response = await fetch(url, FetchResultTypes.Text);

			expect(response).toStrictEqual(JSON.stringify({ test: true }));
		});

		test('GIVEN fetch w/ Browser URL class THEN returns result', async () => {
			const url = new URL('http://localhost/simpleget');
			const response = await fetch(url, FetchResultTypes.Text);

			expect(response).toStrictEqual(JSON.stringify({ test: true }));
		});

		test('GIVEN fetch w/ relative path THEN returns result', async () => {
			const response = await fetch('//localhost/simpleget', FetchResultTypes.Text);

			expect(response).toStrictEqual(JSON.stringify({ test: true }));
		});

		test('GIVEN fetch w/ object body w/ JSON response THEN returns JSON', async () => {
			const response = await fetch<{ test: boolean }>(
				'http://localhost/simplepost',
				{ method: 'POST', body: { sapphire: 'isAwesome' } },
				FetchResultTypes.JSON
			);

			expect(response.test).toBe(true);
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
				expect((error as QueryError).message).toBe(`Failed to request '${url}' with code 404.`);
				expect((error as QueryError).body).toBe('{"success":false}');
				expect((error as QueryError).code).toBe(404);
				expect((error as QueryError).url).toBe(url);
				expect((error as QueryError).toJSON()).toStrictEqual({ success: false });
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
				expect((error as QueryError).message).toBe(`Failed to request '${url}' with code 404.`);
				expect((error as QueryError).code).toBe(404);
				expect((error as QueryError).url).toBe(url.href);
				expect((error as QueryError).toJSON()).toStrictEqual({ success: false });
			}
		});

		test('GIVEN fetch w/ calling error.toJSON() twice THEN returns FetchError', async () => {
			const url = 'http://localhost/404';
			const fetchResult = fetch(url, FetchResultTypes.JSON);

			await expect(fetchResult).rejects.toThrowError(`Failed to request '${url}' with code 404.`);
			await expect(fetchResult).rejects.toBeInstanceOf(Error);

			try {
				await fetchResult;
			} catch (error) {
				expect((error as QueryError).toJSON()).toStrictEqual({ success: false });

				// This will use the cached value
				expect((error as QueryError).toJSON()).toStrictEqual({ success: false });
			}
		});

		test('GIVEN fetch w/ invalid type THEN throws', async () => {
			// @ts-expect-error handling error case
			await expect(fetch('http://localhost/simpleget', 'type not found')).rejects.toThrowError('Unknown type "type not found"');
		});
	});
});

describe('FetchMediaContentTypes', () => {
	test('GIVEN Entries of FetchMediaContentTypes THEN returns expected entries', () => {
		const MediaTypeEntries = [...Object.entries(FetchMediaContentTypes)];

		expect(MediaTypeEntries).toHaveLength(31);
		expect(MediaTypeEntries).toStrictEqual([
			['AudioAac', 'audio/aac'],
			['AudioMp4', 'audio/mp4'],
			['AudioMpeg', 'audio/mpeg'],
			['AudioOgg', 'audio/ogg'],
			['AudioOpus', 'audio/opus'],
			['AudioVorbis', 'audio/vorbis'],
			['AudioWav', 'audio/wav'],
			['AudioWebm', 'audio/webm'],
			['FontOtf', 'font/otf'],
			['FontTtf', 'font/ttf'],
			['FontWoff', 'font/woff'],
			['FontWoff2', 'font/woff2'],
			['FormData', 'multipart/form-data'],
			['FormURLEncoded', 'application/x-www-form-urlencoded'],
			['ImageAPNG', 'image/apng'],
			['ImageGIF', 'image/gif'],
			['ImageJPEG', 'image/jpeg'],
			['ImagePNG', 'image/png'],
			['ImageWEBP', 'image/webp'],
			['JSON', 'application/json'],
			['JavaScript', 'application/javascript'],
			['OctetStream', 'application/octet-stream'],
			['TextCSS', 'text/css'],
			['TextHTML', 'text/html'],
			['TextPlain', 'text/plain'],
			['VideoH264', 'video/h264'],
			['VideoH265', 'video/h265'],
			['VideoMp4', 'video/mp4'],
			['VideoOgg', 'video/ogg'],
			['VideoWebm', 'video/webm'],
			['XML', 'application/xml']
		]);
	});
});
