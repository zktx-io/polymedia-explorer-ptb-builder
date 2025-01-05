// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from "react";
import { useTransactionSummary } from "@mysten/core";
import {
	type ProgrammableTransaction,
	type SuiTransactionBlockResponse,
} from "@mysten/sui/client";
import { PTBBuilder } from "@zktx.io/ptb-builder";
import { enqueueSnackbar } from "notistack";

import { TransactionDetailCard } from "./transaction-summary/TransactionDetailCard";
import { GasBreakdown } from "~/components/GasBreakdown";
import { useRecognizedPackages } from "~/hooks/useRecognizedPackages";
import { InputsCard } from "~/pages/transaction-result/programmable-transaction-view/InputsCard";
import { TransactionsCard } from "~/pages/transaction-result/programmable-transaction-view/TransactionsCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/ui/Tabs";
import { useNetwork } from "~/context";

type Props = {
	transaction: SuiTransactionBlockResponse;
};

function TabsContentContainer({ value, children }: { value: string; children: ReactNode }) {
	return (
		<TabsContent value={value}>
			<div className="mt-3 md:mt-5">{children}</div>
		</TabsContent>
	);
}

export function TransactionData({ transaction }: Props) {
	const recognizedPackagesList = useRecognizedPackages();
	const summary = useTransactionSummary({
		transaction,
		recognizedPackagesList,
	});

	const [network] = useNetwork();

	const transactionKindName = transaction.transaction?.data.transaction.kind;

	const isProgrammableTransaction = transactionKindName === "ProgrammableTransaction";

	const programmableTxn = transaction.transaction!.data.transaction as ProgrammableTransaction;

	return (
		<div className="flex flex-col gap-3 pl-1 pr-2 md:gap-6">
        <Tabs size="lg" defaultValue="data">
          <TabsList>
            <TabsTrigger value="data">Data</TabsTrigger>
            {isProgrammableTransaction &&
              network &&
              network !== "LOCAL" &&
              transaction.digest && (
                <TabsTrigger value="ptbBuilder">PTB Builder</TabsTrigger>
              )}
          </TabsList>
          <TabsContentContainer value="data">
            <section className="flex w-full flex-1 flex-col gap-3 md:gap-6">
              <TransactionDetailCard
                timestamp={summary?.timestamp}
                sender={summary?.sender}
                checkpoint={transaction.checkpoint}
                executedEpoch={transaction.effects?.executedEpoch}
              />
              <div data-testid="inputs-card">
                <InputsCard inputs={programmableTxn.inputs} />
              </div>
              <div data-testid="transactions-card">
                <TransactionsCard transactions={programmableTxn.transactions} />
              </div>
              <div data-testid="gas-breakdown">
                <GasBreakdown summary={summary} />
              </div>
            </section>
          </TabsContentContainer>
          <TabsContentContainer value="ptbBuilder">
            {network !== "LOCAL" && (
              <div style={{ width: "100%", height: "620px" }}>
                <PTBBuilder
                  network={`${network}`.toLowerCase() as any}
                  restore={transaction.digest}
                  options={{
                    canEdit: false,
                    themeSwitch: true,
                  }}
                  enqueueToast={(message, options) =>
                    enqueueSnackbar(message, options)
                  }
                />
              </div>
            )}
          </TabsContentContainer>
        </Tabs>
      </div>
	);
}
