import { useMutation } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client)["api"]["user"]["logout"]["$get"]
>;

export const useLogout = () => {
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client["api"]["user"]["logout"]["$get"]();
      return await response.json();
    },
    onSuccess: () => {
      window.location.reload();
    },
  });

  return mutation;
};
