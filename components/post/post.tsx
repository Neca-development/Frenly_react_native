import React, { useEffect, useState } from "react";
import { Image, Linking, Pressable, Text, View } from "react-native";
import Button from "../Button";

import { useMutation, useQuery } from "@apollo/client";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { id } from "ethers/lib/utils";
import Toast from "react-native-toast-message";
import Collapsible from "react-native-collapsible";
import imagePlaceholder from "../../assets/images/temp-avatar.png";
import {
  getMirrorPostId,
  useGetWalletProfileId,
} from "../../contract/lens-hub.api";
import { useMirrorPostMutation } from "../../store/auth/auth.api";
import { GET_PUBLICATIONS } from "../../store/lens/get-publication.query";
import { LIKE_TO_POST } from "../../store/lens/post/add-like.mutation";
import { CREATE_MIRROR_TYPED_DATA } from "../../store/lens/post/add-mirror.mutation";
import { CANCEL_LIKE_TO_POST } from "../../store/lens/post/cancel-like.mutation";
import { GET_POST_QUERY } from "../../store/lens/post/get-post.query";
import { GET_REACTIONS } from "../../store/lens/post/get-reaction.query";
import Comments from "../Comments";
import { SERVER_URL } from "../../constants/Api";
import { useUpdate } from "../../hooks/use-update-user.hook";
import PostControls from "./components/post-controlls";
import PostContent from "./components/post-content";
import {
  createLensMirrorIdParams,
  getSignatureFromTypedData,
  splitSignature,
} from "../unpublished-posts/create-post.utils";
import ModalComponent from "../modal/modal.component";
import AppLoader from "../app-loader.component";
import SkeletonLoader from "expo-skeleton-loader";
import AvatarComponent from "../shared/avatar.component";
import { SizesEnum } from "../../common/helpers";

export interface IPostData {
  avatar?: any;
  profileId: number;
  name: string;
  contractAddress: string;
  date: string;
  blockchainType: "ETHEREUM" | "POLYGON";
  image: any;
  info: string;
  from: string;
  to: string;
  showDate?: boolean;
  showAuthor?: boolean;
  // ! find out if there will be message types
  messageType: "SEND" | "RECEIVE" | "MINTED";
  //  ! item type?
  itemType: "nft" | "token";
  id: number | string;
  totalUpvotes?: number;
  totalMirror: number;
  refetchInfo?: () => void;
  txHash: string;
  isMirror: boolean;
  handleMirror?: string;
  creator: string;
  mirrorDescription: string;
}
interface IPostProps {
  isUnpublishedPost: boolean;
  addPost(): void;
  declinePost(): void;
  openProfile?(id: number): void;
  data: IPostData;
}

function Post(props: IPostProps) {
  const {
    data,
    isUnpublishedPost,
    openProfile = () => null,
    addPost,
    declinePost,
  } = props;
  const [isCommentsCollapsed, changeCommentsCollapsed] = useState(true);
  const [isMirrorModalVisible, setMirrorModalVisible] = useState(false);

  const connector = useWalletConnect();

  const { value: myProfileId } = useGetWalletProfileId(
    connector.accounts[0] || ""
  );

  const {
    name: username,
    description,
    avatar,
    uploadImage,
    isLoading: creatorLoading,
  } = useUpdate(data.creator);
  const [isLoading, setIsLoading] = useState(false);
  const [likePostToLens, dataLikes] = useMutation(LIKE_TO_POST);
  const [cancelLikePostToLens, dataCancelLikes] =
    useMutation(CANCEL_LIKE_TO_POST);
  const [isLikeRequest, setIsLikeRequest] = useState(false);

  const { data: comments, refetch: refetchComments } = useQuery(
    GET_PUBLICATIONS,
    {
      variables: {
        request: {
          commentsOf: data.id,
        },
      },
    }
  );

  const { data: postData, refetch: refetchPost } = useQuery(GET_POST_QUERY, {
    variables: {
      request: {
        publicationId: data.id,
      },
    },
  });

  const [mirrorPublication, dataMirrorPublication] = useMutation(
    CREATE_MIRROR_TYPED_DATA
  );

  const { data: publicationIsReact, refetch: refetchLikes } = useQuery(
    GET_REACTIONS,
    {
      variables: {
        request: {
          publicationIds: [data.id],
        },
        requestReaction: {
          profileId: myProfileId,
        },
      },
      skip: typeof id == "number",
    }
  );
  const [mirrorPost] = useMirrorPostMutation();

  function toggleCommentsCollapsed() {
    changeCommentsCollapsed(!isCommentsCollapsed);
  }

  const likeHandler = async () => {
    if (!myProfileId || !data.id) {
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: "Try again later",
      });
      return;
    }
    setIsLikeRequest(true);

    try {
      if (publicationIsReact.publications.items[0].reaction == null) {
        await likePostToLens({
          variables: {
            request: {
              profileId: myProfileId,
              reaction: "UPVOTE",
              publicationId: data.id,
            },
          },
        });
        console.log("💖 LIKE");
      } else if (
        publicationIsReact.publications.items[0].reaction == "UPVOTE"
      ) {
        await cancelLikePostToLens({
          variables: {
            request: {
              profileId: myProfileId,
              reaction: "UPVOTE",
              publicationId: data.id,
            },
          },
        });
        console.log("💔 DISLIKE");
      }
    } catch (error) {
      console.log("🤬", error);
    } finally {
      await refetchLikes();
      await refetchPost();
      setIsLikeRequest(false);
    }
  };

  const mirrorHandler = async (mirrorText: string) => {
    if (!myProfileId || !data.id) {
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: "Try again later",
      });
      return;
    }
    // setIsDescriptionView(false)
    try {
      setIsLoading(true);
      const typeD = await mirrorPublication({
        variables: {
          request: {
            profileId: myProfileId,
            publicationId: data.id,
            referenceModule: null,
          },
        },
      });

      const typedData = typeD?.data?.createMirrorTypedData?.typedData;
      const signature = await getSignatureFromTypedData(connector, typedData);
      const signatureAfterSplit = splitSignature(signature);

      const getMirrorParams = createLensMirrorIdParams(
        typedData,
        signatureAfterSplit
      );
      const newLensId = await getMirrorPostId(connector, getMirrorParams);

      await mirrorPost({
        lensId: data.id as string,
        newLensId,
        description: mirrorText,
      });
      data.refetchInfo && (await data.refetchInfo());
      Toast.show({
        type: "success",
        text1: "✅ Success",
        text2: "Your mirror created",
      });
    } catch (error_) {
      console.log(String(error_));
      // toast.error(String(error_));
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: "Try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-row items-start px-4 border-b border-border-color pt-2 pb-4">
      {isLoading && <AppLoader />}
      {isMirrorModalVisible && (
        <ModalComponent
          title="Mirror post"
          onSubmit={mirrorHandler}
          onClose={() => setMirrorModalVisible(false)}
        />
      )}
      {!isUnpublishedPost && (
        <Pressable
          onPress={() => openProfile(data.profileId)}
          className="mr-4 items-center border rounded-full border-border-color overflow-hidden"
        >
          <AvatarComponent
            isLoading={creatorLoading}
            avatar={avatar || data.avatar}
            size={SizesEnum.md}
          />
        </Pressable>
      )}
      <View className="flex-1 ">
        <PostContent
          isLoading={creatorLoading}
          userName={username || data.name}
          data={data}
        />
        {isUnpublishedPost && (
          <View className="flex-row mt-2">
            <Button
              buttonStyle="py-2"
              style="flex-1 mr-3"
              textStyle="text-white text-sm font-semibold text-center"
              title="Publish"
              onPress={addPost}
            />
            <Button
              buttonStyle="py-2 bg-error-bg"
              style="flex-1"
              textStyle="text-error text-sm font-semibold text-center"
              title="Decline"
              onPress={declinePost}
            />
          </View>
        )}

        <View className="flex-row justify-between items-center mt-2">
          <Pressable
            onPress={() =>
              Linking.openURL(
                data.blockchainType == "ETHEREUM"
                  ? `https://rinkeby.etherscan.io/tx/${data.txHash}`
                  : `https://mumbai.polygonscan.com/tx/${data.txHash}`
              )
            }
          >
            <Text className="text-sm text-main" rel="noreferrer">
              Check on{" "}
              {data.blockchainType === "ETHEREUM" ? "Etherscan" : "Polygonscan"}
            </Text>
          </Pressable>
          {!isUnpublishedPost && (
            <PostControls
              isLiked={
                publicationIsReact?.publications?.items[0]?.reaction == "UPVOTE"
              }
              onLikePress={likeHandler}
              onCommentsPress={toggleCommentsCollapsed}
              onMirrorPress={() => setMirrorModalVisible(true)}
              commentsCount={comments?.publications?.items?.length}
              likesCount={postData?.publication?.stats.totalUpvotes}
              mirrorsCount={data.totalMirror}
              isLikeRequest={isLikeRequest}
            />
          )}
        </View>
        {!isUnpublishedPost && (
          <Collapsible collapsed={isCommentsCollapsed}>
            <Comments
              refetchComment={refetchComments}
              data={comments?.publications?.items}
              pubId={data.id}
              profileId={String(myProfileId)}
            />
          </Collapsible>
        )}
      </View>
    </View>
  );
}

export default Post;
