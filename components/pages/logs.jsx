import { Icon } from '@iconify/react/dist/iconify.js';
import React, { memo, useContext, useState, useCallback } from 'react';
import { getContrastColor } from '../../utils';
import DiscordStyledMultiSelect from '../selects/multiSelect';
import Switch from '../ui/dashboard/common/Switch';
import { GuildDataContext } from '../../context/guild';
import { logs } from '../../utils';
import SaveBar from '../ui/dashboard/common/SaveBar';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { api } from '../../utils/api';
import { DataContext } from '../../context';

const Log = memo(function Log({ channels, logName, data, handleChannelSelect, handleColorSelect, handleSwitch, icon, name }) {
  const { channel, color, enabled } = data;
  const { locale } = useContext(DataContext);

  return (
    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <img loading="lazy" src={icon} className="w-8 h-8" />
          <h3 className="font-bold text-gray-100">{logName}</h3>
        </div>
        <Switch size="md" active={enabled} onChange={() => handleSwitch(name)} />
      </div>

      <div className="space-y-4 mt-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Icon icon="mdi:pound" className="text-gray-400 w-5 h-5" />
            <h3 className="text-xs font-bold uppercase text-gray-400">{locale.logs.channel}</h3>
          </div>
          <DiscordStyledMultiSelect isMulti={false} options={channels} onChange={(e) => handleChannelSelect(name, e)} value={channel} />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Icon icon="mdi:palette" className="text-gray-400 w-5 h-5" />
            <h3 className="text-xs font-bold uppercase text-gray-400">{locale.logs.color}</h3>
          </div>
          <div className="relative h-[50px] rounded-lg border border-[#ffffff1a]" style={{ backgroundColor: color }}>
            <Icon
              className="absolute w-[14px] h-[14px] top-[5px] right-[5px] transition-colors duration-500"
              icon={'fa-solid:eye-dropper'}
              style={{ color: getContrastColor(color) }}
            />
            <input
              type="color"
              className="appearance-none w-full h-full rounded-lg cursor-pointer opacity-0"
              value={color}
              onChange={(e) => handleColorSelect(name, e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

function Logs() {
  const { guild, channels } = useContext(GuildDataContext);
  const { locale } = useContext(DataContext);

  const initialState = {
    logs: guild.logs,
    loading: false,
    saving: false,
  };
  const [state, setState] = useState(initialState);

  const handleColorSelect = useCallback((name, color) => {
    setState((prevState) => {
      if (prevState.logs[name].color === color) {
        return prevState; // No change needed
      }
      return {
        ...prevState,
        saving: true,
        logs: {
          ...prevState.logs,
          [name]: {
            ...prevState.logs[name],
            color,
          },
        },
      };
    });
  }, []);

  const handleChannelSelect = useCallback((name, channel) => {
    setState((prevState) => ({
      ...prevState,
      saving: true,
      logs: {
        ...prevState.logs,
        [name]: {
          ...prevState.logs[name],
          channel: channel.value,
        },
      },
    }));
  }, []);

  const handleSwitch = useCallback((name) => {
    setState((prevState) => ({
      ...prevState,
      saving: true,
      logs: {
        ...prevState.logs,
        [name]: {
          ...prevState.logs[name],
          enabled: !prevState.logs[name].enabled,
        },
      },
    }));
  }, []);

  const handleSave = useCallback(async () => {
    setState((prevState) => ({ ...prevState, loading: true }));

    try {
      await api.post(`/guilds/${guild.id}/logs`, state.logs);
      setState((prevState) => ({ ...prevState, saving: false, loading: false }));
      guild.logs = state.logs;
    } catch (error) {
      console.error('Error saving logs:', error);
      setState((prevState) => ({ ...prevState, saving: false, loading: false }));
    }
  }, [state.logs, guild.id, guild]);

  const handleReset = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <Head>
        <title>{locale.logs.pageTitle}</title>
      </Head>
      <header className="p-2.5 border-b border-[#3d4049] text-xl font-semibold">
        <h1>{locale.logs.title}</h1>
      </header>

      <div className="bg-[#060A1B] p-5 rounded-lg mb-[100px] mt-3 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {logs.map((log) => (
            <Log
              key={log.name}
              name={log.name}
              logName={locale.logs[log.name]}
              data={state.logs[log.name]}
              channels={channels}
              icon={log.icon}
              handleChannelSelect={handleChannelSelect}
              handleColorSelect={handleColorSelect}
              handleSwitch={handleSwitch}
            />
          ))}
        </div>
      </div>

      <SaveBar saving={state.loading} hasUnsavedChanges={state.saving} onReset={handleReset} onSave={handleSave} />
    </motion.section>
  );
}

export default memo(Logs);
