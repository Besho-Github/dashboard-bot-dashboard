import { createContext, useState, useEffect, useMemo } from 'react';
import { fetchGuild } from '../utils/api';
import { useParams, useRouter } from 'next/navigation';

export const GuildDataContext = createContext();
export const GuildUpdateContext = createContext();

export const GuildDataProvider = ({ children }) => {
  const [guild, setGuild] = useState(null);
  const [channels, setChannels] = useState([]);
  const [roles, setRoles] = useState([]);
  const [emojis, setEmojis] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const id = params.id;
      try {
        const guildData = await fetchGuild(id);
        if (guildData == 401) {
          router.push('/');
          return;
        } else if (guildData == 404) {
          setGuild(guildData);
          return;
        } else if (guildData == 403) {
          window.location.reload();
        } else {
          setGuild(guildData.data);
          setChannels(guildData.channels);
          setRoles(guildData.roles);
          setEmojis(guildData.emojis);
          setIsPremium(guildData.isPremium);
        }
      } catch (error) {
        console.error('Failed to fetch guild data or channels:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const guildValue = useMemo(
    () => ({ guild, channels, roles, emojis, loading, isPremium }),
    [guild, channels, roles, emojis, loading, isPremium]
  );
  const setGuildValue = useMemo(() => ({ setGuild }), []);

  return (
    <GuildDataContext.Provider value={guildValue}>
      <GuildUpdateContext.Provider value={setGuildValue}>{children}</GuildUpdateContext.Provider>
    </GuildDataContext.Provider>
  );
};
