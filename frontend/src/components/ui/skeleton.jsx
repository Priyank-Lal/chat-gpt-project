import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      // className={cn("bg-accent animate-pulse rounded-md", className)}
      className={cn("bg-[#3a3a3a] animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
