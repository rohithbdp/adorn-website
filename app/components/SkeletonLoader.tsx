export const GallerySkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="h-64 bg-gray-800 rounded-lg"></div>
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-gray-800 rounded w-3/4"></div>
        <div className="h-3 bg-gray-800 rounded w-full"></div>
        <div className="h-3 bg-gray-800 rounded w-5/6"></div>
      </div>
    </div>
  );
};

export const ImageSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="aspect-square bg-gray-800 rounded-lg"></div>
    </div>
  );
};