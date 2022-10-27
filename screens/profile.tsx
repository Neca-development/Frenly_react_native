import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import safeViewAndroid from "../helpers/safe-view-android";
import ArrowBack from "../assets/icons/arrowBack";
import Share from "../assets/icons/share";

import loader from "../assets/gifs/eyes.gif";
import mockImg from "../assets/images/wolf.jpeg";
import Button from "../components/Button";
import { useQuery } from "@apollo/client";
import { GET_PUBLICATIONS } from "../store/lens/get-publication.query";
import Post from "../components/post/post";
import { useNavigation } from "@react-navigation/native";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { useGetWalletProfileId } from "../contract/lens-hub.api";

interface IProfileProps {
  //   navigation: NativeStackScreenProps<RootStackParamList, "Profile">;
  route: any;
}

export default function Profile(props: IProfileProps) {
  const { route } = props;
  const navigation = useNavigation();

  const connector = useWalletConnect();

  const { value: accountId } = useGetWalletProfileId(
    connector.accounts[0] || ""
  );

  const { id } = route.params;
  const { data: feeds, refetch } = useQuery(GET_PUBLICATIONS, {
    //  skip: id == accountId,
    variables: {
      request: {
        // publicationIds: dataFeeds?.data?.data,
        profileId: id,
        publicationTypes: ["POST", "MIRROR"],
        limit: 10,
      },
    },
  });

  //   console.log(feeds);
  return (
    <SafeAreaView style={safeViewAndroid.AndroidSafeArea}>
      <View className="w-full pt-4 px-4  pb-3">
        <View className="flex-row justify-between items-center">
          <Pressable onPress={() => navigation.goBack()}>
            <ArrowBack />
          </Pressable>
          <Text className="text-xl font-bold ">artyshatilov.eth</Text>
          <Pressable>
            <Share />
          </Pressable>
        </View>
      </View>

      <ScrollView>
        {/* Profile */}
        <View className="w-full items-center pt-2 pb-8 px-4 ">
          <Image source={mockImg} className="w-[96px] h-[96px] rounded-full " />
          <Text className="text-md font-semibold text-gray-darker ml-1 text-center mt-2">
            Low-key web3 founder, part-time designer, full-time dreamer
          </Text>

          {false ? <Button title="Follow" style="mt-2" /> : null}
        </View>
        {/* Posts */}

        {false && <Image source={loader} />}
        {true &&
          feeds?.publications.items.map((el: any, index: number) => {
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
                isAddCap={false}
                key={postId}
                data={{
                  avatar: mockImg,
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
                  handleMirror: mirrorOf?.profile.handle,
                }}
              ></Post>
            );
          })}
      </ScrollView>
    </SafeAreaView>
  );
}
