import { useQueryState, parseAsBoolean } from "nuqs";

export const useMemberModal = () => {
  const [isMember, setIsMember] = useQueryState(
    "Member-Modal",
    parseAsBoolean.withOptions({ clearOnDefault: true }).withDefault(false)
  );

  return { isMember, setIsMember };
};
