import React, { useEffect } from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

import gif from "../assets/gifs/eyes.gif";

import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";

import { useMutation } from "@apollo/client";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { ethers } from "ethers";
import {
	useGetNonceQuery,
	useHasLanceProfileQuery,
	useLoginMutation,
} from "../store/auth/auth.api";
import { setTokens } from "../store/auth/auth.slice";
import { login } from "../store/lens/auth/login-user";
import { CREATE_PROFILE } from "../store/lens/create-profile.mutation";
import { useAppDispatch } from "../store/store.hook";

const shortenAddress = (address: string) => {
	return `${address.slice(0, 6)}...${address.slice(
		address.length - 4,
		address.length
	)}`;
};

export default function Auth({ navigation }: RootTabScreenProps<"Auth">) {
	const connector = useWalletConnect();
	const dispatch = useAppDispatch();
	const { data: dataNonce } = useGetNonceQuery(connector.accounts[0] || "", {
		skip: !connector.accounts[0],
	});

	const [triggerLogin] = useLoginMutation();

	const connectWallet = React.useCallback(() => {
		return connector.connect();
	}, [connector]);

	const killSession = React.useCallback(() => {
		return connector.killSession();
	}, [connector]);

	const isLanceProfileExist = useHasLanceProfileQuery(
		connector.accounts[0] || ""
	);

	const [mutateFunction, { data, loading, error }] =
		useMutation(CREATE_PROFILE);

	const createProfileHandler = async () => {
		if (connector.accounts[0]) {
			console.log("mtfunc");
			await mutateFunction({
				variables: {
					request: {
						handle: `frenly${connector.accounts[0].toLowerCase().slice(0, 10)}`,
						profilePictureUri: null,
						followModule: {
							freeFollowModule: true,
						},
					},
				},
			});
			console.log(
				"🚀 ~ file: auth.tsx ~ line 64 ~ createProfileHandler ~ data",
				data
			);
		}
	};

	useEffect(() => {
		console.log("🚀 ~ file: auth.tsx ~ line 75 ~ Auth ~ error", error);
	}, [error]);

	async function signIn() {
		let dataLogin;
		console.log("====================================");
		console.log(dataNonce);
		console.log("====================================");
		const nonce = dataNonce?.data?.nonce;
		console.log(nonce);

		if (nonce) {
			console.log(nonce);
			const signature = await connector.signPersonalMessage([
				`Nonce: ${nonce}`,
				connector.accounts[0].toLowerCase(),
			]);

			console.log(
				"🚀 ~ file: auth.tsx ~ line 80 ~ signIn ~ signature",
				signature
			);

			dataLogin = await triggerLogin({
				address: connector.accounts[0],
				signature: signature || "",
			}).unwrap();
		}
		console.log(dataLogin);
		// @ts-ignore
		dispatch(setTokens({ ...dataLogin?.data }));
		// console.log("AaA", connector.accounts[0], library);

		const provider = new ethers.providers.JsonRpcProvider(
			"https://polygon-mumbai.g.alchemy.com/v2/HCm-qNqCQm-NnbV9nHWxq9OnMHkUNvsg",
			8001
		);
		await login(connector.accounts[0], provider, connector);

		connector.accounts[0];
		console.log(
			"🚀 ~ file: auth.tsx ~ line 96 ~ signIn ~ wallet",
			connector.accounts[0]
		);
		console.log(
			"🚀 ~ file: auth.tsx ~ line 89 ~ signIn ~ countProfile",
			isLanceProfileExist
		);
		if (!isLanceProfileExist?.data?.data) {
			try {
				await createProfileHandler();
			} catch (error) {
				console.log(error);
			}
		}
		navigation.navigate("Feed");
	}

	useEffect(() => {
		// if (connector.accounts[0]) navigation.push("Feed");
		console.log(connector.accounts[0]);
	}, connector.accounts);

	useEffect(() => {
		console.log(dataNonce, "nonce change");
	}, [dataNonce]);

	return (
		<View className="container flex-col justify-between items-center h-screen px-5 py-20">
			<View className="flex-1 item-center justify-center">
				<Image
					style={{ width: 300, height: 300 }}
					borderRadius={15}
					source={gif}
				/>
				<Text className="text-4xl font-bold mt-16 text-center">Frenly</Text>
				<Text className="text-l mt-3 text-base text-center text-gray-700">
					Web3 social network
				</Text>
				<Text className="text-l text-base text-center text-gray-700">
					built for you, not advertisers
				</Text>
			</View>
			{!connector.connected && (
				<TouchableOpacity
					className="w-full rounded-xl bg-blue-500 items-center py-3 font-semibold"
					onPress={connectWallet}
				>
					<Text className="text-white text-lg font-bold">Connect Wallet</Text>
				</TouchableOpacity>
			)}
			{!!connector.connected && (
				<>
					<Text>{shortenAddress(connector.accounts[0])}</Text>
					<TouchableOpacity onPress={signIn} style={styles.buttonStyle}>
						<Text style={styles.buttonTextStyle}>Sign in</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={killSession} style={styles.buttonStyle}>
						<Text style={styles.buttonTextStyle}>Log out</Text>
					</TouchableOpacity>
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
	buttonStyle: {
		backgroundColor: "#3399FF",
		borderWidth: 0,
		color: "#FFFFFF",
		borderColor: "#3399FF",
		height: 40,
		alignItems: "center",
		borderRadius: 30,
		marginLeft: 35,
		marginRight: 35,
		marginTop: 20,
		marginBottom: 20,
	},
	buttonTextStyle: {
		color: "#FFFFFF",
		paddingVertical: 10,
		paddingHorizontal: 15,
		fontSize: 16,
		fontWeight: "600",
	},
});
