import { useContext } from 'react';
import CreatableStyledSelect from '../../../selects/CreatebleSelect';
import RolesStyledMultiSelect from '../../../selects/multiSelect';
import Switch from '../common/Switch';
import { DataContext } from '../../../../context';
import DiscordStyledMultiSelect from '../../../selects/ChannelsInput';

export const ModalTemplate = ({
  state,
  channels,
  roles,
  changeAliases,
  changeEnabledChannels,
  changeDisabledChannels,
  changeEnabledRoles,
  changeDisabledRoles,
  changeAutoDeleteReply,
  changeAutoDeleteInvocation,
}) => {
  const { locale } = useContext(DataContext);

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex flex-col gap-1 w-full max-w-full md:max-w-[397px]">
        <div className="w-full text-xs font-bold tracking-wide leading-4 text-gray-400 uppercase">{locale.modal.First}</div>
        <CreatableStyledSelect value={state.aliases} onChange={changeAliases} />
      </div>
      <div className="flex flex-col gap-1 w-full max-w-full md:max-w-[397px]">
        <div className="w-full text-xs font-bold tracking-wide leading-4 text-gray-400 uppercase">{locale.modal.twice}</div>
        <DiscordStyledMultiSelect
          options={channels}
          value={state.enabled_channels}
          onChange={changeEnabledChannels}
          disabled={state.disabled_channels.length > 0}
        />
      </div>
      <div className="flex flex-col gap-1 w-full max-w-full md:max-w-[397px]">
        <div className="w-full text-xs font-bold tracking-wide leading-4 text-gray-400 uppercase">{locale.modal.third}</div>
        <DiscordStyledMultiSelect
          options={channels}
          value={state.disabled_channels}
          onChange={changeDisabledChannels}
          disabled={state.enabled_channels.length > 0}
        />
      </div>
      <div className="flex flex-col gap-1 w-full max-w-full md:max-w-[397px]">
        <div className="w-full text-xs font-bold tracking-wide leading-4 text-gray-400 uppercase">{locale.modal.fourth}</div>
        <RolesStyledMultiSelect
          options={roles}
          value={state.enabled_roles}
          onChange={changeEnabledRoles}
          type="roles"
          disabled={state.disabled_roles.length > 0}
        />
      </div>
      <div className="flex flex-col gap-1 w-full max-w-full md:max-w-[397px]">
        <div className="w-full text-xs font-bold tracking-wide leading-4 text-gray-400 uppercase">{locale.modal.fifth}</div>
        <RolesStyledMultiSelect
          options={roles}
          value={state.disabled_roles}
          onChange={changeDisabledRoles}
          type="roles"
          disabled={state.enabled_roles.length > 0}
        />
      </div>
      <div className="flex gap-5 text-sm font-medium leading-6 text-gray-100 w-full max-w-full md:max-w-[397px] items-center">
        <div className="flex-auto my-auto">{locale.modal.sixth}</div>
        <Switch active={state.auto_delete_reply} onChange={changeAutoDeleteReply} size="sm" />
      </div>
      <div className="flex gap-5 text-sm font-medium leading-6 text-gray-100 w-full max-w-full md:max-w-[397px] items-center">
        <div className="flex-auto my-auto">{locale.modal.seventh}</div>
        <Switch active={state.auto_delete_invocation} onChange={changeAutoDeleteInvocation} size="sm" />
      </div>
    </div>
  );
};
