import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { setUser } from "./auth.slice";

import { baseQueryWithReauth } from "./base-query";

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,

  endpoints: (builder) => ({
    sendOtp: builder.mutation({
      query: (body: { phoneNumber: string }) => {
        return {
          url: "auth/users/send-otp/",
          method: "POST",
          body,
        };
      },
    }),
    registration: builder.mutation({
      query: (body: { phoneNumber: string }) => {
        return {
          url: "auth/users/",
          method: "POST",
          body,
          credentials: "include",
        };
      },

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(
            "🚀 ~ file: auth.api.ts ~ line 34 ~ onQueryStarted ~ data",
            data
          );
        } catch {}
      },
    }),
    login: builder.mutation<
      { refreshToken: string; accessToken: string },
      {
        address: string;
        signature: string;
      }
    >({
      query: (args) => {
        return {
          url: `auth/${args.address}/signature`,
          method: "POST",
          body: {
            signature: args.signature,
          },
          credentials: "omit",
        };
      },
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(setUser({ token: data.accessToken }));
          // dispatch(
          //   // setTokens({
          //   //   data: {
          //   //     accessToken: data.data.accessToken,
          //   //     refreshToken: data.data.refreshToken,
          //   //   },
          //   // })
          // )
        } catch {}
      },
    }),
    refreshTokens: builder.query({
      query: (args) => {
        return {
          url: "auth/refresh-toke",
          method: "POST",
          body: {
            refreshToken: localStorage.getItem("back_refresh_token"),
          },
          credentials: "omit",
        };
      },
    }),
    publishContent: builder.mutation<any, { contentId: string }>({
      query: (args) => {
        // console.log("🚀 ~ file: auth.api.ts ~ line 88 ~ args", args);

        return {
          url: `content/${args.contentId}`,
          method: "POST",

          credentials: "omit",
        };
      },
    }),
    publishAdminPost: builder.mutation<any, { contentId: string }>({
      query: (args) => {
        return {
          url: `admin/content/${args.contentId}`,
          method: "PUT",

          credentials: "omit",
        };
      },
    }),
    mirrorPost: builder.mutation<
      any,
      { lensId: string; newLensId: string; description: string }
    >({
      query: ({ lensId, newLensId, description }) => {
        return {
          url: `content/${lensId}/repost/${newLensId}`,
          method: "POST",
          body: {
            description,
          },
          credentials: "omit",
        };
      },
    }),
    bindWithLensId: builder.mutation<
      any,
      { contentId: string; lensId: string }
    >({
      query: (args) => {
        return {
          url: `content/${args.contentId}/${args.lensId}`,
          method: "PUT",

          credentials: "omit",
        };
      },
    }),
    bindAdminPost: builder.mutation<any, { contentId: string; lensId: string }>(
      {
        query: (args) => {
          return {
            url: `admin/bind/${args.contentId}/${args.lensId}`,
            method: "PUT",

            credentials: "omit",
          };
        },
      }
    ),
    removeContent: builder.mutation<any, { contentId: string }>({
      query: (args) => {
        return {
          url: `content/${args.contentId}`,
          method: "DELETE",

          credentials: "omit",
        };
      },
    }),
    getNonce: builder.query<any, string>({
      query: (address) => {
        return {
          url: `auth/${address}/nonce`,
          method: "GET",
          credentials: "omit",
        };
      },
    }),
    hasLanceProfile: builder.query<any, string>({
      query: (address) => {
        return {
          url: `auth/${address}/lens-profile`,
          method: "GET",
          credentials: "omit",
        };
      },
    }),
    getFeed: builder.query<any, { take: number; skip: number }>({
      query: (args) => {
        return {
          url: `content?take=${args.take}&skip=${args.skip}`,
          method: "GET",
          credentials: "omit",
        };
      },
    }),
    getUnpublishedContent: builder.query<any, any>({
      query: (args) => {
        return {
          url: `content/unpublished`,
          method: "GET",
          credentials: "omit",
        };
      },
      // providesTags: (result) => JSON.parse(result),
    }),
    uploadInfo: builder.mutation<
      any,
      { username: string; description: string }
    >({
      query: (args) => {
        return {
          url: `user`,
          method: "PUT",
          body: args,
          credentials: "omit",
        };
      },
    }),
    getFilteredFeed: builder.query<any, { take: number; skip: number }>({
      query: (args) => {
        return {
          url: `content/filtered?take=${args.take}&skip=${args.skip}`,
          method: "GET",
          credentials: "omit",
        };
      },
    }),
    uploadImage: builder.mutation<any, { avatar: File }>({
      query: (args) => {
        const formData = new FormData();
        formData.append("avatar", args.avatar, args.avatar.name);

        return {
          url: `user/avatar`,
          method: "PUT",
          body: formData,
          credentials: "omit",
        };
      },
    }),
    getUserInfo: builder.query<any, { address: string }>({
      query: (args) => {
        return {
          url: `user/${args.address}`,
          method: "GET",

          credentials: "omit",
        };
      },
    }),
    getContentMetadata: builder.query<any, { contentId: string }>({
      query: ({ contentId }) => {
        return {
          url: `content/${contentId}/metadata`,
          method: "GET",
          credentials: "omit",
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useUploadInfoMutation,
  useUploadImageMutation,
  useLoginMutation,
  useRegistrationMutation,
  useSendOtpMutation,
  useGetNonceQuery,
  useGetUnpublishedContentQuery,
  usePublishContentMutation,
  usePublishAdminPostMutation,
  useBindAdminPostMutation,
  useHasLanceProfileQuery,
  useGetFeedQuery,
  useBindWithLensIdMutation,
  useRemoveContentMutation,
  useMirrorPostMutation,
  useGetUserInfoQuery,
  useGetFilteredFeedQuery,
} = authApi;
