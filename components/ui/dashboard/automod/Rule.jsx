import { useContext, useEffect, useState } from 'react';
import DiscordStyledMultiSelect from '../../../selects/multiSelect';
import { motion } from 'framer-motion';
import { NumberInput, TimeInput } from '../../../selects/Inputs';
import CreatableStyledSelect from '../../../selects/CreatebleSelect';
import { Icon } from '@iconify/react/dist/iconify.js';
import { DataContext } from '../../../../context';

export default function Rule({
  rule,
  channels,
  roles,
  changeRuleSettings,
  setIsCollapsed,
  Reset,
  Save,
  actions = [],
  inputs = [],
  saving,
}) {
  const { locale } = useContext(DataContext);
  const handleKeywordFilterChange = (newKeywords) => {
    if (newKeywords.length > 100) return;
    changeRuleSettings(rule.id, {
      trigger_metadata: {
        ...rule.trigger_metadata,
        keyword_filter: newKeywords,
      },
    });
  };
  const handleMentionLimitChange = (total) => {
    changeRuleSettings(rule.id, {
      trigger_metadata: {
        ...rule.trigger_metadata,
        mention_total_limit: total,
      },
    });
  };
  const handleExemptChannelsChange = (newChannels) => {
    changeRuleSettings(rule.id, { exempt_channels: newChannels.map((e) => e.value) });
  };

  const handleExemptRolesChange = (newRoles) => {
    changeRuleSettings(rule.id, { exempt_roles: newRoles.map((e) => e.value) });
  };

  const handleActionChange = (actionType, isActive, metadata) => {
    let updatedActions = rule.actions || [];
    if (isActive) {
      updatedActions = updatedActions.filter((action) => action.type !== actionType);
      updatedActions.push({ type: actionType, metadata });
    } else {
      updatedActions = updatedActions.filter((action) => action.type !== actionType);
    }

    changeRuleSettings(rule.id, { actions: updatedActions });
  };
  const TimeoutActive = rule.actions?.some((action) => action.type === 3);
  const LogActive = rule.actions?.some((action) => action.type === 2);
  const MessageAction = rule.actions?.some((action) => action.type === 1);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (LogActive) {
      setTimeout(() => setVisible(true), 300);
    } else {
      setVisible(false);
    }
  }, [LogActive]);
  return (
    <>
      <div className="flex flex-col px-3.5 mt-3.5 w-full">
        {inputs.includes(4) && (
          <>
            <div className="mt-1.5 text-xs font-bold tracking-wide leading-3 text-gray-400 uppercase">{locale.automod.Sec_1.p_10}</div>
            <div className="gap-5 mt-1.5 w-full">
              <NumberInput value={rule.trigger_metadata.mention_total_limit} onChange={handleMentionLimitChange} />
            </div>
          </>
        )}

        {inputs.includes(1) && (
          <>
            <div className="text-xs font-bold tracking-wide leading-3 text-gray-400 uppercase">{locale.automod.Sec_1.p_1}</div>
            <div className="gap-5 mt-1.5 w-full">
              <CreatableStyledSelect value={rule.trigger_metadata.keyword_filter || []} onChange={handleKeywordFilterChange} />
            </div>
          </>
        )}
        {inputs.includes(2) && (
          <>
            <div className="mt-1.5 text-xs font-bold tracking-wide leading-3 text-gray-400 uppercase">{locale.automod.Sec_1.p_2}</div>
            <div className="gap-5 mt-1.5 w-full">
              <DiscordStyledMultiSelect options={channels} value={rule.exempt_channels} onChange={handleExemptChannelsChange} />
            </div>
          </>
        )}
        {inputs.includes(3) && (
          <>
            <div className="mt-1.5 text-xs font-bold tracking-wide leading-3 text-gray-400 uppercase">{locale.automod.Sec_1.p_3}</div>
            <div className="gap-5 mt-1.5 w-full">
              <DiscordStyledMultiSelect type="roles" options={roles} value={rule.exempt_roles} onChange={handleExemptRolesChange} />
            </div>
          </>
        )}
        <div className="mt-1.5 text-xs font-bold tracking-wide leading-3 text-gray-400 uppercase">{locale.automod.Sec_1.p_4}</div>

        {
          /* Block Message Action */
          actions.includes(1) && (
            <div
              onClick={() =>
                handleActionChange(1, !MessageAction, {
                  custom_message: 'Your message contains inappropriate language.',
                })
              }
              className={`flex border-[#3e4652] border gap-5 justify-between px-3.5 py-3.5 mt-1.5 w-full text-xs font-bold tracking-wide leading-3 text-white uppercase rounded-md cursor-pointer transition-colors duration-300
                ${MessageAction ? 'bg-[#25235b]' : 'bg-[#1D1B45] hover:bg-[#2b296b]'}`}
            >
              <div className="flex gap-2.5">
                <img loading="lazy" src="/icons/x.svg" className="shrink-0 aspect-square fill-zinc-700 w-[30px]" />
                <div className="my-auto">{locale.automod.Sec_1.p_5}</div>
              </div>
              <div className="px-5 flex items-center">
                {MessageAction && <img src="/icons/active.svg" className="shrink-0 size-5 text-[#5b5bca]" />}
              </div>
            </div>
          )
        }

        {
          /* Send to Log Action */
          actions.includes(2) && (
            <div
              onClick={() =>
                handleActionChange(2, !LogActive, {
                  channel_id: channels[0]?.id,
                })
              }
              className={`flex border-[#3e4652] border gap-5 justify-between px-3.5 py-3.5 mt-1.5 w-full text-xs font-bold tracking-wide leading-3 text-white uppercase rounded-md cursor-pointer transition-colors duration-300
          ${LogActive ? 'bg-[#25235b]' : 'bg-[#1D1B45] hover:bg-[#2b296b]'}`}
            >
              <div className="flex flex-col">
                <div className="flex gap-2.5">
                  <img loading="lazy" src="/icons/hashtag.svg" className="text-white shrink-0 aspect-square fill-zinc-700 w-[30px]" />
                  <div className="my-auto">{locale.automod.Sec_1.p_6}</div>
                </div>
                <motion.div
                  initial={false}
                  animate={{ height: !LogActive ? 0 : 'auto', overflow: !visible ? 'hidden' : 'visible' }}
                  transition={{ duration: 0.3 }}
                >
                  <div onClick={(e) => e.stopPropagation()} className="w-[250px] px-2.5 pt-4 gap-2.5 flex flex-col">
                    <div className="my-auto">{locale.automod.Sec_1.p_7}</div>
                    <DiscordStyledMultiSelect
                      isMulti={false}
                      options={channels}
                      onChange={(e) => handleActionChange(2, true, { channel_id: e.value })}
                      value={rule.actions?.find((action) => action.type === 2)?.metadata.channel_id || channels[0]?.id}
                      menuPlacement={'top'}
                    />
                  </div>
                </motion.div>
              </div>
              <div className="px-5 flex items-center">
                {LogActive && <img src="/icons/active.svg" className="shrink-0 size-5 text-[#5b5bca]" />}
              </div>
            </div>
          )
        }

        {
          /* Timeout Member Action */
          actions.includes(3) && (
            <div
              onClick={() =>
                handleActionChange(3, !TimeoutActive, {
                  duration_seconds: rule.actions?.find((action) => action.type === 3)?.metadata.duration_seconds || 300,
                })
              }
              className={`flex border-[#3e4652] border gap-5 justify-between px-3.5 py-3.5 mt-1.5 w-full text-xs font-bold tracking-wide leading-3 text-white uppercase rounded-md cursor-pointer transition-colors duration-300
          ${TimeoutActive ? 'bg-[#25235b]' : 'bg-[#1D1B45] hover:bg-[#2b296b]'}`}
            >
              <div className="flex flex-col">
                <div className="flex gap-2.5">
                  <img loading="lazy" src="/icons/timeoutMember.svg" className="shrink-0 aspect-square fill-white w-[30px]" />
                  <div className="my-auto">{locale.automod.Sec_1.p_8}</div>
                </div>
                <motion.div
                  initial={false}
                  animate={{ height: !TimeoutActive ? 0 : 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-2.5 my-auto whitespace-nowrap pt-5">
                    <div className="my-auto">{locale.automod.Sec_1.p_9}</div>
                    <TimeInput
                      timeValue={rule.actions?.find((action) => action.type === 3)?.metadata.duration_seconds}
                      changeTimeValue={(e) => handleActionChange(3, true, { duration_seconds: parseInt(e) })}
                    />
                  </div>
                </motion.div>
              </div>
              <div className="px-5 flex items-center">
                {TimeoutActive && <img src="/icons/active.svg" className="shrink-0 size-5 text-[#5b5bca]" />}
              </div>
            </div>
          )
        }

        <div className="flex justify-end gap-2 pt-4 px-4 text-sm leading-4 text-white whitespace-nowrap rounded-b shadow-sm">
          <button
            className="flex flex-col justify-center px-5 py-1 rounded transition-colors duration-300 hover:underline font-normal"
            onClick={() => {
              Reset();
              setIsCollapsed(true);
            }}
          >
            <div className="justify-center py-1">{locale.automod.cancel}</div>
          </button>
          <button
            className="flex flex-col justify-center items-center py-[2px] px-[16px] h-[38px] w-[80px] bg-indigo-500 rounded hover:bg-indigo-600 transition-colors duration-300 font-normal"
            onClick={() => {
              Save(rule.id);
            }}
            disabled={saving == rule.id}
            style={{ opacity: saving == rule.id ? '0.5' : '1', cursor: saving == rule.id ? 'not-allowed' : 'pointer' }}
          >
            <div className="flex justify-center items-center">
              {saving == rule.id ? (
                <Icon icon={'eos-icons:three-dots-loading'} className="text-[#ffffffa3] size-[38px]" />
              ) : (
                locale.automod.save
              )}
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
