import { gql } from "@apollo/client";
import { client } from "./../../../App";

const GET_CHALLENGE = `
  query($request: ChallengeRequest!) {
    challenge(request: $request) { text }
  }
`;

export const generateChallenge = (address: string) => {
  // console.log({ address });

  return client.query({
    query: gql(GET_CHALLENGE),
    variables: {
      request: {
        address,
      },
    },
  });
};
