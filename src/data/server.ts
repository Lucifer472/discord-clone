import { db } from "@/lib/db";

export const getFirstServerByUserId = async (userId: string) => {
  try {
    return await db.server.findFirst({
      where: {
        userId,
      },
    });
  } catch {
    return null;
  }
};

export const findManyServerByUserId = async (userId: string) => {
  try {
    return await db.server.findMany({
      where: {
        member: {
          some: {
            userId,
          },
        },
      },
    });
  } catch {
    return null;
  }
};
