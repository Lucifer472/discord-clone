import { useQueryState, parseAsBoolean } from "nuqs";

export const useChannelModal = () => {
  const [isChannel, setIsChannel] = useQueryState(
    "channel-modal",
    parseAsBoolean.withOptions({ clearOnDefault: true }).withDefault(false)
  );

  return { isChannel, setIsChannel };
};
