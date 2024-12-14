import { z } from "zod";

export const ServerSchema = z.object({
  name: z.string().min(1, "Name is Required for Server"),
  image: z.union([
    z.instanceof(File),
    z.string().transform((value) => (value === "" ? undefined : value)),
  ]),
});
