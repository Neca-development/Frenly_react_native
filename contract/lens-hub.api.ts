import "@ethersproject/shims";
// import { useCall, useContractFunction } from '@usedapp/core'
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import "react-native-get-random-values";
import { lensHubABI, lensHubContract } from "./lens-hub.contract";
import WalletConnectProvider from "@walletconnect/web3-provider";

const provider = new ethers.providers.JsonRpcProvider(
  "https://polygon-mumbai.g.alchemy.com/v2/HCm-qNqCQm-NnbV9nHWxq9OnMHkUNvsg",
  80001
);
const lensContract = new Contract(lensHubContract, lensHubABI, provider);

export async function getLensPostId(connector: any, obj: any) {
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
  const signer = ethers_provider.getSigner();

  const lensContractInst = new Contract(lensHubContract, lensHubABI, signer);
  const res = await lensContractInst.postWithSig(obj);
  const receipt = await res.wait();

  const lensPostId =
    Number(receipt?.logs[0]?.topics[2]).toString(16).length === 1
      ? `0x${Number(receipt?.logs[0]?.topics[1]).toString(16)}-0x0${Number(
          receipt?.logs[0]?.topics[2]
        ).toString(16)}`
      : `0x${Number(receipt?.logs[0]?.topics[1]).toString(16)}-0x${Number(
          receipt?.logs[0]?.topics[2]
        ).toString(16)}`;

  return lensPostId;
}

export function useGetWalletProfileId(address: String) {
  const [value, setValue] = useState<unknown>();
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    (async () => {
      try {
        let data = await lensContract.tokenOfOwnerByIndex(address, 0);
        data = JSON.parse(data);
        // console.log(
        //   "🚀 ~ file: lens-hub.api.ts ~ line 24 ~ data",
        //   "0x" + data.toString(16)
        // );

        setValue("0x" + data.toString(16));
      } catch (error) {
        // console.log("🚀 ~ file: lens-hub.api.ts ~ line 32 ~ error", error);
        setError(error);
      }
    })();
  }, [address]);

  return { value, error };
}

export function useHaveProfile(address: string | undefined) {
  // const { value, error } =
  //   useCall({
  //     contract: lensContract,
  //     method: 'balanceOf',
  //     args: [address],
  //   }) ?? {}
  // if (error) {
  //   console.error(error.message)
  //   return
  // }
  // return value ? Number.parseInt(value[0]._hex, 16) : null
}

// export function useMirrorWithSig() {
//   const { state, send } = useContractFunction(lensContract, 'mirrorWithSig')
//   return { state, send }
// }

// export function useFollowWithSig() {
//   const { state, send } = useContractFunction(lensContract, 'followWithSig')
//   return { state, send }
// }

// export function useUnfollowWithSig() {
//   const { state, send } = useContractFunction(lensContract, 'burnWithSig')
//   return { state, send }
// }
