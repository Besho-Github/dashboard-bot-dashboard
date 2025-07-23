'use client';

import { Lexend } from '@next/font/google';

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

import Nav from '../components/Nav';
import Head from 'next/head';
import { useContext } from 'react';
import { DataContext } from '../context';

const Layout = ({ children }) => {
  const { locale } = useContext(DataContext);

  const isRTL = locale.getLanguage() === 'ar';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`page bg-[#020614]  text-white ${lexend.variable} font-lexend relative`}>
      <Head>
        <link rel="icon" href="/logo.png" />
      </Head>
      <Nav />
      {children}
    </div>
  );
};

export default Layout;
