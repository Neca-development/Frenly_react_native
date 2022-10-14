import { gql } from '@apollo/client'

export const IS_FOLLOWING = gql`
  query Profile($profileId: ProfileId, $request: ProfileId) {
    profile(request: $request) {
      isFollowing($profileId)
    }
  }
`
