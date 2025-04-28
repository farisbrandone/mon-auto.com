import { Skeleton } from "@/components/ui/skeleton";

export function MySkeleton() {
  return (
    <div className="flex items-center space-x-4 w-full p-1">
      <div className="space-y-2 w-full">
        <Skeleton className="h-[250px] w-full " />
      </div>
    </div>
  );
}
