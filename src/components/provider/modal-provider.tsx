"use client";

import { UsernameModal } from "@/features/auth/username-model";
import { CreateChannelModal } from "@/features/channels/create-channel-modal";
import { CreateServerModal } from "@/features/servers/create-server-modal";
import { DeleteServerModal } from "@/features/servers/delete-server-modal";
import { EditServerModal } from "@/features/servers/edit-server-modal";
import { InviteModal } from "@/features/servers/invite-modal";
import { LeaveServerModal } from "@/features/servers/leave-server-modal";
import { MembersModal } from "@/features/servers/members-modal";

export const ModalProvider = () => {
  return (
    <>
      <UsernameModal />
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
    </>
  );
};
