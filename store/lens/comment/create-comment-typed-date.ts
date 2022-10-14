// this is showing you how you use it with react for example
// if your using node or something else you can import using
// @apollo/client/core!
import { gql } from '@apollo/client'

import { client } from '../../../pages/_app.page'

const CREATE_COMMENT_TYPED_DATA = `
  mutation($request: CreatePublicCommentRequest!) { 
    createCommentTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          CommentWithSig {
            name
            type
          }
        }
      domain {
        name
        chainId
        version
        verifyingContract
      }
      value {
        nonce
        deadline
        profileId
        profileIdPointed
        pubIdPointed
        referenceModuleData
        contentURI
        collectModule
        collectModuleInitData
        referenceModule
        referenceModuleInitData
      }
     }
   }
 }
`

export const createCommentTypedData = (createCommentTypedDataRequest: any) => {
  return client.mutate({
    mutation: gql(CREATE_COMMENT_TYPED_DATA),
    variables: {
      request: createCommentTypedDataRequest,
    },
  })
}
