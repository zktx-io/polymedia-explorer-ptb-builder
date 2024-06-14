// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { DisplayFieldsResponse, SuiObjectResponse } from "@mysten/sui/client";

import { hasDisplayData } from "../hasDisplayData";

export function getObjectDisplayLookup(objects: SuiObjectResponse[] = []) {
	const lookup = new Map<string, DisplayFieldsResponse>();
	return objects?.filter(hasDisplayData).reduce((acc, curr) => {
		if (curr.data?.objectId) {
			acc.set(curr.data.objectId, curr.data.display!);
		}
		return acc;
	}, lookup);
}
