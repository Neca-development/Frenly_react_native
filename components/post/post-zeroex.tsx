import React from "react";

import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { View } from "react-native";
import { SizesEnum } from "../../common/helpers";
import { useUpdate } from "../../hooks/use-update-user.hook";

import AvatarWithLink from "../shared/avatar-with-link.component";
import Button from "../shared/button.component";
import PostContent from "./components/post-content";

export interface Signature {
  signatureType: number;
  r: string;
  s: string;
  v: number;
}

export interface signedObject {
  erc1155Token: string;
  erc1155TokenId: string;
  erc1155TokenAmount: string;
  direction: number;
  erc20Token: string;
  erc20TokenAmount: string;
  maker: string;
  erc1155TokenProperties: any[];
  fees: any[];
  expiry: string;
  nonce: string;
  taker: string;
  signature: Signature;
}

export interface IPostZeroex {
  collectionName: string;
  creationDate: string;
  fromAddress: string;
  id: number;
  image: string;
  isUnpublishedPost: boolean;
  postType: number;
  sellPrice: number;
  //Json data
  signedObject: signedObject;
}

export default function PostZeroex(props: IPostZeroex) {
  const connector = useWalletConnect();
  const {
    name: username,
    avatar,
    isLoading: creatorLoading,
  } = useUpdate(props.fromAddress);
  return (
    <View className="flex-row items-start px-4 border-b border-border-color pt-2 pb-4">
      <AvatarWithLink
        profileId={props.fromAddress}
        isLoading={creatorLoading}
        avatar={avatar}
        size={SizesEnum.md}
      />

      <View className="flex-1 ">
        <PostContent
          data={{
            image: props.image,
            date: props.creationDate,
            from: props.fromAddress,
            info: props.collectionName,
          }}
          userName={username}
          postType={props.postType}
          isLoading={creatorLoading}
        />
        {props.fromAddress == connector.accounts[0] ? (
          <Button buttonStyle={"bg-red-500 mt-2"} title="Cancel the sale" />
        ) : (
          <Button
            buttonStyle={" mt-2"}
            title={`Buy for ${props.sellPrice} ETH`}
          />
        )}
      </View>
    </View>
  );
}
