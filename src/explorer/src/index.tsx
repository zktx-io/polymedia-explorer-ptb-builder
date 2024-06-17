// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import "@fontsource-variable/inter";
import "@fontsource-variable/red-hat-mono";
import { QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { router } from "./pages";
import { queryClient } from "./utils/queryClient";

import "@mysten/dapp-kit/dist/index.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<QueryClientProvider client={queryClient}>
		<RouterProvider router={router} />
	</QueryClientProvider>
);
