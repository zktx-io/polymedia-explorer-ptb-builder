// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { ReactNode, useState } from "react";
import { useTransactionSummary } from "@mysten/core";
import {
	type ProgrammableTransaction,
	type SuiTransactionBlockResponse,
} from "@mysten/sui/client";
import { PTB_SCHEME, PTBBuilder } from "@zktx.io/ptb-builder";
import { enqueueSnackbar } from "notistack";
import { Resizable } from "re-resizable";

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

  const [activeTab, setActiveTab] = useState("data");
  
  const [ptb, setPTB] = useState<PTB_SCHEME | undefined>(undefined);

	const transactionKindName = transaction.transaction?.data.transaction.kind;

	const isProgrammableTransaction = transactionKindName === "ProgrammableTransaction";

	const programmableTxn = transaction.transaction!.data.transaction as ProgrammableTransaction;

  const handleSavePTB = () => {
    if (ptb) {
      const modifyPTBFolw = ptb.flow?.nodes.map((node) => {
        if(node.id === "@end") {
          node.data = {
            label: node.data.label,
          };
        }
        return node;
      });
      const jsonString = JSON.stringify({ ...ptb, flow: { ...ptb.flow, nodes: modifyPTBFolw } });
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${`${network}`.toLowerCase()}:${transaction.digest}.ptb`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
     console.log(ptb);
    } else {
      enqueueSnackbar("No PTB data available.", { variant: "error" });
    }
  };

	return (
		<div className="flex flex-col gap-3 pl-1 pr-2 md:gap-6">
        <Tabs size="lg" defaultValue="data" onValueChange={(value) => setActiveTab(value)}>
          <TabsList className="flex justify-between items-center">
            <div className="flex space-x-2">
              <TabsTrigger value="data">Data</TabsTrigger>
              {isProgrammableTransaction && network && network !== "LOCAL" && transaction.digest && (
                <TabsTrigger value="ptbBuilder">PTB Builder</TabsTrigger>
              )}
            </div>
            {activeTab === "ptbBuilder" && (
              <button
                onClick={handleSavePTB}
                className="bg-gray-50 text-black px-2 py-1 text-sm rounded transition-colors duration-300 hover:bg-blue-500 hover:text-white active:scale-95"
              >
                Save PTB
              </button>
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
              <Resizable
                defaultSize={{
                  width: "100%",
                  height: "480px",
                }}
                minHeight="300px"
                maxHeight="1024px"
                enable={{
                  bottom: true,
                }}
              >
                <PTBBuilder
                  network={`${network}`.toLowerCase() as any}
                  restore={transaction.digest}
                  options={{
                    canEdit: false,
                    themeSwitch: true,
                  }}
                  update={(data) => {
                    setPTB(data);
                  }}
                  enqueueToast={(message, options) =>
                    enqueueSnackbar(message, options)
                  }
                />
              </Resizable>
            )}
          </TabsContentContainer>
        </Tabs>
      </div>
	);
}
