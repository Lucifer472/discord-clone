"use client";
import { useEffect, useState } from "react";

import { useGetCurrentUser } from "@/features/auth/api/use-get-current-user";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSetUsername } from "@/features/auth/api/use-set-username";
import { removeSpace } from "@/lib/utils";
import { toast } from "sonner";

export const UsernameModal = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const { data } = useGetCurrentUser();
  const { mutate, isPending } = useSetUsername();

  useEffect(() => {
    if (data && !open) {
      if (!data.user.username) {
        setOpen(true);
      }
    }
  }, [data, open]);

  const handleSetUsername = () => {
    mutate(
      {
        json: { username: text },
      },
      {
        onError: () => {
          toast.error("Username already Taken!");
        },
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Enter Username to Continue
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Please Enter a Unique Username to continue sign-up Process.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 px-6">
          <Label className="uppercase text-xs text-zinc-500 dark:text-secondary/70">
            Username
          </Label>
          <Input
            disabled={isPending}
            type="text"
            value={text}
            onChange={(e) => setText(removeSpace(e.target.value))}
            placeholder="Enter User Name"
            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
          />
        </div>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <Button
            onClick={handleSetUsername}
            variant={"primary"}
            disabled={isPending}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
