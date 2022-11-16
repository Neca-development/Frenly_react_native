import { useWalletConnect } from "@walletconnect/react-native-dapp";
import React, { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import SendIcon from "../assets/icons/send-icon";
import { getLensCommentId } from "../contract/lens-hub.api";
import Comment, { IComment } from "./Comment";
import {
  createLensCommentIdParams,
  getSignatureFromTypedData,
  splitSignature,
} from "./unpublished-posts/create-post.utils";
import Toast from "react-native-toast-message";
import { authApi } from "../store/auth/auth.api";
import { useAppDispatch } from "../store/store.hook";
import { createCommentTypedData } from "../store/lens/comment/create-comment-typed-date";
import AppLoader from "./app-loader.component";

interface ICommentsProps {
  pubId: string | number;
  profileId: string;
  data: [];
  refetchComment: Function;
}

function Comments(props: ICommentsProps) {
  const { data, refetchComment, pubId, profileId } = props;

  const dispatch = useAppDispatch();

  const [comments, setComments] = useState([]);
  const [commentValue, setCommentValue] = useState("");
  const connector = useWalletConnect();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data) {
      const newValue = data.slice().reverse();
      setComments(newValue);
    }
  }, [data]);

  async function commentHandler() {
    try {
      setIsLoading(true);
      const contentMetadata = await dispatch(
        authApi.endpoints.createCommentMetadata.initiate({
          comment: String(commentValue),
          lensId: String(pubId),
        })
      );
      const contentURI = contentMetadata.data.data;

      const createCommentRequest = {
        profileId,
        publicationId: pubId,
        contentURI,
        collectModule: {
          revertCollectModule: true,
        },
        referenceModule: {
          followerOnlyReferenceModule: false,
        },
      };
      const result = await createCommentTypedData(createCommentRequest);
      const { typedData } = result.data.createCommentTypedData;

      const signature = await getSignatureFromTypedData(connector, typedData);
      const signatureAfterSplit = splitSignature(signature);

      const getCommentParams = createLensCommentIdParams(
        typedData,
        signatureAfterSplit
      );
      await getLensCommentId(connector, getCommentParams);

      setCommentValue("");
      refetchComment();
      console.log("✅ Success");
      Toast.show({
        type: "success",
        text1: "✅ Success",
        text2: "Your comment created",
      });
    } catch (error_) {
      console.log("❌ Error", String(error_));
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: "Try again later",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View className="py-4 relative">
      {isLoading && <AppLoader />}
      <Text className="text-xl font-bold mb-4">Comments</Text>
      {/* {newComment && <Comment {...newComment} />} */}
      {comments?.map((comment: IComment) => (
        <Comment key={comment.id} {...comment} />
      ))}
      <View className="w-full pt-4 pb-4 flex-row items-center">
        <View className="flex-1 rounded-2xl bg-light-gray px-4 py-2  mr-2">
          <TextInput
            value={commentValue}
            onChangeText={(text) => setCommentValue(text)}
            type="text"
            className="outline-none w-full"
            placeholder="Comment"
          />
        </View>
        <Pressable onPress={commentHandler} disabled={isLoading}>
          <View className="flex items-center justify-center py-1 px-2">
            <SendIcon />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

export default Comments;
