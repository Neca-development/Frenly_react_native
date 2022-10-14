import moment from "moment";
import Image from "next/image";
import React from "react";

export interface IComment {
	metadata: any;
	profile: any;
	createdAt: string;
	id: string;
}

const Comment = ({ metadata, profile, createdAt }: IComment) => {
	const commentDate = moment(createdAt).fromNow(true);

	return (
		<figure className="flex items-center mb-2">
			<div className="mr-4 flex items-center border rounded-full border-border-color overflow-hidden self-start">
				<Image
					src="/assets/images/temp-avatar.png"
					alt={profile.handle}
					width={24}
					height={24}
				/>
			</div>

			<figcaption className="w-full border-b-[1px] border-border-color pb-4">
				<div className="flex justify-between">
					<div className="text-base font-semibold">{profile?.handle}</div>
					<div className="text-sm text-gray">{commentDate}</div>
				</div>
				<div className="text-base font-normal text-gray">
					{metadata.content}
				</div>
			</figcaption>
		</figure>
	);
};

export default Comment;
