import { gql } from '@apollo/client'

export const CANCEL_LIKE_TO_POST = gql`
  mutation ($request: ReactionRequest!) {
    removeReaction(request: $request)
  }
`
