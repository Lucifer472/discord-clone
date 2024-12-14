import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetCurrentUser = () => {
  const query = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await client["api"]["user"]["current"]["$get"]();

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return await response.json();
    },
  });

  return query;
};
