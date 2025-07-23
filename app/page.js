'use client';

import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import { PiBellRingingFill } from 'react-icons/pi';
import { ImTicket } from 'react-icons/im';
import { BiSolidShieldAlt2 } from 'react-icons/bi';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { DataContext } from '../context';
import Footer from '../components/Footer';
import { formatNumber } from '../utils';

function Home() {
  const [stats, setStats] = useState({
    members: 0,
    users: 0,
    guilds: 0,
  });

  // Parallax effect for hero section
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Page transition animation
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    // Set a small delay to ensure smooth animation
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const dynamicData = await fetch(`${process.env.API_URL}/stats`, { cache: 'no-store' });
        const data = await dynamicData.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Fallback stats are already set in initial state
      }
    };

    fetchStats();
  }, []);

  const { user, locale } = useContext(DataContext);

  const handleClick = () => {
    window.location.href = process.env.LOGIN_URL;
  };
  const handleInvite = () => {
    window.location.href = process.env.INVITE_URL;
  };

  // Page transition variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeInOut',
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div initial="hidden" animate={isPageLoaded ? 'visible' : 'hidden'} variants={pageVariants} className="overflow-hidden">
      {/* Head/Meta Tags */}
      <Head>
        <title>Wicks Bot</title>
        <meta name="description" content="This is my page description" />
        <link rel="icon" href="/logo.png" />
      </Head>

      {/* Hero Section - Enhanced with parallax and improved visual elements */}
      <section className="min-h-screen relative px-4 sm:px-6 lg:px-8 xl:px-0 custom-grid overflow-hidden">
        <div className="absolute inset-0 stars-small opacity-70" style={{ transform: `translateY(${scrollY * 0.1}px)` }} />
        <div className="absolute inset-0 stars-big opacity-70" style={{ transform: `translateY(${scrollY * 0.2}px)` }} />

        <div className="flex justify-center items-center min-h-screen fade-color">
          <div className="flex flex-col justify-center items-center text-center gap-4 sm:gap-6 lg:gap-8 z-10 w-full max-w-[1200px] mx-auto">
            {/* Main Title with enhanced animation */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold">
                <span className="bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">{locale.home.hero.title}</span>
              </h2>
              <div className="absolute -inset-1 bg-gradient-to-r from-[#CFB360]/0 via-[#CFB360]/10 to-[#CFB360]/0 blur-xl opacity-70 -z-10 rounded-full" />
            </motion.div>

            {/* Description with enhanced styling */}
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-[800px] text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 font-light leading-relaxed px-4 sm:px-6 drop-shadow-lg"
            >
              {locale.home.hero.paragraph}
            </motion.p>

            {/* CTA Buttons with improved hover effects */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex gap-3 sm:gap-4 flex-col sm:flex-row items-center w-full sm:w-auto px-4 sm:px-0"
            >
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(207,179,96,0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleInvite}
                className="w-full sm:w-auto flex gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gold-gradient text-black font-semibold items-center justify-center group transition-all duration-300 hover:shadow-[0_0_20px_rgba(207,179,96,0.3)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Icon icon="ic:baseline-discord" className="size-[20px] sm:size-[24px] relative z-10" />
                <span className="relative z-10">{locale.home.hero.firstbutton}</span>
                <Icon
                  icon="solar:arrow-right-bold-duotone"
                  className="size-[16px] sm:size-[20px] transition-transform duration-300 group-hover:translate-x-1 relative z-10"
                />
              </motion.button>

              {!user ? (
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 0 15px rgba(207,179,96,0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClick}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl border border-[#CFB360]/20 bg-[#CFB360]/5 hover:bg-[#CFB360]/10 text-white font-semibold backdrop-blur-sm transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-[#CFB360]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">{locale.home.hero.twicebutton}</span>
                </motion.button>
              ) : (
                <Link prefetch href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: '0 0 15px rgba(207,179,96,0.2)' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl border border-[#CFB360]/20 bg-[#CFB360]/5 hover:bg-[#CFB360]/10 text-white font-semibold backdrop-blur-sm transition-all duration-300 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-[#CFB360]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10">{locale.home.hero.thirdbutton}</span>
                  </motion.button>
                </Link>
              )}
            </motion.div>
          </div>

          {/* Enhanced Bottom Glow */}
          <div className="absolute rounded-full h-[643px] w-[773px] bg-[#CFB360] ring-4 ring-[#6B5A29] ring-opacity-50 blur-[307.51px] -bottom-[50rem]" />
        </div>
      </section>

      {/* Features Banner - Enhanced with glass morphism and better hover effects */}
      <div className="bg-gradient-to-r from-[#CFB360] via-[#E2CC87] to-[#CFB360] h-[80px] relative overflow-hidden shadow-lg">
        {/* Overlay gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>

        {/* Glass effect background */}
        <div className="absolute inset-0 backdrop-blur-[2px] bg-black/5"></div>

        {/* Content container */}
        <div className="relative h-full flex items-center">
          {/* Ticker wrapper - Only animates on mobile */}
          <div className="absolute flex md:justify-center md:inset-x-0 mobile-ticker">
            {/* Content wrapper */}
            <div className="flex items-center space-x-12 whitespace-nowrap md:justify-center">
              {[
                { icon: <PiBellRingingFill className="text-[24px] text-[#040715]" />, text: locale.home.cards.card_1 },
                { icon: <ImTicket className="text-[24px] text-[#040715]" />, text: locale.home.cards.card_2 },
                { icon: <Icon icon="mdi:human-welcome" className="text-[24px] text-[#040715]" />, text: locale.home.cards.card_3 },
                { icon: <BiSolidShieldAlt2 className="text-[24px] text-[#040715]" />, text: locale.home.cards.card_4 },
              ].map((item, index) => (
                <div key={index} className="feature-item">
                  <div className="flex items-center gap-3 px-8 py-2 hover:scale-105 transition-transform duration-300">
                    <div className="icon-wrapper p-2 bg-black/10 rounded-full">{item.icon}</div>
                    <h2 className="text-[#040715] font-bold whitespace-nowrap text-sm md:text-base">{item.text}</h2>
                  </div>
                </div>
              ))}
            </div>

            {/* Duplicate set - Only shown on mobile */}
            <div className="flex items-center space-x-12 whitespace-nowrap md:hidden">
              {[
                { icon: <PiBellRingingFill className="text-[24px] text-[#040715]" />, text: locale.home.cards.card_1 },
                { icon: <ImTicket className="text-[24px] text-[#040715]" />, text: locale.home.cards.card_2 },
                { icon: <Icon icon="mdi:human-welcome" className="text-[24px] text-[#040715]" />, text: locale.home.cards.card_3 },
                { icon: <BiSolidShieldAlt2 className="text-[24px] text-[#040715]" />, text: locale.home.cards.card_4 },
              ].map((item, index) => (
                <div key={index} className="feature-item">
                  <div className="flex items-center gap-3 px-8 py-2 hover:scale-105 transition-transform duration-300">
                    <div className="icon-wrapper p-2 bg-black/10 rounded-full">{item.icon}</div>
                    <h2 className="text-[#040715] font-bold whitespace-nowrap text-sm md:text-base">{item.text}</h2>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <section className="min-h-screen bg-background-500 relative py-8 sm:py-12 lg:py-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute rounded-full h-[200px] sm:h-[250px] lg:h-[350px] w-[120px] sm:w-[150px] lg:w-[200px] bg-[#CFB360] ring-4 ring-[#6B5A29] ring-opacity-50 blur-[60px] sm:blur-[80px] lg:blur-[110px] -right-[8rem] sm:-right-[10rem] lg:-right-[15rem] top-[8rem] sm:top-[10rem] lg:top-[15rem]" />
          <div className="absolute rounded-full h-[200px] sm:h-[250px] lg:h-[350px] w-[120px] sm:w-[150px] lg:w-[200px] bg-[#CFB360] ring-4 ring-[#6B5A29] ring-opacity-50 blur-[60px] sm:blur-[80px] lg:blur-[110px] -left-[8rem] sm:-left-[10rem] lg:-left-[15rem] bottom-[12rem] sm:bottom-[15rem] lg:bottom-[20rem]" />
        </div>

        {/* Feature Highlights */}
        <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col gap-12 sm:gap-16 lg:gap-24">
            {[
              {
                image: '/future-3.png',
                icon: 'solar:ticket-bold-duotone',
                head: locale.home.future_3.head,
                title: locale.home.future_3.title,
                paragraph: locale.home.future_3.paragraph,
                direction: 'normal',
                bgColor: 'from-[#CFB360]/10 via-[#E2CC87]/5 to-transparent',
                delay: 0.1,
              },
              {
                image: '/future-2.png',
                icon: 'solar:hand-stars-bold-duotone',
                head: locale.home.future_2.head,
                title: locale.home.future_2.title,
                paragraph: locale.home.future_2.paragraph,
                direction: 'reverse',
                bgColor: 'from-[#E2CC87]/10 via-[#CFB360]/5 to-transparent',
                delay: 0.2,
              },
              {
                image: '/future-1.png',
                icon: 'solar:users-group-rounded-bold-duotone',
                head: locale.home.future_1.head,
                title: locale.home.future_1.title,
                paragraph: locale.home.future_1.paragraph,
                direction: 'normal',
                bgColor: 'from-[#B89A50]/10 via-[#CFB360]/5 to-transparent',
                delay: 0.3,
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`relative flex flex-col lg:flex-row ${
                  feature.direction === 'reverse' ? 'lg:flex-row-reverse' : ''
                } gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-center bg-gradient-to-b from-[#CFB360]/5 via-transparent to-transparent lg:bg-none p-4 sm:p-6 lg:p-0 rounded-2xl lg:rounded-none`}
              >
                {/* Image Section - Now Second on Mobile */}
                {index === 0 && (
                  <div className="hidden lg:block absolute inset-0 pointer-events-none">
                    <div className="absolute w-full h-full">
                      <div className="absolute -top-20 left-1/4 w-48 h-48 bg-[#CFB360]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
                      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-[#E2CC87]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
                    </div>
                  </div>
                )}

                {/* Content Section - First on Mobile */}
                <div className="w-full lg:w-1/2 px-0 sm:px-4 lg:px-6 xl:px-8">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="space-y-4 sm:space-y-5 lg:space-y-6"
                  >
                    {/* Feature Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#CFB360]/10 border border-[#CFB360]/20 backdrop-blur-sm shadow-lg">
                      <Icon icon={feature.icon} className="w-4 h-4 sm:w-5 sm:h-5 text-[#CFB360]" />
                      <span className="text-xs sm:text-sm font-semibold text-[#CFB360] whitespace-nowrap">{feature.head}</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] xl:text-[45px] font-extrabold bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent leading-[1.2] sm:leading-[1.15]">
                      {feature.title}
                    </h2>

                    {/* Description */}
                    <p className="text-sm sm:text-base lg:text-lg text-gray-400/90 font-medium leading-relaxed max-w-2xl">
                      {feature.paragraph}
                    </p>
                  </motion.div>
                </div>

                {/* Image Section - Second on Mobile */}
                <motion.div
                  initial={{ opacity: 0, x: feature.direction === 'reverse' ? 100 : -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  className="w-full lg:w-1/2 relative group mt-8 lg:mt-0"
                >
                  <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#CFB360]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9] relative">
                      <Image
                        src={feature.image}
                        fill
                        className="object-cover"
                        alt={`feature-${index + 1}`}
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                      />
                    </div>
                  </div>

                  {/* Mobile-only bottom gradient separator */}
                  <div className="h-px w-full bg-gradient-to-r from-[#CFB360]/20 via-[#CFB360]/10 to-transparent lg:hidden mt-8" />
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="w-full min-h-screen lg:min-h-0 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-16 flex flex-col lg:flex-row justify-between items-center gap-8 sm:gap-12 lg:gap-16 relative">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#CFB360]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70" />
          <div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#E2CC87]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
            style={{ animationDelay: '2s' }}
          />
        </div>

        {/* Left Content */}
        <div className="w-full lg:w-[50rem] flex flex-col gap-6 sm:gap-8 lg:gap-[3rem] relative z-10">
          <div className="space-y-4 sm:space-y-6">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-block"
            >
              <span className="px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold rounded-full bg-[#CFB360]/10 text-[#CFB360] border border-[#CFB360]/20 hover:bg-[#CFB360]/15 transition-colors duration-300 shadow-md hover:shadow-lg">
                ✨ {locale.home.stats.badge}
              </span>
            </motion.div>

            {/* Main Title with enhanced styling */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-[#CFB360] via-[#E2CC87] to-[#CFB360] bg-clip-text text-transparent relative"
            >
              {locale.home.stats.title}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#CFB360]/0 via-[#CFB360]/5 to-[#CFB360]/0 blur-xl opacity-70 -z-10 rounded-full" />
            </motion.h2>

            {/* Subtitle with enhanced styling */}
            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white/90 drop-shadow-md"
            >
              {locale.home.stats.subtitle.replace('[num]', formatNumber(stats.guilds))}
            </motion.h3>
          </div>

          {/* Description with enhanced styling */}
          <div className="space-y-4 sm:space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg sm:text-xl lg:text-2xl text-white/80 leading-relaxed drop-shadow-sm"
            >
              {locale.home.stats.description1}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-sm sm:text-base lg:text-lg text-white/60 leading-relaxed"
            >
              {locale.home.stats.description2}
            </motion.p>
          </div>
        </div>

        {/* Right Stats - Enhanced with better card styling */}
        <div className="w-full lg:w-auto grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 relative z-10">
          {[
            {
              value: stats.users,
              label: locale.home.stats.userLabel,
              gradientBg: 'bg-gradient-to-br from-[#CFB360]/10 via-[#E2CC87]/5 to-[#B89A50]/10',
              iconGradient: 'bg-gradient-to-r from-[#CFB360] to-[#E2CC87]',
              borderGlow: 'shadow-[0_0_15px_rgba(207,179,96,0.1)]',
              hoverGlow: 'group-hover:shadow-[0_0_25px_rgba(207,179,96,0.2)]',
              numberGradient: 'from-[#CFB360] via-[#E2CC87] to-[#CFB360]',
              icon: 'ph:users-three-fill',
              delay: 0.6,
            },
            {
              value: stats.guilds,
              label: locale.home.stats.serverLabel,
              gradientBg: 'bg-gradient-to-br from-[#E2CC87]/10 via-[#CFB360]/5 to-[#E2CC87]/10',
              iconGradient: 'bg-gradient-to-r from-[#E2CC87] to-[#CFB360]',
              borderGlow: 'shadow-[0_0_15px_rgba(226,204,135,0.1)]',
              hoverGlow: 'group-hover:shadow-[0_0_25px_rgba(226,204,135,0.2)]',
              numberGradient: 'from-[#E2CC87] via-[#CFB360] to-[#E2CC87]',
              icon: 'ph:buildings-bold',
              delay: 0.7,
            },
            {
              value: stats.members,
              label: locale.home.stats.memberLabel,
              gradientBg: 'bg-gradient-to-br from-[#B89A50]/10 via-[#CFB360]/5 to-[#B89A50]/10',
              iconGradient: 'bg-gradient-to-r from-[#B89A50] to-[#CFB360]',
              borderGlow: 'shadow-[0_0_15px_rgba(184,154,80,0.1)]',
              hoverGlow: 'group-hover:shadow-[0_0_25px_rgba(184,154,80,0.2)]',
              numberGradient: 'from-[#B89A50] via-[#CFB360] to-[#B89A50]',
              icon: 'ph:crown-bold',
              delay: 0.8,
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: stat.delay, duration: 0.8 }}
              whileHover={{ scale: 1.03 }}
              className={`
                  group relative p-8 rounded-2xl
                  ${stat.gradientBg}
                  border border-white/5
                  backdrop-blur-sm
                  transition-all duration-500
                  ${stat.borderGlow}
                  ${stat.hoverGlow}
                  hover:border-white/10
                  cursor-pointer
                `}
            >
              <div className="flex items-start gap-6">
                <div
                  className={`
                    p-4 rounded-xl
                    ${stat.iconGradient}
                    bg-opacity-10 backdrop-blur-sm
                    shadow-lg
                    transition-transform duration-300
                    group-hover:scale-110
                  `}
                >
                  <Icon icon={stat.icon} className="text-3xl text-white drop-shadow-lg" />
                </div>
                <div>
                  <h4
                    className={`
                      text-5xl lg:text-6xl font-bold
                      bg-gradient-to-r ${stat.numberGradient}
                      bg-clip-text text-transparent
                      mb-3
                      transition-all duration-300
                      group-hover:scale-105
                    `}
                  >
                    {formatNumber(stat.value)}+
                  </h4>
                  <p
                    className="
                      text-sm text-white/60
                      font-medium uppercase tracking-wider
                      transition-colors duration-300
                      group-hover:text-white/80
                    "
                  >
                    {stat.label}
                  </p>
                </div>
              </div>

              {/* Ambient Light Effect - Enhanced */}
              <div
                className={`
                  absolute inset-0 rounded-2xl
                  bg-gradient-to-r ${stat.numberGradient}
                  opacity-0 group-hover:opacity-5
                  transition-opacity duration-500
                  blur-2xl
                `}
              />

              {/* Highlight Effect - Enhanced */}
              <div
                className="
                  absolute inset-0 rounded-2xl
                  bg-gradient-to-br from-white/5 via-transparent to-transparent
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-500
                "
              />

              {/* Animated border glow */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#CFB360] to-[#E2CC87] rounded-2xl opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Premium Features Section - Enhanced with better UI/UX */}
      <section className="relative bg-background-500 pt-0 pb-12 sm:pb-16 lg:pb-20">
        <div className="w-full px-4 sm:px-6 md:container md:mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl border border-[#CFB360]/20 hover:border-[#CFB360]/30 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            {/* Enhanced gradient background */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[#161b22]" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#CFB360]/10 via-transparent to-[#E2CC87]/10" />
              <div className="absolute w-full h-full">
                <div
                  className="absolute top-0 left-0 w-[300px] sm:w-[400px] lg:w-[500px] h-[300px] sm:h-[400px] lg:h-[500px] bg-[#CFB360]/20 rounded-full mix-blend-overlay filter blur-[40px] sm:blur-[60px] lg:blur-[80px]"
                  style={{ animationDuration: '4s' }}
                />
                <div
                  className="absolute bottom-0 right-0 w-[300px] sm:w-[400px] lg:w-[500px] h-[300px] sm:h-[400px] lg:h-[500px] bg-[#E2CC87]/20 rounded-full mix-blend-overlay filter blur-[40px] sm:blur-[60px] lg:blur-[80px]"
                  style={{ animationDuration: '6s', animationDelay: '2s' }}
                />
              </div>
              <div className="absolute inset-0 bg-[#161b22]/50 backdrop-blur-3xl" />
            </div>

            {/* Content wrapper with glass effect */}
            <div className="relative z-10">
              {/* Top banner with enhanced styling */}
              <div className="bg-gradient-to-r from-[#CFB360]/20 via-[#E2CC87]/20 to-[#CFB360]/20 p-1.5 sm:p-2 text-center border-b border-[#CFB360]/20">
                <span className="text-xs sm:text-sm font-medium text-[#CFB360] flex items-center justify-center gap-1.5">
                  <Icon icon="solar:star-bold" className="text-[#CFB360] animate-pulse" />
                  {locale.premium.limitedOffer}
                </span>
              </div>

              {/* Main content with enhanced layout */}
              <div className="w-full p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
                {/* Left side - Content */}
                <div className="w-full flex-1 space-y-6 lg:space-y-8">
                  <div className="space-y-3 lg:space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#CFB360]/10 border border-[#CFB360]/20 hover:bg-[#CFB360]/15 transition-colors duration-300">
                      <Icon icon="ph:crown-simple-fill" className="text-[#CFB360] text-xs sm:text-sm lg:text-base" />
                      <span className="text-[#CFB360] text-xs sm:text-sm font-semibold">{locale.premium.exclusive}</span>
                    </div>

                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold">
                      <span className="bg-gradient-to-r from-[#CFB360] to-[#E2CC87] bg-clip-text text-transparent">
                        {locale.premium.adTitle}
                      </span>
                    </h2>

                    <p className="text-sm sm:text-base lg:text-lg text-gray-400 leading-relaxed">{locale.premium.description}</p>
                  </div>

                  {/* Features grid with enhanced card styling */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                    {[
                      {
                        icon: 'ph:crown-fill',
                        title: locale.premium.feature1Title,
                        desc: locale.premium.feature1Desc,
                      },
                      {
                        icon: 'ph:rocket-fill',
                        title: locale.premium.feature2Title,
                        desc: locale.premium.feature2Desc,
                      },
                      {
                        icon: 'ph:chart-line-up-fill',
                        title: locale.premium.feature3Title,
                        desc: locale.premium.feature3Desc,
                      },
                      {
                        icon: 'ph:headset-fill',
                        title: locale.premium.feature4Title,
                        desc: locale.premium.feature4Desc,
                      },
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.03 }}
                        className="p-3 sm:p-4 rounded-xl bg-[#CFB360]/5 border border-[#CFB360]/10 hover:border-[#CFB360]/20 transition-all duration-300 hover:bg-[#CFB360]/10 group relative overflow-hidden"
                      >
                        {/* Ambient glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#CFB360]/5 via-transparent to-[#E2CC87]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="relative z-10">
                          <Icon
                            icon={feature.icon}
                            className="text-[#CFB360] text-xl lg:text-2xl mb-2 lg:mb-3 group-hover:scale-110 transition-transform duration-300"
                          />
                          <h3 className="font-semibold text-white text-sm lg:text-base mb-1 lg:mb-2">{feature.title}</h3>
                          <p className="text-gray-400 text-xs lg:text-sm group-hover:text-gray-300 transition-colors duration-300">
                            {feature.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button with enhanced styling */}
                  <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 items-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.open('https://discord.gg/tBwAeuJuud', '_blank')}
                      className="relative inline-flex items-center justify-center w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 bg-gradient-to-r from-[#CFB360] to-[#E2CC87] hover:from-[#B89A50] hover:to-[#D1B670] text-black rounded-md font-semibold transition-all duration-200 text-xs sm:text-sm lg:text-base group overflow-hidden"
                    >
                      <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Icon icon="ic:baseline-discord" className="mr-2 text-base sm:text-lg lg:text-xl relative z-10" />
                      <span className="relative z-10">{locale.premium.openTicket}</span>
                    </motion.button>
                  </div>
                </div>

                {/* Right side - Decorative element with enhanced animation */}
                <div className="lg:w-1/3 hidden lg:block">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                  >
                    <div className="relative w-full aspect-square flex items-center justify-center">
                      {/* Animated rings with enhanced styling */}
                      <div className="absolute inset-0 animate-spin-slow">
                        <div className="absolute inset-4 border-2 border-[#CFB360]/20 rounded-full" />
                        <div className="absolute inset-8 border-2 border-[#CFB360]/15 rounded-full" />
                        <div className="absolute inset-12 border-2 border-[#CFB360]/10 rounded-full" />
                      </div>
                      {/* Center icon with enhanced styling */}
                      <div className="relative z-10 bg-gradient-to-br from-[#CFB360] to-[#E2CC87] p-6 sm:p-8 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                        <Icon
                          icon="ph:crown-fill"
                          className="text-black text-4xl sm:text-5xl lg:text-6xl group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background-500 relative overflow-hidden">
        {/* Background Effects - Enhanced */}
        <div className="absolute inset-0">
          <div
            className="absolute top-0 left-1/4 w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 bg-[#CFB360] rounded-full mix-blend-multiply filter blur-lg sm:blur-xl opacity-10 animate-pulse"
            style={{ animationDuration: '8s' }}
          ></div>
          <div
            className="absolute top-0 right-1/4 w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 bg-[#E2CC87] rounded-full mix-blend-multiply filter blur-lg sm:blur-xl opacity-10 animate-pulse"
            style={{ animationDuration: '10s', animationDelay: '2s' }}
          ></div>
          <div
            className="absolute bottom-0 left-1/3 w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 bg-[#B89A50] rounded-full mix-blend-multiply filter blur-lg sm:blur-xl opacity-10 animate-pulse"
            style={{ animationDuration: '12s', animationDelay: '4s' }}
          ></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 mb-4 sm:mb-6 text-xs sm:text-sm font-semibold rounded-full bg-[#CFB360]/10 text-[#CFB360] border border-[#CFB360]/20 hover:bg-[#CFB360]/15 transition-colors duration-300 shadow-md hover:shadow-lg">
              <span className="mr-2">🌟</span>
              {locale.home.community.joinBadge.replace('[num]', formatNumber(stats.members))}
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-[#CFB360] to-[#E2CC87] bg-clip-text text-transparent relative">
              {locale.home.community.title}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#CFB360]/0 via-[#CFB360]/5 to-[#CFB360]/0 blur-xl opacity-70 -z-10 rounded-full" />
            </h2>

            <p className="text-gray-400 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 lg:mb-10 leading-relaxed">
              {locale.home.community.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(207,179,96,0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('https://discord.gg/tBwAeuJuud', '_blank')}
                className="w-full sm:w-auto group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#CFB360] to-[#E2CC87] rounded-xl font-semibold text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(207,179,96,0.3)] flex items-center justify-center gap-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Icon icon="ic:baseline-discord" className="text-xl sm:text-2xl relative z-10" />
                <span className="relative z-10">{locale.home.community.joinButton}</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Enhanced with better styling */}
      <Footer />
    </motion.div>
  );
}

export default Home;
