import { ETHEREUM_ADDRESS, TokenTypeEnum } from "@shared/lib";
import type { SwappableAssetV4 } from "@traderxyz/nft-swap-sdk";
import { NftSwapV4 } from "@traderxyz/nft-swap-sdk";
import { useCallback, useEffect, useState } from "react";
import { useBlockchain } from "src/blockchain";
interface ICreateOrderInput {
  tokenAddressMaker: string;
  tokenAddressTaker?: string;
  tokenType: TokenTypeEnum;
  tokenId: string;
}
export const useCreateOrder = ({
  tokenAddressMaker,
  tokenAddressTaker = ETHEREUM_ADDRESS,
  tokenId,
  tokenType,
}: ICreateOrderInput) => {
  const [price, setPrice] = useState("");
  const { account, signer, library, switchNetwork, ChainId, ethers } =
    useBlockchain();
  useEffect(() => {
    if (Number.isNaN(Number(price)) && price.length > 0) {
      setPrice("");
    }
  }, [price]);
  return {
    price,
    setPrice,
    createOrder: useCallback(async () => {
      try {
        console.log(tokenAddressMaker, tokenId);
        await switchNetwork(ChainId.Mainnet);
        const makerOrderERC721: SwappableAssetV4 = {
          tokenAddress: tokenAddressMaker,
          tokenId,
          type: TokenTypeEnum.ERC721,
        };
        const makerOrderERC1155: SwappableAssetV4 = {
          tokenAddress: tokenAddressMaker,
          tokenId,
          type: TokenTypeEnum.ERC721,
        };
        const makerOrder =
          tokenType == TokenTypeEnum.ERC1155
            ? makerOrderERC1155
            : makerOrderERC721;
        const takerOrder: SwappableAssetV4 = {
          tokenAddress: tokenAddressTaker,
          amount: price + "0".repeat(17),
          type: TokenTypeEnum.ERC20,
        };
        // @ts-ignore
        const nftSwapSdk = new NftSwapV4(library, signer, ChainId.Mainnet);
        console.log(makerOrder, takerOrder);
        const approvalStatusForMaker = await nftSwapSdk.loadApprovalStatus(
          makerOrder,
          account as string
        );
        if (!approvalStatusForMaker.contractApproved) {
          const approvalTx = await nftSwapSdk.approveTokenOrNftByAsset(
            makerOrder,
            account as string
          );
          const approvalTxReceipt = await approvalTx.wait();
          console.log(approvalTxReceipt);
        }
        const order = nftSwapSdk.buildOrder(
          makerOrder,
          takerOrder,
          account as string
        );
        console.log(order);
        const signedOrder = await nftSwapSdk.signOrder(order);
        const postedOrder = await nftSwapSdk.postOrder(
          signedOrder,
          ChainId.Mainnet
        );
        console.log(postedOrder);
        console.log(signedOrder);
      } catch {
      } finally {
        await switchNetwork(ChainId.Mumbai);
      }
    }, [
      ChainId.Mainnet,
      ChainId.Mumbai,
      account,
      library,
      price,
      signer,
      tokenAddressMaker,
      tokenAddressTaker,
      tokenId,
      tokenType,
    ]),
  };
};
