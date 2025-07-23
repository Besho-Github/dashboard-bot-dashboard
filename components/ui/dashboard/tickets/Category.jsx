import DiscordStyledMultiSelect from '../../../selects/multiSelect';
import { TRANSPARENT, getContrastColor } from '../../../../utils';
import { useRef, useState, useEffect, useContext, memo } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { motion, AnimatePresence } from 'framer-motion';
import { DataContext } from '../../../../context';
import { Tooltip } from 'react-tooltip';
import EmojiPicker from 'emoji-picker-react';

export default memo(function Category({
  index,
  category,
  channels,
  roles,
  handleChannelType,
  handleInputChange,
  handleSelectChange,
  handleRemoveCategory,
  handleColorChange,
  handleEmojiChange,
  handleCategoryImageChange,
  handleCategoryImageRemove,
  customEmojis,
  uploading = true,
  error,
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [emojiPickerRef, emojiButtonRef]);

  const handleFileUploadClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  const toggleEmojiPicker = (e) => {
    e.stopPropagation();
    setShowEmojiPicker(!showEmojiPicker);
  };
  const EmojiDisplay = () => {
    if (!customEmojis || customEmojis.length === 0) {
      return <div className="flex items-center justify-center text-gray-400 text-xs">No emoji</div>;
    }

    const emoji = customEmojis.find((emoji) => `<${emoji.name}:${emoji.id}>` === category.emoji);
    const emojiUrl = emoji ? `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}` : null;

    if (emojiUrl) {
      return (
        <div className="flex items-center justify-center w-6 h-6">
          <img src={emojiUrl} className="max-w-full max-h-full object-contain" alt={emoji.name} />
        </div>
      );
    }

    return category.emoji ? (
      <div className="flex items-center justify-center text-lg">{category.emoji}</div>
    ) : (
      <div className="flex items-center justify-center text-gray-400 text-xs">No emoji</div>
    );
  };

  const { locale } = useContext(DataContext);

  return (
    <motion.div
      className="flex flex-col px-5 pt-3 pb-5 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 max-md:max-w-full my-3 shadow-lg hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex gap-5 justify-between items-start w-full max-md:flex-wrap max-md:max-w-full">
        <div className="mt-3 text-xs font-semibold leading-4 uppercase text-zinc-400">{locale.tickets.category.categoryName}</div>
        <div className="flex gap-1">
          <Tooltip
            id={`deleteTooltip-${index}`}
            className="text-white text-sm font-normal normal-case"
            style={{ borderRadius: '5px', background: '#111214' }}
          />
          <Icon
            data-tooltip-id={`deleteTooltip-${index}`}
            data-tooltip-content={`${locale.tickets.category.Tooltip}`}
            icon="mdi:trash-can-outline"
            className="cursor-pointer text-gray-500 size-5 hover:text-red-400 transition-colors duration-200 outline-none"
            onClick={() => handleRemoveCategory(index)}
            aria-label="Delete category"
          />
        </div>
      </div>
      <input
        className="px-3 py-3 mt-3 text-sm font-medium leading-4 text-gray-300 whitespace-nowrap rounded-md border border-[#3a3f4e] bg-[#1F1A45] w-full max-md:pr-5 max-md:max-w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        type="text"
        value={category.name}
        placeholder="Enter category name"
        onChange={(e) => handleInputChange(e, index, 'name')}
        aria-label="Category name"
      />
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-2 text-xs text-red-400 font-medium"
        >
          {error}
        </motion.div>
      )}
      <div className="mt-4 max-md:max-w-full">
        <div className="flex gap-6 max-md:flex-col max-md:gap-0">
          <div className="flex flex-col w-[196px] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col grow text-xs font-semibold leading-4 text-zinc-400 max-md:mt-3">
              <div className="uppercase">{locale.tickets.category.categoryChannel}</div>
              <div className="mt-3 w-full text-sm font-medium leading-4">
                <DiscordStyledMultiSelect
                  isMulti={false}
                  type="categories"
                  options={channels}
                  value={category.categoryId}
                  onChange={(e) => handleSelectChange(e.value, index, 'categoryId')}
                  aria-label="Category channel"
                />
              </div>
              <div className="mt-4 uppercase">{locale.tickets.category.emoji}</div>
              <div className="mt-3 w-full text-sm font-medium leading-4">
                <div className="relative">
                  <div className="flex items-center justify-between text-sm font-medium rounded-md text-gray-300 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-[#3a3f4e] overflow-hidden transition-all duration-200 hover:border-blue-500">
                    <div className="flex-grow pl-3 py-2.5 flex items-center">
                      <EmojiDisplay />
                    </div>
                    <Tooltip
                      id={`emojiPickerTooltip-${index}`}
                      className="text-white text-xs font-normal"
                      style={{ borderRadius: '4px', background: '#111214' }}
                    />
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      className="h-[38px] w-[38px] flex items-center justify-center border-l border-[#3a3f4e] focus:outline-none"
                      onClick={toggleEmojiPicker}
                      ref={emojiButtonRef}
                      aria-label="Open emoji picker"
                      data-tooltip-id={`emojiPickerTooltip-${index}`}
                      data-tooltip-content="Select Emoji"
                    >
                      <Icon icon={'mdi:smiley'} className="size-5 text-gray-300" />
                    </motion.button>
                  </div>
                  <div className="mt-4 uppercase">{locale.tickets.category.adminRole}</div>
                  <div className="mt-3 w-full text-sm font-medium leading-4">
                    <DiscordStyledMultiSelect
                      type="roles"
                      isMulti={true}
                      components={{ ClearIndicator: () => null, DropdownIndicator: () => null }}
                      options={roles.filter((role) => role.name !== '@everyone')}
                      onChange={(e) => {
                        handleSelectChange(e.map((role) => role.value).join(','), index, 'roleId');
                      }}
                      value={category.roleId.split(',')}
                      aria-label="Admin role"
                    />
                  </div>
                  <AnimatePresence>
                    {showEmojiPicker && typeof window !== 'undefined' && (
                      <motion.div
                        className="absolute z-50 mt-1 right-0"
                        ref={emojiPickerRef}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))' }}
                      >
                        <div className="overflow-hidden rounded-lg border border-[#3a3f4e]">
                          <EmojiPicker
                            searchPlaceholder="Search emoji..."
                            theme="dark"
                            emojiStyle="native"
                            lazyLoadEmojis
                            width={320}
                            height={400}
                            previewConfig={{
                              showPreview: false,
                            }}
                            customEmojis={
                              customEmojis?.map((e) => ({
                                id: e.id,
                                names: [e.name],
                                imgUrl: `https://cdn.discordapp.com/emojis/${e.id}.${e.animated ? 'gif' : 'png'}`,
                                category: 'Custom',
                              })) || []
                            }
                            onEmojiClick={(emojiData) => {
                              // For custom Discord emojis
                              if (emojiData.isCustom) {
                                const customEmoji = customEmojis?.find((e) => e.id === emojiData.emoji);
                                if (customEmoji) {
                                  handleEmojiChange({ native: false, name: customEmoji.name, id: customEmoji.id }, index);
                                }
                              } else {
                                // For regular Unicode emojis
                                handleEmojiChange({ native: emojiData.emoji }, index);
                              }
                              setShowEmojiPicker(false);
                            }}
                            categories={[
                              {
                                name: 'Custom',
                                category: 'custom',
                              },
                              {
                                name: 'Smileys & People',
                                category: 'smileys_people',
                              },
                              {
                                name: 'Animals & Nature',
                                category: 'animals_nature',
                              },
                              {
                                name: 'Food & Drink',
                                category: 'food_drink',
                              },
                              {
                                name: 'Activities',
                                category: 'activities',
                              },
                              {
                                name: 'Travel & Places',
                                category: 'travel_places',
                              },
                              {
                                name: 'Objects',
                                category: 'objects',
                              },
                              {
                                name: 'Symbols',
                                category: 'symbols',
                              },
                              {
                                name: 'Flags',
                                category: 'flags',
                              },
                            ]}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-[196px] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col grow font-semibold max-md:mt-3">
              <div className="text-xs leading-4 uppercase text-zinc-400">{locale.tickets.category.logChannel}</div>
              <div className="mt-3 w-full text-sm font-medium leading-4">
                <DiscordStyledMultiSelect
                  isMulti={false}
                  type="channels"
                  options={channels}
                  onChange={(e) => handleSelectChange(e.value, index, 'logChannelId')}
                  value={category.logChannelId}
                  aria-label="Log channel"
                />
              </div>
              <div className="mt-4 text-xs leading-4 uppercase text-zinc-400">{locale.tickets.category.displayType}</div>
              <div className="mt-3 w-full text-sm font-medium leading-4">
                <DiscordStyledMultiSelect
                  isMulti={false}
                  type="any"
                  options={[
                    {
                      label: (
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 bg-blue-500 text-white text-xs rounded-md">Button Primary</div>
                        </div>
                      ),
                      value: '21',
                    },
                    {
                      label: (
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 bg-gray-500 text-white text-xs rounded-md">Button Secondary</div>
                        </div>
                      ),
                      value: '22',
                    },
                    {
                      label: (
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 bg-green-500 text-white text-xs rounded-md">Button Success</div>
                        </div>
                      ),
                      value: '23',
                    },
                    {
                      label: (
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 bg-red-500 text-white text-xs rounded-md">Button Danger</div>
                        </div>
                      ),
                      value: '24',
                    },
                    {
                      label: (
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 bg-[#2f3136] text-white text-xs rounded-md flex items-center gap-1">
                            <span>Select Menu</span>
                            <Icon icon="mdi:chevron-down" className="w-3 h-3" />
                          </div>
                        </div>
                      ),
                      value: '3',
                    },
                  ]}
                  onChange={(e) => handleChannelType(e, index)}
                  value={category.sectionType}
                  aria-label="Display type"
                />
              </div>
              <div className="mt-4 text-xs leading-4 uppercase text-zinc-400">{locale.tickets.category.embed}</div>
              <div
                className="mt-3 relative rounded-md h-full border border-solid border-[#3a3f4e] overflow-hidden transition-all duration-300 hover:border-white"
                style={{ backgroundColor: category.color }}
              >
                <Icon
                  className="absolute w-[16px] h-[16px] top-[8px] right-[8px] transition-colors duration-500"
                  icon={'fa-solid:eye-dropper'}
                  style={{ color: category.color && getContrastColor(category.color) }}
                />
                <input
                  type="color"
                  className="appearance-none w-full h-full rounded-md cursor-pointer opacity-0"
                  value={category.color}
                  onChange={(e) => handleColorChange(e.target.value, index)}
                  aria-label="Embed color"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-[196px] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col grow font-semibold max-md:mt-3">
              <div className="text-xs leading-4 uppercase text-zinc-400">{locale.tickets.category.background}</div>
              <div className="mt-3 w-full text-sm font-medium leading-4 flex flex-col grow">
                <img
                  src={category.image?.replace('media.wicks.bot', process.env.MEDIA_DOMAIN) || TRANSPARENT}
                  className="aspect-[4/2] border-[#1e293b] border rounded-md object-cover transition-all duration-300 hover:border-white"
                  alt="Category background"
                />
                <div className="flex gap-4 justify-between items-center self-start mt-5">
                  <input
                    type="file"
                    id={`backgroundImageInput-${index}`}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => handleCategoryImageChange(e, index)}
                    accept="image/gif, image/jpeg, image/png"
                  />
                  <div className="flex gap-5">
                    <motion.div
                      whileHover={!uploading ? { scale: 1.03, backgroundColor: '#4B5563' } : {}}
                      whileTap={!uploading ? { scale: 0.97 } : {}}
                      className={`flex flex-col justify-center self-stretch px-4 py-2 h-[38px] w-[80px] my-auto text-xs font-semibold text-white rounded-md bg-[#3F4352] border border-[#4B5563] ${
                        uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      } transition duration-200`}
                      onClick={handleFileUploadClick}
                      role="button"
                      aria-label="Choose image"
                      aria-disabled={uploading}
                    >
                      {uploading ? (
                        <Icon icon={'eos-icons:three-dots-loading'} className="text-[#ffffffa3] size-6 mx-auto" />
                      ) : (
                        <div className="justify-center py-0.5">{locale.tickets.category.choose}</div>
                      )}
                    </motion.div>
                    <motion.div
                      whileHover={{ color: '#ffffff' }}
                      whileTap={{ scale: 0.97 }}
                      className="self-stretch my-auto text-xs font-medium hover:underline transition duration-200 text-zinc-300 cursor-pointer"
                      onClick={() => handleCategoryImageRemove(index)}
                      role="button"
                      aria-label="Remove image"
                    >
                      {locale.tickets.category.remove}
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
