import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client)["api"]["server"]["leave-server"][":serverId"]["$patch"]
>;

type RequestType = InferRequestType<
  (typeof client)["api"]["server"]["leave-server"][":serverId"]["$patch"]
>;

export const useLeaveMember = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client["api"]["server"]["leave-server"][
        ":serverId"
      ]["$patch"]({
        param,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return await response.json();
    },
  });

  return mutation;
};
