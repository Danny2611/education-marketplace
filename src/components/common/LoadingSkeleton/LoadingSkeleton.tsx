export const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {[...Array(6)].map((_, index) => (
      <div
        key={index}
        className="animate-pulse rounded-lg bg-white p-4 shadow-md"
      >
        <div className="mb-4 h-48 rounded-md bg-gray-300"></div>
        <div className="mb-2 h-4 rounded bg-gray-300"></div>
        <div className="mb-2 h-3 w-2/3 rounded bg-gray-300"></div>
        <div className="h-4 w-1/3 rounded bg-gray-300"></div>
      </div>
    ))}
  </div>
);
