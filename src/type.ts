import { Member, Server, User } from "@prisma/client";

export type LayoutType = {
  children: React.ReactNode;
};

export type ServerWithMembersWithProfile = Server & {
  member: (Member & { user: User })[];
};
