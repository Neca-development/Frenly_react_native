// import { WalletConnect } from "@walletconnect/client";
import { ethers, utils } from "ethers";

// eslint-disable-next-line unicorn/prefer-module
const omitDeep = require("omit-deep");

// @ts-ignore

export const signedTypeData = async (
  domain: any,
  types: any,
  value: any,
  signer: any
) => {
  const typesWithoutTypeName = omitDeep(types, "__typename");
  const parasha = {
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
      ...typesWithoutTypeName,
    },
    domain: omitDeep(domain, "__typename"),
    value: omitDeep(value, "__typename"),
  };
  return signer.signTypedData([
    signer.accounts[0],
    JSON.stringify({ primaryType: "Mail", ...parasha }),
  ]);
};

export const splitSignature = (signature: string) => {
  return utils.splitSignature(signature);
};
