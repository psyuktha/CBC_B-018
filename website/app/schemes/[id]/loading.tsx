import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Main content */}
      <div className="ml-0 flex-1">
        {/* Top navbar skeleton */}
        <div className="flex h-14 items-center justify-between border-b bg-white px-4 sm:px-6">
          <Skeleton className="h-8 w-40" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="p-4 sm:p-6">
          {/* Top section */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-36" />
              <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-9 w-32" />
          </div>

          {/* Scheme details card skeleton */}
          <div className="mb-6 rounded-lg border p-6 shadow-sm">
            <div className="mb-4">
              <Skeleton className="mb-2 h-7 w-40" />
              <Skeleton className="h-5 w-24" />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Left column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-20 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                <div>
                  <Skeleton className="mb-4 h-6 w-36" />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {Array(8)
                      .fill(null)
                      .map((_, index) => (
                        <div key={index} className="space-y-2">
                          <Skeleton className="h-5 w-20" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      ))}
                  </div>
                  <div className="mt-6">
                    <Skeleton className="mb-2 h-5 w-12" />
                    <div className="flex flex-wrap gap-2">
                      {Array(5)
                        .fill(null)
                        .map((_, index) => (
                          <Skeleton key={index} className="h-6 w-20" />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
