import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAbbreviation } from '../../utils';
import { DataContext } from '../../context';
import { Icon, loadIcon } from '@iconify/react';

function ServerCard({ server }) {
  const [hovered, setHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { locale } = useContext(DataContext);
  const isRTL = locale.getLanguage() === 'ar';

  useEffect(() => {
    router.prefetch(`/dashboard/${server.id}/`);
    // Pre-fetch the icon when component mounts
    loadIcon('eos-icons:three-dots-loading');
  }, []);

  const handleNavigation = async () => {
    setIsLoading(true);
    await router.push(`/dashboard/${server.id}/`);
  };

  return (
    <div
      className="flex flex-col sm:flex-row main-container w-[300px] sm:w-[400px] h-[280px] sm:h-[200px] bg-gradient-to-br from-[#020614] to-[#0a0f24] rounded-xl border-2 m-4 border-[#2f333f] transition-all duration-300 ease-in-out hover:translate-y-[-4px] hover:shadow-xl hover:shadow-[#2c2d3161] hover:border-[#3a3f4d] hover:cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`flex w-full sm:w-[230px] py-6 sm:py-0 justify-center flex-col items-center transition-colors duration-300 ${
          hovered ? 'bg-[#242831]' : 'bg-[#2f333f]'
        } ${isRTL ? 'sm:rounded-r-lg' : 'sm:rounded-l-lg'}`}
      >
        <div className="flex w-16 h-16 rounded-lg mb-3 transform transition-transform duration-300 hover:scale-105">
          {server.icon ? (
            <img
              src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.webp?size=128`}
              alt={`${server.name} Server Icon`}
              className="w-full h-full rounded-lg object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-lg bg-gradient-to-br from-[#353945] to-[#2a2e38] flex items-center justify-center text-lg font-bold text-gray-200">
              {getAbbreviation(server.name)}
            </div>
          )}
        </div>
        <span className="text-xl font-semibold max-w-[170px] truncate text-gray-100 text-center">{server.name}</span>
      </div>
      <div className="flex items-center justify-center flex-1 py-6 sm:py-0" dir={isRTL ? 'rtl' : 'ltr'}>
        <button
          onClick={handleNavigation}
          disabled={isLoading}
          className="relative flex justify-center items-center px-6 w-3/5 py-3 bg-gradient-to-r from-[#ceb165] to-[#b6a14b] rounded-md transition-all duration-300 hover:from-[#b6a14b] hover:to-[#9d8a36] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#ceb165] focus:ring-opacity-50"
        >
          {isLoading ? (
            <Icon icon="eos-icons:three-dots-loading" className="text-[#020614] w-6 h-6" />
          ) : (
            <span className="text-[#020614] font-semibold whitespace-nowrap">{locale.common.setup}</span>
          )}
        </button>
      </div>
    </div>
  );
}

function ServerCardSkeleton() {
  const { locale } = useContext(DataContext);
  const isRTL = locale.getLanguage() === 'ar';

  return (
    <SkeletonTheme baseColor="#2b2e36" highlightColor="#343642">
      <div className="flex flex-col sm:flex-row main-container w-[300px] sm:w-[400px] h-[280px] sm:h-[200px] bg-gradient-to-br from-[#020614] to-[#0a0f24] rounded-xl m-4 border-2 border-[#2f333f]">
        <div
          className={`flex w-full sm:w-[230px] py-6 sm:py-0 justify-center flex-col items-center ${
            isRTL ? 'sm:rounded-r-lg rounded-t-lg' : 'sm:rounded-l-lg rounded-t-lg'
          } bg-[#2f333f]`}
        >
          <Skeleton circle height={64} width={64} className="mb-3" />
          <Skeleton height={24} width={140} />
        </div>
        <div className="flex items-center justify-center flex-1 py-6 sm:py-0" dir={isRTL ? 'rtl' : 'ltr'}>
          <Skeleton height={48} width={100} borderRadius={8} />
        </div>
      </div>
    </SkeletonTheme>
  );
}

export { ServerCard, ServerCardSkeleton };
