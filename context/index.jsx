'use client';

import { createContext, useState, useEffect } from 'react';
import { fetchGuilds, fetchUser, api } from '../utils/api';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import locale from '../utils/locals';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [guilds, setGuilds] = useState(null);
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState(null);
  const searchParams = useSearchParams();
  // Load language from localStorage on component mount
  useEffect(() => {
    const token = searchParams.get('login');

    if (token) {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      router.push('/');
    }

    const savedLanguage = localStorage.getItem('language');
    api.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    if (savedLanguage) {
      setLanguage(savedLanguage);
      locale.setLanguage(savedLanguage);
      router.refresh();
    } else {
      const defaultLanguage = navigator.language == 'ar' ? 'ar' : 'en';
      setLanguage(defaultLanguage);
      locale.setLanguage(defaultLanguage);
      router.refresh();
    }
  }, []);

  // Save language to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage && language) {
      localStorage.setItem('language', language);
      locale.setLanguage(language);
      router.refresh();
    }
  }, [language]);

  useEffect(() => {
    // Fetch guilds and user data
    const fetchData = async () => {
      try {
        const userData = await fetchUser(localStorage.getItem('token'));
        const guildsData = await fetchGuilds(localStorage.getItem('token'));
        setGuilds(guildsData);
        setUser(userData);
      } catch (error) {
        if (pathname.startsWith('/dashboard')) {
          router.push('/');
        }
        console.error('Failed to fetch guild data or channels:', error);
      }
    };

    fetchData();
  }, []);

  const value = {
    language,
    guilds,
    user,
    setLanguage,
    locale,
  };

  return <DataContext.Provider value={value}>{language ? children : <></>}</DataContext.Provider>;
};
