import AsyncStorageLib from "@react-native-async-storage/async-storage";
import WalletConnect from "@walletconnect/client";

import { authenticate } from "./authenticate";
import { generateChallenge } from "./generate-challenge";

export const login = async (
	address: string,
	lib: any,
	connector: WalletConnect
) => {
	// we request a challenge from the server
	const challengeResponse = await generateChallenge(address);

	console.log("challengeRes", challengeResponse);

	// sign the text with the wallet
	const signature = await connector.signPersonalMessage([
		challengeResponse.data.challenge.text,
		address.toLowerCase(),
	]);

	console.log(
		"🚀 ~ file: login-user.ts ~ line 24 ~ address, signature",
		address,
		signature
	);
	const data = await authenticate(address, signature);
	console.log("🚀 ~ file: login-user.ts ~ line 24 ~ data", data);

	const { accessToken } = data.data.authenticate;
	// eslint-disable-next-line @typescript-eslint/no-shadow
	const { refreshToken } = data.data.authenticate;
	console.log(accessToken);
	await AsyncStorageLib.setItem("lens_access_token", accessToken);
	await AsyncStorageLib.setItem("lens_refresh_token", refreshToken);

	// you now have the accessToken and the refreshToken
	// {
	//  data: {
	//   authenticate: {
	//    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjB4YjE5QzI4OTBjZjk0N0FEM2YwYjdkN0U1QTlmZkJjZTM2ZDNmOWJkMiIsInJvbGUiOiJub3JtYWwiLCJpYXQiOjE2NDUxMDQyMzEsImV4cCI6MTY0NTEwNjAzMX0.lwLlo3UBxjNGn5D_W25oh2rg2I_ZS3KVuU9n7dctGIU",
	//    refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjB4YjE5QzI4OTBjZjk0N0FEM2YwYjdkN0U1QTlmZkJjZTM2ZDNmOWJkMiIsInJvbGUiOiJyZWZyZXNoIiwiaWF0IjoxNjQ1MTA0MjMxLCJleHAiOjE2NDUxOTA2MzF9.2Tdts-dLVWgTLXmah8cfzNx7sGLFtMBY7Z9VXcn2ZpE"
	//   }
	// }
};
