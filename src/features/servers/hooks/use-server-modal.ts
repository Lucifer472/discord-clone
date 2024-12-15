import { useQueryState, parseAsBoolean } from "nuqs";

export const useServerModal = () => {
  const [isServer, setIsServer] = useQueryState(
    "server-modal",
    parseAsBoolean.withOptions({ clearOnDefault: true }).withDefault(false)
  );

  return { isServer, setIsServer };
};
