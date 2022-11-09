import loaderGif from "../../assets/gifs/ey0es.gif";

import { useMutation } from "@apollo/client";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import React, { useCallback, useState } from "react";
import {
  Text,
  RefreshControl,
  ScrollView,
  Image,
  View,
  Pressable,
} from "react-native";
import Colors from "../../constants/Colors";
import { getLensPostId } from "../../contract/lens-hub.api";
import {
  authApi,
  useBindWithLensIdMutation,
  usePublishContentMutation,
  useRemoveContentMutation,
} from "../../store/auth/auth.api";
import { CREATE_POST_TYPED_DATA } from "../../store/lens/add-post.mutation";
import { useAppDispatch } from "../../store/store.hook";
import Post from "../post/post";
import {
  createLensPostIdParams,
  createPostOptionsInfo,
  getSignatureFromTypedData,
  splitSignature,
} from "./create-post.utils";
import AppLoader from "../app-loader.component";
import { refreshAuth } from "../../store/lens/auth/refresh-token.mutation";

interface IUnpublishedPosts {
  postsData: any;
  isLoading: boolean;
  refetch(): void;
  profileId: number;
}

export default function UnpublishedPOsts(props: IUnpublishedPosts) {
  const { postsData, isLoading, refetch, profileId } = props;

  const dispatch = useAppDispatch();

  const connector = useWalletConnect();
  const [publishContent] = usePublishContentMutation();
  const [removeContent] = useRemoveContentMutation();
  const [bindContentIdWithLens] = useBindWithLensIdMutation();
  const [addPostToLens] = useMutation(CREATE_POST_TYPED_DATA);

  const [isTransactionLoading, setTransactionLoading] = useState(false);

  const addPost = async (id: string | number) => {
    if (id == null) {
      return;
    }
    try {
      setTransactionLoading(true);
      const contentMetadata = await dispatch(
        authApi.endpoints.getContentMetadata.initiate({
          contentId: id.toString(),
        })
      ).unwrap();

      const postOptionsInfo = createPostOptionsInfo(profileId, contentMetadata);

      const typeD = await addPostToLens(postOptionsInfo);
      const typedData = typeD?.data?.createPostTypedData?.typedData;

      const signature = await getSignatureFromTypedData(connector, typedData);
      const signatureAfterSplit = splitSignature(signature);

      const lensPostIdParams = createLensPostIdParams(
        typedData,
        signatureAfterSplit
      );
      const lensPostId = await getLensPostId(connector, lensPostIdParams);

      await publishContent({ contentId: id.toString() });
      await bindContentIdWithLens({
        contentId: id.toString(),
        lensId: lensPostId.toString(),
      });

      console.log("🥰 SUCCESS");
    } catch (error) {
      console.log("🤡 ERROR", error);
    } finally {
      setTransactionLoading(false);
      refetch();
    }
  };

  const declinePost = async (id: number) => {
    if (id == null) {
      return;
    }
    try {
      await removeContent({ contentId: id.toString() });
    } catch (error_) {
      // toast.error(String(error_))
    } finally {
      refetch();
      // setIsLoading(false)
    }
  };
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
      {isTransactionLoading && <AppLoader />}
      {postsData?.data.map((el) => (
        <Post
          key={el.id}
          isUnpublishedPost
          addPost={() => addPost(el.id)}
          declinePost={() => declinePost(el.id)}
          data={{
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
