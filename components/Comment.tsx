import moment from "moment";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";

export interface IComment {
	metadata: any;
	profile: any;
	createdAt: string;
	id: string;
}

const Comment = ({ metadata, profile, createdAt }: IComment) => {
	const commentDate = moment(createdAt).fromNow(true);

	return (
		<ScrollView horizontal>
			<View className="flex-row items-center mb-2">
				<View className="mr-4 flex items-center border rounded-full border-border-color overflow-hidden self-start">
					<Image
						source="/assets/images/temp-avatar.png"
						alt={profile.handle}
						width={24}
						height={24}
					/>
				</View>

				<View className="w-full border-b-[1px] border-border-color pb-4">
					<View className="flex-row justify-between">
						<Text className="text-base font-semibold">{profile?.handle}</Text>
						<Text className="text-sm text-gray">{commentDate}</Text>
					</View>
					<Text className="text-base font-normal text-gray">
						{metadata.content}
					</Text>
				</View>
			</View>
		</ScrollView>
	);
};

export default Comment;
