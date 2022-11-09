import React, { useEffect, useState } from "react";
import { Image, Linking, Pressable, Text, View } from "react-native";
import Button from "../Button";

import { useMutation, useQuery } from "@apollo/client";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { id } from "ethers/lib/utils";
import Collapsible from "react-native-collapsible";
import imagePlaceholder from "../../assets/images/temp-avatar.png";
import { useGetWalletProfileId } from "../../contract/lens-hub.api";
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

interface IPostProps {
  isUnpublishedPost: boolean;
  addPost(id: number): void;
  declinePost(id: number): void;
  openProfile?(id: number): void;
  data: {
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
  };
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

  const { data: publicationIsReact, refetch } = useQuery(GET_REACTIONS, {
    variables: {
      request: {
        publicationIds: [id],
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

  return (
    <View className="flex-row items-start px-4 border-b border-border-color pt-2 pb-4">
      {!isUnpublishedPost && (
        <Pressable
          onPress={() => openProfile(data.profileId)}
          className="mr-4 items-center border rounded-full border-border-color overflow-hidden"
        >
          {avatar ? (
            <Image
              source={{
                uri: `${SERVER_URL}avatars/${avatar}`,
              }}
              className="w-[40px] h-[40px] rounded-full"
            />
          ) : (
            <Image
              source={data.avatar || imagePlaceholder}
              className="w-[40px] h-[40px] rounded-full"
            />
          )}
        </Pressable>
      )}
      <View className="flex-1">
        <PostContent userName={username || data.name} data={data} />
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
              onCommentsPress={toggleCommentsCollapsed}
              commentsCount={comments?.publications?.items?.length}
              likesCount={postData?.publication?.stats.totalUpvotes}
              isLikeRequest={isLikeRequest}
            />
          )}
        </View>
        {!isUnpublishedPost && (
          <Collapsible collapsed={isCommentsCollapsed}>
            <Comments
              refetchComment={refetchComments}
              data={comments}
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
