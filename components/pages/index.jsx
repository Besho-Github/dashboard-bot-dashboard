import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const GeneralSkeleton = () => (
  <>
    <SkeletonTheme baseColor="#111633" highlightColor="#1C234D" borderRadius={4}>
      <div className="p-2.5 border-b border-[#252B4D] text-xl font-semibold">
        <Skeleton width={200} height={24} />
      </div>
      <div className="bg-[#0E1530] p-5 rounded mb-[100px] mt-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#1A2142] p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton circle width={40} height={40} />
              <Skeleton width={150} height={20} />
            </div>
            <div className="space-y-4">
              <Skeleton height={40} />
              <Skeleton height={40} />
            </div>
          </div>
          <div className="bg-[#1A2142] p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton circle width={40} height={40} />
              <Skeleton width={150} height={20} />
            </div>
            <div className="space-y-4">
              <Skeleton height={40} />
              <Skeleton height={80} />
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#1A2142]/50 p-4 sm:p-5 rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                <div className="flex items-center gap-3 sm:gap-4">
                  <Skeleton circle width={28} height={28} className="sm:w-8 sm:h-8" />
                  <div>
                    <Skeleton width={100} height={14} className="sm:w-[120px] sm:h-4" />
                    <Skeleton width={140} height={12} className="mt-2 sm:w-[180px] sm:h-3.5" />
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Skeleton width={32} height={20} className="sm:w-10 sm:h-6" />
                  <Skeleton circle width={28} height={28} className="sm:w-8 sm:h-8" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonTheme>
  </>
);

const Loader = () => (
  <div className="flex items-center justify-center min-h-[70vh]">
    <div className="relative inline-block w-13 h-13">
      <div className="bg-[#d0b462] absolute w-2.5 h-2.5 animate-cubeSpinner"></div>
      <div className="bg-[#d0b462] absolute w-2.5 h-2.5 animate-cubeSpinner" style={{ animationDelay: '-0.9s' }}></div>
    </div>
  </div>
);

export { GeneralSkeleton, Loader };
