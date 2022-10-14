import "@ethersproject/shims";
// import { useCall, useContractFunction } from '@usedapp/core'
import { Contract, ethers } from "ethers";
import "react-native-get-random-values";
import { lensHubABI, lensHubContract } from "./lens-hub.contract";

// export const getWalletProfileId = async (address: string, library: any) => {
//   const contract = createLensContract(library)

//   return await contract.tokenOfOwnerByIndex(address, 0)
// }
const lensInterface = new ethers.utils.Interface(lensHubABI);
const lensContract = new Contract(lensHubContract, lensInterface);

export function useGetWalletProfileId(address: String) {
	// const connector = useWalletConnect();
	// const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/HCm-qNqCQm-NnbV9nHWxq9OnMHkUNvsg", 8001);
	// const contract = new ethers.Contract(lensHubContract, lensHubABI, provider)
	// contract.
	// const { value, error } =
	//   useCall({
	//     contract: lensContract,
	//     method: 'tokenOfOwnerByIndex',
	//     args: [address, 0],
	//   }) ?? {}
	// if (error) {
	//   console.error(error.message)
	//   return
	// }
	// return value ? value[0]._hex : null
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

// export function usePostWithSig() {

//   const { state, send } = useContractFunction(lensContract, 'postWithSig')
//   return { state, send }
// }

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
