import { useQueryState, parseAsBoolean } from "nuqs";

export const useDeleteModal = () => {
  const [isDelete, setIsDelete] = useQueryState(
    "delete-modal",
    parseAsBoolean.withOptions({ clearOnDefault: true }).withDefault(false)
  );

  return { isDelete, setIsDelete };
};
