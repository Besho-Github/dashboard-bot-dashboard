'use client';

import { useContext } from 'react';
import { GuildDataContext } from '../../../../context/guild';
import { useParams } from 'next/navigation';
import Apply from '../../../../components/pages/Apply';
import BotNotInServer from '../../../../components/ui/dashboard/BotNotInServer';
import { GeneralSkeleton } from '../../../../components/pages';

export default function DashboardPage() {
  const { guild, loading } = useContext(GuildDataContext);
  const { id } = useParams();

  if (loading) {
    return <GeneralSkeleton />;
  }

  if (guild === 404) {
    return <BotNotInServer inviteLink={`${process.env.INVITE_URL}?id=${id}`} />;
  }

  return <Apply />;
}
