import React, { useCallback, useState } from "react";

import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { View } from "react-native";
import { PostTypeEnum, SizesEnum } from "../../common/helpers";
import { useUpdate } from "../../hooks/use-update-user.hook";
import {
  useAcceptZeroexOrderMutation,
  useRemoveZeroexPostMutation,
} from "../../store/auth/auth.api";

import AvatarWithLink from "../shared/avatar-with-link.component";
import Button from "../shared/button.component";
import PostContent from "./components/post-content";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { NftSwapV4, SwappableAssetV4 } from "@traderxyz/nft-swap-sdk";
import {
  ETHEREUM_CHAIN_ID,
  ETHEREUM_RPC_URL,
  MUMBAI_HEX_CHAIN_ID,
} from "../../constants/Api";
import { TokenTypeEnum } from "../../contract/nft.api";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useGetWalletProfileId } from "../../contract/lens-hub.api";
import AppLoader from "../app-loader.component";
import useSwitchNetwork from "../../hooks/use-switch-network.hook";

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
  toAddress?: string;
  id: number;
  image: string;
  isUnpublishedPost: boolean;
  postType: number;
  sellPrice: number;
  refetchInfo(): void;
  //Json data
  signedObject: string;
}

export default function PostZeroex(props: IPostZeroex) {
  const [isLoading, setLoading] = useState(false);

  const { value: profileId } = useGetWalletProfileId(
    props.postType === PostTypeEnum.BUY_EVENT
      ? props?.toAddress || ""
      : props.fromAddress
  );

  const connector = useWalletConnect();
  const navigation = useNavigation();
  const { switchNetwork } = useSwitchNetwork();

  const {
    name: username,
    avatar,
    isLoading: creatorLoading,
  } = useUpdate(
    props.postType === PostTypeEnum.BUY_EVENT
      ? props?.toAddress || ""
      : props.fromAddress
  );

  const [removeZeroexPost] = useRemoveZeroexPostMutation();
  const [acceptZeroexOrder] = useAcceptZeroexOrderMutation();

  async function onRemovePress() {
    const res = await removeZeroexPost({ contentId: String(props.id) });
    if (res?.error) {
      Toast.show({
        type: "error",
        text1: "❌ " + res?.error.data.error,
      });
      return console.log(res.error);
    }
    props.refetchInfo();
    Toast.show({
      type: "error",
      text1: "✅ You cancelled your order",
    });
    return console.log("✅", res);
  }

  async function onBuyPress() {
    try {
      await switchNetwork(ETHEREUM_CHAIN_ID);
      setLoading(true);
      const CHAIN_ID = ETHEREUM_CHAIN_ID;
      // await switchNetwork(ChainId.Mainnet)
      const takerOrder: SwappableAssetV4 = {
        tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        amount: String(props.sellPrice),
        type: TokenTypeEnum.ERC20,
      };

      const provider = new WalletConnectProvider({
        rpc: {
          [CHAIN_ID]: ETHEREUM_RPC_URL,
        },
        chainId: CHAIN_ID,
        connector: connector,
        qrcode: false,
      });
      await provider.enable();
      const ethers_provider = new ethers.providers.Web3Provider(provider);
      const signer = ethers_provider.getSigner(connector.accounts[0]);
      const nftSwapSdk = new NftSwapV4(ethers_provider, signer, CHAIN_ID);
      const parsedSignedOrder = JSON.parse(props.signedObject);
      const fillTx = await nftSwapSdk.fillSignedOrder(parsedSignedOrder);
      await nftSwapSdk.awaitTransactionHash(fillTx.hash);
      const backRes = await acceptZeroexOrder({ contentId: String(props.id) });
      if (backRes.error) {
        throw backRes;
      }
      props.refetchInfo();

      Toast.show({
        type: "success",
        text1: "✨ You have successfully bought an NFT.",
      });
    } catch (error) {
      if (error.code == "INSUFFICIENT_FUNDS") {
        Toast.show({
          type: "error",
          text1: "😥 You don`t have enough ETHs to Buy this NFT.",
        });
        console.log("😥 ", error);
      } else if (error.message === "WRONG_CHAIN") {
        // navigation.navigate("Auth");
        Toast.show({
          type: "error",
          text1: "😢 Wrong network",
          text2: "Please switch network to Ethereum Mainnet & connect again",
        });
      } else {
        console.log("🤬 164", error);
        Toast.show({
          type: "error",
          text1: "😢 Something went wrong. Try again.",
        });
      }
    } finally {
      setLoading(false);
      switchNetwork(MUMBAI_HEX_CHAIN_ID);
    }
  }

  function buttonsSwitcher() {
    return props.fromAddress == connector.accounts[0] ? (
      <Button
        onPress={onRemovePress}
        buttonStyle={"bg-red-500 mt-2"}
        title="Cancel the sale"
      />
    ) : (
      <Button
        onPress={onBuyPress}
        buttonStyle={" mt-2"}
        title={`Buy for ${props.sellPrice} ETH`}
      />
    );
  }

  return (
    <View className="flex-row items-start px-4 border-b border-border-color pt-2 pb-4">
      {isLoading && <AppLoader />}
      <AvatarWithLink
        profileId={profileId as string}
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
            to: props.toAddress,
            info: props.collectionName,
          }}
          userName={username}
          postType={props.postType}
          isLoading={creatorLoading}
        />
        {props.postType === PostTypeEnum.SELL_ORDER && buttonsSwitcher()}
      </View>
    </View>
  );
}
