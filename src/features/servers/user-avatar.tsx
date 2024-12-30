import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export const UserAvatar = ({
  src,
  className,
  char,
}: {
  src?: string;
  className?: string;
  char?: string;
}) => {
  return (
    <Avatar className={cn("size-7 md:size-10", className)}>
      <AvatarImage src={src} />
      <AvatarFallback>{char ? char : "A"}</AvatarFallback>
    </Avatar>
  );
};
