import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import BigSwitch from '../ui/dashboard/common/bigSwitch';
import Switch from '../ui/dashboard/common/Switch';
import { Icon } from '@iconify/react/dist/iconify.js';
import CreatableStyledSelect from '../selects/CreatebleSelect';
import { GuildDataContext, GuildUpdateContext } from '../../context/guild';
import { decimalToHexColor } from '../../utils';
import { NumberInput, ThemedSelect } from '../selects/Inputs';
import SaveBar from '../ui/dashboard/common/SaveBar';
import { api } from '../../utils/api';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { DataContext } from '../../context';

function Protection() {
  const { roles, guild } = useContext(GuildDataContext);
  const { setGuild } = useContext(GuildUpdateContext);
  const { locale } = useContext(DataContext);

  const triggerRef = useRef(null);

  const [state, setState] = useState({
    protection: JSON.parse(JSON.stringify(guild.protection)),
    item: 'Ban',
    activeRole: `${guild.protection.moderationSettings[0]?.roleID}` || null,
    hasUnsavedChanges: false,
    saving: false,
  });

  const [hoveredRole, setHoveredRole] = useState(null);

  const getRoleById = (roleID) => roles.find((role) => role.id === roleID);

  const deleteRole = (roleId) => {
    const newValues = state.protection.moderationSettings.filter((r) => r.roleID !== roleId);
    setState((prevState) => ({
      ...prevState,
      protection: {
        ...prevState.protection,
        moderationSettings: newValues,
      },
      hasUnsavedChanges: true,
    }));
  };

  const handleItemClick = (item) => {
    setState((prevState) => ({
      ...prevState,
      item: item,
    }));
  };
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = (event) => {
    setShowPopup(!showPopup);
    const rect = event.target.getBoundingClientRect();
    setPopupPosition({
      x: rect.left + window.pageXOffset,
      y: rect.top + window.pageYOffset + rect.height,
    });
  };
  const [searchQuery, setSearchQuery] = useState('');
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) && !state.protection.moderationSettings.some((r) => r.roleID == role.id)
  );

  // Function to handle clicks outside the popup
  const handleClickOutside = (event) => {
    if (triggerRef.current && !triggerRef.current.contains(event.target)) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    if (showPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopup]);

  const handleAddNewRole = (roleId) => {
    const newValues = [...state.protection.moderationSettings];

    newValues.push({
      roleID: roleId,
      banLimit: 0,
      banAction: 'roles',
      kickLimit: 0,
      kickAction: 'roles',
      roleChangeLimit: 0,
      roleChangeAction: 'roles',
      channelChangeLimit: 0,
      channelChangeAction: 'roles',
    });
    setShowPopup(false);
    setState((prevState) => ({
      ...prevState,
      protection: {
        ...prevState.protection,
        moderationSettings: newValues,
      },
      activeRole: roleId,
      item: 'Ban',
      hasUnsavedChanges: true,
    }));
  };

  const setActiveRole = (roleID) => {
    setState((prevState) => ({
      ...prevState,
      activeRole: roleID,
      hasUnsavedChanges: true,
    }));
  };

  const setDashboardPermission = (perm) => {
    setState((prevState) => ({
      ...prevState,
      protection: {
        ...prevState.protection,
        serverSettings: {
          ...prevState.protection.serverSettings,
          dashboardPermission: perm,
        },
      },
      hasUnsavedChanges: true,
    }));
  };

  const handleSwitchChnage = () => {
    setState((prevState) => ({
      ...prevState,
      protection: {
        ...prevState.protection,
        serverSettings: {
          ...prevState.protection.serverSettings,
          restrictToOwner: !prevState.protection.serverSettings.restrictToOwner,
        },
      },
      hasUnsavedChanges: true,
    }));
  };

  const changeTrustedBots = (newVal) => {
    setState((prevState) => ({
      ...prevState,
      protection: {
        ...prevState.protection,
        serverSettings: {
          ...prevState.protection.serverSettings,
          trustedBots: newVal,
        },
      },
      hasUnsavedChanges: true,
    }));
  };

  const activeWindowData = () => {
    const roleID = state.activeRole;
    const list = state.item;

    const data = state.protection.moderationSettings.find((role) => role.roleID == roleID);

    if (!data) return null; // Handle case where no matching role is found

    const mapping = {
      'Channel Update': { limit: data.channelChangeLimit, action: data.channelChangeAction },
      'Role Update': { limit: data.roleChangeLimit, action: data.roleChangeAction },
      Kick: { limit: data.kickLimit, action: data.kickAction },
      Ban: { limit: data.banLimit, action: data.banAction },
    };

    return mapping[list] || null; // Return null if list does not match any key
  };

  const getFieldByItem = (item) => {
    switch (item) {
      case 'Channel Update':
        return 'channelChange';
      case 'Role Update':
        return 'roleChange';
      case 'Kick':
        return 'kick';
      case 'Ban':
        return 'ban';
      default:
        return null;
    }
  };

  const changeNumber = useCallback(
    (value) => {
      const field = getFieldByItem(state.item);
      if (!field) return;

      setState((prevState) => {
        const newSettings = prevState.protection.moderationSettings.map((role) => {
          if (role.roleID === state.activeRole) {
            return {
              ...role,
              [`${field}Limit`]: value,
            };
          }
          return role;
        });

        return {
          ...prevState,
          protection: {
            ...prevState.protection,
            moderationSettings: newSettings,
          },
          hasUnsavedChanges: true,
        };
      });
    },
    [state.activeRole, state.item]
  );

  const changeSelect = useCallback(
    (e) => {
      const field = getFieldByItem(state.item);
      if (!field) return;

      setState((prevState) => {
        const newSettings = prevState.protection.moderationSettings.map((role) => {
          if (role.roleID === state.activeRole) {
            return {
              ...role,
              [`${field}Action`]: e.target.value,
            };
          }
          return role;
        });

        return {
          ...prevState,
          protection: {
            ...prevState.protection,
            moderationSettings: newSettings,
          },
          hasUnsavedChanges: true,
        };
      });
    },
    [state.activeRole, state.item]
  );

  const toggleSwitch = () => {
    setState((prevState) => ({
      ...prevState,
      protection: {
        ...prevState.protection,
        serverSettings: {
          ...prevState.protection.serverSettings,
          active: !prevState.protection.serverSettings.active,
        },
      },
      hasUnsavedChanges: true,
    }));
  };

  const Rest = () => {
    setState({
      protection: guild.protection,
      item: 'Ban',
      activeRole: guild.protection.moderationSettings[0]?.roleID || null,
      hasUnsavedChanges: false,
    });
  };

  const Save = () => {
    setState((prevState) => ({
      ...prevState,
      saving: true,
    }));

    const data = state.protection;
    api.post(`/guilds/${guild.id}/protection`, data).then(({ data }) => {
      setState((prevState) => ({
        ...prevState,
        saving: false,
        hasUnsavedChanges: false,
      }));

      setGuild((prevState) => ({
        ...prevState,
        protection: state.protection,
      }));
    });
  };
  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <Head>
        <title>{locale.protection.pageTitle}</title>
      </Head>
      <header className="p-2.5 border-b border-[#3d4049] text-xl font-semibold flex items-center justify-between">
        <h1>{locale.protection.title}</h1>
        <BigSwitch isOn={state.protection.serverSettings.active} toggleSwitch={toggleSwitch} />
      </header>
      <div className="bg-[#060A1B] p-5 rounded mt-3">
        <div className="rounded bg-[#090f28] w-full flex md:h-[200px] h-full flex-col md:flex-row">
          <div className="flex flex-col justify-center font-medium leading-[143%] md:w-[250px] w-full">
            <div className="flex flex-col pb-20 w-full rounded-l bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-100 transition-opacity duration-300 h-full">
              <div className="flex gap-5 my-2 justify-between self-center px-5 w-full text-xs font-semibold leading-5 text-gray-400 uppercase max-w-[250px] items-center">
                <div className="my-auto">{locale.protection.rolesSec_1.title}</div>
                <Icon
                  icon={'bi:plus-circle-fill'}
                  className={`shrink-0 aspect-square size-[15px] cursor-pointer hover:scale-150 transition duration-150 ease-out hover:ease-in ${
                    showPopup && 'scale-150'
                  }`}
                  onClick={togglePopup}
                />
                {showPopup && (
                  <div
                    ref={triggerRef}
                    className="z-[9846] absolute flex flex-col justify-center items-start px-2.5 pt-2.5 pb-4 text-base font-medium leading-4 text-gray-400 bg-[#121212] rounded border border-solid border-zinc-600 border-opacity-50 max-w-[250px]"
                    style={{ left: popupPosition.x, top: popupPosition.y }}
                  >
                    <div className="flex gap-5 justify-center self-stretch px-2.5 py-2 whitespace-nowrap rounded bg-neutral-800 text-zinc-400">
                      <input
                        type="text"
                        placeholder="Roles"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-zinc-400 placeholder:text-zinc-400 w-full"
                      />
                    </div>
                    {filteredRoles.map((role, index) => (
                      <div
                        onClick={() => handleAddNewRole(role.id)}
                        key={index}
                        className="flex gap-2 mt-2 p-2 rounded hover:bg-[#26282c] transition-colors duration-200 cursor-pointer w-full "
                      >
                        <div className="shrink-0 w-3 h-3 rounded-md" style={{ backgroundColor: decimalToHexColor(role.color) }} />
                        <div>{role.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-blend-normal bg-zinc-300 bg-opacity-20 min-h-[1px] rounded-[407px]" />
              <div className="flex my-2 flex-col m-width-[250px]">
                {state.protection.moderationSettings.map(({ roleID }) => {
                  const role = getRoleById(roleID);
                  const color = decimalToHexColor(role?.color);
                  const name = role?.name || 'Deleted Role';

                  return (
                    <div
                      className={`mx-2 my-[1px] flex items-center p-1 hover:bg-[#515461] rounded cursor-pointer relative justify-between transition-all duration-200 ${
                        state.activeRole == roleID && 'bg-[#555865]'
                      }`}
                      key={roleID}
                      onClick={() => setActiveRole(roleID)}
                      onMouseEnter={() => setHoveredRole(roleID)}
                      onMouseLeave={() => setHoveredRole(null)}
                    >
                      <div className="flex items-center gap-2.5 text-[15px]">
                        <Icon icon={'ic:sharp-circle'} color={color} />
                        <span>{name}</span>
                      </div>
                      {hoveredRole === roleID && (
                        <Icon
                          icon={'solar:trash-bin-trash-bold'}
                          className="mx-2 bg-[#3c3f4c] hover:bg-[#393b47] rounded-full p-1 size-[23px]"
                          color="#9497a7"
                          onClick={() => {
                            deleteRole(roleID);
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex flex-col md:w-[calc(100%-220px)] w-[calc(100%-0px)]">
            {activeWindowData() ? (
              <>
                <SelectableList active={state.item} onChange={handleItemClick} />
                <div className="mx-5 my-2">
                  <div className="flex flex-col gap-1">
                    <div className="w-full text-xs font-bold tracking-wide leading-4 text-gray-400 uppercase">
                      {state.item} {locale.protection.limit}
                    </div>
                    <NumberInput value={activeWindowData().limit} onChange={changeNumber} />
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="w-full text-xs font-bold tracking-wide leading-4 text-gray-400 uppercase">
                      {locale.protection.rateLimit}
                    </div>
                    <ThemedSelect value={activeWindowData().action} onChange={changeSelect} />
                  </div>
                </div>
              </>
            ) : (
              <div className="mx-5 my-2 p-4 text-gray-600">
                <div className="text-base font-semibold mb-1">{locale.protection.rolesSec_1.noRole}</div>
                <div className="text-sm mb-2">{locale.protection.rolesSec_1.noRolep}</div>
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-solid border-zinc-600 border-opacity-50 min-h-[1px] my-5" />

        <div className="flex flex-col items-start text-sm leading-5 text-gray-400">
          <div className="flex gap-5 self-stretch py-1 w-full text-xs font-bold tracking-wide leading-4 uppercase max-md:flex-wrap max-md:max-w-full">
            <div className="flex-auto my-auto">{locale.protection.rolesSec_2.title}</div>
            <Switch active={state.protection.serverSettings.restrictToOwner} onChange={handleSwitchChnage} size="sm" />
          </div>
          <div className="mt-2 max-md:max-w-full">{locale.protection.rolesSec_2.p_1}</div>
          <div className="max-md:max-w-full">{locale.protection.rolesSec_2.p_2}</div>
        </div>

        <div className="border-t border-solid border-zinc-600 border-opacity-50 min-h-[1px] my-5" />

        <div className="flex flex-col text-sm leading-5 text-gray-400">
          <div className="w-full text-xs font-bold tracking-wide leading-4 uppercase max-md:max-w-full">
            {locale.protection.rolesSec_3.title}
          </div>
          <div className="mt-3 w-full max-md:max-w-full">{locale.protection.rolesSec_3.p_1}</div>
          <div className="w-full max-md:max-w-full">{locale.protection.rolesSec_3.p_2}</div>
          <div className="mt-6 w-full max-md:max-w-full">{locale.protection.rolesSec_3.p_3}</div>
          <div
            className={`flex gap-2 items-start px-2.5 py-3 mt-6 text-sm font-medium leading-5 whitespace-nowrap rounded max-md:flex-wrap bg-gradient-to-br from-indigo-500/5 to-purple-500/5 cursor-pointer ${
              state.protection.serverSettings.dashboardPermission == 'Administrator' ? 'bg-slate-700 text-white' : 'bg-slate-800'
            }`}
            onClick={() => setDashboardPermission('Administrator')}
          >
            <Icon
              icon={state.protection.serverSettings.dashboardPermission == 'Administrator' ? 'mdi:radiobox-marked' : 'mdi:radiobox-blank'}
              className="shrink-0 self-start aspect-square w-[24px] h-[24px]"
            />
            <div className="flex-auto my-auto max-md:max-w-full">{locale.protection.rolesSec_3.btn_1}</div>
          </div>
          <div
            className={`flex gap-4 px-2.5 py-3 mt-2 text-sm font-medium leading-5 rounded max-md:flex-wrap bg-gradient-to-br from-indigo-500/5 to-purple-500/5 cursor-pointer ${
              state.protection.serverSettings.dashboardPermission == 'ManageServer' ? 'bg-slate-700 text-white' : 'bg-slate-800'
            }`}
            onClick={() => setDashboardPermission('ManageServer')}
          >
            <Icon
              icon={state.protection.serverSettings.dashboardPermission == 'ManageServer' ? 'mdi:radiobox-marked' : 'mdi:radiobox-blank'}
              className="shrink-0 self-start aspect-square w-[24px] h-[24px]"
            />
            <div className="flex-auto max-md:max-w-full">{locale.protection.rolesSec_3.btn_2}</div>
          </div>
        </div>

        <div className="border-t border-solid border-zinc-600 border-opacity-50 min-h-[1px] my-5" />

        <div className="flex flex-col text-sm leading-5 text-gray-400">
          <div className="w-full text-xs font-bold tracking-wide leading-4 uppercase max-md:max-w-full">
            {locale.protection.rolesSec_4.title}
          </div>
          <div className="flex mt-3 w-full text-base leading-4 text-gray-100 whitespace-nowrap rounded-sm flex-col">
            <CreatableStyledSelect
              value={state.protection.serverSettings.trustedBots}
              onChange={changeTrustedBots}
              theme={{
                control: (provided) => ({
                  ...provided,
                  background: 'linear-gradient(to bottom right, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
                  color: 'white',
                  borderColor: '#10152f',
                }),
                input: (provided) => ({
                  ...provided,
                  color: 'white',
                }),
              }}
            />
          </div>
          <div className="mt-2.5 w-full max-md:max-w-full">{locale.protection.rolesSec_4.p_1}</div>
          <div className="mt-1.5 w-full max-md:max-w-full">{locale.protection.rolesSec_4.p_2}</div>
        </div>
      </div>
      <SaveBar hasUnsavedChanges={state.hasUnsavedChanges} onReset={Rest} onSave={Save} saving={state.saving} />
    </motion.section>
  );
}

export default memo(Protection);

const SelectableList = ({ active, onChange }) => {
  const { locale } = useContext(DataContext);

  const getItemClass = (item) => {
    const baseClass =
      'px-0 py-[15px] text-center whitespace-nowrap cursor-pointer hover:border-b-[1.778px] hover:border-b-slate-400 text-[12px] md:text-[18px]';
    const activeClass = 'text-white border-b-slate-500';
    const inactiveClass = 'text-gray-400';

    return active === item ? `${baseClass} ${activeClass} border-b-[1.778px]` : `${baseClass} ${inactiveClass}`;
  };
  return (
    <div className="flex gap-6 md:gap-5 items-start md:px-5 px-2 text-sm font-medium leading-5 border-solid border-b-[1.778px] border-b-zinc-600 border-b-opacity-50 max-md:flex-wrap h-[52px] w-full justify-center md:justify-start">
      <div className={getItemClass('Ban')} onClick={() => onChange('Ban')}>
        {locale.protection.ban}
      </div>
      <div className={getItemClass('Kick')} onClick={() => onChange('Kick')}>
        {locale.protection.kick}
      </div>
      <div className={getItemClass('Role Update')} onClick={() => onChange('Role Update')}>
        {locale.protection.role}
      </div>
      <div className={`${getItemClass('Channel Update')}`} onClick={() => onChange('Channel Update')}>
        {locale.protection.channel}
      </div>
    </div>
  );
};
