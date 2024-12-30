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

import { useDeleteModal } from "./hooks/use-delete-modal";
import { useServerId } from "./hooks/use-server-id";

import { useGetServerById } from "./api/use-get-server-id";
import { useDeleteServer } from "./api/use-delete-server";

export const DeleteServerModal = () => {
  const serverId = useServerId();

  const { isDelete, setIsDelete } = useDeleteModal();

  const { data } = useGetServerById({ serverId });
  const { mutate, isPending } = useDeleteServer();

  const handleDeleteServer = () => {
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
    <Dialog open={isDelete} onOpenChange={setIsDelete}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Delete Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to Delete{" "}
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
              onClick={() => setIsDelete(false)}
              variant={"ghost"}
            >
              Cancel
            </Button>
            <Button
              disabled={isPending}
              variant={"primary"}
              onClick={handleDeleteServer}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
