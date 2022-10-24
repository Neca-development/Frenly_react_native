import { Contract, ethers } from "ethers";

import {
	lensHubABI,
	lensHubContract,
} from "../../../contract/lens-hub.contract";
import { signedTypeData, splitSignature } from "../post/create-post.utils";
import { createCommentTypedData } from "./create-comment-typed-date";

export const createComment = async (
	profileId: string,
	pubId: string | number,
	contentURI: string,
	signer: any
) => {
	console.log(profileId, pubId, contentURI, signer);

	// hard coded to make the code example clear
	const createCommentRequest = {
		profileId,
		publicationId: pubId,
		contentURI,
		collectModule: {
			revertCollectModule: true,
		},
		referenceModule: {
			followerOnlyReferenceModule: false,
		},
		// referenceModule: {
		//   commentsRestricted: false,
		//   mirrorsRestricted: false,
		//   degreesOfSeparation: 4,
		// },
	};
	try {
		const result = await createCommentTypedData(createCommentRequest);
		const { typedData } = result.data.createCommentTypedData;

		const signature = await signedTypeData(
			typedData.domain,
			typedData.types,
			typedData.value,
			signer
		);
		const { v, r, s } = splitSignature(signature);

		const lensHub = new ethers.Contract(lensHubContract, lensHubABI, signer);

		const tx = await lensHub.commentWithSig({
			profileId: typedData.value.profileId,
			contentURI: typedData.value.contentURI,
			profileIdPointed: typedData.value.profileIdPointed,
			pubIdPointed: typedData.value.pubIdPointed,
			referenceModuleData: typedData.value.referenceModuleData,
			collectModule: typedData.value.collectModule,
			collectModuleInitData: typedData.value.collectModuleInitData,
			referenceModule: typedData.value.referenceModule,
			referenceModuleInitData: typedData.value.referenceModuleInitData,
			sig: {
				v,
				r,
				s,
				deadline: typedData.value.deadline,
			},
		});

		await tx.wait(1);
		console.log("🚀 ~ file: create-comment.ts ~ line 66 ~ tx.hash", tx.hash);
	} catch (error) {
		console.error("Something went wrong", error);
	}

	// 0x64464dc0de5aac614a82dfd946fc0e17105ff6ed177b7d677ddb88ec772c52d3
	// you can look at how to know when its been indexed here:
	//   - https://docs.lens.dev/docs/has-transaction-been-indexed
};
