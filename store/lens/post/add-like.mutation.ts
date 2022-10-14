import { gql } from '@apollo/client'

export const LIKE_TO_POST = gql`
  mutation ($request: ReactionRequest!) {
    addReaction(request: $request)
  }
`
