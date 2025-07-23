import React, { useState, useContext } from 'react';
import { GuildDataContext } from '../../context/guild';
import WelcomeMessage from '../ui/dashboard/welcome/Message';
import { WelcomeImage } from '../ui/dashboard/welcome/Image';
import SaveBar from '../ui/dashboard/common/SaveBar';
import { api } from '../../utils/api';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { DataContext } from '../../context';

export default function Welcome() {
  const { guild, channels } = useContext(GuildDataContext);
  const [state, setState] = useState({
    welcome: guild.welcome,
    saving: false,
    loading: false,
  });

  const { locale } = useContext(DataContext);

  const handleDescriptionChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      saving: true,
      welcome: {
        ...prevState.welcome,
        text: {
          ...prevState.welcome.text,
          message: e.target.value,
        },
      },
    }));
  };

  const handleRadioChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      saving: true,
      welcome: {
        ...prevState.welcome,
        text: {
          ...prevState.welcome.text,
          type: parseInt(e.target.value),
        },
      },
    }));
  };

  const handleChannelChange = (selectedOption) => {
    setState((prevState) => ({
      ...prevState,
      saving: true,
      welcome: {
        ...prevState.welcome,
        text: {
          ...prevState.welcome.text,
          channelId: selectedOption ? selectedOption.value : null,
        },
      },
    }));
  };

  const handleSwitchChange = (name) => {
    setState((prevState) => ({
      ...prevState,
      saving: true,
      welcome: {
        ...prevState.welcome,
        [name]: {
          ...prevState.welcome[name],
          enabled: !prevState.welcome[name].enabled,
        },
      },
    }));
  };

  const handleBackgroundChange = (url, dimensions) => {
    setState((prevState) => ({
      ...prevState,
      saving: true,
      welcome: {
        ...prevState.welcome,
        background: {
          ...prevState.welcome.background,
          image_url: url,
          size: {
            width: dimensions.width,
            height: dimensions.height,
          },
        },
      },
    }));
  };

  const handleElementChange = (element, attrs) => {
    setState((prevState) => ({
      ...prevState,
      saving: true,
      welcome: {
        ...prevState.welcome,
        [element]: {
          ...prevState.welcome[element],
          ...attrs,
        },
      },
    }));
  };

  const Save = async () => {
    setState((prevState) => ({ ...prevState, loading: true }));
    try {
      await api.post(`/guilds/${guild.id}/welcome`, state.welcome);
      setState((prevState) => ({ ...prevState, saving: false, loading: false }));
      guild.welcome = state.welcome;
    } catch (error) {
      console.error('Error saving welcome settings:', error);
      Reset();
    }
  };

  const Reset = () => {
    setState({
      welcome: guild.welcome,
      saving: false,
      loading: false,
    });
  };

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <Head>
        <title>{locale.welcome.pageTitle}</title>
      </Head>
      <header className="p-2.5 border-b border-[#3d4049] text-xl font-semibold">
        <h1>{locale.welcome.title}</h1>
      </header>
      <div className="bg-[#060A1B] p-5 rounded mt-3 pb-20">
        <WelcomeMessage
          state={state.welcome}
          handleDescriptionChange={handleDescriptionChange}
          handleRadioChange={handleRadioChange}
          handleChannelChange={handleChannelChange}
          handleSwitchChange={handleSwitchChange}
          channels={channels}
        />
        <WelcomeImage
          state={state.welcome}
          handleSwitchChange={handleSwitchChange}
          handleBackgroundChange={handleBackgroundChange}
          handleElementChange={handleElementChange}
        />
      </div>
      <SaveBar hasUnsavedChanges={state.saving} saving={state.loading} onSave={Save} onReset={Reset} />
    </motion.section>
  );
}
