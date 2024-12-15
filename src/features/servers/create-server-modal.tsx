"use client";
import { z } from "zod";
import Image from "next/image";

import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { ServerSchema } from "./schema";
import { useCreateServer } from "./api/use-create-server";
import { useRouter } from "next/navigation";
import { useServerModal } from "./hooks/use-server-modal";

export const CreateServerModal = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { mutate, isPending } = useCreateServer();
  const { isServer, setIsServer } = useServerModal();

  const form = useForm<z.infer<typeof ServerSchema>>({
    resolver: zodResolver(ServerSchema),
    defaultValues: {
      name: "",
      image: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      toast.error("No file selected");
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg"];
    if (!validTypes.includes(file.type)) {
      toast.error(
        "Invalid file type. Only JPG,SVG,PNG OR JPEG images are allowed."
      );
      return;
    }

    // Validate file size (1MB = 1,048,576 bytes)
    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      toast.error("File size exceeds 1MB.");
      return;
    }

    // Convert the file to a Base64 string
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      form.setValue("image", base64String);
    };

    reader.onerror = () => {
      toast.error("Unable to save Image");
    };

    reader.readAsDataURL(file);
  };

  const onSubmit = (v: z.infer<typeof ServerSchema>) => {
    mutate(
      {
        json: {
          name: v.name,
          image: v.image ? v.image : "",
        },
      },
      {
        onSuccess: () => {
          form.reset();
          toast.success("Server Created!");
          router.refresh();
          setIsServer(false);
        },
        onError: (res) => {
          toast.error(res.message);
        },
      }
    );
  };

  return (
    <Dialog open={isServer} onOpenChange={setIsServer}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Customize you are server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give you are server personality with a name and image you can always
            change it later
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center pt-2">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="size-[72px] relative rounded-md overflow-hidden">
                            <Image
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                              alt="Workspace Image"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px] bg-white rounded-md">
                            <AvatarFallback className="bg-zinc-200 rounded-md">
                              <ImageIcon className="size-[36px] text-neutral-400 bg-zinc-200" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm text-start">Server Image</p>
                          <p className="text-xs text-muted-foreground">
                            JPG, PNG, SVG AND JPEG WITH MAX SIZE OF 1MB.
                          </p>
                          <input
                            className="hidden"
                            accept=".jpg,.png,.svg,.jpeg"
                            type="file"
                            ref={inputRef}
                            disabled={isPending}
                            onChange={handleImageChange}
                          />
                          {field.value ? (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant={"destructive"}
                              className="w-fit px-2 mt-2"
                              onClick={() => {
                                field.onChange(null);
                                if (inputRef.current) {
                                  inputRef.current.value = "";
                                }
                              }}
                            >
                              Remove Image
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant={"primary"}
                              className="w-fit mt-2"
                              onClick={() => inputRef.current?.click()}
                            >
                              Upload Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs text-zinc-500 dark:text-secondary/70">
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        {...field}
                        type="text"
                        placeholder="Enter Server Name"
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant={"primary"} disabled={isPending}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
