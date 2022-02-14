import { fetch, FetchMethods, FetchResultTypes, QueryError } from '@sapphire/fetch';
import type { PhishermanInfoType, PhishermanReportType, PhishermanReturnType } from './PhishermanTypes';
import os from 'node:os';

const agent = `Sapphire Phisherman/1.0.0 (node-fetch) ${os.platform()}/${os.release()} (https://github.com/sapphiredev/utilities/tree/main/packages/phisherman)`;
/**
 * The cached apiKey which was created using {@link setApiKey}
 */
let storedApiKey: string;

/**
 * Checks if a link is detected as a scam or phishing link by phisherman.
 * @param domain The domain to check.
 * @param apiKey optionally pass a Phiserman API key for making this request. This will default to {@link storedApiKey}, which can be configured through {@link setApiKey}.
 * @since 1.0.0
 */
export async function checkDomain(domain: string, apiKey: string = storedApiKey) {
	validateUrl(domain);
	const result = await fetch<PhishermanReturnType>(
		`https://api.phisherman.gg/v2/domains/check/${domain}`,
		{
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': agent,
				Authorization: `Bearer ${apiKey}`
			}
		},
		FetchResultTypes.JSON
	);

	return {
		...result,
		isScam: result.classification === 'safe' || result.classification === 'unknown' ? false : true
	};
}

/**
 * Report a domain that is confirmed to be a scam or phishing domain to phisherman, to enhance their API.
 * @param domain The domain to report.
 * @param apiKey optionally pass a Phiserman API key for making this request. This will default to {@link storedApiKey}, which can be configured through {@link setApiKey}.
 * @since 1.0.0
 */
export function reportDomain(domain: string, apiKey: string = storedApiKey) {
	validateUrl(domain);
	return fetch<PhishermanReportType>(
		`https://api.phisherman.gg/v2/phish/report`,
		{
			method: FetchMethods.Put,
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': agent,
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
 * Returns information for a domain.
 * @param domain The domain to get info about.
 * @param apiKey optionally pass a Phiserman API key for making this request. This will default to {@link storedApiKey}, which can be configured through {@link setApiKey}.
 * @since 1.1.0
 */
export async function getDomainInfo(domain: string, apiKey: string = storedApiKey) {
	validateUrl(domain);
	const result = await fetch<PhishermanInfoType>(
		`https://api.phisherman.gg/v2/domains/info/${domain}`,
		{
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': agent,
				Authorization: `Bearer ${apiKey}`
			}
		},
		FetchResultTypes.JSON
	);
	return result[domain];
}

/**
 * Report a caught phish back to phisherman to improve their analytics.
 * @param domain The domain which was caught.
 * @param apiKey @param apiKey optionally pass a Phiserman API key for making this request. This will default to {@link storedApiKey}, which can be configured through {@link setApiKey}.
 * @param guildId The id of the guild in which the domain was caught.
 * @since 1.1.0
 */
export function reportCaughtPhish(domain: string, apiKey: string = storedApiKey, guildId: string | number = '') {
	return fetch<PhishermanReportType>(
		`https://api.phisherman.gg/v2/phish/caught/${domain}`,
		{
			method: FetchMethods.Post,
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': agent,
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				guild: Number(guildId)
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
					'User-Agent': agent,
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

function validateUrl(domain: string) {
	const regexp = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
	if (!domain.match(regexp)) throw new Error('[SapphirePhisherman]: Invalid domain provided');
}
