import { useQueryState, parseAsBoolean } from "nuqs";

export const useLeaveModal = () => {
  const [isLeave, setIsLeave] = useQueryState(
    "leave-modal",
    parseAsBoolean.withOptions({ clearOnDefault: true }).withDefault(false)
  );

  return { isLeave, setIsLeave };
};
