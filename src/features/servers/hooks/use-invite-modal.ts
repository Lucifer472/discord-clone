import { useQueryState, parseAsString } from "nuqs";

export const useInviteModal = () => {
  const [isInvite, setIsInvite] = useQueryState(
    "invite-modal",
    parseAsString.withOptions({ clearOnDefault: true }).withDefault("")
  );

  return { isInvite, setIsInvite };
};
