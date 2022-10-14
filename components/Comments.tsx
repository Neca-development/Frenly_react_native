import React, { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import SendIcon from "../assets/icons/send-icon";
import { createComment } from "../store/lens/comment/create-comment";
import Comment, { IComment } from "./Comment";
import { useLoaderContext } from "./contexts/loader-context";

interface ICommentsProps {
	pubId: string | number;
	profileId: string;
	data: any;
	refetchComment: Function;
}

function Comments(props: ICommentsProps) {
	const { data, refetchComment } = props;

	const [commentValue, setCommentValue] = useState("");

	const { isLoading, setIsLoading } = useLoaderContext();

	async function commentHandler() {
		setIsLoading(true);
		const res = await fetch("/api/comment", {
			method: "POST",
			body: JSON.stringify({ comment: commentValue, pubId }),
		});
		const data = await res.json();
		setIsLoading(false);

		setCommentValue("");

		const signer = library?.getSigner();

		setIsLoading(true);
		await createComment(profileId, pubId, data.contentURI, signer);
		setIsLoading(false);
		refetchComment();
	}

	useEffect(() => {
		console.log("data", data?.length);
	}, [data]);

	return (
		<View className="py-4 relative">
			<Text className="text-xl font-bold mb-4">Comments</Text>
			{data?.publications?.items?.map((comment: IComment) => (
				<Comment key={comment.id} {...comment} />
			))}
			<View className="w-full pt-4 pb-4 flex-row">
				<View className="flex rounded-2xl bg-light-gray px-4 py-2 w-full mr-2">
					<TextInput
						value={commentValue}
						onChange={(e) => setCommentValue(e.target.value)}
						type="text"
						className="outline-none w-full"
						placeholder="Comment"
					/>
				</View>
				<Pressable onPress={commentHandler}>
					<View className="flex items-center justify-center py-1 px-2">
						<SendIcon />
					</View>
				</Pressable>
			</View>
		</View>
	);
}

export default Comments;
