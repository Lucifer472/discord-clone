import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { v4 as uuidV4 } from "uuid";

import { ServerSchema } from "../schema";

import { db } from "@/lib/db";
import { SessionMiddleware } from "@/lib/session";

const app = new Hono().post(
  "/create",
  SessionMiddleware,
  zValidator("json", ServerSchema),
  async (c) => {
    const user = c.get("user");
    const { name, image } = c.req.valid("json");

    if (!image || image instanceof File) {
      return c.json({ error: "Invalid Image" }, 400);
    }

    try {
      const inviteCode = uuidV4();

      const server = await db.server.create({
        data: {
          image,
          name,
          userId: user.id,
          inviteCode,
          channels: {
            create: [
              {
                name: "general",
                userId: user.id,
              },
            ],
          },
          member: {
            create: [
              {
                userId: user.id,
                role: "ADMIN",
              },
            ],
          },
        },
      });

      return c.json({ data: server }, 200);
    } catch (error) {
      return c.json({ error }, 500);
    }
  }
);

export default app;
