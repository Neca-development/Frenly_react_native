import React from "react";
import { PostTypeEnum } from "../../common/helpers";
import Post, { IPostData } from "../post/post";
import PostZeroex from "../post/post-zeroex";

const PostSwitcher = (props: IPostData) => {
  if (props.postType != PostTypeEnum.NFT_TRANSFER) {
    return <PostZeroex {...props} />;
  }
  return <Post postType={props.postType} {...props} />;
};
export default React.memo(PostSwitcher);
