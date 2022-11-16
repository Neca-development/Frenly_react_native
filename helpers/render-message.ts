import { IPostData } from "../components/post/post";

export default function renderMessage(data: IPostData) {
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
}
