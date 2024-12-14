import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client)["api"]["user"]["image"]["$patch"]
>;

type RequestType = InferRequestType<
  (typeof client)["api"]["user"]["image"]["$patch"]
>;

export const useSetImage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client["api"]["user"]["image"]["$patch"]({
        json,
      });

      return await response.json();
    },
    onSuccess: async () => {
      router.refresh();
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Update Successfully!");
    },
  });

  return mutation;
};
