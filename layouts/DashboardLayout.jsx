'use client';

import { useState, useEffect, useContext, useMemo } from 'react';
import Sidebar from 'react-sidebar';
import { DataContext } from '../context';
import { GuildDataContext, GuildDataProvider } from '../context/guild';
import { StaticNav } from '../components/ui/static-navbar';
import { Menu, MenuSkeleton } from '../components/ui/dashboard/sideMenu';
import style from '../components/styles/sidebar';
import { useParams } from 'next/navigation';

const DashboardLayoutInner = ({ children }) => {
  const { guilds, language } = useContext(DataContext);
  const { guild, loading } = useContext(GuildDataContext);
  const { id } = useParams();

  const [state, setState] = useState({
    sidebarDocked: false,
    sidebarOpen: false,
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 800px)');
    const mediaQueryChanged = () => {
      setState({
        sidebarDocked: id ? mql.matches : false,
        sidebarOpen: false,
      });
    };

    mql.addEventListener('change', mediaQueryChanged);
    mediaQueryChanged();

    return () => mql.removeEventListener('change', mediaQueryChanged);
  }, [id]);

  const handleOpen = () => {
    if (!id) return;
    setState((prevState) => ({
      ...prevState,
      sidebarOpen: !prevState.sidebarOpen,
    }));
  };

  const handleSetOpen = (open) => {
    if (!id) return;
    setState((prevState) => ({
      ...prevState,
      sidebarOpen: open,
    }));
  };

  const sidebarContent = useMemo(() => {
    if (loading) return <MenuSkeleton guilds={guilds} />;
    if (guild && guild !== 404 && guilds) {
      return <Menu guilds={guilds} sidebarDocked={state.sidebarDocked} handleSetOpen={handleOpen} />;
    }
    return <MenuSkeleton guilds={guilds} />;
  }, [loading, guild, guilds, state.sidebarDocked]);

  return (
    <>
      <StaticNav sidebarDocked={id ? state.sidebarDocked : true} handleSetOpen={handleOpen} />
      <Sidebar
        sidebar={sidebarContent}
        touch={true}
        sidebarClassName="sidebar"
        styles={style(state.sidebarDocked, isRTL)}
        open={state.sidebarOpen}
        docked={state.sidebarDocked}
        onSetOpen={handleSetOpen}
        pullRight={isRTL}
      >
        {children}
      </Sidebar>
    </>
  );
};

export default function DashboardLayout({ children }) {
  return (
    <GuildDataProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </GuildDataProvider>
  );
}
