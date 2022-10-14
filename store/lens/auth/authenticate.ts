import { gql } from "@apollo/client";
import { client } from "../../../App";

const AUTHENTICATION = `
  mutation($request: SignedAuthChallenge!) { 
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
 }
`;

export const authenticate = (address: string, signature: string) => {
	return client.mutate({
		mutation: gql(AUTHENTICATION),
		variables: {
			request: {
				address,
				signature,
			},
		},
	});
};
