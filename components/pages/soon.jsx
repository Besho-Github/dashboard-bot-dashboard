import Head from 'next/head';
import { useContext } from 'react';
import { DataContext } from '../../context';

export default function Leveling() {
  const { locale } = useContext(DataContext);
  return (
    <>
      <Head>
        <title>Coming Soon</title>
      </Head>
      <section className="h-[70vh] flex items-center justify-center flex-col text-center">
        <h2 className="text-[2rem] font-extrabold uppercase">
          {locale.common.soon.title} <span className="text-[#D0B460] text-shadow-custom">{locale.common.soon.titleSpan}</span>
        </h2>
        <p className="text-[1rem] font-bold capitalize">{locale.common.soon.p}</p>
      </section>
    </>
  );
}
