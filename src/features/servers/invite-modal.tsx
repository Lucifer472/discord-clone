"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CheckIcon, CopyIcon, RefreshCcwIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useOrigin } from "./hooks/use-origin";
import { useInviteModal } from "./hooks/use-invite-modal";
import { useServerId } from "./hooks/use-server-id";

import { useGetServerById } from "./api/use-get-server-id";
import { useUpdateServerInviteCode } from "./api/use-update-invite-code";

export const InviteModal = () => {
  const router = useRouter();
  const origin = useOrigin();

  const [copied, setCopied] = useState(false);

  const { isInvite, setIsInvite } = useInviteModal();

  const serverId = useServerId();

  const { data, refetch, isFetching } = useGetServerById({
    serverId,
  });
  const { mutate, isPending } = useUpdateServerInviteCode();

  const server = data?.data;

  const inviteUrl = `${origin}/invite/${server?.server.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    toast.success("Code Copied!");

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const onNewCode = () => {
    mutate(
      {
        param: { serverId: isInvite },
      },
      {
        onSuccess: () => {
          refetch();
          toast.success("Code Updated!");
          router.refresh();
        },
        onError: () => {
          toast.error("Something went wrong!");
        },
      }
    );
  };

  return (
    <Dialog open={!!isInvite} onOpenChange={() => setIsInvite("")}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Invite People
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Invite People to you are server
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Server Invite Link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black"
              value={!isFetching ? inviteUrl : "Generating..."}
              disabled={isPending}
            />
            <Button size={"icon"} onClick={onCopy} disabled={isPending}>
              {copied ? (
                <CheckIcon className="size-4" />
              ) : (
                <CopyIcon className="size-4" />
              )}
            </Button>
          </div>
          <Button
            size={"sm"}
            variant={"link"}
            disabled={isPending}
            className="text-xs text-zinc-500 p-0 mt-4"
            onClick={onNewCode}
          >
            Generate new Link <RefreshCcwIcon className="size-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
