import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  ScrollView,
  Linking,
  Pressable,
} from "react-native";
import { SizesEnum } from "../common/helpers";
import Button from "../components/shared/button.component";
import NFTImage from "../components/shared/nft-image.component";
import safeViewAndroid from "../helpers/safe-view-android";
import { RootStackParamList } from "../types";
import type { RouteProp } from "@react-navigation/native";
import { IAlchemyResponse } from "../common/types/alchemy";
import { NftSwapV4 } from "@traderxyz/nft-swap-sdk";
import type { SwappableAssetV4 } from "@traderxyz/nft-swap-sdk";
import { ethers } from "ethers";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import WalletConnectProvider from "@walletconnect/web3-provider";

export default function NFTScreen({
  route,
}: RouteProp<RootStackParamList, "NFT">) {
  const [sellPrice, setSellPrice] = useState<null | string>(null);
  const data = route.params.data as IAlchemyResponse;

  const connector = useWalletConnect();

  enum TokenTypeEnum {
    "ERC20" = "ERC20",
    "ERC721" = "ERC721",
    "ERC1155" = "ERC1155",
  }

  async function onSellPress() {
    try {
      const CHAIN_ID = 1; // Chain 1 corresponds to Mainnet. Visit https://chainid.network/ for a complete list of chain ids

      const CRYPTOPUNK_420 = {
        tokenAddress: "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb", // CryptoPunk contract address
        tokenId: "420", // Token Id of the CryptoPunk we want to swap
        type: "ERC721", // Must be one of 'ERC20', 'ERC721', or 'ERC1155'
      };

      const SIXTY_NINE_USDC = {
        tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC contract address
        amount: "69000000", // 69 USDC (USDC is 6 digits)
        type: "ERC20",
      };

      // User A Trade Data
      const walletAddressUserA = "0x1eeD19957E0a81AED9a80f09a3CCEaD83Ea6D86b";
      const nftToSwapUserA = CRYPTOPUNK_420;

      const tokenAddressTaker = "0x0000000000000000000000000000000000000000";

      const makerOrderERC721: SwappableAssetV4 = {
        tokenAddress: connector.accounts[0],
        tokenId: data.id.tokenId,
        type: TokenTypeEnum.ERC721,
      };
      const makerOrderERC1155: SwappableAssetV4 = {
        tokenAddress: connector.accounts[0],
        tokenId: data.id.tokenId,
        type: TokenTypeEnum.ERC721,
      };

      const makerOrder =
        data?.contractMetadata?.tokenType == TokenTypeEnum.ERC1155
          ? makerOrderERC1155
          : makerOrderERC721;
      const takerOrder: SwappableAssetV4 = {
        tokenAddress: tokenAddressTaker,
        amount: sellPrice + "0".repeat(17),
        type: TokenTypeEnum.ERC20,
      };

      const provider = new WalletConnectProvider({
        rpc: {
          80001:
            "https://polygon-mumbai.g.alchemy.com/v2/HCm-qNqCQm-NnbV9nHWxq9OnMHkUNvsg",
        },
        chainId: 80001,
        connector: connector,
        qrcode: false,
      });
      await provider.enable();
      const ethers_provider = new ethers.providers.Web3Provider(provider);
      const signer = ethers_provider.getSigner(connector.accounts[0]);
      // console.log(signer);
      console.log(provider);
      const nftSwapSdk = new NftSwapV4(provider, signer, CHAIN_ID);
      // console.log(nftSwapSdk);

      const approvalStatusForMaker = await nftSwapSdk.loadApprovalStatus(
        makerOrder,
        connector.accounts[0] as string
      );

      // ERROR CHECK WALLET NETWORK
      console.log(approvalStatusForMaker);
      // if (!approvalStatusForMaker.contractApproved) {
      //   const approvalTx = await nftSwapSdk.approveTokenOrNftByAsset(
      //     makerOrder,
      //     connector.accounts[0] as string
      //   );
      //   const approvalTxReceipt = await approvalTx.wait();
      //   console.log(approvalTxReceipt);
      // }
      // const order = nftSwapSdk.buildOrder(
      //   makerOrder,
      //   takerOrder,
      //   connector.accounts[0] as string
      // );
      // console.log(order);
      // const signedOrder = await nftSwapSdk.signOrder(order);
    } catch (error) {
      console.error(error);
    }
    // const postedOrder = await nftSwapSdk.postOrder(signedOrder, ChainId.Mainnet)
  }
  return (
    <SafeAreaView style={safeViewAndroid.AndroidSafeArea}>
      <ScrollView>
        <View className="px-10 py-6 items-center">
          <NFTImage
            size={SizesEnum.lg}
            source={{ uri: data.metadata.image }}
            address={data.contract.address}
          />
          <Text className="text-2xl font-extrabold mt-3">Contract address</Text>
          <Pressable
            onPress={() =>
              Linking.openURL(
                `https://polygonscan.com/address/${data.contract.address}`
              )
            }
          >
            <Text className="text-xl text-main font-extrabold text-center">
              {data.contract.address}
            </Text>
          </Pressable>
          <Text className="text-2xl font-extrabold mt-3">NFT name</Text>
          <Text className="text-xl  first-letter">
            {data.contractMetadata.name}
          </Text>

          <Text className="text-2xl font-extrabold mt-3 mb-1">Sell amount</Text>
          <View className="w-full rounded-2xl bg-light-gray relative">
            <TextInput
              value={sellPrice}
              onChangeText={(text) => setSellPrice(text)}
              keyboardType="numeric"
              className="outline-none w-full pl-4 pr-12 py-2"
              placeholder="0"
            />
            <View className="h-full absolute right-2 top-0 justify-center ">
              <Text className="font-semibold text-main">ETH</Text>
            </View>
          </View>

          <Button title="SELL" style="mt-5 min-w-[50%]" onPress={onSellPress} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
