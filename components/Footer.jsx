'use client';

import React, { useContext, useState, useRef, useEffect } from 'react';
import { DataContext } from '../context';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
  const { locale, setLanguage } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const isRTL = locale.getLanguage() === 'ar';
  const [dropdownPosition, setDropdownPosition] = useState('left');
  const [isMobile, setIsMobile] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleLanguageChange = async (locale) => {
    closeDropdown();
    setLanguage(locale);
  };

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
    const updateDropdownPosition = () => {
      if (dropdownRef.current && buttonRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const spaceOnRight = windowWidth - buttonRect.right;
        const spaceOnLeft = buttonRect.left;

        // Set position based on available space
        setDropdownPosition(spaceOnRight > spaceOnLeft ? 'left' : 'right');
      }
    };

    if (isOpen) {
      updateDropdownPosition();
      window.addEventListener('resize', updateDropdownPosition);
      return () => window.removeEventListener('resize', updateDropdownPosition);
    }
  }, [isOpen]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const languageOptions = [
    { name: 'العربية', locale: 'ar', imageUrl: '/ar.png' },
    { name: 'English', locale: 'en', imageUrl: '/en.png' },
  ];

  // Social media links with enhanced styling
  const socialLinks = [
    { href: 'https://www.youtube.com/@wick_studio', icon: 'mdi:youtube', hoverColor: 'hover:bg-red-600', label: 'YouTube' },
    /*     { href: 'https://x.com/MrWick077', icon: 'ri:twitter-x-fill', hoverColor: 'hover:bg-[#1DA1F2]', label: 'Twitter' }, */
    { href: 'https://discord.gg/tBwAeuJuud', icon: 'ic:baseline-discord', hoverColor: 'hover:bg-[#5865F2]', label: 'Discord' },
    /*     { href: 'https://github.com/wickstudio', icon: 'mdi:github', hoverColor: 'hover:bg-gray-800', label: 'GitHub' },
    {
      href: 'https://www.instagram.com/mik__subhi',
      icon: 'mdi:instagram',
      hoverColor: 'hover:bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500',
      label: 'Instagram',
    }, */
  ];

  return (
    <footer
      className={`relative bg-[#0d1117] border-t border-[#30363d]/40 text-white pt-6 pb-12 md:pt-12 lg:pt-16 md:pb-20 lg:pb-32 ${
        isRTL ? 'rtl' : 'ltr'
      }`}
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/4 w-64 h-64 bg-[#CFB360]/5 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-pulse"
          style={{ animationDuration: '15s' }}
        ></div>
        <div
          className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#E2CC87]/5 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-pulse"
          style={{ animationDuration: '20s', animationDelay: '5s' }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`relative flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-16 ${isRTL ? 'lg:flex-row-reverse' : ''} justify-between`}
        >
          {/* Logo Section - Improved for RTL/LTR */}
          <div className={`flex flex-col gap-4 sm:gap-6 items-center ${isRTL ? 'lg:items-end' : 'lg:items-start'}`}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link href="/">
                <img
                  src="/solid-logo.png"
                  alt="Solid Logo"
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 hover:opacity-90 transition-opacity"
                />
              </Link>
            </motion.div>

            {/* Social Icons - Improved spacing and hover effects */}
            <div className={`flex gap-2.5 sm:gap-3 md:gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {socialLinks.map((link, index) => (
                <Link key={index} href={link.href} aria-label={link.label}>
                  <motion.div
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 sm:p-2.5 md:p-3 bg-[#21262d] rounded-lg md:rounded-xl text-[#c9d1d9] ${link.hoverColor} hover:text-white transform transition-all duration-300 cursor-pointer hover:shadow-lg relative group overflow-hidden`}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white rounded-lg md:rounded-xl transition-opacity duration-300"></div>
                    <Icon icon={link.icon} className="text-sm sm:text-base md:text-lg lg:text-xl relative z-10" />
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Copyright text with RTL/LTR support */}
            <p
              className={`text-[#8b949e] text-center ${
                isRTL ? 'lg:text-right' : 'lg:text-left'
              } text-xs sm:text-sm max-w-[300px] mx-auto lg:mx-0`}
            >
              {locale.home.footer.text_3}
            </p>
          </div>

          {/* Links Section - Improved grid layout with RTL/LTR support */}
          <div className={`grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 w-full lg:w-auto`}>
            {/* About Section - Enhanced for RTL/LTR */}
            <div className="space-y-3 sm:space-y-4">
              <h2
                className={`text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#c9d1d9] ${
                  isRTL ? 'text-right' : 'text-left'
                } border-b border-[#30363d]/40 pb-2`}
              >
                {locale.home.about.head}
              </h2>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  { href: '/terms-of-use', text: locale.home.about.item_2 },
                  { href: '/privacy-policy', text: locale.home.about.item_3 },
                  { href: '/refund-policy', text: locale.home.about.item_1 },
                  { href: 'mailto:support@wick-studio.com', text: locale.home.about.item_4 },
                ].map((link, index) => (
                  <li key={index} className={isRTL ? 'text-right' : 'text-left'}>
                    <Link href={link.href}>
                      <motion.span
                        whileHover={{ x: isRTL ? -8 : 8, color: '#ffffff' }}
                        className={`text-[#8b949e] hover:text-white transition-colors duration-200 text-xs sm:text-sm flex items-center group gap-1.5 ${
                          isRTL ? 'flex-row-reverse justify-end' : 'justify-start'
                        }`}
                      >
                        {isRTL ? (
                          <>
                            <Icon icon="lucide:chevron-left" className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                            {link.text}
                          </>
                        ) : (
                          <>
                            {link.text}
                            <Icon icon="lucide:chevron-right" className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                          </>
                        )}
                      </motion.span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Other Links Section - Enhanced for RTL/LTR */}
            <div className="space-y-3 sm:space-y-4">
              <h2
                className={`text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#c9d1d9] ${
                  isRTL ? 'text-right' : 'text-left'
                } border-b border-[#30363d]/40 pb-2`}
              >
                {locale.home.other.head}
              </h2>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  { href: 'https://top.gg/bot/652505019920285707', text: locale.home.other.item_1 },
                  { href: 'https://discordbotlist.com/bots/wicks', text: locale.home.other.item_2 },
                  { href: 'https://discord.gg/tBwAeuJuud', text: locale.home.other.item_3 },
                  { href: '/status', text: locale.home.about.item_5 },
                ].map((link, index) => (
                  <li key={index} className={isRTL ? 'text-right' : 'text-left'}>
                    <Link href={link.href}>
                      <motion.span
                        whileHover={{ x: isRTL ? -8 : 8, color: '#ffffff' }}
                        className={`text-[#8b949e] hover:text-white transition-colors duration-200 text-xs sm:text-sm flex items-center group gap-1.5 ${
                          isRTL ? 'flex-row-reverse justify-end' : 'justify-start'
                        }`}
                      >
                        {isRTL ? (
                          <>
                            <Icon icon="lucide:chevron-left" className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                            {link.text}
                          </>
                        ) : (
                          <>
                            {link.text}
                            <Icon icon="lucide:chevron-right" className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                          </>
                        )}
                      </motion.span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Language Selector - Improved for RTL/LTR */}
            <div className="relative col-span-2 lg:col-span-1 mt-6 lg:mt-0">
              <h2
                className={`text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#c9d1d9] ${
                  isRTL ? 'text-right' : 'text-left'
                } border-b border-[#30363d]/40 pb-2 mb-4 hidden lg:block`}
              >
                {isRTL ? 'اللغة' : 'Language'}
              </h2>

              <button
                onClick={toggleDropdown}
                ref={buttonRef}
                className={`w-full group flex items-center ${
                  isRTL ? 'flex-row-reverse' : ''
                } justify-between gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-[#21262d]/80 hover:bg-[#30363d] transition-all duration-200 border border-[#30363d] hover:border-[#6e7681] focus:outline-none focus:ring-2 focus:ring-[#6e7681] focus:ring-opacity-50`}
              >
                <img
                  src={`/${locale.getLanguage()}.png`}
                  alt={locale.getLanguage()}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-[#30363d]"
                />
                <span className="text-[#c9d1d9] font-medium text-sm sm:text-base">
                  {locale.getLanguage() === 'ar' ? 'العربية' : 'English'}
                </span>
                <Icon
                  icon="lucide:chevron-down"
                  className={`text-[#8b949e] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    ref={dropdownRef}
                    initial={isMobile ? { opacity: 0, y: '100vh' } : { opacity: 0, y: 8, scale: 0.98 }}
                    animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: 1 }}
                    exit={isMobile ? { opacity: 0, y: '100vh' } : { opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className={`
                      ${
                        isMobile
                          ? 'fixed inset-x-0 bottom-0 rounded-t-2xl z-50'
                          : `absolute z-50 mt-2 w-full sm:w-56 rounded-xl md:rounded-2xl ${
                              isRTL
                                ? dropdownPosition === 'right'
                                  ? 'left-0'
                                  : 'right-0'
                                : dropdownPosition === 'right'
                                ? 'right-0'
                                : 'left-0'
                            }`
                      }
                      py-1.5 bg-[#21262d]/95 backdrop-blur-sm border border-[#30363d] shadow-xl
                    `}
                  >
                    {isMobile && <div className="w-12 h-1 bg-[#30363d] rounded-full mx-auto my-2" />}
                    <div className="px-2 py-2">
                      <p className={`text-xs font-medium text-[#8b949e] px-3 pb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {isRTL ? 'اختر اللغة' : 'Select language'}
                      </p>
                      {languageOptions.map((option) => (
                        <motion.button
                          key={option.locale}
                          onClick={() => handleLanguageChange(option.locale)}
                          whileHover={{ scale: 1.02, backgroundColor: 'rgba(48, 54, 61, 0.8)' }}
                          className={`w-full px-3 py-2.5 ${
                            isRTL ? 'text-right' : 'text-left'
                          } rounded-xl text-[#c9d1d9] hover:bg-[#30363d] flex items-center ${
                            isRTL ? 'flex-row-reverse' : ''
                          } justify-between group transition duration-200 ${option.locale === locale.getLanguage() ? 'bg-[#30363d]' : ''}`}
                        >
                          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <img
                              src={option.imageUrl}
                              alt={option.name}
                              className="w-5 h-5 rounded-full object-cover ring-1 ring-[#30363d]"
                            />
                            <span className="font-medium text-sm">{option.name}</span>
                          </div>
                          {option.locale === locale.getLanguage() ? (
                            <Icon icon="lucide:check" className="text-sm text-[#2ea043]" />
                          ) : (
                            <Icon
                              icon={isRTL ? 'lucide:arrow-left' : 'lucide:arrow-right'}
                              className="text-sm opacity-0 group-hover:opacity-100 transition-opacity text-[#8b949e]"
                            />
                          )}
                        </motion.button>
                      ))}
                    </div>

                    {/* Optional: Add a footer section with improved styling */}
                    <div className="border-t border-[#30363d] mt-1 px-2 py-2">
                      <a
                        href="#"
                        className={`w-full px-3 py-2 ${
                          isRTL ? 'text-right' : 'text-left'
                        } rounded-xl text-[#8b949e] hover:bg-[#30363d] flex items-center ${
                          isRTL ? 'flex-row-reverse' : ''
                        } gap-2 text-xs sm:text-sm group transition duration-200`}
                      >
                        <Icon icon="lucide:globe" className="text-base" />
                        <span>{isRTL ? 'المزيد من اللغات قريباً' : 'More languages coming soon'}</span>
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
