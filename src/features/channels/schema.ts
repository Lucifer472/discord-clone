import { z } from "zod";
import { ChannelType } from "@prisma/client";

export const ChannelSchema = z.object({
  name: z
    .string()
    .min(1, "Name is Required for Channel")
    .refine((name) => name !== "general", "Channel name can't be 'general'"),
  type: z.nativeEnum(ChannelType),
});
