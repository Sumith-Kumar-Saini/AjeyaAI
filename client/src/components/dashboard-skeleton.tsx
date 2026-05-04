export default function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <div className="h-6 w-40 bg-muted animate-pulse rounded" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="h-24 bg-muted animate-pulse rounded" />
        <div className="h-24 bg-muted animate-pulse rounded" />
        <div className="h-24 bg-muted animate-pulse rounded" />
      </div>
      <div className="h-64 bg-muted animate-pulse rounded" />
    </div>
  );
}