const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
    <div className="h-32 bg-slate-200 rounded"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-24 bg-slate-200 rounded"></div>
      <div className="h-24 bg-slate-200 rounded"></div>
    </div>
  </div>
);

export default LoadingSkeleton;
