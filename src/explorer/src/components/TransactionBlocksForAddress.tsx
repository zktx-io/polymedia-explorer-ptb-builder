/// Transactions table for addresses / objects / packages.

// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { type TransactionFilter } from "@mysten/sui/client";
import { Heading, RadioGroup, RadioGroupItem } from "@mysten/ui";
import clsx from "clsx";
import { useReducer, useState } from "react";
import { DEFAULT_TRANSACTIONS_LIMIT, useGetTransactionBlocks } from "~/hooks/useGetTransactionBlocks";
import { Pagination } from "~/ui/Pagination";
import { PlaceholderTable } from "~/ui/PlaceholderTable";
import { TableCard } from "~/ui/TableCard";
import { genTableDataFromTxData } from "./transactions/TxCardUtils";

export enum FILTER_VALUES {
	INPUT = "InputObject",
	CHANGED = "ChangedObject",
	FROM_ADDRESS = "FromAddress",
	TO_ADDRESS = "ToAddress",
}

type TransactionBlocksForAddressProps = {
	type: "address" | "object";
	address: string;
	filter: FILTER_VALUES;
	header?: string;
};

enum PAGE_ACTIONS {
	NEXT,
	PREV,
	FIRST,
}

type TransactionBlocksForAddressActionType = {
	type: PAGE_ACTIONS;
	filterValue: FILTER_VALUES;
};

type PageStateByFilterMap = {
	InputObject: number;
	ChangedObject: number;
	FromAddress: number;
	ToAddress: number;
};

type FilterRadioOption = {
	label: string;
	value: string;
};

const reducer = (state: PageStateByFilterMap, action: TransactionBlocksForAddressActionType) => {
	switch (action.type) {
		case PAGE_ACTIONS.NEXT:
			return {
				...state,
				[action.filterValue]: state[action.filterValue] + 1,
			};
		case PAGE_ACTIONS.PREV:
			return {
				...state,
				[action.filterValue]: state[action.filterValue] - 1,
			};
		case PAGE_ACTIONS.FIRST:
			return {
				...state,
				[action.filterValue]: 0,
			};
		default:
			return { ...state };
	}
};

export function FiltersControl({
	filterOptions,
	filterValue,
	setFilterValue,
}: {
	filterOptions: FilterRadioOption[];
	filterValue: string;
	setFilterValue: any;
}) {
	return (
		<RadioGroup
			aria-label="transaction filter"
			value={filterValue}
			onValueChange={(value) => setFilterValue(value as FILTER_VALUES)}
		>
			{filterOptions.map(filter => (
				<RadioGroupItem key={filter.value} value={filter.value} label={filter.label} />
			))}
		</RadioGroup>
	);
}

function TransactionBlocksForAddress({
	type,
	address,
	filter,
	header,
}: TransactionBlocksForAddressProps) {
	const [filterValue, setFilterValue] = useState(filter);
	const [currentPageState, dispatch] = useReducer(reducer, {
		InputObject: 0,
		ChangedObject: 0,
		FromAddress: 0,
		ToAddress: 0,
	});

	const { data, isPending, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
		useGetTransactionBlocks(
			{ [filterValue]: address } as TransactionFilter,
			undefined,
			undefined,
			type === "object", // useAltRpc
		);

	const currentPage = currentPageState[filterValue];
	const cardData =
		data?.pages[currentPage]
			? genTableDataFromTxData(data.pages[currentPage].data)
			: undefined;

	const filterOptions: FilterRadioOption[] = type === "object"
		? [
			{ label: "Input Objects", value: "InputObject" },
			{ label: "Updated Objects", value: "ChangedObject" },
		] : [
			{ label: "From Address", value: "FromAddress" },
			{ label: "To Address", value: "ToAddress" },
		];

	return (
		<div data-testid="tx">
			<div className="flex items-center justify-between border-b border-gray-45 pb-5">
				{header && (
					<Heading color="gray-90" variant="heading4/semibold">
						{header}
					</Heading>
				)}

				<FiltersControl
					filterOptions={filterOptions}
					filterValue={filterValue}
					setFilterValue={setFilterValue}
				/>
			</div>

			<div className={clsx(header && "pt-5", "flex flex-col space-y-5 text-left xl:pr-10")}>
				{isPending || isFetching || isFetchingNextPage || !cardData ? (
					<PlaceholderTable
						rowCount={DEFAULT_TRANSACTIONS_LIMIT}
						rowHeight="16px"
						colHeadings={["Digest", "Sender", "Txns", "Gas", "Time"]}
						colWidths={["30%", "30%", "10%", "20%", "10%"]}
					/>
				) : (
					<div>
						<TableCard data={cardData.data} columns={cardData.columns} />
					</div>
				)}

				{(hasNextPage || (data && data?.pages.length > 1)) && (
					<Pagination
						onNext={() => {
							if (isPending || isFetching) {
								return;
							}

							// Make sure we are at the end before fetching another page
							if (
								data &&
								currentPageState[filterValue] === data?.pages.length - 1 &&
								!isPending &&
								!isFetching
							) {
								fetchNextPage();
							}
							dispatch({
								type: PAGE_ACTIONS.NEXT,

								filterValue,
							});
						}}
						hasNext={
							(Boolean(hasNextPage) && Boolean(data?.pages[currentPage])) ||
							currentPage < (data?.pages.length ?? 0) - 1
						}
						hasPrev={currentPageState[filterValue] !== 0}
						onPrev={() =>
							dispatch({
								type: PAGE_ACTIONS.PREV,

								filterValue,
							})
						}
						onFirst={() =>
							dispatch({
								type: PAGE_ACTIONS.FIRST,
								filterValue,
							})
						}
					/>
				)}
			</div>
		</div>
	);
}

export default TransactionBlocksForAddress;
