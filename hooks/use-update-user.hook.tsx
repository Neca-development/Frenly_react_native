import { useEffect } from "react";
import {
  useGetUserInfoQuery,
  useUploadImageMutation,
  useUploadInfoMutation,
} from "../store/auth/auth.api";

export function useUpdate(address: string) {
  const {
    data: userInfo,
    refetch: refetchUserInfo,
    ...otherData
  } = useGetUserInfoQuery({
    address,
  });

  const [uploadImage] = useUploadImageMutation();

  const [updateUserInfo] = useUploadInfoMutation();

  useEffect(() => {
    refetchUserInfo();
  }, [address, refetchUserInfo]);

  return {
    avatar: userInfo?.data?.avatar,
    name: userInfo?.data.username,
    description: userInfo?.data.description,
    userInfo,
    refetchUserInfo,
    updateUserInfo,
    uploadImage,
    isLoading: otherData.isLoading,
  };
}
