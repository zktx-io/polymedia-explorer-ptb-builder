// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

export type Feature = {
	type: "Feature";
	id: string;
	geometry: { coordinates: [number, number][][]; type: "Polygon" };
	properties: { name: string; countryCode: string };
};

type ValidatorIpInfo = {
	ip: string;
	hostname: string;
	city: string;
	region: string;
	country: string;
	loc: string;
	postal: string;
	timezone: string;
	asn: {
		asn: string;
		name: string;
		domain: string;
		route: string;
		type: string;
	};
	countryCode: string;
	countryFlag: {
		emoji: string;
		unicode: string;
	};
	countryCurrency: {
		code: string;
		symbol: string;
	};
	continent: {
		code: string;
		name: string;
	};
	isEU: boolean;
};

export type ValidatorMapValidator = {
	ipInfo?: ValidatorIpInfo;
	suiAddress: string;
	name: string;
	votingPower: string;
};

export type ValidatorMapResponse = {
	validators: ValidatorMapValidator[];
	nodeCount?: number | null;
};
