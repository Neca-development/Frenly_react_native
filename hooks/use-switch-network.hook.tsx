import React from "react";

import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { ETHEREUM_RPC_URL } from "../constants/Api";

export default function useSwitchNetwork() {
  const connector = useWalletConnect();

  async function switchNetwork(chainId: number) {
    try {
      await connector.sendCustomRequest({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId}` }],
      });
    } catch (error) {
      // if (error.code === 4902) {
      //   try {
      //     await connector.sendCustomRequest({
      //       method: "wallet_addEthereumChain",
      //       params: [
      //         {
      //           chainId: `0x${chainId}`,
      //           chainName: "Ethereum Mainnet",
      //           rpcUrls: [ETHEREUM_RPC_URL] /* ... */,
      //         },
      //       ],
      //     });
      //   } catch (addError) {
      //     console.log("❌ addError", addError);
      //   }
      // }

      console.log("❌ switchError", error);
    }
  }

  return {
    switchNetwork: switchNetwork,
  };
}
