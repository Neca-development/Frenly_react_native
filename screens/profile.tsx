import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import safeViewAndroid from "../helpers/safe-view-android";
import { useQuery } from "@apollo/client";
import { GET_PUBLICATIONS } from "../store/lens/get-publication.query";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { useGetWalletProfileId } from "../contract/lens-hub.api";
import Header from "../components/shared/header/header.component";
import { GET_DEFAULT_PROFILES } from "../store/lens/get-profile.query";
import {
  useGetIsFollowQuery,
  useGetUnpublishedContentQuery,
  useSubscribeUserMutation,
  useUnSubscribeUserMutation,
} from "../store/auth/auth.api";
import UnpublishedPOsts from "../components/unpublished-posts/unpublished-posts";
import UserPosts from "../components/user-posts/user-posts";
import Toast from "react-native-toast-message";

interface IProfileProps {
  route: any;
  currentUser: boolean;
}

export default function Profile(props: IProfileProps) {
  const { route } = props;
  const connector = useWalletConnect();
  const { value: accountId } = useGetWalletProfileId(
    connector.accounts[0] || ""
  );
  const [isLoading, setIsLoading] = useState(true);
  const { id, currentUser = false } = route.params;
  const [subscribeUser] = useSubscribeUserMutation();
  const [unSubscribeUser] = useUnSubscribeUserMutation();
  const [isFollowUnFollowLoading, setFollowUnFollowLoading] = useState(false);

  const {
    data: feeds,
    refetch: refetchPublications,
    loading: publicationsLoading,
  } = useQuery(GET_PUBLICATIONS, {
    skip: currentUser,
    variables: {
      request: {
        // publicationIds: dataFeeds?.data?.data,
        profileId: id,
        publicationTypes: ["POST", "MIRROR"],
        limit: 10,
      },
    },
  });
  const {
    data: postsData,
    refetch: refetchUnpublishedContent,
    isLoading: unpublishedLoading,
  } = useGetUnpublishedContentQuery(null);

  const { data: dataProfile, refetch: refetchProfile } = useQuery(
    GET_DEFAULT_PROFILES,
    {
      variables: {
        request: {
          profileId: id,
        },
      },
    }
  );

  const {
    data: isFollow,
    refetch: refetchIsFollow,
    error,
  } = useGetIsFollowQuery(
    {
      address: dataProfile?.profile?.ownedBy,
    },
    { skip: dataProfile?.profile?.ownedBy == null }
  );
  const followHandler = async () => {
    try {
      setFollowUnFollowLoading(true);
      const res = await subscribeUser({
        address: dataProfile?.profile?.ownedBy as string,
      });
      if (res?.error) {
        throw res.error;
      }
      console.log("✅ follow");
      refetchIsFollow();
      Toast.show({
        type: "success",
        text1: "✅ Success",
        text2: "You have successfully subscribed",
      });
    } catch (error) {
      console.log("⛔", error);
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: "Try again later",
      });
    } finally {
      setFollowUnFollowLoading(false);
    }
  };

  const unFollowHandler = async () => {
    try {
      setFollowUnFollowLoading(true);
      const res = await unSubscribeUser({
        address: dataProfile?.profile?.ownedBy as string,
      });
      if (res?.error) {
        throw res.error;
      }

      console.log("✅ unfollow");
      refetchIsFollow();
      Toast.show({
        type: "success",
        text1: "✅ Success",
        text2: "You have successfully unsubscribed",
      });
    } catch (error) {
      console.log("⛔", error);
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: "Try again later",
      });
    } finally {
      setFollowUnFollowLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setIsLoading(unpublishedLoading);
    } else {
      setIsLoading(publicationsLoading);
    }
  }, [publicationsLoading, unpublishedLoading]);

  return (
    <SafeAreaView style={safeViewAndroid.AndroidSafeArea}>
      <Header
        title="Profile"
        isOwner={currentUser}
        nickname={dataProfile?.profile.handle}
        address={dataProfile?.profile.ownedBy}
        isFollowModule={dataProfile?.profile?.followModule !== null}
        followHandle={followHandler}
        unfollowHandle={unFollowHandler}
        followers={dataProfile?.profile.stats.totalFollowers}
        isFollow={Boolean(isFollow?.data)}
        isFollowUnFollowLoading={isFollowUnFollowLoading}
      />
      {currentUser ? (
        <UnpublishedPOsts
          postsData={postsData}
          isLoading={isLoading}
          refetch={refetchUnpublishedContent}
          profileId={id}
        />
      ) : (
        <UserPosts
          feeds={feeds}
          isLoading={isLoading}
          refetch={refetchPublications}
        />
      )}
    </SafeAreaView>
  );
}
