export default function DashboardLayoutSkeleton() {
  return (
    <div className="flex">
      <div className="w-64 h-screen bg-muted animate-pulse" />
      <div className="flex-1 p-6 space-y-4">
        <div className="h-6 w-40 bg-muted animate-pulse rounded" />
        <div className="h-40 bg-muted animate-pulse rounded" />
      </div>
    </div>
  );
}