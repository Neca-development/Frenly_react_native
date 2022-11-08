import { gql } from "@apollo/client";
import { client } from "./../../../App";
const REFRESH = `mutation ($request: RefreshRequest!) {
   refresh(request: $request) {
     accessToken
     refreshToken
   }
 }`;

export const refreshAuth = async (refreshToken) => {
  const result = await client.mutate({
    mutation: gql(REFRESH),
    variables: {
      request: { refreshToken },
    },
  });

  return result.data!.refresh;
};
