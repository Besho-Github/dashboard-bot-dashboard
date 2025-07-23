import React, { useState, useContext, useEffect, useRef } from 'react';
import { AiOutlinePoweroff } from 'react-icons/ai';
import { api } from '../../utils/api';
import { DataContext } from '../../context';
import { Icon } from '@iconify/react';

const UserMenu = ({ user }) => {
  const [menuActive, setMenuActive] = useState(false);
  const avatar = user?.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128` : '/avatar.png';

  const menuRef = useRef(null);

  const handleMenuToggle = (event) => {
    event.stopPropagation(); // Prevent the click event from propagating to the document
    setMenuActive((prev) => !prev);
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const { language, setLanguage } = useContext(DataContext);

  const handleLanguageChange = async (locale) => {
    setLanguage(locale);
  };

  const languageOptions = [
    { name: 'العربية', locale: 'ar', imageUrl: '/ar.png' },
    { name: 'English', locale: 'en', imageUrl: '/en.png' },
  ];

  const { locale } = useContext(DataContext);
  const isRTL = locale.getLanguage() === 'ar';

  const nextLanguage = language === 'ar' ? 'en' : 'ar';
  const nextLanguageOption = languageOptions.find((option) => option.locale === nextLanguage);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return user ? (
    <div className="relative" ref={menuRef}>
      <div className="cursor-pointer flex" onClick={handleMenuToggle}>
        <img src={avatar} alt="profile-img" className="rounded-full w-12 h-12" />
      </div>

      {menuActive && (
        <div
          className="absolute mt-2 w-56 rounded-xl md:rounded-2xl py-1 bg-[#21262d]/95 backdrop-blur-sm border border-[#30363d] shadow-lg"
          style={{
            right: isRTL ? 'auto' : '0',
            left: isRTL ? '0' : 'auto',
            top: '100%',
            zIndex: 50,
          }}
        >
          <div className="px-2 py-2">
            <div className="flex items-center gap-3 px-3 pb-3 border-b border-[#30363d]">
              <img src={avatar} alt="profile-img" className="w-10 h-10 rounded-full object-cover ring-1 ring-[#30363d]" />
              <div className="flex flex-col">
                <span className="font-medium text-[#c9d1d9]">{user.username}</span>
                <span className="text-sm text-[#8b949e]">{user.username}</span>
              </div>
            </div>

            {/* Language Option (mobile only) */}
            <div className="block lg:hidden mt-2">
              <button
                onClick={() => handleLanguageChange(nextLanguage)}
                className={`w-full px-3 py-2.5 text-left rounded-xl text-[#c9d1d9] hover:bg-[#30363d] flex items-center ${
                  isRTL ? 'flex-row-reverse' : ''
                } justify-between group transition duration-200`}
              >
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <img
                    src={nextLanguageOption.imageUrl}
                    alt={nextLanguageOption.name}
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-[#30363d]"
                  />
                  <span className="font-medium">{nextLanguageOption.name}</span>
                </div>
                <Icon
                  icon={isRTL ? 'lucide:arrow-left' : 'lucide:arrow-right'}
                  className="text-sm opacity-0 group-hover:opacity-100 transition-opacity text-[#8b949e]"
                />
              </button>
            </div>

            {/* Logout Option */}
            <div className="mt-2">
              <button
                onClick={logout}
                className="w-full px-3 py-2.5 text-left rounded-xl text-red-500 hover:bg-red-500/10 flex items-center gap-3 group transition duration-200"
              >
                <AiOutlinePoweroff className="text-lg" />
                <span className="font-medium">{locale.common.userMenu.logout}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
    <div></div>
  );
};

export default UserMenu;
