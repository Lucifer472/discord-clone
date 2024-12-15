"use client";
import { z } from "zod";
import Image from "next/image";

import { ImageIcon } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { useRouter } from "next/navigation";
import { useInviteModal } from "./hooks/use-invite-modal";
import { useGetServerById } from "./api/use-get-current-user";

export const InviteModal = () => {
  const router = useRouter();
  const { isInvite, setIsInvite } = useInviteModal();

  const { data, isPending } = useGetServerById({ serverId: isInvite });

  if (isPending) return;

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
      </DialogContent>
    </Dialog>
  );
};
