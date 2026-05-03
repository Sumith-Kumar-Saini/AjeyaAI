export default function ProjectLoading() {
  return (
    <div className="p-6 space-y-4">
      <div className="h-6 w-40 bg-muted animate-pulse rounded" />
      <div className="h-32 bg-muted animate-pulse rounded" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-40 bg-muted animate-pulse rounded" />
        <div className="h-40 bg-muted animate-pulse rounded" />
      </div>
    </div>
  );
}