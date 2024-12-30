"use client";

import { Role } from "@prisma/client";
import { ServerWithMembersWithProfile } from "@/type";
import {
  ChevronDownIcon,
  LogOutIcon,
  PlusCircleIcon,
  SettingsIcon,
  TrashIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useInviteModal } from "./hooks/use-invite-modal";
import { useEditModal } from "./hooks/use-edit-modal";
import { useMemberModal } from "./hooks/use-members-modal";
import { useChannelModal } from "../channels/hooks/use-channel-modal";
import { useLeaveModal } from "./hooks/use-leave-modal";
import { useDeleteModal } from "./hooks/use-delete-modal";

export const ServerHeader = ({
  server,
  role,
}: {
  server: ServerWithMembersWithProfile;
  role: Role;
}) => {
  const isAdmin = role === "ADMIN";
  const isModerator = isAdmin || role === "MODERATOR";

  const { setIsInvite } = useInviteModal();
  const { setIsEdit } = useEditModal();
  const { setIsMember } = useMemberModal();
  const { setIsChannel } = useChannelModal();
  const { setIsLeave } = useLeaveModal();
  const { setIsDelete } = useDeleteModal();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/20 dark:hover:bg-zinc-700/50 transition">
          {server.name}
          <ChevronDownIcon className="size-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
        {isModerator && (
          <DropdownMenuItem
            onClick={() => setIsInvite(server.id)}
            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
          >
            Invite People
            <UserPlusIcon className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => setIsEdit(true)}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Server Settings
            <SettingsIcon className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => setIsMember(true)}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Manage Members
            <UsersIcon className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            onClick={() => setIsChannel(true)}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Create Channel
            <PlusCircleIcon className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => setIsDelete(true)}
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
          >
            Delete Server
            <TrashIcon className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => setIsLeave(true)}
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
          >
            Leave Server
            <LogOutIcon className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
