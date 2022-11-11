import ethers, { utils } from "ethers";

const omitDeep = require("omit-deep");

export const createLensMirrorIdParams = (
  typedData: any,
  signatureAfterSplit: ethers.Signature
) => {
  const { v, r, s } = signatureAfterSplit;
  return {
    profileId: typedData.value.profileId,
    profileIdPointed: typedData.value.profileIdPointed,
    pubIdPointed: typedData.value.pubIdPointed,
    referenceModuleData: typedData.value.referenceModuleData,
    referenceModule: typedData.value.referenceModule,
    referenceModuleInitData: typedData.value.referenceModuleInitData,
    sig: {
      v,
      r,
      s,
      deadline: typedData.value.deadline,
    },
  };
};

export const createLensPostIdParams = (
  typedData: any,
  signatureAfterSplit: ethers.Signature
) => {
  const { v, r, s } = signatureAfterSplit;
  return {
    profileId: typedData.value.profileId,
    contentURI: typedData.value.contentURI,
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
  };
};

export const createPostOptionsInfo = (
  profileId: number,
  contentMetadata: any
) => {
  return {
    variables: {
      request: {
        profileId: profileId,
        contentURI: contentMetadata.data,
        collectModule: {
          revertCollectModule: true,
        },
        referenceModule: {
          followerOnlyReferenceModule: false,
        },
      },
    },
  };
};

export const splitSignature = (signature: string) => {
  return utils.splitSignature(signature);
};

export async function getSignatureFromTypedData(connector, typedData) {
  let signature;
  try {
    signature = await connector.signTypedData([
      connector.accounts[0],
      JSON.stringify({
        types: {
          EIP712Domain: [
            {
              name: "name",
              type: "string",
            },
            {
              name: "version",
              type: "string",
            },
            {
              name: "chainId",
              type: "uint256",
            },
            {
              name: "verifyingContract",
              type: "address",
            },
          ],
          ...omitDeep(typedData.types, "__typename"),
        },
        primaryType: Object.keys(typedData.types)[0],
        domain: omitDeep(typedData.domain, "__typename"),
        message: omitDeep(typedData.value, "__typename"),
      }),
    ]);
  } catch (error) {
    console.log("SIGNATURE ERR", error);
  }
  return signature;
}
