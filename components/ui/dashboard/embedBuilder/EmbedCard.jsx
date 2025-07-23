import { useContext, useState } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import EmbedForm from './EmbedForm';
import DiscordStyledMultiSelect from '../../../selects/multiSelect';
import { GuildDataContext } from '../../../../context/guild';
import { api } from '../../../../utils/api';
import cleanDeep from 'clean-deep';
import { hexToDecimalColor } from '../../../../utils';
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataContext } from '../../../../context';

export default function EmbedCard({
  embed,
  handleAddField,
  handleClearFields,
  handleChange,
  handleColorChange,
  handleFieldChange,
  handleRemoveField,
  handleDeleteEmbed,
  handleEditEmbed,
  handleImageUpload,
  handleImageRemove,
  isValidEmbed,
  loadingStates,
  index,
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { channels, guild } = useContext(GuildDataContext);
  const Channels = channels.filter((ch) => ch.type == 0);
  const [channel, setChannel] = useState(Channels[0]?.id || '');
  const [isSending, setIsSending] = useState(false);
  const { locale } = useContext(DataContext);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSendEmbed = async () => {
    setIsSending(true);
    const Embed = cleanDeep({ ...embed, content: '', _id: '', color: hexToDecimalColor(embed.color) });
    try {
      const response = await api.post(`/guilds/${guild.id}/channels/${channel}/message`, {
        content: embed.content,
        embeds: [Embed],
      });
      toast.success(locale.embed.body.sec_1.toast, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Bounce,
      });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col py-4 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 w-full mb-2">
      <div className="flex gap-5 justify-between self-center w-full items-center px-5">
        <div className="flex gap-2">
          <img loading="lazy" src="/icons/embed.svg" className="shrink-0 w-10 aspect-square" alt="icon" />
          <div className="flex flex-col self-start px-5">
            <div className="text-sm font-bold leading-5 text-gray-100">
              {locale.embed.body.sec_1.embedNum} {index}
            </div>
          </div>
        </div>

        <button onClick={toggleCollapse} className="p-2 hover:bg-[#363945] rounded-full transition-colors">
          <svg
            className={`w-5 h-5 transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <motion.div initial={false} animate={{ height: isCollapsed ? 0 : 'auto' }} transition={{ duration: 0.3 }} className="overflow-hidden">
        <div className="w-full bg-blend-normal bg-zinc-300 bg-opacity-20 min-h-[2px] rounded-[407px] mt-4" />
        <div className="p-5 flex lg:flex-row flex-col gap-5">
          <div className="flex flex-col lg:w-1/2 w-full gap-2">
            <label className="text-white uppercase">{locale.embed.body.sec_1.messageContent}</label>
            <textarea
              name="content"
              value={embed.content}
              onChange={handleChange}
              placeholder={locale.embed.body.sec_1.messageContent}
              className="px-2.5 py-3 mt-3 text-sm font-medium leading-4 text-gray-400 whitespace-nowrap rounded-sm bg-[#1D1B45] max-md:pr-5 max-md:max-w-full focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <label className="text-white uppercase">{locale.embed.body.sec_1.channel}</label>
            <DiscordStyledMultiSelect
              isMulti={false}
              options={channels}
              value={channel}
              onChange={(selected) => setChannel(selected.value)}
            />

            <button
              className="p-2 my-1 bg-indigo-500 rounded text-white flex justify-center items-center h-10"
              onClick={handleSendEmbed}
              disabled={isSending}
              style={{
                opacity: isSending ? '0.5' : '1',
                cursor: isSending ? 'not-allowed' : 'pointer',
              }}
            >
              {isSending ? <Icon icon={'eos-icons:three-dots-loading'} className="text-[#ffffffa3]" /> : locale.embed.body.sec_1.sendEmbed}
            </button>
          </div>
          <div className="flex flex-col lg:w-1/2 w-full">
            <EmbedForm
              embed={embed}
              handleAddField={handleAddField}
              handleClearFields={handleClearFields}
              handleChange={handleChange}
              handleColorChange={handleColorChange}
              handleFieldChange={handleFieldChange}
              handleRemoveField={handleRemoveField}
              handleImageUpload={handleImageUpload}
              handleImageRemove={handleImageRemove}
              isValidEmbed={isValidEmbed}
              loadingStates={loadingStates}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4 px-4 text-sm leading-4 text-white whitespace-nowrap rounded-b shadow-sm">
          <button
            className="flex flex-col justify-center px-5 py-1 rounded transition-colors duration-300 hover:underline font-normal"
            onClick={() => {
              setIsCollapsed(true);
            }}
          >
            <div className="justify-center py-1">{locale.embed.body.sec_1.cancel}</div>
          </button>
          <button
            className="flex flex-col justify-center items-center py-[2px] px-[16px] h-[38px] w-[80px] bg-indigo-500 rounded hover:bg-indigo-600 transition-colors duration-300 font-normal"
            onClick={() => handleEditEmbed(embed._id, embed)}
            disabled={loadingStates[embed._id]?.delete || loadingStates[embed._id]?.save}
            style={{
              opacity: loadingStates[embed._id]?.save ? '0.5' : '1',
              cursor: loadingStates[embed._id]?.save ? 'not-allowed' : 'pointer',
            }}
          >
            <div className="flex justify-center items-center">
              {loadingStates[embed._id]?.save ? (
                <Icon icon={'eos-icons:three-dots-loading'} className="text-[#ffffffa3] size-[38px]" />
              ) : (
                locale.embed.body.sec_1.save
              )}
            </div>
          </button>
          <button
            className="flex flex-col justify-center items-center py-[2px] px-[16px] h-[38px] w-[80px] bg-red-500 rounded hover:bg-red-600 transition-colors duration-300 font-normal"
            onClick={() => handleDeleteEmbed(embed._id)}
            disabled={loadingStates[embed._id]?.delete || loadingStates[embed._id]?.save}
            style={{
              opacity: loadingStates[embed._id]?.delete ? '0.5' : '1',
              cursor: loadingStates[embed._id]?.delete ? 'not-allowed' : 'pointer',
            }}
          >
            <div className="flex justify-center items-center">
              {loadingStates[embed._id]?.delete ? (
                <Icon icon={'eos-icons:three-dots-loading'} className="text-[#ffffffa3] size-[38px]" />
              ) : (
                locale.embed.body.sec_1.delete
              )}
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
