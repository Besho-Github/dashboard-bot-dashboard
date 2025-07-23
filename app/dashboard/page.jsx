'use client';
import { ServerCard, ServerCardSkeleton } from '../../components/ui/server-card';
import { DataContext } from '../../context';
import { useContext } from 'react';
import { StaticNav } from '../../components/ui/static-navbar';
import { Fade } from 'react-awesome-reveal';
import Head from 'next/head';

const IndexPage = () => {
  const { locale, guilds } = useContext(DataContext);

  return (
    <>
      <Head>
        <title>{locale.selectServer.title}</title>
      </Head>
      <div className="p-5">
        <ul className="flex flex-wrap justify-center">
          {guilds ? (
            // show server cards
            guilds.length ? (
              guilds.map((server) => (
                <Fade key={server.id} triggerOnce={true}>
                  <ServerCard server={server} />
                </Fade>
              ))
            ) : (
              <div className="h-[60vh] flex items-center flex-col text-center justify-center">
                <Head>
                  <title>{locale.common.noServer}</title>
                </Head>
                <h2 className="text-[2rem] font-extrabold uppercase">{locale.common.noServer}</h2>
                <p className="text-[1rem] font-extrabold capitalize">{locale.common.noServerp}</p>
              </div>
            )
          ) : (
            // show skeleton
            new Array(9).fill(' ', 0, 9).map((v, i) => <ServerCardSkeleton key={i} />)
          )}
        </ul>
      </div>
    </>
  );
};

export default IndexPage;
