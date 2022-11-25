import React from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { PostTypeEnum } from "../../common/helpers";
import Colors from "../../constants/Colors";
import Post from "../post/post";

interface IUserPosts {
  feeds: any;
  isLoading: boolean;
  refetch(): void;
}

export default function UserPosts(props: IUserPosts) {
  const { feeds, isLoading, refetch } = props;
  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refetch}
          tintColor={Colors.main.background}
        />
      }
    >
      {feeds?.publications?.items.map((el: any, index: number) => {
        const {
          createdAt,
          collectModule,
          profile,
          metadata,
          id: postId,
          stats,
          mirrorOf,
        } = el;

        return (
          <Post
            isUnpublishedPost={false}
            key={postId}
            postType={PostTypeEnum.NFT_TRANSFER}
            data={{
              from: metadata?.attributes[4].value,
              to: metadata?.attributes[3].value,
              contractAddress: metadata?.attributes[1].value,
              info: metadata.description,
              image: metadata?.attributes[9]?.value,
              name: profile.handle,
              date: createdAt,
              showDate: false,
              messageType: metadata.attributes[5].value,
              itemType: "nft",
              totalUpvotes: stats.totalUpvotes,
              totalMirror: stats.totalAmountOfMirrors,
              id: postId,
              profileId: profile.id,
              // refetchInfo: refetchInfo,
              txHash: metadata.attributes[8].value,
              blockchainType: metadata.attributes[7].value,
              isMirror: Boolean(mirrorOf),
              handleMirror: mirrorOf?.profile.ownedBy,
              creator: profile.ownedBy,
            }}
          />
        );
      })}
    </ScrollView>
  );
}
