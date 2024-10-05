// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useSuiClient } from "@mysten/dapp-kit";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

import { SuiClient, type PaginatedTransactionResponse, type TransactionFilter } from "@mysten/sui/client";
import { useNetworkContext } from "~/context";
import { Network } from "~/utils/api/DefaultRpcClient";

export const DEFAULT_TRANSACTIONS_LIMIT = 20;

// Fetch transaction blocks
export function useGetTransactionBlocks(
	filter?: TransactionFilter,
	limit = DEFAULT_TRANSACTIONS_LIMIT,
	refetchInterval?: number,
	useAltRpc = false,
) {
	const [network] = useNetworkContext();
	const client =
		 (useAltRpc && network === Network.MAINNET)  ? new SuiClient({ url: "https://mainnet.suiet.app" })
		: (useAltRpc && network === Network.TESTNET) ? new SuiClient({ url: "https://testnet.suiet.app" })
		: useSuiClient();

	return useInfiniteQuery<PaginatedTransactionResponse>({
		queryKey: ["get-transaction-blocks", filter, limit],
		queryFn: async ({ pageParam }) =>
			await client.queryTransactionBlocks({
				filter,
				cursor: pageParam as string | null,
				order: "descending",
				limit,
				options: {
					showEffects: true,
					showInput: true,
				},
			}),
		initialPageParam: null,
		getNextPageParam: ({ hasNextPage, nextCursor }) => (hasNextPage ? nextCursor : null),
		staleTime: 10 * 1000,
		retry: false,
		placeholderData: keepPreviousData,
		refetchInterval,
	});
}
