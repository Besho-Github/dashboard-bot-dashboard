import Switch from '../common/Switch';
import { Icon } from '@iconify/react/dist/iconify.js';
import DiscordStyledMultiSelect from '../../../selects/multiSelect';
import { useContext } from 'react';
import { DataContext } from '../../../../context';
import { graytheme } from '../../../selects/themes';

export default function WelcomeMessage({
  state,
  handleDescriptionChange,
  handleRadioChange,
  handleChannelChange,
  handleSwitchChange,
  channels,
}) {
  const { locale } = useContext(DataContext);

  const handleVariableClick = (variable) => {
    const textarea = document.querySelector('textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = state.text.message;
    const newText = text.substring(0, start) + variable + text.substring(end);
    handleDescriptionChange({ target: { value: newText } });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/10 p-2 rounded-lg">
              <Icon icon="mdi:message-text" className="text-indigo-400 w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-gray-100 uppercase">{locale.welcome.sec_1.title}</h2>
          </div>
          <Switch size="sm" active={state.text.enabled} onChange={() => handleSwitchChange('text')} />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-bold tracking-wide text-gray-400 uppercase">{locale.welcome.sec_1.textArea}</div>
          <textarea
            maxLength={2000}
            onChange={handleDescriptionChange}
            className="w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-lg bg-[#1c1e4e] min-h-[84px] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
            rows={4}
            value={state.text.message}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500/10 p-2 rounded-lg">
              <Icon icon="mdi:send" className="text-green-400 w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-gray-100 uppercase">{locale.welcome.sec_1.send}</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-[#232428] rounded-lg transition-colors">
              <input type="radio" id="member-dm" name="send-to" value="1" className="hidden peer" onClick={handleRadioChange} />
              <Icon
                icon={state.text.type == 1 ? 'mdi:radiobox-marked' : 'mdi:radiobox-blank'}
                className="shrink-0 w-5 h-5 text-indigo-400"
              />
              <span className="text-gray-300">{locale.welcome.sec_1.option_1}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-[#232428] rounded-lg transition-colors">
              <input type="radio" id="specific-channel" name="send-to" value="0" className="hidden peer" onClick={handleRadioChange} />
              <Icon
                icon={state.text.type == 0 ? 'mdi:radiobox-marked' : 'mdi:radiobox-blank'}
                className="shrink-0 w-5 h-5 text-indigo-400"
              />
              <span className="text-gray-300">{locale.welcome.sec_1.option_2}</span>
            </label>

            {state.text.type == 0 && (
              <div className="mt-3 pl-7">
                <DiscordStyledMultiSelect isMulti={false} options={channels} onChange={handleChannelChange} value={state.text.channelId} />
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-amber-500/10 p-2 rounded-lg">
              <Icon icon="mdi:code-braces" className="text-amber-400 w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-gray-100 uppercase">{locale.welcome.variables.title}</h2>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { var: '{USERNAME}', desc: locale.welcome.variables.item_4 },

              { var: '{SERVER}', desc: locale.welcome.variables.item_1 },
              { var: '{MEMBERCOUNT}', desc: locale.welcome.variables.item_2 },
              { var: '{INVITERNAME}', desc: locale.welcome.variables.item_6 },
              { var: '{INVITES}', desc: locale.welcome.variables.item_7 },
              { var: '{USER}', desc: locale.welcome.variables.item_3 },
              { var: '{INVITER}', desc: locale.welcome.variables.item_5 },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row md:items-center gap-2 p-2 hover:bg-[#232428] rounded-lg transition-colors cursor-pointer"
                onClick={() => handleVariableClick(item.var)}
              >
                <code className="text-blue-400 font-mono text-sm whitespace-nowrap">{item.var}</code>
                <span className="text-gray-400 capitalize text-sm truncate w-[115px] md:w-full">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
