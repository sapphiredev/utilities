export interface PhishermanOptions {
	apiKey: string;
}

export interface PhishermanReturnType {
	verifiedPhish: boolean;
	classification: 'malicious' | 'suspicious' | 'safe';
}

export type CheckReturnType = PhishermanReturnType & {
	isScam: boolean;
};

export interface PhishermanReportType {
	success: boolean;
	message: string;
}
