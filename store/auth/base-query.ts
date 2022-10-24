import AsyncStorageLib from "@react-native-async-storage/async-storage";
import type {
	FetchArgs,
	FetchBaseQueryError,
} from "@reduxjs/toolkit/dist/query";
import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
import type {
	BaseQueryApi,
	BaseQueryFn,
} from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import { Mutex } from "async-mutex";
import { SERVER_URL } from "../../constants/Api";
import { RootState } from "../store";

import { logout } from "./auth.slice";

const baseQuery = fetchBaseQuery({
	baseUrl: SERVER_URL,
	mode: "cors",

	prepareHeaders: (headers, { getState }) => {
		const aToken = (getState() as RootState).auth.accessToken;
		const rToken = (getState() as RootState).auth.refreshToken;
		console.log("🚀 ~ file: base-query.ts ~ line 25 ~ aToken", aToken);
		console.log("🚀 ~ file: base-query.ts ~ line 27 ~ rToken", rToken);
		// If we have a token set in state, let's assume that we should be passing it.
		if (aToken !== undefined) {
			headers.set("authorization", `Bearer ${aToken}`);
		}

		// headers.set('refresh-token', `${rToken}`)

		return headers;
	},
});

const mutex = new Mutex();

export const baseQueryWithReauth: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> = async (
	arguments_: string | FetchArgs | never,
	api: BaseQueryApi,
	extraOptions: {}
) => {
	await mutex.waitForUnlock();
	let result = await baseQuery(arguments_, api, extraOptions);

	if (result.error && result.error.status === 401) {
		if (!mutex.isLocked()) {
			const release = await mutex.acquire();
			const refreshToken = AsyncStorageLib.getItem("back_refresh_token");

			try {
				const refreshResult = await baseQuery(
					{
						url: "auth/refresh-token",
						method: "POST",
						body: {
							refreshToken,
						},
					},
					api,
					extraOptions
				);

				if (refreshResult.data) {
					// @ts-ignore
					api.dispatch(refreshToken(refreshResult.data));

					// retry the initial query
					result = await baseQuery(arguments_, api, extraOptions);
				} else {
					api.dispatch(logout());
					// window.location.pathname = '/login'
				}
			} finally {
				release();
			}
		} else {
			await mutex.waitForUnlock();
			result = await baseQuery(arguments_, api, extraOptions);
		}
	}

	return result;
};
