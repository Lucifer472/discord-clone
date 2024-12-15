"use client";

import { UsernameModal } from "@/features/auth/username-model";
import { CreateServerModal } from "@/features/servers/create-server-modal";
import { InviteModal } from "@/features/servers/invite-modal";

export const ModalProvider = () => {
  return (
    <>
      <UsernameModal />
      <CreateServerModal />
      <InviteModal />
    </>
  );
};
