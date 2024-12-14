import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client)["api"]["user"]["username"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client)["api"]["user"]["username"]["$patch"]
>;

export const useSetUsername = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client["api"]["user"]["username"]["$patch"]({
        json,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return await response.json();
    },

    onSuccess: async () => {
      toast.success("Username set Successfully!");
      router.refresh();
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return mutation;
};
