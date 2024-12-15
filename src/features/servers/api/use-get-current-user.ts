import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetServerById = ({ serverId }: { serverId: string }) => {
  const query = useQuery({
    queryKey: [serverId],
    queryFn: async () => {
      const response = await client["api"]["server"][":serverId"]["$get"]({
        param: { serverId },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return await response.json();
    },
  });

  return query;
};
