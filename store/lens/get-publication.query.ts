import { gql } from "@apollo/client";
import { original } from "@reduxjs/toolkit";
import { id } from "ethers/lib/utils";
import next from "next";
import { profile } from "node:console";
import { on } from "node:events";
import { request } from "node:http";
import { url } from "node:inspector";

export const GET_PUBLICATIONS = gql`
  query ($request: PublicationsQueryRequest!) {
    publications(request: $request) {
      items {
        __typename
        ... on Post {
          ...PostFields
        }
        ... on Comment {
          ...CommentFields
        }
        ... on Mirror {
          ...MirrorFields
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
  fragment MediaFields on Media {
    url
    mimeType
  }
  fragment ProfileFields on Profile {
    id
    name
    bio
    attributes {
      displayType
      traitType
      key
      value
    }
    isFollowedByMe
    isFollowing(who: null)
    followNftAddress
    metadata
    isDefault
    handle
    picture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
      }
    }
    coverPicture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
      }
    }
    ownedBy
    dispatcher {
      address
    }
    stats {
      totalFollowers
      totalFollowing
      totalPosts
      totalComments
      totalMirrors
      totalPublications
      totalCollects
    }
    followModule {
      ... on FeeFollowModuleSettings {
        type
        amount {
          asset {
            name
            symbol
            decimals
            address
          }
          value
        }
        recipient
      }
      ... on ProfileFollowModuleSettings {
        type
      }
      ... on RevertFollowModuleSettings {
        type
      }
    }
  }
  fragment PublicationStatsFields on PublicationStats {
    totalAmountOfMirrors
    totalAmountOfCollects
    totalAmountOfComments
    totalUpvotes
  }
  fragment MetadataOutputFields on MetadataOutput {
    name
    description
    content
    media {
      original {
        ...MediaFields
      }
    }
    attributes {
      displayType
      traitType
      value
    }
  }
  fragment Erc20Fields on Erc20 {
    name
    symbol
    decimals
    address
  }
  fragment CollectModuleFields on CollectModule {
    __typename
    ... on FreeCollectModuleSettings {
      type
      followerOnly
      contractAddress
    }
    ... on FeeCollectModuleSettings {
      type
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
    }
    ... on LimitedFeeCollectModuleSettings {
      type
      collectLimit
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
    }
    ... on LimitedTimedFeeCollectModuleSettings {
      type
      collectLimit
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
      endTimestamp
    }
    ... on RevertCollectModuleSettings {
      type
    }
    ... on TimedFeeCollectModuleSettings {
      type
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
      endTimestamp
    }
  }
  fragment PostFields on Post {
    id
    profile {
      ...ProfileFields
    }

    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
    hidden
    reaction(request: null)
    mirrors(by: null)
    hasCollectedByMe
  }
  fragment MirrorBaseFields on Mirror {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
    hidden
    reaction(request: null)
    hasCollectedByMe
  }
  fragment MirrorFields on Mirror {
    ...MirrorBaseFields
    mirrorOf {
      ... on Post {
        ...PostFields
      }
      ... on Comment {
        ...CommentFields
      }
    }
  }
  fragment CommentBaseFields on Comment {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
    hidden
    reaction(request: null)
    mirrors(by: null)
    hasCollectedByMe
  }
  fragment CommentFields on Comment {
    ...CommentBaseFields
    mainPost {
      ... on Post {
        ...PostFields
      }
      ... on Mirror {
        ...MirrorBaseFields
        mirrorOf {
          ... on Post {
            ...PostFields
          }
          ... on Comment {
            ...CommentMirrorOfFields
          }
        }
      }
    }
  }
  fragment CommentMirrorOfFields on Comment {
    ...CommentBaseFields
  }
`;

export const GET_COMMENTS = gql`
  query (
    $request: PublicationsQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
    $profileId: ProfileId
  ) {
    publications(request: $request) {
      items {
        ... on Comment {
          ...CommentFields
          __typename
        }
        __typename
      }
      pageInfo {
        totalCount
        next
        __typename
      }
      __typename
    }
  }

  fragment CommentFields on Comment {
    id
    profile {
      ...ProfileFields
      __typename
    }
    reaction(request: $reactionRequest)
    mirrors(by: $profileId)
    hasCollectedByMe
    collectedBy {
      address
      defaultProfile {
        ...ProfileFields
        __typename
      }
      __typename
    }
    collectModule {
      ...MinimalCollectModuleFields
      __typename
    }
    stats {
      ...StatsFields
      __typename
    }
    metadata {
      ...MetadataFields
      __typename
    }
    hidden
    createdAt
    appId
    commentOn {
      ... on Post {
        ...PostFields
        __typename
      }
      ... on Comment {
        id
        profile {
          ...ProfileFields
          __typename
        }
        reaction(request: $reactionRequest)
        mirrors(by: $profileId)
        hasCollectedByMe
        collectedBy {
          address
          defaultProfile {
            handle
            __typename
          }
          __typename
        }
        collectModule {
          ...MinimalCollectModuleFields
          __typename
        }
        metadata {
          ...MetadataFields
          __typename
        }
        stats {
          ...StatsFields
          __typename
        }
        mainPost {
          ... on Post {
            ...PostFields
            __typename
          }
          ... on Mirror {
            ...MirrorFields
            __typename
          }
          __typename
        }
        hidden
        createdAt
        __typename
      }
      ... on Mirror {
        ...MirrorFields
        __typename
      }
      __typename
    }
    __typename
  }

  fragment PostFields on Post {
    id
    profile {
      ...ProfileFields
      __typename
    }
    reaction(request: $reactionRequest)
    mirrors(by: $profileId)
    hasCollectedByMe
    collectedBy {
      address
      defaultProfile {
        ...ProfileFields
        __typename
      }
      __typename
    }
    collectModule {
      ...MinimalCollectModuleFields
      __typename
    }
    stats {
      ...StatsFields
      __typename
    }
    metadata {
      ...MetadataFields
      __typename
    }
    hidden
    createdAt
    appId
    __typename
  }

  fragment ProfileFields on Profile {
    id
    name
    handle
    bio
    ownedBy
    attributes {
      key
      value
      __typename
    }
    picture {
      ... on MediaSet {
        original {
          url
          __typename
        }
        __typename
      }
      ... on NftImage {
        uri
        __typename
      }
      __typename
    }
    followModule {
      __typename
    }
    __typename
  }

  fragment MinimalCollectModuleFields on CollectModule {
    ... on FreeCollectModuleSettings {
      type
      __typename
    }
    ... on FeeCollectModuleSettings {
      type
      amount {
        asset {
          address
          __typename
        }
        __typename
      }
      __typename
    }
    ... on LimitedFeeCollectModuleSettings {
      type
      amount {
        asset {
          address
          __typename
        }
        __typename
      }
      __typename
    }
    ... on LimitedTimedFeeCollectModuleSettings {
      type
      amount {
        asset {
          address
          __typename
        }
        __typename
      }
      __typename
    }
    ... on TimedFeeCollectModuleSettings {
      type
      amount {
        asset {
          address
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }

  fragment MetadataFields on MetadataOutput {
    name
    description
    content
    cover {
      original {
        url
        __typename
      }
      __typename
    }
    media {
      original {
        url
        mimeType
        __typename
      }
      __typename
    }
    attributes {
      value
      __typename
    }
    __typename
  }

  fragment StatsFields on PublicationStats {
    totalUpvotes
    totalAmountOfMirrors
    totalAmountOfCollects
    totalAmountOfComments
    __typename
  }

  fragment MirrorFields on Mirror {
    id
    profile {
      ...ProfileFields
      __typename
    }
    reaction(request: $reactionRequest)
    collectModule {
      ...MinimalCollectModuleFields
      __typename
    }
    stats {
      ...StatsFields
      __typename
    }
    metadata {
      ...MetadataFields
      __typename
    }
    hidden
    mirrorOf {
      ... on Post {
        ...PostFields
        __typename
      }
      ... on Comment {
        id
        profile {
          ...ProfileFields
          __typename
        }
        reaction(request: $reactionRequest)
        mirrors(by: $profileId)
        stats {
          ...StatsFields
          __typename
        }
        createdAt
        __typename
      }
      __typename
    }
    createdAt
    appId
    __typename
  }
`;
