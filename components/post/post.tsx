import React, { useEffect, useState } from "react";
import { Image, Linking, Pressable, Text, View } from "react-native";
import Button from "../Button";

import { useMutation, useQuery } from "@apollo/client";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { id } from "ethers/lib/utils";
import Collapsible from "react-native-collapsible";
import commentIcon from "../../assets/icons/comment.png";
import cycleIcon from "../../assets/icons/cycle.png";
import heartIcon from "../../assets/icons/heart.png";
import { useGetWalletProfileId } from "../../contract/lens-hub.api";
import {
	useBindWithLensIdMutation,
	useMirrorPostMutation,
	usePublishContentMutation,
	useRemoveContentMutation,
} from "../../store/auth/auth.api";
import { CREATE_POST_TYPED_DATA } from "../../store/lens/add-post.mutation";
import { GET_PUBLICATIONS } from "../../store/lens/get-publication.query";
import { LIKE_TO_POST } from "../../store/lens/post/add-like.mutation";
import { CREATE_MIRROR_TYPED_DATA } from "../../store/lens/post/add-mirror.mutation";
import { CANCEL_LIKE_TO_POST } from "../../store/lens/post/cancel-like.mutation";
import { GET_POST_QUERY } from "../../store/lens/post/get-post.query";
import { GET_REACTIONS } from "../../store/lens/post/get-reaction.query";
import Comments from "../Comments";

interface IPostProps {
	isAddCap: boolean;
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
	const { data, isAddCap } = props;
	const [isCommentsCollapsed, changeCommentsCollapsed] = useState(true);

	const connector = useWalletConnect();

	const { value: myProfileId } = useGetWalletProfileId(
		connector.accounts[0] || ""
	);
	// const { state: postState, send: postWithSig } = usePostWithSig();
	// const { state: mirrorState, send: mirrorWithSig } = useMirrorWithSig();
	const [addPostToLens, postToLensData] = useMutation(CREATE_POST_TYPED_DATA);
	const [publishContent] = usePublishContentMutation();
	const [bindContentIdWithLens] = useBindWithLensIdMutation();
	const [removeContent] = useRemoveContentMutation();
	const [isLoading, setIsLoading] = useState(false);
	const [likePostToLens, dataLikes] = useMutation(LIKE_TO_POST);
	const [cancelLikePostToLens, dataCancelLikes] =
		useMutation(CANCEL_LIKE_TO_POST);
	const [isLikeRequest, setIsLikeRequest] = useState(false);

	const { data: comments, refetch: refetchComments } = useQuery(
		GET_PUBLICATIONS,
		{
			variables: {
				request: {
					commentsOf: data.id,
				},
			},
		}
	);

	const { data: postData, refetch: refetchPost } = useQuery(GET_POST_QUERY, {
		variables: {
			request: {
				publicationId: data.id,
			},
		},
	});

	const [mirrorPublication, dataMirrorPublication] = useMutation(
		CREATE_MIRROR_TYPED_DATA
	);

	const { data: publicationIsReact, refetch } = useQuery(GET_REACTIONS, {
		variables: {
			request: {
				publicationIds: [id],
			},
			requestReaction: {
				profileId: myProfileId,
			},
		},
		skip: typeof id == "number",
	});

	const [mirrorPost] = useMirrorPostMutation();

	useEffect(() => {
		console.log(
			"🚀 ~ file: post.tsx ~ line 123 ~ useEffect ~ myProfileId",
			myProfileId
		);
	}, [myProfileId]);

	// const addPost = async () => {
	// 	setIsLoading(true);
	// 	if (id) {
	// 		try {
	// 			const publishedPost = await publishContent({
	// 				contentId: id.toString(),
	// 			});
	// 			// @ts-ignore

	// 			const typeD = await addPostToLens({
	// 				variables: {
	// 					request: {
	// 						profileId: myProfileId,
	// 						// @ts-ignore
	// 						contentURI: publishedPost.data.data,
	// 						collectModule: {
	// 							revertCollectModule: true,
	// 						},
	// 						referenceModule: {
	// 							followerOnlyReferenceModule: false,
	// 						},
	// 					},
	// 				},
	// 			});

	// 			const typedData = typeD?.data?.createPostTypedData?.typedData;

	// 			const signature = await signedTypeData(
	// 				typedData.domain,
	// 				typedData.types,
	// 				typedData.value,
	// 				library?.getSigner()
	// 			);

	// 			const { v, r, s } = splitSignature(signature);

	// 			const receipt = await postWithSig({
	// 				profileId: typedData.value.profileId,
	// 				contentURI: typedData.value.contentURI,
	// 				collectModule: typedData.value.collectModule,
	// 				collectModuleInitData: typedData.value.collectModuleInitData,
	// 				referenceModule: typedData.value.referenceModule,
	// 				referenceModuleInitData: typedData.value.referenceModuleInitData,
	// 				sig: {
	// 					v,
	// 					r,
	// 					s,
	// 					deadline: typedData.value.deadline,
	// 				},
	// 			});
	// 			await bindContentIdWithLens({
	// 				contentId: id.toString(),
	// 				lensId:
	// 					Number(receipt?.logs[0]?.topics[2]).toString(16).length === 1
	// 						? `0x${Number(receipt?.logs[0]?.topics[1]).toString(
	// 								16
	// 						  )}-0x0${Number(receipt?.logs[0]?.topics[2]).toString(16)}`
	// 						: `0x${Number(receipt?.logs[0]?.topics[1]).toString(
	// 								16
	// 						  )}-0x${Number(receipt?.logs[0]?.topics[2]).toString(16)}`,
	// 			});
	// 		} catch (error) {
	// 			console.log(error);
	// 		} finally {
	// 			setIsLoading(false);
	// 			refetch();
	// 			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
	// 			refetchInfo && (await refetchInfo());
	// 		}
	// 	}
	// };

	// const declinePost = async () => {
	// 	if (id) {
	// 		await removeContent({ contentId: id.toString() });
	// 	}
	// 	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
	// 	refetchInfo && (await refetchInfo());
	// };

	// const likeHandler = async () => {
	// 	console.log("myProfileId", myProfileId);
	// 	setIsLikeRequest(true);
	// 	if (myProfileId) {
	// 		console.log(id);
	// 		console.log(
	// 			"REACTION BEFORE",
	// 			publicationIsReact.publications.items[0].reaction
	// 		);

	// 		if (publicationIsReact.publications.items[0].reaction == null) {
	// 			try {
	// 				setIsLikeRequest(true);
	// 				await likePostToLens({
	// 					variables: {
	// 						request: {
	// 							profileId: myProfileId,
	// 							reaction: "UPVOTE",
	// 							publicationId: id,
	// 						},
	// 					},
	// 				});
	// 			} catch (error) {
	// 				console.error(error);
	// 			}
	// 			setIsLikeRequest(false);
	// 		}

	// 		if (publicationIsReact.publications.items[0].reaction == "UPVOTE") {
	// 			setIsLikeRequest(true);
	// 			cancelLikePostToLens({
	// 				variables: {
	// 					request: {
	// 						profileId: myProfileId,
	// 						reaction: "UPVOTE",
	// 						publicationId: id,
	// 					},
	// 				},
	// 			});
	// 			setIsLikeRequest(false);
	// 		}
	// 	}

	// 	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
	// 	refetchInfo && (await refetchInfo());
	// 	await refetch();
	// 	await refetchPost();
	// 	setIsLikeRequest(false);
	// 	console.log(
	// 		"REACTION AFTER",
	// 		publicationIsReact.publications.items[0].reaction
	// 	);
	// };

	// const mirrorHandler = async () => {
	// 	const typeD = await mirrorPublication({
	// 		variables: {
	// 			request: {
	// 				profileId: myProfileId,
	// 				publicationId: id,
	// 				referenceModule: null,
	// 			},
	// 		},
	// 	});
	// 	console.log(typeD);

	// 	const typedData = typeD?.data?.createMirrorTypedData?.typedData;

	// 	const signer = library?.getSigner();

	// 	// if (!typedData) return
	// 	const signature = await signedTypeData(
	// 		typedData.domain,
	// 		typedData.types,
	// 		typedData.value,
	// 		signer
	// 	);

	// 	const { v, r, s } = splitSignature(signature);

	// 	const tx = await mirrorWithSig({
	// 		profileId: typedData.value.profileId,
	// 		profileIdPointed: typedData.value.profileIdPointed,
	// 		pubIdPointed: typedData.value.pubIdPointed,
	// 		referenceModuleData: typedData.value.referenceModuleData,
	// 		referenceModule: typedData.value.referenceModule,
	// 		referenceModuleInitData: typedData.value.referenceModuleInitData,
	// 		sig: {
	// 			v,
	// 			r,
	// 			s,
	// 			deadline: typedData.value.deadline,
	// 		},
	// 	});

	// 	console.log(tx?.logs);

	// 	const newLensId =
	// 		Number(tx?.logs[0]?.topics[2]).toString(16).length === 1
	// 			? `0x${Number(tx?.logs[0]?.topics[1]).toString(16)}-0x0${Number(
	// 					tx?.logs[0]?.topics[2]
	// 			  ).toString(16)}`
	// 			: `0x${Number(tx?.logs[0]?.topics[1]).toString(16)}-0x${Number(
	// 					tx?.logs[0]?.topics[2]
	// 			  ).toString(16)}`;

	// 	console.log("ids", id, newLensId);

	// 	await mirrorPost({ lensId: id as string, newLensId });

	// 	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
	// 	refetchInfo && (await refetchInfo());
	// };

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

				<View className="relative h-[300px] rounded-lg overflow-hidden mt-1">
					{data.image !== null ? (
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
				{isAddCap && (
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
									{postData?.publication?.stats.totalUpvotes}
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
									{comments?.publications?.items?.length ?? 0}
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
					<Comments
						refetchComment={refetchComments}
						data={comments}
						pubId={data.id}
						profileId={myProfileId}
					/>
				</Collapsible>
			</View>
		</View>
	);
}

export default Post;
