import React, { useCallback, useContext, useState } from 'react';
import Select from 'react-select';
import { CustomOption, customStyles, CustomSingleValue } from '../selects/server';
import ColorPicker from '../ui/dashboard/general/ColorPicker';
import { Icon } from '@iconify/react/dist/iconify.js';
import SaveBar from '../ui/dashboard/common/SaveBar';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { api } from '../../utils/api';
import DiscordStyledMultiSelect from '../selects/multiSelect';
import { GuildDataContext } from '../../context/guild';
import { DataContext } from '../../context';

export default function General() {
  const { guild, roles } = useContext(GuildDataContext);
  const { locale } = useContext(DataContext);
  const isRTL = locale.getLanguage() === 'ar';

  const InitialState = {
    guild: JSON.parse(JSON.stringify(guild)),
    saving: false,
    loading: false,
  };

  const [state, setState] = useState(InitialState);

  const options = [
    {
      label: 'English',
      icon: <Icon icon={'flag:gb-4x3'} className={`rounded ${isRTL ? 'ml-[10px]' : 'mr-[10px]'} w-[30px] height-[30px]`} />,
      value: 'en',
    },
    {
      label: 'العربية',
      icon: <Icon icon={'flag:ps-4x3'} className={`rounded ${isRTL ? 'ml-[10px]' : 'mr-[10px]'} w-[30px] height-[30px]`} />,
      value: 'ar',
    },
  ];

  const hasUnsavedChanges = useCallback(() => {
    return JSON.stringify(state.guild) != JSON.stringify(guild);
  }, [guild, state.guild]);

  const onColorChange = (color) => {
    setState((prevState) => ({
      ...prevState,
      saving: true,
      guild: { ...prevState.guild, color },
    }));
  };

  const onLanguageChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      saving: true,
      guild: { ...prevState.guild, language: e.value },
    }));
  };

  const onAutoRoleChange = (type, selectedRoles) => {
    setState((prevState) => ({
      ...prevState,
      saving: true,
      guild: {
        ...prevState.guild,
        autorole: {
          ...prevState.guild.autorole,
          [type]: selectedRoles.map((role) => role.value),
        },
      },
    }));
  };

  const onReset = () => {
    setState(InitialState);
  };

  const Save = () => {
    const data = {
      color: state.guild.color,
      language: state.guild.language,
      users: state.guild.autorole.users,
      bots: state.guild.autorole.bots,
    };
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    api
      .patch(`/guilds/${guild.id}/general`, data)
      .then(() => {
        setState((prevState) => ({
          ...prevState,
          saving: false,
          loading: false,
        }));
        guild.color = state.guild.color;
        guild.language = state.guild.language;
        guild.autorole = state.guild.autorole;
      })
      .catch(() => {
        onReset();
      });
  };

  const theme = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#0c122d',
      color: 'white',
      borderColor: '#10152f',
      '&:hover': {
        borderColor: '#0058cc',
      },
    }),
    multiValue: (base) => ({
      ...base,
      background: '#282d43',
    }),
    option: (provided) => ({
      ...provided,
      backgroundColor: '#282d43',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#0c122d',
    }),
  };

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <Head>
        <title>{locale.general.pageTitle}</title>
      </Head>
      <header className="p-2.5 border-b border-[#3d4049] text-xl font-semibold">
        <h1>{locale.general.generalSettings}</h1>
      </header>
      <div className="bg-[#060A1B] p-5 rounded mb-[100px] mt-3">
        <div className="mt-6 box-border">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 box-border" style={{ color: 'hsl(215, 8.8%, 73.3%)' }}>
            {locale.general.botLanguage}
          </h2>
          <Select
            styles={customStyles}
            onChange={onLanguageChange}
            options={options}
            components={{ Option: CustomOption, SingleValue: CustomSingleValue, IndicatorSeparator: null }}
            isSearchable={false}
            isClearable={false}
            value={options.find((option) => option.value == state.guild.language)}
          />
        </div>
        <div className="mt-6 box-border">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 box-border" style={{ color: 'hsl(215, 8.8%, 73.3%)' }}>
            {locale.general.embedColor}
          </h2>
          <div className="text-sm leading-4 cursor-default mb-2 box-border" style={{ color: 'hsl(210, 9.1%, 87.1%)' }}>
            {locale.general.embedColorDescription}
          </div>
          <ColorPicker selectedColor={state.guild.color} onChange={onColorChange} />
        </div>
        <div className="bg-[#060A1B] rounded mt-5 mb-[3rem]">
          <div className="box-border flex flex-col gap-5">
            <div className="flex flex-col gap-1 w-full max-w-full">
              <div className="w-full text-xs font-bold tracking-wide leading-4 text-gray-400 uppercase mb-1">
                {locale.general.autoRules.input_1}
              </div>
              <DiscordStyledMultiSelect
                options={roles}
                value={state.guild.autorole.users}
                type="roles"
                theme={theme}
                className="!bg-[#0C122D] !rounded"
                onChange={(selectedRoles) => onAutoRoleChange('users', selectedRoles)}
              />
            </div>
            <div className="flex flex-col gap-1 w-full max-w-full">
              <div className="w-full text-xs font-bold tracking-wide leading-4 text-gray-400 uppercase mb-1">
                {locale.general.autoRules.input_2}
              </div>
              <DiscordStyledMultiSelect
                options={roles}
                value={state.guild.autorole.bots}
                type="roles"
                theme={theme}
                className="!bg-[#0C122D] !rounded"
                onChange={(selectedRoles) => onAutoRoleChange('bots', selectedRoles)}
              />
            </div>
          </div>
        </div>
      </div>
      <SaveBar hasUnsavedChanges={hasUnsavedChanges()} onReset={onReset} onSave={Save} saving={state.loading} />
    </motion.section>
  );
}

{
  /* <div className="mt-6 box-border">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 box-border flex gap-2" style={{ color: 'hsl(215, 8.8%, 73.3%)' }}>
            {locale.general.resetServerSettings')}
            <div className="flex items-center justify-center bg-[#d42929] rounded-full px-1 items-center text-white">
              <span className="uppercase">{locale.general.danger')}</span>
            </div>
          </h2>
          <button className="w-[157px] h-8 rounded-[3px] border border-red-500 flex items-center justify-center px-2 hover:bg-[#F23F42] active:bg-[#BB3032] transition duration-300">
            <span className="text-white text-xs font-semibold">{locale.general.resetServerSettings')}</span>
          </button>
        </div> */
}
