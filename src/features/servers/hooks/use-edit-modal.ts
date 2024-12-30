import { useQueryState, parseAsBoolean } from "nuqs";

export const useEditModal = () => {
  const [isEdit, setIsEdit] = useQueryState(
    "edit-modal",
    parseAsBoolean.withOptions({ clearOnDefault: true }).withDefault(false)
  );

  return { isEdit, setIsEdit };
};
