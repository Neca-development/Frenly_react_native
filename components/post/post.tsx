import React, { useEffect, useState } from "react";
import { Linking, Pressable, Text, View } from "react-native";
import Button from "../shared/button.component";

import { useMutation, useQuery } from "@apollo/client";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { id } from "ethers/lib/utils";
import Toast from "react-native-toast-message";
import Collapsible from "react-native-collapsible";

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
import Comments from "../comments.component";
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
import { PostTypeEnum, SizesEnum } from "../../common/helpers";
import createTwitterLink from "../../helpers/create-twitter-link";
import AvatarWithLink from "../shared/avatar-with-link.component";

export interface IPostData {
  postType: PostTypeEnum;
  avatar?: any;
  profileId: string;
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
  addPost?(): void;
  declinePost?(): void;
  data: IPostData;
  postType: PostTypeEnum;
}

const Post = React.memo((props: IPostProps) => {
  const { data, isUnpublishedPost, addPost, declinePost, postType } = props;
  const [isCommentsCollapsed, changeCommentsCollapsed] = useState(true);
  const [isMirrorModalVisible, setMirrorModalVisible] = useState(false);
  const [isLiked, setIsLiked] = useState<null | boolean>(null);

  const connector = useWalletConnect();

  const { value: myProfileId } = useGetWalletProfileId(
    connector.accounts[0] || ""
  );

  const {
    name: username,
    avatar,
    isLoading: creatorLoading,
  } = useUpdate(data.creator);
  const [isLoading, setIsLoading] = useState(false);
  const [likePostToLens, dataLikes] = useMutation(LIKE_TO_POST);
  const [likesCount, setLikesCount] = useState(0);
  const [cancelLikePostToLens, dataCancelLikes] =
    useMutation(CANCEL_LIKE_TO_POST);
  const [isLikeRequest, setIsLikeRequest] = useState(false);
  const [repostTwitterLink, setRepostTwitterLink] = useState("");

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

  const { data: publicationIsReact } = useQuery(GET_REACTIONS, {
    variables: {
      request: {
        publicationIds: [data.id],
      },
      requestReaction: {
        profileId: myProfileId,
      },
    },
    skip: typeof id == "number",
  });
  const [mirrorPost] = useMirrorPostMutation();

  function toggleCommentsCollapsed() {
    changeCommentsCollapsed(!isCommentsCollapsed);
  }

  const likePost = async () => {
    try {
      setIsLiked(true);
      setLikesCount(likesCount + 1);
      setIsLikeRequest(true);
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
    } catch (error) {
      setLikesCount(likesCount - 1);
      setIsLiked(false);
    } finally {
      setIsLikeRequest(false);
    }
  };

  const dislikePost = async () => {
    try {
      setIsLiked(false);
      setLikesCount(likesCount - 1);
      setIsLikeRequest(true);

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
    } catch (error) {
      setIsLiked(false);
      setLikesCount(likesCount + 1);
      setIsLiked(true);
    } finally {
      setIsLikeRequest(false);
    }
  };

  const checkPostIsLiked = () => {
    if (isLiked !== null) {
      return isLiked;
    }
    return publicationIsReact?.publications?.items[0]?.reaction === "UPVOTE";
  };

  const likeHandler = async () => {
    if (!myProfileId || !data.id) {
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: "Try again later",
      });
      return;
    }

    if (checkPostIsLiked()) {
      return dislikePost();
    }
    return likePost();
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

  useEffect(() => {
    setRepostTwitterLink(createTwitterLink(data));
  }, [data]);

  useEffect(() => {
    setLikesCount(postData?.publication?.stats.totalUpvotes);
  }, [postData?.publication?.stats.totalUpvotes]);

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
        <AvatarWithLink
          profileId={data.profileId}
          isLoading={creatorLoading}
          avatar={avatar || data.avatar}
          size={SizesEnum.md}
        />
      )}
      <View className="flex-1 ">
        <PostContent
          isLoading={creatorLoading}
          userName={username || data.name}
          data={data}
          postType={postType}
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
                  ? `https://etherscan.io//tx/${data.txHash}`
                  : `https://mumbai.polygonscan.com/tx/${data.txHash}`
              )
            }
          >
            <Text className="text-sm text-main" rel="noreferrer">
              {data.blockchainType === "ETHEREUM" ? "Etherscan" : "Polygonscan"}
            </Text>
          </Pressable>
          {!isUnpublishedPost && (
            <PostControls
              isLiked={checkPostIsLiked()}
              onLikePress={likeHandler}
              onCommentsPress={toggleCommentsCollapsed}
              onMirrorPress={() => setMirrorModalVisible(true)}
              commentsCount={comments?.publications?.items?.length}
              likesCount={likesCount}
              mirrorsCount={data.totalMirror}
              isLikeRequest={isLikeRequest}
              repostTwitterLink={repostTwitterLink}
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
});

export default Post;
