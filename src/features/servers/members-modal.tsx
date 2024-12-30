"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckIcon,
  GavelIcon,
  Loader2Icon,
  MoreVerticalIcon,
  ShieldAlert,
  ShieldCheck,
  ShieldCheckIcon,
  ShieldIcon,
  ShieldQuestionIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Role } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

import { UserAvatar } from "./user-avatar";

import { useServerId } from "./hooks/use-server-id";
import { useMemberModal } from "./hooks/use-members-modal";

import { useGetServerById } from "./api/use-get-server-id";
import { useUpdateMemberRole } from "./api/use-update-member-role";
import { useKickMember } from "./api/use-kick-member";

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="size-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="size-4 ml-2 text-rose-500" />,
};

export const MembersModal = () => {
  const [loadingId, setLoadingId] = useState<null | number>(null);
  const router = useRouter();

  const { isMember, setIsMember } = useMemberModal();

  const serverId = useServerId();

  const { data } = useGetServerById({
    serverId,
  });
  const { mutate: updateMemberRole } = useUpdateMemberRole();
  const { mutate: kickMember } = useKickMember();

  const server = data?.data;

  const onRoleChange = (memberId: number, role: Role) => {
    setLoadingId(memberId);
    updateMemberRole(
      {
        param: { serverId, memberId: memberId.toString(), role },
      },
      {
        onSuccess: () => {
          router.refresh();
          toast.success("Member Role Updated!");
        },
        onSettled: () => {
          setLoadingId(null);
        },
      }
    );
  };

  const onKickMember = (memberId: number) => {
    setLoadingId(memberId);
    kickMember(
      {
        param: { serverId, memberId: memberId.toString() },
      },
      {
        onSuccess: () => {
          router.refresh();
          toast.success("Member Removed!");
        },
        onSettled: () => {
          setLoadingId(null);
        },
      }
    );
  };

  if (!server) return;

  return (
    <Dialog open={isMember} onOpenChange={setIsMember}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server.members.length + 1} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          <div className="flex items-center gap-x-2 mb-6">
            <UserAvatar
              src={server.user?.user.image as string}
              char={
                server.user?.user.name
                  ? server.user?.user.name[0]
                  : server.user?.user.email?.[0]
              }
            />
            <div className="flex flex-col gap-y-1">
              <div className="text-xs font-semibold flex items-center">
                {server.user?.user.name}
                {roleIconMap[server.user!.role]}
              </div>
              <p className="text-xs text-zinc-500">{server.user?.user.email}</p>
            </div>
          </div>
          {server.members.map((m) => (
            <div key={m.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar
                src={m.user.image as string}
                char={m.user.name ? m.user.name[0] : m.user.email?.[0]}
              />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center">
                  {m.user.name}
                  {roleIconMap[m.role]}
                </div>
                <p className="text-xs text-zinc-500">{m.user.email}</p>
              </div>
              {server.server.userId !== m.userId && loadingId !== m.id && (
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVerticalIcon className="size-4 text-zinc-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center">
                          <ShieldQuestionIcon className="size-4 mr-2" />
                          <span>More</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              onClick={() => onRoleChange(m.id, "GUEST")}
                            >
                              <ShieldIcon className="size-4 mr-2" />
                              GUEST
                              {m.role === "GUEST" && (
                                <CheckIcon className="size-4 ml-auto" />
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onRoleChange(m.id, "MODERATOR")}
                            >
                              <ShieldCheckIcon className="size-4 mr-2" />
                              Moderator
                              {m.role === "MODERATOR" && (
                                <CheckIcon className="size-4 ml-auto" />
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onKickMember(m.id)}>
                        <GavelIcon className="size-4 mr-2" />
                        Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {loadingId === m.id && (
                <Loader2Icon className="animate-spin text-zinc-500 ml-auto size-4" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
