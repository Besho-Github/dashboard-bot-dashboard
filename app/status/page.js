'use client';

import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { DataContext } from '../../context';
import Footer from '../../components/Footer';
import axios from 'axios';

const StatusPage = () => {
  const { locale } = useContext(DataContext);
  const [shardData, setShardData] = useState({ shards: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.API_URL}/stats/shards`);
        setShardData(res.data);
      } catch (error) {
        console.error('Failed to fetch shard data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return 'READY';
      case 1:
        return 'CONNECTING';
      case 2:
        return 'RECONNECTING';
      case 3:
        return 'IDLE';
      case 4:
        return 'NEARLY';
      case 5:
        return 'DISCONNECTED';
      default:
        return 'UNKNOWN';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return 'bg-green-500';
      case 1:
        return 'bg-yellow-500';
      case 2:
        return 'bg-red-500';
      case 3:
        return 'bg-gray-500';
      case 4:
        return 'bg-red-700';
      case 5:
        return 'bg-purple-500';
      default:
        return 'bg-gray-700';
    }
  };

  return (
    <>
      <Head>
        <title>Wicks Bot - Status</title>
        <meta name="description" content="Bot Shards Status" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <section className="relative px-[20px] lg:px-0 bg-background-500">
        <div className="absolute rounded-full h-[643px] w-[773px] bg-[#CFB360] ring-4 ring-[#6B5A29] ring-opacity-50 blur-[307.51px] -top-[50rem]"></div>

        <div className="container mx-auto py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center my-16">
            <h1 className="text-4xl font-bold mb-4 text-[#CFB360]">Shard Status</h1>
            <p className="text-gray-400">Real-time status of all bot shards</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {shardData.shards.map((cluster, clusterIndex) => (
              <div key={clusterIndex} className="space-y-4">
                <h2 className="text-2xl font-bold text-center text-[#CFB360]">Cluster #{clusterIndex + 1}</h2>
                <div className="flex flex-wrap justify-center gap-4">
                  {cluster.map((shard) => (
                    <div
                      key={shard.id}
                      className="bg-slate-800 w-[300px] rounded-lg p-6 flex flex-col items-center transition-all hover:transform hover:scale-105"
                    >
                      <h3 className="text-xl font-bold text-[#CFB360] mb-2">Shard #{shard.id + 1}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(shard.status)}`}></div>
                        <span className="text-gray-300">{getStatusText(shard.status)}</span>
                      </div>
                      <p className="text-gray-300">Guilds: {shard.guilds}</p>
                      <p className="text-gray-300">Ping: {Math.round(shard.ping)}ms</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center text-sm text-gray-400"
          >
            <p>Status updates every 30 seconds</p>
          </motion.div>
        </div>

        <div className="absolute rounded-full h-[350px] w-[200px] bg-[#CFB360] ring-4 ring-[#6B5A29] ring-opacity-50 blur-[110px] -right-[15rem] bottom-[15rem]"></div>
      </section>
      <Footer />
    </>
  );
};

export default StatusPage;
