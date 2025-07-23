import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { DataContext } from '../../context';
import Link from 'next/link';
import UserMenu from './UserMenu';
import { Icon } from '@iconify/react';

export const FloatingNav = ({ className }) => {
  const { language, setLanguage, user } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleLanguageChange = async (locale) => {
    closeDropdown();
    setLanguage(locale);
  };

  const languageOptions = [
    { name: 'العربية', locale: 'ar', imageUrl: '/ar.png' },
    { name: 'English', locale: 'en', imageUrl: '/en.png' },
  ];

  const { scrollYProgress } = useScroll();

  const [visible, setVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [originalBackgroundColor, setOriginalBackgroundColor] = useState('rgba(34, 43, 53, 0.9)');
  const [isPhone, setIsPhone] = useState(false);

  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    const isButtonClick = buttonRef.current?.contains(event.target);
    const isDropdownClick = dropdownRef.current?.contains(event.target);

    if (!isButtonClick && !isDropdownClick) {
      closeDropdown();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    setIsLoaded(true);
    setVisible(true);
    setOriginalBackgroundColor('rgba(0, 0, 0, 0)');

    const mql = window.matchMedia('(min-width: 800px)');
    const mediaQueryChanged = () => {
      setIsPhone(!mql.matches);
    };
    mql.addListener(mediaQueryChanged);
    mediaQueryChanged();

    return () => mql.removeListener(mediaQueryChanged);
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (current) => {
    if (typeof current === 'number') {
      let direction = current - scrollYProgress.getPrevious();
      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
        setOriginalBackgroundColor('rgba(0, 0, 0, 0)');
      } else {
        setVisible(direction < 0);
        setOriginalBackgroundColor('rgba(3, 6, 17 0.9)');
      }
    }
  });
  const { locale } = useContext(DataContext);
  const isRTL = locale.getLanguage() === 'ar';
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
          backgroundColor: originalBackgroundColor,
        }}
        transition={{
          duration: 0.2,
        }}
        className={`flex w-full fixed top-0 inset-x-0 mx-auto border border-l-0 border-r-0 border-transparent dark:border-white/[0.2] dark:bg-black bg-[#030611] z-[5000] pr-8 pl-8 py-2 items-center justify-between space-x-4 ${className}`}
      >
        <div className="flex justify-between items-center w-full">
          <div className="dropdowns hidden lg:block" style={{ visibility: isPhone ? (user ? 'hidden' : 'visible') : 'visible' }}>
            <div className={`dropdown ${isOpen ? 'active' : ''}`}>
              <div className="customInput" ref={buttonRef} onClick={toggleDropdown}>
                {languageOptions.map((option) => {
                  if (option.locale === language) {
                    return (
                      <div key={option.locale} className="flex items-center">
                        <img src={option.imageUrl} alt={option.name} className="mr-[50px] rounded-md w-10 h-7" />
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute z-50 mt-2 w-56 rounded-xl md:rounded-2xl py-1 bg-[#21262d]/95 backdrop-blur-sm border border-[#30363d] shadow-lg"
                    style={{
                      left: isRTL ? 'auto' : '0',
                      right: isRTL ? '0' : 'auto',
                      top: '100%',
                    }}
                  >
                    <div className="px-2 py-2">
                      <p className="text-xs font-medium text-[#8b949e] px-3 pb-2">{isRTL ? 'اختر اللغة' : 'Select language'}</p>
                      {languageOptions.map((option) => (
                        <button
                          key={option.locale}
                          onClick={() => handleLanguageChange(option.locale)}
                          className={`w-full px-3 py-2.5 text-left rounded-xl text-[#c9d1d9] hover:bg-[#30363d] flex items-center ${
                            isRTL ? 'flex-row-reverse' : ''
                          } justify-between group transition duration-200 ${option.locale === language ? 'bg-[#30363d]' : ''}`}
                        >
                          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <img
                              src={option.imageUrl}
                              alt={option.name}
                              className="w-5 h-5 rounded-full object-cover ring-1 ring-[#30363d]"
                            />
                            <span className="font-medium">{option.name}</span>
                          </div>
                          {option.locale === language ? (
                            <Icon icon="lucide:check" className="text-sm text-[#2ea043]" />
                          ) : (
                            <Icon
                              icon={isRTL ? 'lucide:arrow-left' : 'lucide:arrow-right'}
                              className="text-sm opacity-0 group-hover:opacity-100 transition-opacity text-[#8b949e]"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className={`flex items-center gap-4 relative right-0 ${isRTL ? 'lg:right-[40px]' : 'lg:right-[-40px]'}`}>
            <Link href="/" className="flex items-center gap-4">
              <img src="/logo.png" width={60} height={60} alt="Logo" className="transform transition duration-1000 hover:rotate-[360deg]" />
              <h2 className="text-[30px] font-bold hidden lg:flex">Wicks Bot</h2>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {/*             <button className="gold-button gap-4">
              <FaCrown className="h-5 w-5" />
              <h2 className="text-[14px] font-bold">{t('header.firstbutton')}</h2>
            </button> */}
            <UserMenu user={user} />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
