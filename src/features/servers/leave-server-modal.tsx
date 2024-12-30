"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useLeaveModal } from "./hooks/use-leave-modal";
import { useServerId } from "./hooks/use-server-id";

import { useGetServerById } from "./api/use-get-server-id";
import { useLeaveMember } from "./api/use-leave-member";

export const LeaveServerModal = () => {
  const serverId = useServerId();

  const { isLeave, setIsLeave } = useLeaveModal();

  const { data } = useGetServerById({ serverId });
  const { mutate, isPending } = useLeaveMember();

  const handleLeaveServer = () => {
    mutate(
      {
        param: { serverId },
      },
      {
        onSuccess: () => {
          window.location.href = "/";
        },
      }
    );
  };

  if (!data) return;

  return (
    <Dialog open={isLeave} onOpenChange={setIsLeave}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to leave{" "}
            <span className="font-semibold text-indigo-500">
              {data.data.server.name}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isPending}
              onClick={() => setIsLeave(false)}
              variant={"ghost"}
            >
              Cancel
            </Button>
            <Button
              disabled={isPending}
              variant={"primary"}
              onClick={handleLeaveServer}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
