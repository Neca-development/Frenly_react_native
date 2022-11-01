import React from "react";
import { View, Text, RefreshControl, ScrollView } from "react-native";
import Colors from "../../constants/Colors";
import Post from "../post/post";

interface IUnpublishedPOsts {
  postsData: any;
  isLoading: boolean;
  refetch(): void;
  profileId: number;
}

export default function UnpublishedPOsts(props: IUnpublishedPOsts) {
  const { postsData, isLoading, refetch, profileId } = props;
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
      {postsData?.data.map((el) => (
        <Post
          // isLoading={isLoading}
          // setIsLoading={setIsLoading}

          key={el.id}
          isUnpublishedPost
          data={{
            // avatar: mockImg,
            from: el.fromAddress,
            to: el.toAddress,
            contractAddress: el.contractAddress,
            info: el.info,
            image: el.image,
            name: "",
            date: el.creationDate,
            showDate: false,
            messageType: el.transferType,
            itemType: "nft",
            totalUpvotes: 0,
            totalMirror: 0,
            id: el.id,
            profileId: profileId,
            // refetchInfo: refetchUnpublishedContent,
            txHash: el.transactionHash,
            blockchainType: el.blockchainType == 0 ? "ETHEREUM" : "POLYGON",
            isMirror: Boolean(el.isMirror),
            // handleMirror: mirrorOf?.profile.handle,
          }}
        ></Post>
      ))}
    </ScrollView>
  );
}
