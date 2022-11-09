import React, { useEffect, useState } from "react";
import { Image, Linking, Pressable, Text, View } from "react-native";
import Button from "../Button";

import { useMutation, useQuery } from "@apollo/client";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { id } from "ethers/lib/utils";
import Collapsible from "react-native-collapsible";
import imagePlaceholder from "../../assets/images/temp-avatar.png";
import commentIcon from "../../assets/icons/comment.png";
import cycleIcon from "../../assets/icons/cycle.png";
import heartIcon from "../../assets/icons/heart.png";
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

  const renderMessage = () => {
    let message;
    const messageTypeClone =
      data.from == "0x0000000000000000000000000000000000000000"
        ? "MINTED"
        : data.messageType;

    switch (messageTypeClone) {
      case "MINTED":
        message = "🎉 Minted a new ";
        break;
      case "RECEIVE":
        message = "📤 Received ";
        break;
      case "SEND":
        message = "📤 Sent ";
        break;
      default:
        break;
    }

    switch (data.itemType) {
      case "nft":
        message += `${data.messageType !== "MINTED" ? "an" : ""} NFT`;
        break;
      case "token":
        message += "tokens";
        break;
      default:
        break;
    }

    return `${message} `;
  };

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
          <Image
            source={data.avatar || imagePlaceholder}
            className="w-[40px] h-[40px]"
          />
        </Pressable>
      )}
      <View className="flex-1">
        <View>
          <Text className="text-base font-semibold">{data.name}</Text>
          <Text className="text-base font-normal text-gray">{data.date}</Text>
        </View>

        <View>
          <Text className="text-base font-semibold">
            {renderMessage()}{" "}
            {data.from !== "0x0000000000000000000000000000000000000000" ? (
              data.messageType == "RECEIVE" ? (
                <>from&nbsp;</>
              ) : (
                <>to&nbsp;</>
              )
            ) : (
              <>from Smart contract&nbsp;</>
            )}
          </Text>
          <Text
            onPress={() =>
              Linking.openURL(
                data.blockchainType === "ETHEREUM"
                  ? `https://rinkeby.etherscan.io/address/${
                      data.from == "0x0000000000000000000000000000000000000000"
                        ? data.contractAddress
                        : data.from
                    }`
                  : `https://polygonscan.com/address/${
                      data.from == "0x0000000000000000000000000000000000000000"
                        ? data.contractAddress
                        : data.from
                    }`
              )
            }
            className="text-main text-base font-semibold"
            rel="noreferrer"
          >
            {data.from == "0x0000000000000000000000000000000000000000"
              ? data.contractAddress
              : data.messageType == "RECEIVE"
              ? data.from
              : data.to}
          </Text>
        </View>

        <Text className="text-sm font-normal text-gray-darker mt-1">
          {data.info}
        </Text>

        <View className="relative h-[300px] rounded-lg overflow-hidden mt-1">
          {data.image !== null ? (
            <Image
              source={{
                uri: `${SERVER_URL}token-images/${data.image}`,
              }}
              resizeMode="cover"
              className="w-full h-full object-center"
            />
          ) : (
            <Image
              source={"../../assets/images/favicon.png"}
              // className="m-auto mt-30 mb-30"
            />
          )}

          {/* <img
            src={ '/assets/images/eyes.gif'}s
            alt="image"
            className="object-cover"
          /> */}
        </View>
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
          <Text
            onPress={() =>
              Linking.openURL(
                data.blockchainType == "ETHEREUM"
                  ? `https://rinkeby.etherscan.io/tx/${data.txHash}`
                  : `https://mumbai.polygonscan.com/tx/${data.txHash}`
              )
            }
            className="text-sm text-main"
            rel="noreferrer"
          >
            Check on{" "}
            {data.blockchainType === "ETHEREUM" ? "Etherscan" : "Polygonscan"}
          </Text>
          {isUnpublishedPost === false && (
            <View className="flex-row items-center">
              <Pressable
                // disabled={isLikeRequest}
                // onClick={likeHandler}
                className={`flex-row items-center justify-center py-1 px-2 ${
                  isLikeRequest ? "bg-gray" : ""
                }`}
              >
                <Image
                  source={heartIcon}
                  className="h-5 w-5"
                  resizeMode="contain"
                />
                <Text className="text-md font-semibold text-gray-darker ml-1">
                  {postData?.publication?.stats.totalUpvotes}
                </Text>
              </Pressable>
              <Pressable
                onPress={toggleCommentsCollapsed}
                className="flex-row items-center justify-center py-1 px-2"
              >
                <Image
                  source={commentIcon}
                  className="h-5 w-5"
                  resizeMode="contain"
                />
                <Text className="text-md font-semibold text-gray-darker ml-1">
                  {comments?.publications?.items?.length ?? 0}
                </Text>
              </Pressable>
              <Pressable
                // onClick={mirrorHandler}
                className="flex-row items-center justify-center py-1 px-2"
              >
                <Image
                  source={cycleIcon}
                  className="h-5 w-5"
                  resizeMode="contain"
                />
                <Text className="text-md font-semibold text-gray-darker ml-1">
                  {/* {totalMirror} */}0
                </Text>
              </Pressable>
            </View>
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
