// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

 
import "react";

declare module "react" {
	type CSSProperties = Record<`--${string}`, string | number | null>;
}
