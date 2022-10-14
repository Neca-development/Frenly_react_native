import React, { useEffect } from "react";
import { Image, SafeAreaView, ScrollView, Text, View } from "react-native";
import EyesIcon from "../assets/icons/eyes";
import Button from "../components/Button";
import Post from "../components/post/post";

import { useQuery } from "@apollo/client";
import mockImg from "../assets/images/wolf.jpeg";
import safeViewAndroid from "../helpers/safe-view-android";
import { useGetFeedQuery } from "../store/auth/auth.api";
import { GET_PUBLICATIONS } from "../store/lens/get-publication.query";

import loader from "../assets/gifs/duck_loader.gif";

function Feed() {
	const { data: dataFeeds, refetch: refetchFeeds } = useGetFeedQuery({
		take: 10,
		skip: 0,
	});
	const drafts = useQuery(GET_PUBLICATIONS, {
		variables: {
			request: {
				publicationIds: dataFeeds?.data.map((el: any) => el.lensId),
				// profileId: accountId,
				// publicationTypes: ['POST', 'COMMENT', 'MIRROR'],
				// limit: 10,
			},
		},
	});

	const refetchInfo = async () => {
		refetchFeeds();
		await drafts.refetch();
	};

	useEffect(() => {
		console.log({ dataFeeds, drafts });
	}, [dataFeeds, drafts]);

	return (
		<SafeAreaView style={safeViewAndroid.AndroidSafeArea}>
			<View className="w-full pt-4 px-4 border-b border-border-color pb-3">
				<View className="flex-row justify-between items-center">
					<EyesIcon />
					<Button title="Add post"></Button>
				</View>
			</View>
			<ScrollView>
				<Text className="text-3xl font-bold mt-4 px-4">Frenly Feed</Text>
				{dataFeeds ? (
					drafts?.data?.publications?.items.map((el: any) => {
						const {
							createdAt,
							collectModule,
							profile,
							metadata,
							id,
							stats,
							mirrorOf,
						} = el;

						let index;
						dataFeeds?.data?.forEach((element: any, _index: number) => {
							if (element.lensId == id) {
								index = _index;
							}
						});

						return (
							<Post
								isAddCap={false}
								isLikeRequest={false}
								key={id}
								data={{
									avatar: mockImg,
									from: metadata?.attributes[4].value,
									to: metadata?.attributes[3].value,
									contractAddress: metadata?.attributes[1].value,
									info: metadata.description,
									image: dataFeeds?.data[Number(index)]?.image,
									name: profile.handle,
									date: createdAt,
									showDate: false,
									messageType: metadata.attributes[5].value,
									itemType: "nft",
									totalUpvotes: stats.totalUpvotes,
									totalMirror: stats.totalAmountOfMirrors,
									id: id,
									profileId: profile.id,
									refetchInfo: refetchInfo,
									txHash: metadata.attributes[8].value,
									blockchainType: metadata.attributes[7].value,
									isMirror: dataFeeds?.data[Number(index)]?.isMirror,
									handleMirror: mirrorOf?.profile.handle,
								}}
							></Post>
						);
					})
				) : (
					<Image source={loader} />
				)}
			</ScrollView>
		</SafeAreaView>
	);
}

export default Feed;
