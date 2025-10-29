interface PageLoadingStateProps {
  rows?: number;
  skeletonHeight?: string;
}

export default function PageLoadingState({
  rows = 5,
  skeletonHeight = 'h-10',
}: PageLoadingStateProps) {
  return (
    <div className="bg-white rounded-2xl border border-background-200 p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-background-200 rounded w-1/3 mb-6"></div>
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-background-200 rounded-lg"></div>
            <div className="flex-1">
              <div
                className={`${skeletonHeight} bg-background-200 rounded w-3/4 mb-2`}
              ></div>
              <div className="h-3 bg-background-200 rounded w-1/2"></div>
            </div>
            <div className="h-4 bg-background-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
