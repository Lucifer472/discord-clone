import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client)["api"]["channel"]["create"][":serverId"]["$post"]
>;

type RequestType = InferRequestType<
  (typeof client)["api"]["channel"]["create"][":serverId"]["$post"]
>;

export const useCreateChannel = () => {
  const router = useRouter();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client["api"]["channel"]["create"][":serverId"][
        "$post"
      ]({
        json,
        param,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return await response.json();
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  return mutation;
};
