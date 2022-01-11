import { fetch, FetchMethods, FetchResultTypes } from '@sapphire/fetch';
import type { PhishermanReportType, PhishermanReturnType } from './PhishermanTypes';

let apiKey: string;

/**
 * Checks if a link is detected as a scam or phishing link by phisherman.
 * @param domain The domain to check.
 * @since 1.0.0
 */
export async function checkDomain(domain: string) {
	const result = await fetch<PhishermanReturnType>(
		`https://api.phisherman.gg/v2/domains/check/${domain}`,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`
			}
		},
		FetchResultTypes.JSON
	);

	return {
		isScam: result.classification === 'safe' ? false : true,
		...result
	};
}

/**
 * Report a domain that is confirmed to be a scam or phishing domain to phisherman, to enhance their API.
 * @param domain The domain to report
 * @since 1.0.0
 */
export function reportDomain(domain: string) {
	return fetch<PhishermanReportType>(
		`https://api.phisherman.gg/v2/phish/report`,
		{
			method: FetchMethods.Put,
			headers: {
				'Content-Type': 'application/json',
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
 * @param key The API to access the phisherman API.
 */
export function setApiKey(key: string) {
	void checkApiKey(apiKey).then(() => {
		apiKey = key;
	});
}

async function checkApiKey(apiKey: string) {
	const result = await fetch<{ message: string; success: false }>(
		`https://api.phisherman.gg/v2/domains/check/verified.test.phisherman.gg`,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`
			}
		},
		FetchResultTypes.JSON
	);
	if (result.message.length) {
		if (result.message === 'missing permissions or invalid API key') {
			throw new Error('Invalid API key');
		}
	}
}
