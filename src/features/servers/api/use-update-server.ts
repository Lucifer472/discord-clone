import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client)["api"]["server"][":serverId"]["$patch"],
  200
>;

type RequestType = InferRequestType<
  (typeof client)["api"]["server"][":serverId"]["$patch"]
>;

export const useUpdateServer = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client["api"]["server"][":serverId"]["$patch"]({
        json,
        param,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return await response.json();
    },
    onSuccess: (res) => {
      router.refresh();
      queryClient.invalidateQueries({ queryKey: [res.success.id] });
    },
  });

  return mutation;
};
