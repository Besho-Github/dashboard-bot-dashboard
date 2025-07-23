import React, { useState, useContext, useCallback, useMemo, memo } from 'react';
import Command from '../ui/dashboard/commands/Command';
import Modal from '../ui/dashboard/commands/Modal';
import { ModalTemplate } from '../ui/dashboard/commands/ModalTemplate';
import { GuildDataContext, GuildUpdateContext } from '../../context/guild';
import { commands as publicCommands } from '../../utils';
import { api } from '../../utils/api';
import { Fade } from 'react-awesome-reveal';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { DataContext } from '../../context';

const Commands = () => {
  const { locale } = useContext(DataContext);
  const { channels, roles, guild } = useContext(GuildDataContext);
  const { setGuild } = useContext(GuildUpdateContext);

  const [state, setState] = useState({
    commands: guild?.commands || {},
    modal: false,
    command: null,
    aliases: [],
    enabled_channels: [],
    enabled_roles: [],
    disabled_roles: [],
    disabled_channels: [],
    auto_delete_reply: true,
    auto_delete_invocation: true,
    enabled: true,
    saving: false,
    loading: null,
  });

  const showModal = useCallback(
    (command) => {
      setState((prevState) => ({
        ...prevState,
        modal: true,
        command,
        ...prevState.commands[command],
      }));
    },
    [state.commands]
  );

  const closeModal = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      modal: false,
      command: null,
    }));
  }, []);

  const changeAliases = useCallback((value) => {
    setState((prevState) => ({ ...prevState, aliases: value }));
  }, []);

  const changeDisabledRoles = useCallback((value) => {
    setState((prevState) => ({
      ...prevState,
      disabled_roles: value.map(({ value }) => value),
    }));
  }, []);

  const changeEnabledRoles = useCallback((value) => {
    setState((prevState) => ({
      ...prevState,
      enabled_roles: value.map(({ value }) => value),
    }));
  }, []);

  const changeEnabledChannels = useCallback((value) => {
    setState((prevState) => ({
      ...prevState,
      enabled_channels: value.map(({ value }) => value),
    }));
  }, []);

  const changeDisabledChannels = useCallback((value) => {
    setState((prevState) => ({
      ...prevState,
      disabled_channels: value.map(({ value }) => value),
    }));
  }, []);

  const changeAutoDeleteInvocation = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      auto_delete_invocation: !prevState.auto_delete_invocation,
    }));
  }, []);

  const changeAutoDeleteReply = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      auto_delete_reply: !prevState.auto_delete_reply,
    }));
  }, []);

  const Save = useCallback(() => {
    const data = {
      aliases: state.aliases,
      disabled_channels: state.disabled_channels,
      enabled_channels: state.enabled_channels,
      disabled_roles: state.disabled_roles,
      enabled_roles: state.enabled_roles,
      auto_delete_reply: state.auto_delete_reply,
      auto_delete_invocation: state.auto_delete_invocation,
      enabled: state.enabled,
    };
    setState((prevState) => ({ ...prevState, saving: true }));
    api.post(`/guilds/${guild.id}/commands/${state.command}`, data).then(({ data }) => {
      setState((prevState) => ({
        ...prevState,
        modal: false,
        saving: false,
        commands: { ...prevState.commands, [state.command]: data.command },
      }));
      setGuild((prevGuild) => ({
        ...prevGuild,
        commands: { ...prevGuild.commands, [state.command]: data.command },
      }));
    });
  }, [state, guild.id, setGuild]);

  const changeSwitch = useCallback(
    (command, value) => {
      setState((prevState) => ({
        ...prevState,
        loading: command,
      }));
      api.patch(`/guilds/${guild.id}/commands/${command}/enabled`, { enabled: value }).then(() => {
        setState((prevState) => ({
          ...prevState,
          loading: null,
          commands: { ...prevState.commands, [command]: { ...prevState.commands[command], enabled: value } },
        }));
        setGuild((prevGuild) => ({
          ...prevGuild,
          commands: { ...prevGuild.commands, [command]: { ...prevGuild.commands[command], enabled: value } },
        }));
      });
    },
    [guild.id]
  );

  const commands = useMemo(() => {
    return publicCommands.map((cmd) => (
      <Fade key={cmd}>
        <Command
          active={state.commands[cmd]?.enabled}
          name={cmd}
          description={locale.command[cmd]}
          icon={`/commands/${cmd}.svg`}
          loading={state.loading == cmd}
          editCommand={showModal}
          changeSwitch={changeSwitch}
        />
      </Fade>
    ));
  }, [publicCommands, showModal, changeSwitch, state.commands, state.loading, locale.getLanguage()]);

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <Head>
        <title>{locale.command.pageTitle}</title>
      </Head>
      <header className="p-2.5 border-b border-[#3d4049] text-xl font-semibold">
        <h1>{locale.command.title}</h1>
      </header>
      <div className="bg-[#060A1B] p-5 rounded mt-3">
        {commands}
        <Modal show={state.modal} title={`Edit /${state.command}`} onClose={closeModal} onSave={Save} saving={state.saving}>
          <ModalTemplate
            state={state}
            changeAliases={changeAliases}
            changeAutoDeleteInvocation={changeAutoDeleteInvocation}
            changeAutoDeleteReply={changeAutoDeleteReply}
            changeDisabledChannels={changeDisabledChannels}
            changeDisabledRoles={changeDisabledRoles}
            changeEnabledChannels={changeEnabledChannels}
            changeEnabledRoles={changeEnabledRoles}
            channels={channels}
            roles={roles}
          />
        </Modal>
      </div>
    </motion.section>
  );
};

export default memo(Commands);
