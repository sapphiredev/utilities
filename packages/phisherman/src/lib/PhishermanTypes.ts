export interface PhishermanOptions {
	apiKey: string;
}

export interface PhishermanReturnType {
	verifiedPhish: boolean;
	classification: 'malicious' | 'suspicious' | 'safe' | 'unknown';
}

export type CheckReturnType = PhishermanReturnType & {
	isScam: boolean;
};

export interface PhishermanReportType {
	success: boolean;
	message: string;
}

export interface PhishermanInfo {
	status: string;
	created: string;
	lastChecked: string;
	verifiedPhish: boolean;
	classification: string;
	firstSeen: string;
	lastSeen: string;
	targetedBrand: string;
	phishCaught: number;
	details: Details;
}

export interface PhishermanInfoType {
	[key: string]: PhishermanInfo;
}

interface Details {
	phishTankId: string;
	urlScanId: string;
	websiteScreenshot: string;
	ip_address: string;
	asn: Asn;
	registry: string;
	country: Country;
}

interface Asn {
	asn: string;
	asn_name: string;
	route: string;
}

interface Country {
	code: string;
	name: string;
}
