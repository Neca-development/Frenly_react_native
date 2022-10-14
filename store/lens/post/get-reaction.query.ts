import { gql } from '@apollo/client'

export const GET_REACTIONS = gql`
  query ($request: PublicationsQueryRequest!, $requestReaction: ReactionFieldResolverRequest) {
    publications(request: $request) {
      items {
        __typename
        ... on Post {
          reaction(request: $requestReaction)
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
`
