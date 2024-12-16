import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useServerId } from "../hooks/use-server-id";

type ResponseType = InferResponseType<
  (typeof client)["api"]["server"]["generate-new-code"][":serverId"]["$patch"],
  200
>;

type RequestType = InferRequestType<
  (typeof client)["api"]["server"]["generate-new-code"][":serverId"]["$patch"]
>;

export const useUpdateServerInviteCode = () => {
  const router = useRouter();
  const query = useQueryClient();
  const serverId = useServerId();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client["api"]["server"]["generate-new-code"][
        ":serverId"
      ]["$patch"]({
        param,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return await response.json();
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: [serverId] });
      router.refresh();
    },
  });

  return mutation;
};
