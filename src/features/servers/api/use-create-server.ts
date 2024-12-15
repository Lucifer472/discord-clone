import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client)["api"]["server"]["create"]["$post"],
  200
>;

type RequestType = InferRequestType<
  (typeof client)["api"]["server"]["create"]["$post"]
>;

export const useCreateServer = () => {
  const router = useRouter();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client["api"]["server"]["create"]["$post"]({
        json,
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
