import Switch from '../common/Switch';
import Rodal from 'rodal';
import InputField from './InputField';
import TextAreaField from './TextAreaField';
import FileUpload from './FileUpload';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useContext } from 'react';
import { GuildDataContext } from '../../../../context/guild';
import DiscordStyledMultiSelect from '../../../selects/ChannelsInput';

const Modal = ({
  isOpen,
  onClose,
  onSubmit,
  newReply,
  handleInputChange,
  handleMentionChange,
  handleFileChange,
  RemoveAttachment,
  errors,
  saving,
  uploading,
  triggerRef,
  messageRef,
  locale,
  title,
  handleEnabledChannelsChange,
}) => {
  const { guild, channels } = useContext(GuildDataContext);

  return (
    <Rodal visible={isOpen} onClose={onClose} duration={200} leaveAnimation="fade" closeOnEsc showCloseButton={false} height={'auto'}>
      <div>
        <div className="bg-[#060A1B] rounded shadow flex flex-col justify-center items-start h-full">
          <div className="w-full px-4 pt-[15.22px] pb-4 rounded-tl rounded-tr flex justify-start items-center">
            <div className="w-8 h-6 pr-2" />
            <div className="pb-[0.78px] flex flex-col justify-start items-start">
              <div className="text-gray-100 text-2xl font-normal leading-[30px]">{title}</div>
            </div>
            <div className="w-8 px-1 py-[3.22px] opacity-50 rounded-[3px] flex justify-center items-center">
              <div className="pb-[3.56px] bg-black/opacity-0 flex flex-col justify-start items-center">
                <div className="w-6 h-6 p-1 flex justify-center items-center" />
              </div>
            </div>
          </div>
          <div className="w-full grow px-4 rounded-tl-[5px] rounded-tr-[5px] flex flex-col justify-start items-start gap-4">
            <div className="w-full pb-4 justify-center items-start flex flex-col">
              <InputField
                label={locale.autoreply.trigger}
                name="trigger"
                value={newReply.trigger}
                onChange={handleInputChange}
                error={errors.trigger}
                inputRef={triggerRef}
              />
              <TextAreaField
                label={locale.autoreply.reply}
                name="message"
                value={newReply.message}
                onChange={handleInputChange}
                error={errors.message}
                inputRef={messageRef}
              />
              <div className="flex flex-col gap-1 w-full max-w-full mb-2.5">
                <div className="w-full text-xs font-bold tracking-wide leading-4 text-gray-400 uppercase">{locale.autoreply.useEmbed}</div>
                <select
                  name="embed"
                  value={newReply.embed}
                  onChange={handleInputChange}
                  className="px-2.5 py-3 mt-2 text-sm font-medium leading-4 text-gray-400 whitespace-nowrap rounded-sm bg-[#1D1B45] max-md:pr-5 max-md:max-w-full focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={null} key={0}>
                    None
                  </option>
                  {guild.embeds.map((e, i) => (
                    <option value={e._id} key={i + 1}>
                      Embed {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1 w-full max-w-full mb-2.5">
                <div className="w-full text-xs font-bold tracking-wide leading-4 text-gray-400 uppercase">
                  {locale.autoreply.enabled_channels}
                </div>
                <DiscordStyledMultiSelect options={channels} value={newReply.enabled_channels} onChange={handleEnabledChannelsChange} />
              </div>
              <FileUpload
                attachment={newReply.attachment}
                onFileChange={handleFileChange}
                onRemoveAttachment={RemoveAttachment}
                error={errors.attachment}
                uploading={uploading}
              />
              <div className="flex flex-row gap-1 w-full max-w-full mt-2.5">
                <div className="text-xs font-bold tracking-wide leading-4 text-gray-400 uppercase w-[90%]">
                  {locale.autoreply.mentionUser}
                </div>
                <Switch size="sm" active={newReply.mention} onChange={handleMentionChange} />
              </div>
            </div>
          </div>
          <div className="w-full pr-4 py-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-bl-[5px] rounded-br-[5px] shadow-inner flex justify-start items-start">
            <button
              className="flex flex-col justify-center px-5 py-1 rounded transition-colors duration-300 hover:underline font-normal"
              onClick={onClose}
            >
              <div className="justify-center py-1">{locale.modal.cancel}</div>
            </button>
            <button
              className="flex flex-col justify-center items-center py-[2px] px-[16px] h-[38px] w-[80px] bg-indigo-500 rounded hover:bg-indigo-600 transition-colors duration-300 font-normal"
              onClick={onSubmit}
              style={saving ? { opacity: '0.5', cursor: 'not-allowed' } : {}}
            >
              <div className="flex justify-center items-center">
                {saving ? <Icon icon={'eos-icons:three-dots-loading'} className="text-[#ffffffa3] size-[38px]" /> : locale.modal.save}
              </div>
            </button>
          </div>
        </div>
      </div>
    </Rodal>
  );
};
export default Modal;
