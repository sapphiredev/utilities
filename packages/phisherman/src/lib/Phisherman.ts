import { fetch, FetchMethods, FetchResultTypes, QueryError } from '@sapphire/fetch';
import type { PhishermanReportType, PhishermanReturnType } from './PhishermanTypes';
import os from 'node:os';

let storedApiKey: string;

/**
 * Checks if a link is detected as a scam or phishing link by phisherman.
 * @param domain The domain to check.
 * @param apiKey optionally pass a Phiserman API key for making this request. This will default to {@link storedApiKey}, which can be configured through {@link setApiKey}.
 * @since 1.0.0
 */
export async function checkDomain(domain: string, apiKey: string = storedApiKey) {
	const result = await fetch<PhishermanReturnType>(
		`https://api.phisherman.gg/v2/domains/check/${domain}`,
		{
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': `Sapphire Phisherman/1.0.0 (node-fetch) ${os.platform()}/${os.release()} (https://github.com/sapphiredev/utilities/tree/main/packages/phisherman)`,
				Authorization: `Bearer ${apiKey}`
			}
		},
		FetchResultTypes.JSON
	);

	return {
		...result,
		isScam: result.classification === 'safe' ? false : true
	};
}

/**
 * Report a domain that is confirmed to be a scam or phishing domain to phisherman, to enhance their API.
 * @param domain The domain to report.
 * @param apiKey optionally pass a Phiserman API key for making this request. This will default to {@link storedApiKey}, which can be configured through {@link setApiKey}.
 * @since 1.0.0
 */
export async function reportDomain(domain: string, apiKey: string = storedApiKey) {
	return fetch<PhishermanReportType>(
		`https://api.phisherman.gg/v2/phish/report`,
		{
			method: FetchMethods.Put,
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': `Sapphire Phisherman/1.0.0 (node-fetch) ${os.platform()}/${os.release()} (https://github.com/sapphiredev/utilities/tree/main/packages/phisherman)`,
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				url: domain
			})
		},
		FetchResultTypes.JSON
	);
}

/**
 * Set the phisherman's API key.
 * @param key The API key to access the phisherman API and cache within the code of the wrapper.
 * @since 1.0.0
 */
export async function setApiKey(key: string) {
	await checkApiKey(key);
	storedApiKey = key;
}

async function checkApiKey(apiKey: string) {
	try {
		await fetch<{ message: string; success: false }>(
			`https://api.phisherman.gg/v2/domains/check/verified.test.phisherman.gg`,
			{
				headers: {
					'Content-Type': 'application/json',
					'User-Agent': `Sapphire Phisherman/1.0.0 (node-fetch) ${os.platform()}/${os.release()} (https://github.com/sapphiredev/utilities/tree/main/packages/phisherman)`,
					Authorization: `Bearer ${apiKey}`
				}
			},
			FetchResultTypes.JSON
		);
	} catch (error) {
		const typedError = error as QueryError;

		if (typedError.code === 401 && typedError.toJSON().message === 'missing permissions or invalid API key') {
			throw new Error('[SapphirePhisherman]: Invalid API key provided');
		}

		throw error;
	}
}
