import React, { useEffect, useState } from "react";
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
import Post from "../components/post/post";
import safeViewAndroid from "../helpers/safe-view-android";
import AvatarComponent from "../components/shared/avatar.component";
import Colors from "../constants/Colors";
import AppLoader from "../components/app-loader.component";
import { useQuery } from "@apollo/client";
import { useGetFilteredFeedQuery } from "../store/auth/auth.api";
import { GET_PUBLICATIONS } from "../store/lens/get-publication.query";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { RootStackParamList } from "../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useGetWalletProfileId } from "../contract/lens-hub.api";
import { useUpdate } from "../hooks/use-update-user.hook";
import { SizesEnum } from "../common/helpers";

const takeFeedValue = 20;
const initialSkipValue = 0;
const itemFromBottomToFetch = 4;

function Feed({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Feed">) {
  const [skipValue, setSkipValue] = useState(initialSkipValue);
  const [isFeedRefreshing, setFeedRefreshing] = useState(false);
  const [feed, setFeed] = useState<any[]>([]);
  const [isFiltrationLoading, setFiltrationLoading] = useState(false);
  const [isFeedEnd, setIsFeedEnd] = useState(false);

  const {
    data: dataFeeds,
    refetch: refetchFeeds,
    isLoading: isFeedsLoading,
    isFetching: isFeedFromBackLoading,
    error: feedsError,
  } = useGetFilteredFeedQuery({
    take: takeFeedValue,
    skip: skipValue,
  });

  const connector = useWalletConnect();
  const { value: myProfileId } = useGetWalletProfileId(
    connector.accounts[0] || ""
  );
  const drafts = useQuery(GET_PUBLICATIONS, {
    variables: {
      request: {
        publicationIds: dataFeeds?.data
          .filter((el: any) => el.lensId != null)
          .map((el: any) => el.lensId),
      },
    },
  });

  const { avatar, isLoading: profileLoading } = useUpdate(
    connector.accounts[0] || ""
  );

  const refetchInfo = async () => {
    setFeedRefreshing(true);
    if (skipValue === initialSkipValue) {
      await refetchFeeds();
    } else {
      setFeed([]);
      setSkipValue(0);
    }
    // await drafts.refetch();
    setFeedRefreshing(false);
  };

  function createFeedData() {
    const createdFeedData = dataFeeds?.data?.map((el: any) => {
      const { isMirror, lensId, mirrorDescription } = el;

      let index;
      drafts?.data?.publications?.items?.forEach(
        (element: any, _index: number) => {
          if (element.id === lensId) {
            index = _index;
          }
        }
      );
      if (drafts?.data?.publications?.items[Number(index)]) {
        const { createdAt, profile, metadata, id, stats, mirrorOf } =
          drafts?.data?.publications?.items[Number(index)];

        return {
          isUnpublishedPost: false,
          key: id,
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

    const filteredFeedData = createdFeedData.filter((item) => item != null);
    return filteredFeedData;
  }

  function onEndReached() {
    if (isFeedEnd) {
      return;
    }
    setSkipValue(skipValue + takeFeedValue);
  }

  useEffect(() => {
    if (dataFeeds?.data == null || drafts?.data?.publications?.items == null) {
      return;
    }
    if (dataFeeds.data.length < 1) {
      setIsFeedEnd(true);
    }
    const newFeed = createFeedData();
    setFeed([...feed, ...newFeed]);
  }, [drafts?.data?.publications?.items, dataFeeds?.data]);

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
          isFeedFromBackLoading || drafts.loading ? (
            <View className="py-3">
              <ActivityIndicator
                size={"large"}
                color={Colors.main.background}
              />
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <Post isUnpublishedPost={false} data={item.data} key={item.id} />
        )}
      />
      {isFeedsLoading && <AppLoader />}
    </SafeAreaView>
  );
}

export default Feed;
