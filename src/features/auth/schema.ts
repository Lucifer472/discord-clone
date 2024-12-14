import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Minimum 8 Characters Required!"),
});

export const RegisterSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8, "Minimum 8 Characters Required!"),
});

export const UpdateUsernameSchema = z.object({
  username: z.string().min(1),
});

export const UpdateImageSchema = z.object({
  image: z.string().min(1),
});
