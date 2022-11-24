import WalletConnectProvider from "@walletconnect/web3-provider";

import { IAlchemyResponse } from "./../common/types/alchemy";
import { NftSwapV4 } from "@traderxyz/nft-swap-sdk";
import type { SwappableAssetV4 } from "@traderxyz/nft-swap-sdk";
import { ethers } from "ethers";
import { ETHEREUM_CHAIN_ID, ETHEREUM_RPC_URL } from "../constants/Api";

export enum TokenTypeEnum {
  "ERC20" = "ERC20",
  "ERC721" = "ERC721",
  "ERC1155" = "ERC1155",
}

// export async function buyOrder(
//   connector: any,
//   data: IPostZeroex,
//   sellPrice: string | number
// ) {
//   try {
//     // setIsLoading(true)
//     const CHAIN_ID = ETHEREUM_CHAIN_ID;
//     // await switchNetwork(ChainId.Mainnet)
//     const takerOrder: SwappableAssetV4 = {
//       tokenAddress: ETHEREUM_ADDRESS,
//       amount: String(sellPrice),
//       type: TokenTypeEnum.ERC20,
//     };

//     const provider = new WalletConnectProvider({
//       rpc: {
//         [CHAIN_ID]: ETHEREUM_RPC_URL,
//       },
//       chainId: CHAIN_ID,
//       connector: connector,
//       qrcode: false,
//     });
//     await provider.enable();
//     const ethers_provider = new ethers.providers.Web3Provider(provider);
//     const signer = ethers_provider.getSigner(connector.accounts[0]);
//     const nftSwapSdk = new NftSwapV4(ethers_provider, signer, CHAIN_ID);

//     // @ts-ignore
//     // if (tokenAddressTaker !== ETHEREUM_ADDRESS) {
//     //   const approvalStatusForMaker = await nftSwapSdk.loadApprovalStatus(
//     //     takerOrder,
//     //     account as string
//     //   );
//     //   if (!approvalStatusForMaker.contractApproved) {
//     //     const approvalTx = await nftSwapSdk.approveTokenOrNftByAsset(
//     //       takerOrder,
//     //       account as string
//     //     );
//     //     await approvalTx.wait();
//     //   }
//     // }
//     const parsedSignedOrder = JSON.parse(data.signedObject);
//     const fillTx = await nftSwapSdk.fillSignedOrder(parsedSignedOrder);
//     const res = await nftSwapSdk.awaitTransactionHash(fillTx.hash);
//     return res;
//   } catch (error: any) {
//     return error;
//   } finally {
//     // await switchNetwork(ChainId.Mumbai)
//     // setIsLoading(false)
//   }
// }

export async function createOrder(
  connector: any,
  data: IAlchemyResponse,
  sellPrice: string
) {
  try {
    await connector.connect();
    const CHAIN_ID = ETHEREUM_CHAIN_ID;
    const tokenAddressTaker = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

    const makerOrderERC721: SwappableAssetV4 = {
      tokenAddress: data.contract.address,
      tokenId: data.id.tokenId,
      type: TokenTypeEnum.ERC721,
    };
    const makerOrderERC1155: SwappableAssetV4 = {
      tokenAddress: data.contract.address,
      tokenId: data.id.tokenId,
      type: TokenTypeEnum.ERC1155,
    };
    let ethersInWei = String(
      Number(ethers.utils.parseUnits(sellPrice.toString(), "ether"))
    );

    console.log("💵💰", String(Number(sellPrice) * 1000000000000000000));
    const makerOrder =
      data?.contractMetadata?.tokenType == TokenTypeEnum.ERC1155
        ? makerOrderERC1155
        : makerOrderERC721;
    const takerOrder: SwappableAssetV4 = {
      tokenAddress: tokenAddressTaker,
      amount: String(Number(sellPrice) * 1000000000000000000),
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
    const approvalStatusForMaker = await nftSwapSdk.loadApprovalStatus(
      makerOrder,
      connector.accounts[0] as string
    );

    if (!approvalStatusForMaker.contractApproved) {
      const approvalTx = await nftSwapSdk.approveTokenOrNftByAsset(
        makerOrder,
        connector.accounts[0] as string
      );
      const approvalTxReceipt = await approvalTx.wait();
    }

    const order = nftSwapSdk.buildOrder(
      makerOrder,
      takerOrder,
      String(connector.accounts[0])
    );
    const signedOrder = await nftSwapSdk.signOrder(order);
    console.log(signedOrder);
    return signedOrder;
  } catch (error) {
    console.error(error);
  }
}
