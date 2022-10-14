import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Image, Linking, Pressable, Text, View } from "react-native";
import Button from "../Button";

import Collapsible from "react-native-collapsible";
import commentIcon from "../../assets/icons/comment.png";
import cycleIcon from "../../assets/icons/cycle.png";
import heartIcon from "../../assets/icons/heart.png";

interface IPostProps {
	isAddCap: boolean;
	isLikeRequest: boolean;
	data: {
		avatar?: any;
		profileId: number;
		name: string;
		contractAddress: string;
		date: string;
		blockchainType: "ETHEREUM" | "POLYGON";
		image: any;
		info: string;
		from: string;
		to: string;
		showDate?: boolean;
		showAuthor?: boolean;
		// ! find out if there will be message types
		messageType: "SEND" | "RECEIVE" | "MINTED";
		//  ! item type?
		itemType: "nft" | "token";
		id: number | string;
		totalUpvotes?: number;
		totalMirror: number;
		refetchInfo?: () => void;
		txHash: string;
		isMirror: boolean;
		handleMirror?: string;
	};
}

function Post(props: IPostProps) {
	const { data, isAddCap, isLikeRequest } = props;
	const [isCommentsCollapsed, changeCommentsCollapsed] = useState(true);

	const navigation = useNavigation();

	const renderMessage = () => {
		let message;
		const messageTypeClone =
			data.from == "0x0000000000000000000000000000000000000000"
				? "MINTED"
				: data.messageType;

		switch (messageTypeClone) {
			case "MINTED":
				message = "🎉 Minted a new ";
				break;
			case "RECEIVE":
				message = "📤 Received ";
				break;
			case "SEND":
				message = "📤 Sent ";
				break;
			default:
				break;
		}

		switch (data.itemType) {
			case "nft":
				message += `${data.messageType !== "MINTED" ? "an" : ""} NFT`;
				break;
			case "token":
				message += "tokens";
				break;
			default:
				break;
		}

		return `${message} `;
	};

	function toggleCommentsCollapsed() {
		changeCommentsCollapsed(!isCommentsCollapsed);
	}

	return (
		<View className="flex-row items-start px-4 border-b border-border-color pt-2 pb-4">
			<Pressable
				// onPress={() => navigation.navigate(`/profile/${data.profileId}`)}
				className="mr-4 items-center border rounded-full border-border-color overflow-hidden"
			>
				<Image source={data.avatar} className="w-[40px] h-[40px]" />
			</Pressable>
			<View className="flex-1">
				<View>
					<Text className="text-base font-semibold">{data.name}</Text>
					<Text className="text-base font-normal text-gray">{data.date}</Text>
				</View>

				<View>
					<Text className="text-base font-semibold">
						{renderMessage()}{" "}
						{data.from !== "0x0000000000000000000000000000000000000000" ? (
							data.messageType == "RECEIVE" ? (
								<>from&nbsp;</>
							) : (
								<>to&nbsp;</>
							)
						) : (
							<>from Smart contract&nbsp;</>
						)}
					</Text>
					<Text
						onPress={() =>
							Linking.openURL(
								data.blockchainType === "ETHEREUM"
									? `https://rinkeby.etherscan.io/address/${
											data.from == "0x0000000000000000000000000000000000000000"
												? data.contractAddress
												: data.from
									  }`
									: `https://polygonscan.com/address/${
											data.from == "0x0000000000000000000000000000000000000000"
												? data.contractAddress
												: data.from
									  }`
							)
						}
						className="text-main text-base font-semibold"
						rel="noreferrer"
					>
						{data.from == "0x0000000000000000000000000000000000000000"
							? data.contractAddress
							: data.messageType == "RECEIVE"
							? data.from
							: data.to}
					</Text>
				</View>

				<Text className="text-sm font-normal text-gray-darker mt-1">
					{data.info}
				</Text>

				<Text>
					{`http://135.181.216.90:49310/rest/token-images/${data.image}`}
				</Text>

				<View className="relative h-[300px] rounded-lg overflow-hidden mt-1">
					{data.image ? (
						<Image
							source={{
								uri: `http://135.181.216.90:49310/rest/token-images/${data.image}`,
							}}
							resizeMode="cover"
							className="w-full h-full object-center"
						/>
					) : (
						<Image
							source={"../../assets/images/favicon.png"}
							// className="m-auto mt-30 mb-30"
						/>
					)}

					{/* <img
            src={ '/assets/images/eyes.gif'}s
            alt="image"
            className="object-cover"
          /> */}
				</View>
				{!isAddCap && (
					<View className="flex-row mt-2">
						{/* <Pressable
							// onClick={addPost}
							className="rounded-full bg-main py-2 flex-1 mr-3"
						>
							<Text className="text-white text-sm font-semibold text-center">
								{" "}
								Publish
							</Text>
						</Pressable> */}
						<Button
							buttonStyle="py-2"
							style="flex-1 mr-3"
							textStyle="text-white text-sm font-semibold text-center"
							title="Publish"
						/>
						<Button
							buttonStyle="py-2 bg-error-bg"
							style="flex-1"
							textStyle="text-error text-sm font-semibold text-center"
							title="Decline"
						/>

						{/* <Pressable
							// onClick={declinePost}
							className="rounded-full bg-error-bg py-2 flex-1"
						>
							<Text className="text-error text-sm font-semibold text-center">
								Decline
							</Text>
						</Pressable> */}
					</View>
				)}

				<View className="flex-row justify-between items-center mt-2">
					<Text
						onPress={() =>
							Linking.openURL(
								data.blockchainType == "ETHEREUM"
									? `https://rinkeby.etherscan.io/tx/${data.txHash}`
									: `https://mumbai.polygonscan.com/tx/${data.txHash}`
							)
						}
						className="text-sm text-main"
						rel="noreferrer"
					>
						Check on{" "}
						{data.blockchainType === "ETHEREUM" ? "Etherscan" : "Polygonscan"}
					</Text>
					{isAddCap === false && (
						<View className="flex-row items-center">
							<Pressable
								// disabled={isLikeRequest}
								// onClick={likeHandler}
								className={`flex-row items-center justify-center py-1 px-2 ${
									isLikeRequest ? "bg-gray" : ""
								}`}
							>
								<Image
									source={heartIcon}
									className="h-5 w-5"
									resizeMode="contain"
								/>
								<Text className="text-md font-semibold text-gray-darker ml-1">
									{/* {postData?.publication?.stats.totalUpvotes} */}0
								</Text>
							</Pressable>
							<Pressable
								onPress={toggleCommentsCollapsed}
								className="flex-row items-center justify-center py-1 px-2"
							>
								<Image
									source={commentIcon}
									className="h-5 w-5"
									resizeMode="contain"
								/>
								<Text className="text-md font-semibold text-gray-darker ml-1">
									{/* {comments?.publications?.items?.length} */}0
								</Text>
							</Pressable>
							<Pressable
								// onClick={mirrorHandler}
								className="flex-row items-center justify-center py-1 px-2"
							>
								<Image
									source={cycleIcon}
									className="h-5 w-5"
									resizeMode="contain"
								/>
								<Text className="text-md font-semibold text-gray-darker ml-1">
									{/* {totalMirror} */}0
								</Text>
							</Pressable>
						</View>
					)}
				</View>
				<Collapsible collapsed={isCommentsCollapsed}>
					<Text>
						Lorem, ipsum dolor sit amet consectetur adipisicing elit.
						Cupiditate, iure nemo autem doloremque ipsum harum illo magni
						veritatis quae vitae culpa ab corporis. Laborum voluptatibus
						quisquam ipsam accusamus sed nemo veritatis reiciendis optio soluta
						cum modi, omnis ea temporibus. Voluptatibus consequatur tempore
						commodi praesentium quae corrupti numquam beatae aperiam, ipsum
						iusto id, tenetur repellendus unde laboriosam ratione. Quam fugiat
						quas non sed debitis dolore distinctio explicabo molestias, dolorem
						aliquam alias neque perspiciatis, provident autem eum qui voluptates
						incidunt laudantium odio! Culpa suscipit distinctio est ipsam
						dolorem quam libero quisquam, quasi nobis aspernatur nostrum,
						commodi eos porro repudiandae laudantium quas sunt facere. Suscipit
						velit laborum veniam maxime, recusandae voluptate eius cupiditate
						sit iusto expedita vitae sapiente, nostrum deserunt fugiat, quam
						totam? Molestias alias vel inventore veniam. Magni sunt dolorem
						molestiae tempora quos omnis officia cum eligendi impedit
						consequuntur debitis, similique provident tenetur totam vitae quasi,
						repellendus qui excepturi illum dolores! At delectus, neque facilis
						natus voluptatem eos quis nobis ea magnam explicabo autem vitae iste
						pariatur labore accusamus quisquam doloribus libero, sit illum quas
						vero qui nam. Impedit, aliquid ullam. Hic ducimus corrupti nemo
						praesentium non! Quia qui libero voluptatem ut animi illum possimus.
						Deleniti repudiandae dolorum temporibus cupiditate dolores iusto
						itaque ratione, consequatur laborum quo ullam aperiam explicabo
						voluptatum, officiis tenetur vel ipsum tempora quae alias officia
						atque quisquam nostrum? Sed quaerat praesentium, accusantium
						reiciendis iure soluta labore consequuntur, explicabo modi placeat
						ut necessitatibu
					</Text>
				</Collapsible>
			</View>
		</View>
	);
}

export default Post;
