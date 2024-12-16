import { useParams } from "next/navigation";

export const useServerId = () => {
  const params = useParams<{ serverId: string }>();

  if (params.serverId) {
    return params.serverId;
  }

  return;
};
