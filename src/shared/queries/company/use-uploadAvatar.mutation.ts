

import { uploadAvatarGeneric } from "@/shared/services/uploadAvatar.service";
import { useMutation } from "@tanstack/react-query";

export interface UploadAvatarProps {
  segment: string;
  avatarUri: string;
  id: number;
}


export function useUploadAvatarGenericMutation<T>() {
  return useMutation({
    mutationFn: (variables: UploadAvatarProps) =>
      uploadAvatarGeneric<T>(
        variables.segment,
        variables.avatarUri,
        variables.id
      ),
  });
}
