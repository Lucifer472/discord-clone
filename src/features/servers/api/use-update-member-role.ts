import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useServerId } from "../hooks/use-server-id";

type ResponseType = InferResponseType<
  (typeof client)["api"]["server"]["update-member"][":serverId"][":memberId"][":role"]["$patch"]
>;

type RequestType = InferRequestType<
  (typeof client)["api"]["server"]["update-member"][":serverId"][":memberId"][":role"]["$patch"]
>;

export const useUpdateMemberRole = () => {
  const query = useQueryClient();
  const serverId = useServerId();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client["api"]["server"]["update-member"][
        ":serverId"
      ][":memberId"][":role"]["$patch"]({
        param,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return await response.json();
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: [serverId] });
    },
  });

  return mutation;
};
