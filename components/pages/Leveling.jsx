import { useContext, useState, useCallback } from 'react';
import Head from 'next/head';
import { DataContext } from '../../context';
import { GuildDataContext } from '../../context/guild';
import { Icon } from '@iconify/react/dist/iconify.js';
import BigSwitch from '../ui/dashboard/common/bigSwitch';
import SaveBar from '../ui/dashboard/common/SaveBar';
import DiscordStyledMultiSelect from '../selects/multiSelect';
import { api } from '../../utils/api';
import { motion } from 'framer-motion';
import Checkbox from '../ui/dashboard/common/checkBox';
import { NumberInput } from '../selects/Inputs';
import Command from '../ui/dashboard/commands/Command';
import Modal from '../ui/dashboard/commands/Modal';
import { ModalTemplate } from '../ui/dashboard/commands/ModalTemplate';

export default function Leveling() {
  const { locale } = useContext(DataContext);
  const { guild, channels, roles } = useContext(GuildDataContext);

  const [state, setState] = useState({
    leveling: guild.leveling,
    hasUnsavedChanges: false,
    saving: false,
  });
  console.log(state.leveling);
  const [commands, setCommands] = useState({
    top: guild.commands.top,
    rank: guild.commands.rank,
    reset: guild.commands.reset,
    setxp: guild.commands.setxp,
  });

  const [isCommandModalOpen, setIsCommandModalOpen] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState(null);
  const [loading, setLoading] = useState(null);

  const [commandState, setCommandState] = useState({
    aliases: [],
    enabled_channels: [],
    enabled_roles: [],
    disabled_roles: [],
    disabled_channels: [],
    auto_delete_reply: true,
    auto_delete_invocation: true,
    enabled: true,
    saving: false,
  });

  const [validationErrors, setValidationErrors] = useState([]);

  const handleSwitchChange = () => {
    setState((prev) => ({
      ...prev,
      leveling: {
        ...prev.leveling,
        enabled: !prev.leveling.enabled,
      },
      hasUnsavedChanges: true,
    }));
  };

  const handleChannelSelect = (selectedChannels) => {
    setState((prev) => ({
      ...prev,
      leveling: {
        ...prev.leveling,
        nonXpChannels: selectedChannels.map((channel) => channel.value),
      },
      hasUnsavedChanges: true,
    }));
  };

  const handleRoleSelect = (selectedRoles) => {
    setState((prev) => ({
      ...prev,
      leveling: {
        ...prev.leveling,
        nonXpRoles: selectedRoles.map((role) => role.value),
      },
      hasUnsavedChanges: true,
    }));
  };

  const handleLevelUpChannelSelect = (selected) => {
    setState((prev) => ({
      ...prev,
      leveling: {
        ...prev.leveling,
        levelUpChannel: selected?.value || null,
      },
      hasUnsavedChanges: true,
    }));
  };

  const handleMessageChange = (e) => {
    setState((prev) => ({
      ...prev,
      leveling: {
        ...prev.leveling,
        levelUpMessage: e.target.value,
      },
      hasUnsavedChanges: true,
    }));
  };

  const handleRewardAdd = () => {
    setState((prev) => ({
      ...prev,
      leveling: {
        ...prev.leveling,
        rewards: [
          ...prev.leveling.rewards,
          {
            xpLevel: 0,
            voiceLevel: 0,
            roleId: '',
            dmMember: false,
            removeHigherRole: false,
          },
        ],
      },
      hasUnsavedChanges: true,
    }));
  };

  const handleRewardChange = (index, field, value) => {
    if (field === 'roleId' && value) {
      setValidationErrors((prev) => prev.filter((error) => !error.includes(`Reward ${index + 1}`)));
    }

    setState((prev) => ({
      ...prev,
      leveling: {
        ...prev.leveling,
        rewards: prev.leveling.rewards.map((reward, i) => (i === index ? { ...reward, [field]: value } : reward)),
      },
      hasUnsavedChanges: true,
    }));
  };

  const handleRewardDelete = (index) => {
    setState((prev) => ({
      ...prev,
      leveling: {
        ...prev.leveling,
        rewards: prev.leveling.rewards.filter((_, i) => i !== index),
      },
      hasUnsavedChanges: true,
    }));
  };

  const handleReset = () => {
    setState({
      leveling: JSON.parse(JSON.stringify(guild.leveling)),
      hasUnsavedChanges: false,
      saving: false,
    });
  };

  const handleSave = async () => {
    const invalidRewards = state.leveling.rewards.reduce((errors, reward, index) => {
      if (!reward.roleId) {
        errors.push(`Reward ${index + 1} requires a role to be selected`);
      }
      return errors;
    }, []);

    if (invalidRewards.length > 0) {
      setValidationErrors(invalidRewards);
      document.querySelector('.rewards-section')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setValidationErrors([]);
    setState((prev) => ({ ...prev, saving: true }));

    try {
      await api.post(`/guilds/${guild.id}/leveling`, state.leveling);
      guild.leveling = state.leveling;
      setState((prev) => ({
        ...prev,
        hasUnsavedChanges: false,
        saving: false,
      }));
    } catch (error) {
      console.error('Failed to save leveling settings:', error);
      setState((prev) => ({ ...prev, saving: false }));
    }
  };

  const changeSwitch = useCallback(
    (command, value) => {
      setLoading(command);
      api.patch(`/guilds/${guild.id}/commands/${command}/enabled`, { enabled: value }).then(() => {
        setLoading(null);
        setCommands((prevCommands) => ({
          ...prevCommands,
          [command]: { ...prevCommands[command], enabled: value },
        }));
        guild.commands[command].enabled = value;
      });
    },
    [guild.id]
  );

  const editCommand = (command) => {
    const commandData = guild.commands[command];
    setCommandState({
      aliases: commandData.aliases || [],
      enabled_channels: commandData.enabled_channels || [],
      enabled_roles: commandData.enabled_roles || [],
      disabled_roles: commandData.disabled_roles || [],
      disabled_channels: commandData.disabled_channels || [],
      auto_delete_reply: commandData.auto_delete_reply ?? true,
      auto_delete_invocation: commandData.auto_delete_invocation ?? true,
      enabled: commandData.enabled ?? true,
      saving: false,
    });
    setSelectedCommand(command);
    setIsCommandModalOpen(true);
  };

  const handleCommandModalClose = () => {
    setIsCommandModalOpen(false);
    setSelectedCommand(null);
  };

  const changeAliases = useCallback((value) => {
    setCommandState((prevState) => ({ ...prevState, aliases: value }));
  }, []);

  const changeDisabledRoles = useCallback((value) => {
    setCommandState((prevState) => ({
      ...prevState,
      disabled_roles: value.map(({ value }) => value),
    }));
  }, []);

  const changeEnabledRoles = useCallback((value) => {
    setCommandState((prevState) => ({
      ...prevState,
      enabled_roles: value.map(({ value }) => value),
    }));
  }, []);

  const changeEnabledChannels = useCallback((value) => {
    setCommandState((prevState) => ({
      ...prevState,
      enabled_channels: value.map(({ value }) => value),
    }));
  }, []);

  const changeDisabledChannels = useCallback((value) => {
    setCommandState((prevState) => ({
      ...prevState,
      disabled_channels: value.map(({ value }) => value),
    }));
  }, []);

  const changeAutoDeleteInvocation = useCallback(() => {
    setCommandState((prevState) => ({
      ...prevState,
      auto_delete_invocation: !prevState.auto_delete_invocation,
    }));
  }, []);

  const changeAutoDeleteReply = useCallback(() => {
    setCommandState((prevState) => ({
      ...prevState,
      auto_delete_reply: !prevState.auto_delete_reply,
    }));
  }, []);

  const handleSaveCommand = useCallback(() => {
    if (!selectedCommand) return;

    const data = {
      aliases: commandState.aliases,
      disabled_channels: commandState.disabled_channels,
      enabled_channels: commandState.enabled_channels,
      disabled_roles: commandState.disabled_roles,
      enabled_roles: commandState.enabled_roles,
      auto_delete_reply: commandState.auto_delete_reply,
      auto_delete_invocation: commandState.auto_delete_invocation,
      enabled: commandState.enabled,
    };

    setCommandState((prevState) => ({ ...prevState, saving: true }));

    api
      .post(`/guilds/${guild.id}/commands/${selectedCommand}`, data)
      .then(({ data }) => {
        guild.commands[selectedCommand] = data.command;
        setCommands((prevCommands) => ({
          ...prevCommands,
          [selectedCommand]: data.command,
        }));
        setIsCommandModalOpen(false);
        setCommandState((prevState) => ({ ...prevState, saving: false }));
      })
      .catch((error) => {
        console.error('Failed to save command:', error);
        setCommandState((prevState) => ({ ...prevState, saving: false }));
      });
  }, [commandState, selectedCommand, guild.id]);

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <Head>
        <title>{locale.leveling?.pageTitle || 'Leveling'}</title>
      </Head>
      <header className="p-2.5 border-b border-[#3d4049] text-xl font-semibold flex items-center justify-between">
        <h1>{locale.leveling?.title || 'Leveling System'}</h1>
        <BigSwitch isOn={state.leveling.enabled} toggleSwitch={handleSwitchChange} />
      </header>

      <div className="bg-[#060A1B] p-5 rounded-lg mb-[100px] mt-3 shadow-lg">
        {/* Top Section - Grid with XP Settings and Level Up Notifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* XP Settings Card */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-500/10 p-2 rounded-lg">
                <Icon icon="mdi:star-settings" className="text-indigo-400 w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-gray-100 uppercase">{locale.leveling.xpSettings.title}</h2>
            </div>

            <div className="space-y-4">
              {/* Disabled Channels */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="mdi:pound" className="text-gray-400 w-5 h-5" />
                  <h3 className="text-xs font-bold uppercase text-gray-400">{locale.leveling.xpSettings.disabledChannels}</h3>
                </div>
                <DiscordStyledMultiSelect
                  options={channels}
                  value={state.leveling.nonXpChannels}
                  onChange={handleChannelSelect}
                  type="channels"
                  isMulti={true}
                />
              </div>

              {/* Disabled Roles */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="mdi:shield-account" className="text-gray-400 w-5 h-5" />
                  <h3 className="text-xs font-bold uppercase text-gray-400">{locale.leveling.xpSettings.disabledRoles}</h3>
                </div>
                <DiscordStyledMultiSelect
                  options={roles}
                  value={state.leveling.nonXpRoles}
                  onChange={handleRoleSelect}
                  type="roles"
                  isMulti={true}
                />
              </div>
            </div>
          </div>

          {/* Level Up Notifications Card */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-500/10 p-2 rounded-lg">
                <Icon icon="mdi:arrow-up-bold-circle" className="text-emerald-400 w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-gray-100 uppercase">{locale.leveling.levelUpNotifications.title}</h2>
            </div>

            <div className="space-y-4">
              {/* Announcement Channel */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="mdi:announcement" className="text-gray-400 w-5 h-5" />
                  <h3 className="text-xs font-bold uppercase text-gray-400">{locale.leveling.levelUpNotifications.announcementChannel}</h3>
                </div>
                <DiscordStyledMultiSelect
                  options={channels}
                  value={state.leveling.levelUpChannel || ''}
                  onChange={handleLevelUpChannelSelect}
                  type="channels"
                  isMulti={false}
                />
              </div>

              {/* Level Up Message */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="mdi:message-text" className="text-gray-400 w-5 h-5" />
                  <h3 className="text-xs font-bold uppercase text-gray-400">{locale.leveling.levelUpNotifications.levelUpMessage}</h3>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={state.leveling.levelUpMessage}
                    onChange={handleMessageChange}
                    className="w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-lg bg-[#1D1B45] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                    placeholder={locale.leveling.levelUpNotifications.messagePlaceholder}
                  />
                  <div className="mt-2 flex gap-2 text-xs text-gray-500">
                    <span className="px-2 py-1 rounded bg-[#1D1B45]">{`{${locale.leveling.levelUpNotifications.variables.user}}`}</span>
                    <span className="px-2 py-1 rounded bg-[#1D1B45]">{`{${locale.leveling.levelUpNotifications.variables.level}}`}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Level Rewards */}
        <div className="flex flex-col py-10 w-full rounded-2xl bg-[#060A1B] mt-6">
          <div className="flex flex-col px-8 w-full max-md:px-0 max-md:max-w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-500/10 p-2 rounded-lg">
                <Icon icon="mdi:trophy-award" className="text-indigo-400 w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-gray-100 uppercase">{locale.leveling.rewards.title}</h2>
            </div>

            {validationErrors.length > 0 && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="mdi:alert-circle" className="text-red-400 w-5 h-5" />
                  <h3 className="text-sm font-semibold text-red-400">{locale.leveling.rewards.validationErrors.title}</h3>
                </div>
                <ul className="list-disc list-inside">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-sm text-red-300">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Rewards Container */}
            <div className="flex flex-col gap-4 mb-4">
              {state.leveling.rewards.map((reward, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col self-center px-3.5 pt-3 pb-5 w-full font-bold rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 ${
                    !reward.roleId && validationErrors.length > 0 ? 'border-2 border-red-500/50' : ''
                  }`}
                >
                  <div className="flex flex-wrap gap-5 justify-between text-xs leading-none uppercase text-zinc-400">
                    <div className="flex gap-2">
                      <div>{`${locale.leveling.rewards.rewardNumber} ${index + 1}`}</div>
                    </div>
                    <Icon
                      icon="mdi:trash-can-outline"
                      className="cursor-pointer text-gray-500 size-5 hover:text-red-400 transition-colors duration-200"
                      onClick={() => handleRewardDelete(index)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="text-xs font-medium text-gray-400 mb-2 block">{locale.leveling.rewards.xpLevel}</label>
                      <NumberInput value={reward.xpLevel} onChange={(value) => handleRewardChange(index, 'xpLevel', Number(value))} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-400 mb-2 block">{locale.leveling.rewards.voiceLevel}</label>
                      <NumberInput value={reward.voiceLevel} onChange={(value) => handleRewardChange(index, 'voiceLevel', Number(value))} />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-2">
                      {locale.leveling.rewards.rewardRole}
                      <span className="text-red-400">*</span>
                      {!reward.roleId && validationErrors.length > 0 && (
                        <span className="text-red-400 text-xs font-normal">{locale.leveling.rewards.rewardRoleRequired}</span>
                      )}
                    </label>
                    <DiscordStyledMultiSelect
                      options={roles}
                      value={reward.roleId}
                      onChange={(selected) => handleRewardChange(index, 'roleId', selected?.value)}
                      type="roles"
                      isMulti={false}
                      className={!reward.roleId && validationErrors.length > 0 ? 'error' : ''}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-7 mt-4">
                    <div className="flex gap-2 items-center">
                      <Checkbox
                        isChecked={reward.dmMember}
                        toggleCheckbox={() => handleRewardChange(index, 'dmMember', !reward.dmMember)}
                      />
                      <span className="text-sm text-gray-400">{locale.leveling.rewards.dmMember}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Checkbox
                        isChecked={reward.removeHigherRole}
                        toggleCheckbox={() => handleRewardChange(index, 'removeHigherRole', !reward.removeHigherRole)}
                      />
                      <span className="text-sm text-gray-400">{locale.leveling.rewards.removeHigherRoles}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Add Reward Button */}
            <motion.div
              onClick={handleRewardAdd}
              className="relative group flex justify-center items-center px-4 sm:px-16 py-4 sm:py-6 w-full text-base sm:text-xl font-bold text-indigo-400 rounded-2xl border-2 border-dashed border-indigo-500/20 cursor-pointer overflow-hidden"
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
            >
              <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/10 transition-all duration-300"></div>
              <div className="flex gap-1.5 items-center">
                <Icon
                  icon="ph:plus-circle-fill"
                  className="transition-transform duration-300 group-hover:rotate-90 group-hover:text-indigo-300 text-xl sm:text-2xl"
                />
                <span className="group-hover:text-indigo-300 transition-colors duration-300">{locale.leveling.rewards.addNew}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Commands Section */}
        <div className="flex flex-col py-10 md:py-10 w-full">
          <div className="flex flex-col px-0 md:px-8 w-full max-md:max-w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <Icon icon="mdi:console" className="text-blue-400 w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-gray-100 uppercase">{locale.leveling.commands.title}</h2>
            </div>

            <Command
              name="top"
              active={commands.top.enabled}
              description={locale.leveling.commands.top.description}
              icon="/commands/top.svg"
              changeSwitch={() => changeSwitch('top', !commands.top.enabled)}
              editCommand={editCommand}
              loading={loading === 'top'}
            />

            <Command
              name="rank"
              active={commands.rank.enabled}
              description={locale.leveling.commands.rank.description}
              icon="/commands/rank.svg"
              changeSwitch={() => changeSwitch('rank', !commands.rank.enabled)}
              editCommand={editCommand}
              loading={loading === 'rank'}
            />

            <Command
              name="reset"
              active={commands.reset.enabled}
              description={locale.leveling.commands.reset.description}
              icon="/commands/reset.svg"
              changeSwitch={() => changeSwitch('reset', !commands.reset.enabled)}
              editCommand={editCommand}
              loading={loading === 'reset'}
            />

            <Command
              name="setxp"
              active={commands.setxp.enabled}
              description={locale.leveling.commands.setxp.description}
              icon="/commands/setxp.svg"
              changeSwitch={() => changeSwitch('setxp', !commands.setxp.enabled)}
              editCommand={editCommand}
              loading={loading === 'setxp'}
            />
          </div>
        </div>
      </div>

      <Modal
        show={isCommandModalOpen}
        title={`Edit /${selectedCommand}`}
        onClose={handleCommandModalClose}
        onSave={handleSaveCommand}
        saving={commandState.saving}
      >
        <ModalTemplate
          state={commandState}
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

      <SaveBar hasUnsavedChanges={state.hasUnsavedChanges} onReset={handleReset} onSave={handleSave} saving={state.saving} />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #232428;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3d4049;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4a4d5a;
        }
        .error .select__control {
          border-color: rgb(239 68 68 / 0.5) !important;
        }
      `}</style>
    </motion.section>
  );
}
