/// a92b03de42~1:sui/sdk/typescript/src/transactions/serializer.ts

import { SuiMoveNormalizedType } from "@mysten/sui/client";
import { CallArg } from "@mysten/sui/transactions";
import { MOVE_STDLIB_ADDRESS, SUI_FRAMEWORK_ADDRESS, isValidSuiAddress } from "@mysten/sui/utils";

const OBJECT_MODULE_NAME = 'object';
const ID_STRUCT_NAME = 'ID';

const STD_ASCII_MODULE_NAME = 'ascii';
const STD_ASCII_STRUCT_NAME = 'String';

const STD_UTF8_MODULE_NAME = 'string';
const STD_UTF8_STRUCT_NAME = 'String';

const STD_OPTION_MODULE_NAME = 'option';
const STD_OPTION_STRUCT_NAME = 'Option';

const RESOLVED_SUI_ID = {
	address: SUI_FRAMEWORK_ADDRESS,
	module: OBJECT_MODULE_NAME,
	name: ID_STRUCT_NAME,
};
const RESOLVED_ASCII_STR = {
	address: MOVE_STDLIB_ADDRESS,
	module: STD_ASCII_MODULE_NAME,
	name: STD_ASCII_STRUCT_NAME,
};
const RESOLVED_UTF8_STR = {
	address: MOVE_STDLIB_ADDRESS,
	module: STD_UTF8_MODULE_NAME,
	name: STD_UTF8_STRUCT_NAME,
};

const RESOLVED_STD_OPTION = {
	address: MOVE_STDLIB_ADDRESS,
	module: STD_OPTION_MODULE_NAME,
	name: STD_OPTION_STRUCT_NAME,
};

const isSameStruct = (a: any, b: any) =>
	a.address === b.address && a.module === b.module && a.name === b.name;

export function isTxContext(param: SuiMoveNormalizedType): boolean {
	const struct = extractStructTag(param)?.Struct;
	return (
		struct?.address === '0x2' && struct?.module === 'tx_context' && struct?.name === 'TxContext'
	);
}

function expectType(typeName: string, argVal?: SuiJsonValue) {
	if (typeof argVal === 'undefined') {
		return;
	}
	if (typeof argVal !== typeName) {
		throw new Error(`Expected ${argVal} to be ${typeName}, received ${typeof argVal}`);
	}
}

const allowedTypes = ['Address', 'Bool', 'U8', 'U16', 'U32', 'U64', 'U128', 'U256'];

export function getPureSerializationTypeAndValue(
	normalizedType: SuiMoveNormalizedType,
	argVal: SuiJsonValue | undefined,
): { type: string | undefined, value: SuiJsonValue | undefined  } {
	if (typeof normalizedType === 'string' && allowedTypes.includes(normalizedType)) {
		if (normalizedType in ['U8', 'U16', 'U32', 'U64', 'U128', 'U256']) {
			expectType('number', argVal);
		} else if (normalizedType === 'Bool') {
			expectType('string', argVal);
			if ( !["0", "1", "false", "true"].includes(argVal as string) ) {
				throw new Error('Invalid Bool');
			}
			return { type: normalizedType.toLowerCase(), value: !!argVal };
		} else if (normalizedType === 'Address') {
			expectType('string', argVal);
			if (argVal && !isValidSuiAddress(argVal as string)) {
				throw new Error('Invalid Sui Address');
			}
		}
		return { type: normalizedType.toLowerCase(), value: argVal };
	} else if (typeof normalizedType === 'string') {
		throw new Error(`Unknown pure normalized type ${JSON.stringify(normalizedType, null, 2)}`);
	}

	if ('Vector' in normalizedType) {
		if ((argVal === undefined || typeof argVal === 'string') && normalizedType.Vector === 'U8') {
			return { type: 'string', value: argVal };
		}

		if (argVal !== undefined && !Array.isArray(argVal)) {
			throw new Error(`Expect ${argVal} to be a array, received ${typeof argVal}`);
		}

		const { type: innerType } = getPureSerializationTypeAndValue(
			normalizedType.Vector,
			// undefined when argVal is empty
			argVal ? argVal[0] : undefined,
		);

		if (innerType === undefined) {
			return { type: undefined, value: argVal };
		}

		return { type: `vector<${innerType}>`, value: argVal };
	}

	if ('Struct' in normalizedType) {
		if (isSameStruct(normalizedType.Struct, RESOLVED_ASCII_STR)) {
			return { type: 'string', value: argVal };
		} else if (isSameStruct(normalizedType.Struct, RESOLVED_UTF8_STR)) {
			return { type: 'utf8string', value: argVal };
		} else if (isSameStruct(normalizedType.Struct, RESOLVED_SUI_ID)) {
			return { type: 'address', value: argVal };
		} else if (isSameStruct(normalizedType.Struct, RESOLVED_STD_OPTION)) {
			const optionToVec: SuiMoveNormalizedType = {
				Vector: normalizedType.Struct.typeArguments[0],
			};
			return getPureSerializationTypeAndValue(optionToVec, argVal);
		}
	}

	return { type: undefined, value: argVal };
}

/// a92b03de42~1:sui/sdk/typescript/src/transactions/utils.ts

export function extractMutableReference(
	normalizedType: SuiMoveNormalizedType,
): SuiMoveNormalizedType | undefined {
	return typeof normalizedType === 'object' && 'MutableReference' in normalizedType
		? normalizedType.MutableReference
		: undefined;
}

export function extractReference(
	normalizedType: SuiMoveNormalizedType,
): SuiMoveNormalizedType | undefined {
	return typeof normalizedType === 'object' && 'Reference' in normalizedType
		? normalizedType.Reference
		: undefined;
}

export function extractStructTag(
	normalizedType: SuiMoveNormalizedType,
): Extract<SuiMoveNormalizedType, { Struct: unknown }> | undefined {
	if (typeof normalizedType === 'object' && 'Struct' in normalizedType) {
		return normalizedType;
	}

	const ref = extractReference(normalizedType);
	const mutRef = extractMutableReference(normalizedType);

	if (typeof ref === 'object' && 'Struct' in ref) {
		return ref;
	}

	if (typeof mutRef === 'object' && 'Struct' in mutRef) {
		return mutRef;
	}
	return undefined;
}

/// a92b03de42~1:sui/sdk/typescript/src/client/types/common.ts

export type SuiJsonValue = boolean | number | string | CallArg | Array<SuiJsonValue>;
