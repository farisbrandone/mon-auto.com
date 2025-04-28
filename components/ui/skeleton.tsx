import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-[#0000007c] animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
