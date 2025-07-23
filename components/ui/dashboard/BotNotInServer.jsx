import React, { useContext } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import Head from 'next/head';
import { DataContext } from '../../../context';

const BotNotInServer = ({ inviteLink }) => {
  const { locale } = useContext(DataContext);

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Head>
        <title>{locale.BotNotInServer.pageTitle}</title>
      </Head>
      <div className="max-w-4xl p-8  rounded-lg shadow-lg">
        <h3 className="text-4xl font-bold mb-6">{locale.BotNotInServer.title}</h3>
        <p className="text-lg mb-8">{locale.BotNotInServer.p}</p>
        <a
          href={inviteLink}
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 bg-[#5865f2] text-white rounded-md hover:bg-[#677bc4] transition-colors duration-300"
        >
          <Icon icon={'ic:baseline-plus'} className="w-6 h-6 mr-3" />
          {locale.BotNotInServer.invite}
        </a>
      </div>
    </div>
  );
};

export default BotNotInServer;
