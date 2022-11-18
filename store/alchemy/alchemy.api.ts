import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { NODE_ETH_API_KEY } from "../../constants/Api";
const baseQuery = fetchBaseQuery({
  baseUrl: `https://eth-mainnet.g.alchemy.com/nft/v2/${NODE_ETH_API_KEY}/getNFTs`,
});
export const alchemyApi = createApi({
  reducerPath: "alchemyApi",
  baseQuery,
  endpoints: (builder) => ({
    getNftsForUser: builder.query({
      query: ({ address }: { address: string }) => {
        return {
          url: `?owner=${address}`,
          method: "GET",
          redirect: "follow",
          credentials: "omit",
        };
      },
    }),
  }),
});

export const { useGetNftsForUserQuery } = alchemyApi;
