import React, { useState } from "react";
import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import EyesIcon from "../assets/icons/eyes";
import Button from "../components/Button";
import Post from "../components/post/post";

import { useQuery } from "@apollo/client";
import mockImg from "../assets/images/wolf.jpeg";
import safeViewAndroid from "../helpers/safe-view-android";
import { useGetFeedQuery } from "../store/auth/auth.api";
import { GET_PUBLICATIONS } from "../store/lens/get-publication.query";

import loader from "../assets/gifs/duck_loader.gif";
import { logout } from "../store/auth/auth.slice";
import { useAppDispatch } from "../store/store.hook";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { RootStackParamList } from "../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useGetWalletProfileId } from "../contract/lens-hub.api";

function Feed({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Feed">) {
  const { data: dataFeeds, refetch: refetchFeeds } = useGetFeedQuery({
    take: 10,
    skip: 0,
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
  const [isFeedRefreshing, setFeedRefreshing] = useState(false);

  const dispatch = useAppDispatch();

  const refetchInfo = async () => {
    setFeedRefreshing(true);
    refetchFeeds();
    await drafts.refetch();
    setFeedRefreshing(false);
  };

  const logOut = async () => {
    await dispatch(logout());
    await connector.killSession();

    navigation.navigate("Auth");
  };

  const openProfile = (id: number) => {
    if (id == null) {
      return;
    }
    navigation.navigate(`Profile`, { id });
  };

  return (
    <SafeAreaView style={safeViewAndroid.AndroidSafeArea}>
      <View className="w-full pt-4 px-4 border-b border-border-color pb-3">
        <View className="flex-row justify-between items-center">
          <EyesIcon />
          <Text className="text-xl font-bold ">frenly feed</Text>
          <Button onPress={logOut} title="Log out"></Button>
          <Button
            onPress={() =>
              navigation.navigate("Profile", { id: Number(myProfileId) })
            }
            title="Add post"
          ></Button>
        </View>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={refetchInfo}
            refreshing={isFeedRefreshing}
          />
        }
      >
        {dataFeeds ? (
          drafts?.data?.publications?.items.map((el: any) => {
            const {
              createdAt,
              collectModule,
              profile,
              metadata,
              id,
              stats,
              mirrorOf,
            } = el;

            let index;
            dataFeeds?.data?.forEach((element: any, _index: number) => {
              if (element.lensId == id) {
                index = _index;
              }
            });

            return (
              <Post
                isAddCap={false}
                key={id}
                openProfile={openProfile}
                data={{
                  avatar: mockImg,
                  from: metadata?.attributes[4].value,
                  to: metadata?.attributes[3].value,
                  contractAddress: metadata?.attributes[1].value,
                  info: metadata.description,
                  image: dataFeeds?.data[Number(index)]?.image,
                  name: profile.handle,
                  date: createdAt,
                  showDate: false,
                  messageType: metadata.attributes[5].value,
                  itemType: "nft",
                  totalUpvotes: stats.totalUpvotes,
                  totalMirror: stats.totalAmountOfMirrors,
                  id: id,
                  profileId: profile.id,
                  refetchInfo: refetchInfo,
                  txHash: metadata.attributes[8].value,
                  blockchainType: metadata.attributes[7].value,
                  isMirror: dataFeeds?.data[Number(index)]?.isMirror,
                  handleMirror: mirrorOf?.profile.handle,
                }}
              ></Post>
            );
          })
        ) : (
          <Image source={loader} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default Feed;
