import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import EyesIcon from "../assets/icons/eyes";
import safeViewAndroid from "../helpers/safe-view-android";
import AvatarComponent from "../components/shared/avatar.component";
import Colors from "../constants/Colors";
import AppLoader from "../components/app-loader.component";
import PostSwitcher from "../components/post-switcher/post-switcher";

import { useLazyQuery } from "@apollo/client";
import { authApi } from "../store/auth/auth.api";
import { GET_PUBLICATIONS } from "../store/lens/get-publication.query";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { RootStackParamList } from "../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useGetWalletProfileId } from "../contract/lens-hub.api";
import { useUpdate } from "../hooks/use-update-user.hook";
import { PostTypeEnum, SizesEnum } from "../common/helpers";

// Base fetch settings
const takeFeedValue = 15;
const initialSkipValue = 0;
const itemFromBottomToFetch = 4;

function Feed({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Feed">) {
  const [skipValue, setSkipValue] = useState(initialSkipValue);
  const [isFeedRefreshing, setFeedRefreshing] = useState(false);
  const [feed, setFeed] = useState<any[]>([]);
  const [isFeedEnd, setIsFeedEnd] = useState(false);
  const [isFeedsLoading, setIsFeedsLoading] = useState(false);
  const [isFeedsUpdating, setFeedsUpdating] = useState(false);

  const [getFilteredFeed, dataFeeds] =
    authApi.endpoints.getFilteredFeed.useLazyQuery();

  function createFeed(backRes: any, lensRes: any) {
    if (backRes?.data == null || lensRes?.data?.publications?.items == null) {
      return;
    }
    console.log("😀");
    if (backRes.data.length < 1) {
      setIsFeedEnd(true);
    }
    const newFeed = createFeedData(backRes, lensRes);
    setFeed([...feed, ...newFeed]);
  }

  const connector = useWalletConnect();
  const { value: myProfileId } = useGetWalletProfileId(
    connector.accounts[0] || ""
  );

  const [loadDrafts] = useLazyQuery(GET_PUBLICATIONS, {
    variables: {
      request: {
        publicationIds: dataFeeds?.data?.data
          .filter((el: any) => el.lensId != null)
          .map((el: any) => el.lensId),
      },
    },
  });

  const { avatar, isLoading: profileLoading } = useUpdate(
    connector.accounts[0] || ""
  );

  function createFeedData(backRes: any, lensRes: any) {
    const createdFeedData = backRes?.data?.map((el: any) => {
      const { isMirror, lensId, mirrorDescription, postType } = el;
      let index;
      lensRes?.data?.publications?.items?.forEach(
        (element: any, _index: number) => {
          if (element.id === lensId) {
            index = _index;
          }
        }
      );
      if (postType != PostTypeEnum.NFT_TRANSFER) {
        return { key: el.id, refetchInfo: refetchInfo, ...el };
      }
      if (lensRes?.data?.publications?.items[Number(index)]) {
        const { createdAt, profile, metadata, id, stats, mirrorOf } =
          lensRes?.data?.publications?.items[Number(index)];

        return {
          isUnpublishedPost: false,
          key: id,
          postType: postType,
          data: {
            from: metadata?.attributes[4].value,
            to: metadata?.attributes[3].value,
            contractAddress: metadata?.attributes[1].value,
            info: metadata?.description,
            image: metadata?.attributes[9]?.value,
            name: profile?.handle,
            date: createdAt,
            showDate: false,
            messageType: metadata?.attributes[5].value,
            itemType: "nft",
            totalUpvotes: stats?.totalUpvotes,
            totalMirror: stats?.totalAmountOfMirrors,
            id: id,
            profileId: profile?.id,
            refetchInfo: refetchInfo,
            txHash: metadata?.attributes[8].value,
            blockchainType: metadata?.attributes[7].value,
            isMirror: isMirror,
            handleMirror: mirrorOf?.profile.ownedBy,
            creator: profile.ownedBy,
            mirrorDescription,
          },
        };
      }
    });

    const filteredFeedData = createdFeedData.filter(
      (item: any) => item != null
    );
    return filteredFeedData;
  }

  async function loadFeedData(skipValue: number) {
    const backRes = await getFilteredFeed({
      skip: skipValue,
      take: takeFeedValue,
    });
    const lensRes = await loadDrafts();
    await createFeed(backRes.data, lensRes);
  }
  const refetchInfo = useCallback(() => {
    setFeed([]);
    setSkipValue(initialSkipValue);
    loadFeedData(initialSkipValue);
  }, []);

  async function onEndReached() {
    if (isFeedEnd || isFeedsUpdating) {
      return;
    }
    setFeedsUpdating(true);
    // skipValue fails to update
    setSkipValue(skipValue + takeFeedValue);
    await loadFeedData(skipValue + takeFeedValue);

    setFeedsUpdating(false);
  }

  useEffect(() => {
    setIsFeedsLoading(true);
    loadFeedData(skipValue);
    setIsFeedsLoading(false);
  }, []);

  return (
    <SafeAreaView style={safeViewAndroid.AndroidSafeArea}>
      <View className="w-full pt-4 px-4 border-b border-border-color pb-3">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View className="mr-4 w-[40px] h-[38px] items-center justify-center">
              <EyesIcon />
            </View>
            <Text className="text-xl font-bold">frenly feed</Text>
          </View>
          <Pressable
            onPress={() =>
              navigation.navigate("Profile", {
                id: myProfileId as string,
                currentUser: true,
              })
            }
          >
            <AvatarComponent
              isLoading={profileLoading}
              avatar={avatar}
              size={SizesEnum.sm}
            />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={feed}
        onEndReachedThreshold={itemFromBottomToFetch}
        onEndReached={onEndReached}
        refreshControl={
          <RefreshControl
            onRefresh={refetchInfo}
            refreshing={isFeedRefreshing}
          />
        }
        ListFooterComponent={() =>
          isFeedsUpdating ? (
            <View className="py-3">
              <ActivityIndicator
                size={"large"}
                color={Colors.main.background}
              />
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <PostSwitcher isUnpublishedPost={false} key={item.key} {...item} />
        )}
      />
      {isFeedsLoading && <AppLoader />}
    </SafeAreaView>
  );
}

export default Feed;
