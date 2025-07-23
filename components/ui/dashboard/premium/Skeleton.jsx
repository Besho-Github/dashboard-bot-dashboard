import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse">
      <header className="p-2.5 border-b border-gray-700">
        <div className="h-6 bg-gray-700 rounded w-1/4"></div>
      </header>

      <div className="mt-3 bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="h-48 bg-gray-700"></div>

        <div className="relative px-6 py-4">
          <div className="absolute -top-16 left-6 w-32 h-32 bg-gray-700 rounded-full border-4 border-gray-800"></div>

          <div className="ml-36 space-y-2">
            <div className="h-6 bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
          </div>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index}>
                <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
                <div className="h-10 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-700">
          <div className="h-6 bg-gray-600 rounded w-1/3 mb-4"></div>
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-4 bg-gray-600 rounded w-1/2"></div>
              <div className="h-4 bg-gray-600 rounded w-2/3"></div>
            </div>
            <div className="h-10 bg-gray-600 rounded w-1/4"></div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-700 border-t border-gray-600">
          <div className="h-10 bg-gray-600 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
