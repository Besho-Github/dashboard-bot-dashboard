'use client';

import DiscordStyledSelect from '../../../components/selects/server';
import { Icon } from '@iconify/react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useParams, usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useContext } from 'react';
import { DataContext } from '../../../context';
import { GuildDataContext } from '../../../context/guild';

export const Menu = ({ guilds, handleSetOpen, sidebarDocked }) => {
  const router = useRouter();
  const { id } = useParams();
  const pathname = usePathname();

  const page = pathname?.split('/').pop() || 'general';

  console.log(page);
  const { locale } = useContext(DataContext);
  const { guild } = useContext(GuildDataContext);

  const isOwner = guilds.find((g) => g.id == guild.id)?.owner;
  const restrictedProtection = isOwner ? false : guild ? guild.protection.serverSettings.restrictToOwner : false;

  const isRTL = locale.getLanguage() === 'ar';

  const changeServer = (e) => {
    router.push(`/dashboard/${e.value}/general`);
  };

  const createListItem = (href, icon, text, condition, new_feature = false) => (
    <Link href={href} prefetch={true} passHref onClick={() => (!sidebarDocked ? handleSetOpen() : null)}>
      <li
        className={`List flex flex-row items-center justify-between gap-2 ml-[5px] hover:text-[#cfb360d1] cursor-pointer ${
          condition ? 'font-semibold whitespace-nowrap text-[#CFB360]' : ''
        }  transition-colors duration-200 ease-in-out`}
        style={condition ? { textShadow: '0 0 10px #cfb360' } : {}}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Icon icon={icon} width={30} height={30} className="flex-shrink-0" />
          <span className="text-[18px] truncate">{text}</span>
          {new_feature && (
            <span className="bg-gradient-to-r from-[#e6c77d] to-[#d4af37] text-white text-[10px] px-2 py-0.5 rounded-full font-medium shadow-[0_0_8px_rgba(212,175,55,0.2)] flex-shrink-0">
              NEW
            </span>
          )}
        </div>
        <Icon icon="ri:arrow-right-s-line" width={25} className={`flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
      </li>
    </Link>
  );

  return (
    <div className="Sidebar w-[300px] h-full bg-[#040C25] rounded-tr-[15px] rounded-br-[15px] p-4 flex flex-col gap-4 overflow-y-scroll scrollbar-hide">
      <ul className="flex flex-col gap-4">
        <li className="Category flex flex-col gap-3">
          <div className="text-white/70 text-[15px] font-bold">{locale.sidebar.serverName}</div>
          {guilds && <DiscordStyledSelect guilds={guilds} onChange={changeServer} />}
        </li>
        {createListItem(`/dashboard/${id}/premium`, 'mage:stars-c-fill', locale.sidebar.premium, page === 'premium')}
        <li className="Category flex flex-col gap-3">
          <div className="text-white/70 text-[15px] font-bold">{locale.sidebar.modSettings.title}</div>
          <ul className="flex flex-col gap-2">
            {createListItem(`/dashboard/${id}/general`, 'clarity:cog-solid', locale.sidebar.modSettings.comamand_1, page === 'general')}
            {createListItem(
              `/dashboard/${id}/mod-commands`,
              'ph:gavel-duotone',
              locale.sidebar.modSettings.comamand_2,
              page === 'mod-commands'
            )}
            {createListItem(`/dashboard/${id}/auto-mod`, 'ri:robot-2-fill', locale.sidebar.modSettings.comamand_3, page === 'auto-mod')}
            {restrictedProtection ? (
              <></>
            ) : (
              createListItem(
                `/dashboard/${id}/protection`,
                'ic:twotone-shield',
                locale.sidebar.modSettings.comamand_4,
                page === 'protection'
              )
            )}
            {createListItem(`/dashboard/${id}/logs`, 'majesticons:note-text-line', locale.sidebar.modSettings.comamand_5, page === 'logs')}
          </ul>
        </li>
        <li className="Category flex flex-col gap-3">
          <div className="text-white/70 text-[15px] font-bold">{locale.sidebar.generalSettings.title}</div>
          <ul className="flex flex-col gap-2">
            {createListItem(
              `/dashboard/${id}/tickets`,
              'solar:ticket-bold-duotone',
              locale.sidebar.generalSettings.comamand_1,
              page === 'tickets'
            )}
            {createListItem(
              `/dashboard/${id}/welcome`,
              'ph:user-circle-plus-duotone',
              locale.sidebar.generalSettings.comamand_2,
              page === 'welcome'
            )}
            {createListItem(
              `/dashboard/${id}/commands`,
              'ph:terminal-duotone',
              locale.sidebar.generalSettings.comamand_3,
              page === 'commands'
            )}
            {createListItem(
              `/dashboard/${id}/auto-reply`,
              'ph:chat-teardrop-duotone',
              locale.sidebar.generalSettings.comamand_4,
              page === 'auto-reply'
            )}
            {createListItem(
              `/dashboard/${id}/embed-builder`,
              'material-symbols:add-notes',
              locale.sidebar.generalSettings.comamand_5,
              page === 'embed-builder'
            )}
            {createListItem(
              `/dashboard/${id}/apply-system`,
              'clarity:employee-group-solid',
              locale.sidebar.generalSettings.apply,
              page === 'apply-system'
            )}
            {createListItem(`/dashboard/${id}/colors`, 'ic:twotone-palette', locale.sidebar.generalSettings.colors, page === 'colors')}
            {createListItem(
              `/dashboard/${id}/leveling-system`,
              'icon-park-outline:level',
              locale.sidebar.generalSettings.level,
              page === 'leveling-system'
            )}
            {/* {createListItem(
              `/dashboard/${id}/games`,
              'ph:game-controller-fill',
              locale.sidebar.generalSettings.games,
              page === 'games',
              true
            )} */}
            {createListItem(
              `/dashboard/${id}/rules`,
              'lets-icons:book-check-fill',
              locale.sidebar.generalSettings.rules,
              page === 'rules',
              true
            )}
            {/* {createListItem(
              `/dashboard/${id}/notifications`,
              'ion:notifcations',
              locale.sidebar.generalSettings.notifications,
              page === 'notifications'
            )} */}
          </ul>
        </li>
      </ul>
    </div>
  );
};

export const MenuSkeleton = ({ guilds }) => {
  const router = useRouter();
  const changeServer = (e) => {
    router.push(`/dashboard/${e.value}/general`);
  };
  return (
    <SkeletonTheme baseColor="#0C122D" highlightColor="#1137700f" borderRadius={4}>
      <div className="Sidebar w-[300px] h-full bg-[#040C25] rounded-tr-[15px] rounded-br-[15px] p-4 flex flex-col gap-4">
        <ul className="flex flex-col gap-4">
          <li className="Category flex flex-col gap-3">
            <Skeleton width={60} height={20} />
            {guilds && <DiscordStyledSelect guilds={guilds} onChange={changeServer} />}
          </li>
          <li className="Category flex flex-col gap-3">
            <div className="text-white/70 text-[15px] font-bold">
              <Skeleton width={120} height={20} />
            </div>
            <ul className="flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <li
                  key={index}
                  className="List flex flex-row items-center justify-between gap-2 ml-[5px] hover:text-[#cfb360d1] cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Skeleton circle={true} height={30} width={30} />
                    <Skeleton width={150} height={20} />
                  </div>
                  <Skeleton circle={true} height={25} width={25} />
                </li>
              ))}
            </ul>
          </li>
          <li className="Category flex flex-col gap-3">
            <div className="text-white/70 text-[15px] font-bold">
              <Skeleton width={150} height={20} />
            </div>
            <ul className="flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <li
                  key={index}
                  className="List flex flex-row items-center justify-between gap-2 ml-[5px] hover:text-[#cfb360d1] cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Skeleton circle={true} height={30} width={30} />
                    <Skeleton width={150} height={20} />
                  </div>
                  <Skeleton circle={true} height={25} width={25} />
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </SkeletonTheme>
  );
};
