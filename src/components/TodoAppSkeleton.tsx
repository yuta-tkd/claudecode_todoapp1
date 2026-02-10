"use client";

export function TodoAppSkeleton() {
  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header skeleton */}
      <div className="flex h-14 items-center gap-4 border-b bg-white px-4">
        <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-9 flex-1 max-w-md animate-pulse rounded-lg bg-gray-200" />
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar skeleton */}
        <div className="hidden w-72 border-r bg-white p-4 lg:block">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 animate-pulse rounded bg-gray-200" />
            ))}
          </div>
        </div>
        {/* Content skeleton */}
        <div className="flex-1 p-6">
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-lg bg-gray-200"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
