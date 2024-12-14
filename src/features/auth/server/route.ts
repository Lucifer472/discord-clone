import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/lib/db";
import { SessionMiddleware } from "@/lib/session";

import { UpdateImageSchema, UpdateUsernameSchema } from "../schema";
import { signOut } from "@/auth";

const app = new Hono()
  .get("/current", SessionMiddleware, (c) => {
    const user = c.get("user");
    return c.json({ user }, 200);
  })
  .patch(
    "/username",
    SessionMiddleware,
    zValidator("json", UpdateUsernameSchema),
    async (c) => {
      const user = c.get("user");

      const { username } = c.req.valid("json");

      try {
        const isExists = await db.user.findUnique({
          where: { username },
        });

        if (isExists) {
          return c.json({ message: "Username already exists" }, 400);
        }

        await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            username,
          },
        });

        return c.json({ success: "Username Updated" }, 200);
      } catch (error) {
        return c.json({ error }, 500);
      }
    }
  )
  .patch(
    "/image",
    SessionMiddleware,
    zValidator("json", UpdateImageSchema),
    async (c) => {
      const user = c.get("user");
      const { image } = c.req.valid("json");

      try {
        await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            image,
          },
        });

        return c.json({ success: "Image Updated" }, 200);
      } catch (error) {
        return c.json({ error }, 500);
      }
    }
  )
  .get("/logout", SessionMiddleware, async (c) => {
    try {
      await signOut();
      return c.json({ success: "request was ok" }, 200);
    } catch (error) {
      return c.json({ error }, 500);
    }
  });

export default app;
