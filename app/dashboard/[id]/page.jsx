'use client';

import { useContext, useEffect } from 'react';
import { GuildDataContext } from '../../../context/guild';
import { useParams, useRouter } from 'next/navigation';
import General from '../../../components/pages/general';
import BotNotInServer from '../../../components/ui/dashboard/BotNotInServer';
import { GeneralSkeleton } from '../../../components/pages';

export default function DashboardPage() {
  const { guild, loading } = useContext(GuildDataContext);
  const { id } = useParams();
  const router = useRouter();

  // Use useEffect to handle navigation
  useEffect(() => {
    if (!loading && !guild && guild !== 404) {
      router.push('/');
    }
  }, [guild, loading, router]);

  if (loading) {
    return <GeneralSkeleton />;
  }

  if (guild === 404) {
    return <BotNotInServer inviteLink={`${process.env.INVITE_URL}?id=${id}`} />;
  } else if (!guild) {
    return <GeneralSkeleton />;
  }
  console.log(guild);

  return <General />;
}
