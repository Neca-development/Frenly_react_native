import { SERVER_URL } from "./../constants/Api";
import { IPostData } from "./../components/post/post";
import renderMessage from "./render-message";

export default function createTwitterLink(data: IPostData) {
  return `https://twitter.com/intent/tweet?hashtags=Frenly,LENS&url=${`${SERVER_URL}token-images/${data.image}`}&text=${`I use 👀 Frenly ${renderMessage(
    data
  )} ${
    data.from == "0x0000000000000000000000000000000000000000"
      ? data.contractAddress
      : data.messageType == "RECEIVE"
      ? data.to
      : data.from
  } ${
    data.from !== "0x0000000000000000000000000000000000000000"
      ? data.messageType == "RECEIVE"
        ? "from"
        : "to"
      : "from Smart contract"
  } ${
    data.from == "0x0000000000000000000000000000000000000000"
      ? data.contractAddress
      : data.messageType == "RECEIVE"
      ? data.from
      : data.to
  }
      Find and post by gm.frenly.cc
      `} ${
    data.blockchainType == "ETHEREUM"
      ? `https://etherscan.io/tx/${data.txHash}`
      : `https://mumbai.polygonscan.com/tx/${data.txHash}`
  }
    `;
}
