import { useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { ethers } from "ethers";
import React, { useCallback } from "react";
import { View, Text, RefreshControl, ScrollView } from "react-native";
import Colors from "../../constants/Colors";
import { authApi } from "../../store/auth/auth.api";
import { CREATE_POST_TYPED_DATA } from "../../store/lens/add-post.mutation";
import { signedTypeData } from "../../store/lens/post/create-post.utils";
import { useAppDispatch } from "../../store/store.hook";
import Post from "../post/post";

const omitDeep = require("omit-deep");

interface IUnpublishedPOsts {
  postsData: any;
  isLoading: boolean;
  refetch(): void;
  profileId: number;
}

export default function UnpublishedPOsts(props: IUnpublishedPOsts) {
  const { postsData, isLoading, refetch, profileId } = props;

  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  // const { account, library } = useEthers()

  const connector = useWalletConnect();
  const [addPostToLens, data] = useMutation(CREATE_POST_TYPED_DATA);

  const addPost = useCallback(async (id) => {
    const contentMetadata = await dispatch(
      authApi.endpoints.getContentMetadata.initiate({
        contentId: id.toString(),
      })
    ).unwrap();

    const postOptionsInfo = {
      variables: {
        request: {
          profileId: profileId,
          contentURI: contentMetadata.data,
          collectModule: {
            revertCollectModule: true,
          },
          referenceModule: {
            followerOnlyReferenceModule: false,
          },
        },
      },
    };
    let typeD;
    try {
      typeD = await addPostToLens(postOptionsInfo);
      // console.log("TYPED", typeD);
    } catch (error) {
      // navigation.navigate("Auth");
      // console.error(error);
      console.log(error);
    }
    const typedData = typeD?.data?.createPostTypedData?.typedData;
    // ethers

    let signature;

    // console.log(typedData.domain);
    // console.log(omitDeep(typedData.domain, "__typename"));
    // try {
    //   signature = await signedTypeData(
    //     typedData.domain,
    //     typedData.types,
    //     typedData.value,
    //     connector
    //     // library?.getSigner()
    //   );
    //   // connector.signTypedData();
    //   // signature = connector.signTypedData([
    //   //   {
    //   //     domain: typedData.domain,
    //   //     types: typedData.types,
    //   //     value: typedData.value,
    //   //   },
    //   // ]);
    //   console.log("SIGNATURE", signature);
    // } catch (error) {
    //   console.log("SIGNATURE ERR", error);
    // }
  }, []);
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
      {postsData?.data.map((el) => (
        <Post
          // isLoading={isLoading}
          // setIsLoading={setIsLoading}

          key={el.id}
          isUnpublishedPost
          addPost={() => addPost(el.id)}
          data={{
            // avatar: mockImg,
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
