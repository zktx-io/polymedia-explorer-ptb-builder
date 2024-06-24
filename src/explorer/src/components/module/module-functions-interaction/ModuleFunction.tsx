// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useZodForm } from "@mysten/core";
import {
	ConnectButton,
	useCurrentAccount, useSignTransaction,
	useSuiClient
} from "@mysten/dapp-kit";
import { ArrowRight12 } from "@mysten/icons";
import { bcs } from "@mysten/sui/bcs";
import type { SuiMoveNormalizedFunction } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { Button } from "@mysten/ui";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { useMemo } from "react";
import { useWatch } from "react-hook-form";
import type { TypeOf } from "zod";
import { z } from "zod";
import { DisclosureBox } from "~/ui/DisclosureBox";
import { Input } from "~/ui/Input";
import { FunctionExecutionResult } from "./FunctionExecutionResult";
import { SuiJsonValue, getPureSerializationTypeAndValue } from "./serializer";
import { useFunctionParamsDetails } from "./useFunctionParamsDetails";
import { useFunctionTypeArguments } from "./useFunctionTypeArguments";

const argsSchema = z.object({
	params: z.optional(z.array(z.string().trim().min(1))),
	types: z.optional(z.array(z.string().trim().min(1))),
});

export type ModuleFunctionProps = {
	packageId: string;
	moduleName: string;
	functionName: string;
	functionDetails: SuiMoveNormalizedFunction;
	defaultOpen?: boolean;
};

function createBcsType(
	type: string[],
	value: SuiJsonValue | undefined): any
{
	// pure arguments: "Address", "Bool", "U8", "U16", "U32", "U64", "U128", "U256"
	if (type.length === 1) {
		// @ts-expect-error TS7053: Element implicitly has an 'any' type
		return bcs[type[0].toLowerCase()]();
	}

	// vectors and options are handled recursively
	if (type[0] === "Vector" || type[0] === "Option") {
		if (!Array.isArray(value)) {
			throw new Error(`Type ${type.join(", ")} expected an array value, but found: ${JSON.stringify(value)}`);
		}
		const vectorOrOption = type[0] === "Vector" ? "vector" : "option";
		return bcs[vectorOrOption](
			createBcsType(type.slice(1), value[0])
		);
	}

	throw new Error(`Unsupported type: ${type.join(", ")} with value: ${JSON.stringify(value)}`);
}

export function ModuleFunction({
	defaultOpen,
	packageId,
	moduleName,
	functionName,
	functionDetails,
}: ModuleFunctionProps) {
	const currentAccount = useCurrentAccount();
	const suiClient = useSuiClient();
	const { mutateAsync: signTransaction } = useSignTransaction();
	const { handleSubmit, formState, register, control } = useZodForm({
		schema: argsSchema,
	});
	const { isValidating, isValid, isSubmitting } = formState;

	const typeArguments = useFunctionTypeArguments(functionDetails.typeParameters);
	const formTypeInputs = useWatch({ control, name: "types" });
	const resolvedTypeArguments = useMemo(
		() => typeArguments.map((aType, index) => formTypeInputs?.[index] || aType),
		[typeArguments, formTypeInputs],
	);
	const paramsDetails = useFunctionParamsDetails(functionDetails.parameters, resolvedTypeArguments);

	const execute = useMutation({
		mutationFn: async ({ params, types }: TypeOf<typeof argsSchema>) =>
		{
			if (!currentAccount) {
				return;
			}
			const tx = new Transaction();
			const results = tx.moveCall({
				target: `${packageId}::${moduleName}::${functionName}`,
				typeArguments: types ?? [],
				arguments:
					params?.map((param, i) => {
						const { type, value } = getPureSerializationTypeAndValue(
							functionDetails.parameters[i],
							param,
							resolvedTypeArguments,
						);
						console.debug("type:", type, "value:", value);

						// Object arguments
						if (!type) {
							return tx.object(param);
						}

						// Pure arguments and nested types (Vector, Option)
						return createBcsType(type, value).serialize(value);
					}) ?? [],
			});

			if (functionDetails.return.length > 0)
			{
				// Find returned objects in the transaction results
				const returnedObjects = [];
				for (let i = 0; i < functionDetails.return.length; i++) {
					const returnType = functionDetails.return[i];
					const isObject =
						(
							typeof returnType === "object"
						) && (
							(
								"Struct" in returnType
							) || (
								"TypeParameter" in returnType
								&&
								resolvedTypeArguments[returnType.TypeParameter].startsWith("0x")
							)
						);
					if (isObject) {
						returnedObjects.push(results[i]);
					}
				}

				// Transfer all returned objects to the sender // TODO: transfer only suitable objects
				if (returnedObjects.length > 0) {
					tx.transferObjects(returnedObjects, currentAccount.address);
				}
			}

			const signedTx = await signTransaction({
				transaction: tx,
			});

			const resp = await suiClient.executeTransactionBlock({
				transactionBlock: signedTx.bytes,
				signature: signedTx.signature,
				options: {
					showEffects: true,
					showEvents: true,
					showInput: true,
				},
			});

			if (resp.effects?.status.status === "failure") {
				throw new Error(resp.effects.status.error || "Transaction failed");
			}
			return resp;
		},
	});

	const isExecuteDisabled = isValidating || !isValid || isSubmitting || !currentAccount;

	return (
		<DisclosureBox defaultOpen={defaultOpen} title={functionName}>
			<form
				onSubmit={handleSubmit((formData) =>
					execute.mutateAsync(formData).catch(() => {
						// ignore tx execution errors
					}),
				)}
				autoComplete="off"
				className="flex flex-col flex-nowrap items-stretch gap-4"
			>
				{typeArguments.map((aTypeArgument, index) => (
					<Input
						key={index}
						label={`Type${index}`}
						{...register(`types.${index}` as const)}
						placeholder={aTypeArgument}
					/>
				))}
				{paramsDetails.map(({ paramTypeText }, index) => (
					<Input
						key={index}
						label={`Arg${index}`}
						{...register(`params.${index}` as const)}
						placeholder={paramTypeText}
						disabled={isSubmitting}
					/>
				))}
				<div className="flex items-stretch justify-end gap-1.5">
					<Button
						variant="primary"
						type="submit"
						disabled={isExecuteDisabled}
						loading={execute.isPending}
					>
						Execute
					</Button>
					<ConnectButton
						connectText={
							<>
								Connect Wallet
								<ArrowRight12 fill="currentColor" className="-rotate-45" />
							</>
						}
						className={clsx(
							"!rounded-md !text-bodySmall",
							currentAccount
								? "!border !border-solid !border-steel !bg-white !font-mono !text-hero-dark !shadow-sm !shadow-ebony/5"
								: "!flex !flex-nowrap !items-center !gap-1 !bg-sui-dark !font-sans !text-sui-light hover:!bg-sui-dark hover:!text-white",
						)}
					/>
				</div>
				{execute.error || execute.data ? (
					<FunctionExecutionResult
						error={execute.error ? (execute.error).message || "Error" : false}
						result={execute.data || null}
						onClear={() => {
							execute.reset();
						}}
					/>
				) : null}
			</form>
		</DisclosureBox>
	);
}
