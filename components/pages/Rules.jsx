'use client';

import React, { useContext, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Tooltip } from 'react-tooltip';
import { GuildDataContext } from '../../context/guild';
import { DataContext } from '../../context';
import SaveBar from '../ui/dashboard/common/SaveBar';
import { api } from '../../utils/api';
import Checkbox from '../ui/dashboard/common/checkBox';
import DiscordStyledMultiSelect from '../selects/multiSelect';
import Head from 'next/head';
import EmojiPicker from 'emoji-picker-react';

export default function Rules() {
  const { locale, language } = useContext(DataContext);
  const { guild, channels, emojis } = useContext(GuildDataContext);
  const isRTL = language === 'ar';

  // Initialize with existing data or create default structure
  const defaultRulesData = {
    enabled: false,
    channel: '',
    useEmbed: false,
    embedId: '',
    description: '',
    rules: [],
  };

  const [data, setData] = useState(JSON.parse(JSON.stringify(defaultRulesData)));
  const [settings, setSettings] = useState({
    hasUnsavedChanges: false,
    saving: false,
    warn: false,
  });
  const [errorFields, setErrorFields] = useState({});
  const [sending, setSending] = useState(false);
  const firstErrorRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(null); // Will store the index of the rule for which emoji picker is open
  const emojiPickerRef = useRef(null);
  const emojiButtonRefs = useRef({});

  // Generate a unique numeric ID for new rules
  const generateRuleId = () => {
    // Find the highest existing ID and add 1, or start with 1 if no rules exist
    if (!data.rules || data.rules.length === 0) {
      return 1;
    }

    const highestId = Math.max(...data.rules.map((rule) => (typeof rule.id === 'number' ? rule.id : 0)));
    return highestId + 1;
  };

  // Initialize with data from guild.rules if available
  useEffect(() => {
    if (guild?.rules) {
      // Load existing rules data and add isCollapsed state to each rule
      const loadedRules =
        guild.rules.rules?.map((rule) => ({
          ...rule,
          // Ensure rule.id is a number
          id: typeof rule.id === 'number' ? rule.id : generateRuleId(),
          isCollapsed: false,
        })) || [];

      setData({
        enabled: guild.rules.enabled || false,
        channel: guild.rules.channel || '',
        useEmbed: guild.rules.useEmbed || false,
        embedId: guild.rules.embedId || '',
        description: guild.rules.description || '',
        rules: loadedRules,
      });
    }
  }, [guild?.rules]);

  // Handle click outside to close emoji picker
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showEmojiPicker !== null &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        emojiButtonRefs.current[showEmojiPicker] &&
        !emojiButtonRefs.current[showEmojiPicker].contains(event.target)
      ) {
        setShowEmojiPicker(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker, emojiPickerRef, emojiButtonRefs]);

  // Toggle emoji picker
  const toggleEmojiPicker = (index, e) => {
    e.stopPropagation();
    setShowEmojiPicker(showEmojiPicker === index ? null : index);
  };

  // Handle emoji selection
  const handleEmojiChange = (emojiData, index) => {
    const updatedRules = data.rules.map((rule, i) => {
      if (i === index) {
        // If it's a native emoji (Unicode)
        if (emojiData.native) {
          return { ...rule, emoji: emojiData.native };
        }
        // For custom Discord emojis, store as <name:id>
        else if (emojiData.name && emojiData.id) {
          return { ...rule, emoji: `<${emojiData.name}:${emojiData.id}>` };
        }
        return rule;
      }
      return rule;
    });

    setData({ ...data, rules: updatedRules });
    setSettings({ ...settings, hasUnsavedChanges: true });
  };

  // Component to display emoji
  const EmojiDisplay = ({ emoji, customEmojis }) => {
    if (!emoji) {
      return <div className="flex items-center justify-center text-gray-400 text-xs">No emoji</div>;
    }

    // Check if this is a custom emoji format: <name:id>
    const customEmojiMatch = emoji.match(/<(.+):(\d+)>/);

    if (customEmojiMatch && customEmojis) {
      const [_, name, id] = customEmojiMatch;
      const emojiUrl = `https://cdn.discordapp.com/emojis/${id}.${customEmojis.find((e) => e.id === id)?.animated ? 'gif' : 'png'}`;

      return (
        <div className="flex items-center justify-center">
          <img src={emojiUrl} className="w-6 h-6 object-contain" alt={name} />
        </div>
      );
    }

    // Otherwise it's a regular Unicode emoji
    return <div className="flex items-center justify-center text-lg">{emoji}</div>;
  };

  // Handle toggle for embed vs plain text
  const handleUseEmbedToggle = () => {
    setData({
      ...data,
      useEmbed: !data.useEmbed,
      // Clear embedId when toggling off and clear description when toggling on
      embedId: !data.useEmbed ? data.embedId : '',
      description: !data.useEmbed ? '' : data.description, // Clear description when enabling embed
    });
    setSettings({ ...settings, hasUnsavedChanges: true });
  };

  // Handle embed selection
  const handleEmbedChange = (e) => {
    setData({ ...data, embedId: e.value });
    setSettings({ ...settings, hasUnsavedChanges: true });
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setData({ ...data, [field]: value });
    setSettings({ ...settings, hasUnsavedChanges: true });
    setErrorFields({ ...errorFields, [field]: false });
  };

  // Handle channel selection
  const handleChannelChange = (e) => {
    setData({ ...data, channel: e.value });
    setSettings({ ...settings, hasUnsavedChanges: true });
  };

  // Handle rule change
  const handleRuleChange = (index, field, value) => {
    const updatedRules = data.rules.map((rule, i) => {
      if (i === index) {
        // Ensure the rule has a numeric ID
        const id = typeof rule.id === 'number' ? rule.id : generateRuleId();
        return { ...rule, [field]: value, id };
      }
      return rule;
    });

    setData({ ...data, rules: updatedRules });
    setSettings({ ...settings, hasUnsavedChanges: true });

    // Clear error for this rule
    if (errorFields.rules) {
      const updatedErrorFields = { ...errorFields };
      updatedErrorFields.rules[index] = false;
      setErrorFields(updatedErrorFields);
    }
  };

  // Handle adding a new rule
  const handleAddRule = () => {
    if (data.rules.length < 25) {
      setData({
        ...data,
        rules: [...data.rules, { id: generateRuleId(), title: '', description: '', emoji: '', isCollapsed: false }],
      });
      setSettings({ ...settings, hasUnsavedChanges: true });
    }
  };

  // Handle deleting a rule
  const handleDeleteRule = (index) => {
    const updatedRules = data.rules.filter((_, i) => i !== index);
    setData({ ...data, rules: updatedRules });
    setSettings({ ...settings, hasUnsavedChanges: true });
  };

  // Handle collapse/extend toggle
  const handleToggleCollapse = (index) => {
    const updatedRules = data.rules.map((rule, i) => (i === index ? { ...rule, isCollapsed: !rule.isCollapsed } : rule));
    setData({ ...data, rules: updatedRules });
  };

  // Handle drag and drop
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(data.rules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setData({ ...data, rules: items });
    setSettings({ ...settings, hasUnsavedChanges: true });
  };

  // Validate data before save
  const validateData = () => {
    let errors = {};
    let hasErrors = false;

    if (data.enabled && !data.channel) {
      errors.channel = true;
      hasErrors = true;
    }

    if (data.useEmbed && !data.embedId) {
      errors.embedId = true;
      hasErrors = true;
    }

    // If using plain text (not embed) and description is empty, flag as error
    if (!data.useEmbed && data.enabled && !data.description.trim()) {
      errors.description = true;
      hasErrors = true;
    }

    // Check rules have required fields including id
    const ruleErrors = data.rules.map((rule) => !rule.id || !rule.title.trim() || !rule.description.trim());

    if (ruleErrors.includes(true)) {
      errors.rules = ruleErrors;
      hasErrors = true;
    }

    setErrorFields(errors);
    return hasErrors;
  };

  // Ensure all rules have numeric IDs before saving
  const ensureRuleIds = () => {
    const updatedRules = data.rules.map((rule, index) => {
      if (typeof rule.id !== 'number') {
        // Generate a new ID based on the highest existing ID + index to ensure uniqueness
        return { ...rule, id: generateRuleId() + index };
      }
      return rule;
    });

    if (JSON.stringify(updatedRules) !== JSON.stringify(data.rules)) {
      setData({ ...data, rules: updatedRules });
    }

    return updatedRules;
  };

  // Reset changes function
  const onReset = () => {
    setData(defaultRulesData);
    setSettings({ hasUnsavedChanges: false, saving: false });
    setErrorFields({});
  };

  // Prepare data for save by removing 'isCollapsed'
  const prepareDataForSave = () => {
    const preparedData = {
      ...data,
      rules: data.rules.map(({ isCollapsed, ...rest }) => rest), // Keep id but remove isCollapsed
    };
    return preparedData;
  };

  // Save changes function
  const onSave = async () => {
    // Ensure all rules have numeric IDs
    ensureRuleIds();

    const hasErrors = validateData();
    if (hasErrors) {
      firstErrorRef.current?.scrollIntoView({ behavior: 'smooth' });
      setSettings({ ...settings, warn: true });
      return;
    }

    setSettings({ ...settings, saving: true });
    try {
      const preparedData = prepareDataForSave();

      // If using embed, ensure the embedId references a valid embed
      if (preparedData.useEmbed && !guild.embeds?.some((embed) => embed._id === preparedData.embedId)) {
        setErrorFields({ ...errorFields, embedId: true });
        firstErrorRef.current?.scrollIntoView({ behavior: 'smooth' });
        setSettings({ ...settings, warn: true, saving: false });
        return;
      }

      const response = await api.post(`/guilds/${guild.id}/rules`, preparedData);
      if (response.status === 200) {
        setSettings({ hasUnsavedChanges: false, saving: false });
        guild.rules = preparedData;
        setErrorFields({});
      }
    } catch (error) {
      console.error('Error saving rules:', error);
      setSettings({ ...settings, saving: false });
    }
  };

  // Send rules function - to manually send rules to the selected channel
  const handleSendRules = async () => {
    // Ensure all rules have numeric IDs
    ensureRuleIds();

    // Check if the necessary fields are filled
    if (!data.channel) {
      setErrorFields({ ...errorFields, channel: true });
      firstErrorRef.current?.scrollIntoView({ behavior: 'smooth' });
      setSettings({ ...settings, warn: true });
      return;
    }

    // If using embed, ensure embed is selected
    if (data.useEmbed && !data.embedId) {
      setErrorFields({ ...errorFields, embedId: true });
      firstErrorRef.current?.scrollIntoView({ behavior: 'smooth' });
      setSettings({ ...settings, warn: true });
      return;
    }

    setSending(true);
    try {
      const preparedData = prepareDataForSave();
      // Make API call to send rules to the channel
      const response = await api.post(`/guilds/${guild.id}/rules/send`, preparedData);

      if (response.status === 200) {
        // Show success toast or message here if needed
        console.log('Rules sent successfully');
      }
    } catch (error) {
      console.error('Error sending rules:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <Head>
        <title>{locale.rules?.title || 'Server Rules'}</title>
      </Head>

      <header className="p-2.5 border-b border-[#3d4049] text-xl font-semibold flex items-center justify-between">
        <h1>{locale.rules?.title || 'Server Rules'}</h1>
      </header>

      <div className="bg-[#060A1B] p-5 rounded-lg mb-[100px] mt-3 shadow-lg">
        {/* Main Settings */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-500/10 p-2 rounded-lg">
              <Icon icon="mdi:cog-outline" className="text-indigo-400 w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-gray-100 uppercase">{locale.rules?.settingsTitle || 'Rules Settings'}</h2>
          </div>

          <div className="space-y-4">
            {/* Enable Rules */}
            <div className="flex gap-2 items-center mb-4">
              <Checkbox
                isChecked={data.enabled}
                toggleCheckbox={() => {
                  setData({ ...data, enabled: !data.enabled });
                  setSettings({ ...settings, hasUnsavedChanges: true });
                }}
              />
              <span className="text-sm text-gray-400">{locale.rules?.enableRules || 'Enable Rules System'}</span>
            </div>

            {/* Channel Selection */}
            <div className={`transition-opacity duration-300 ${data.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon icon="mdi:pound" className="text-gray-400 w-5 h-5" />
                <h3 className="text-xs font-bold uppercase text-gray-400">{locale.rules?.channelLabel || 'Rules Channel'}</h3>
              </div>
              <DiscordStyledMultiSelect
                type="channels"
                options={channels}
                onChange={handleChannelChange}
                value={data.channel || ''}
                isMulti={false}
                disabled={!data.enabled}
              />
              {errorFields.channel && (
                <p className="mt-1 text-red-500 text-sm">{locale.rules?.errorRequiredChannel || 'Please select a channel'}</p>
              )}

              {/* Send Rules Button */}
              {data.enabled && data.channel && (
                <div className="mt-4">
                  <motion.button
                    onClick={handleSendRules}
                    disabled={sending || !data.channel || !data.rules.length}
                    className={`flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 ${
                      sending || !data.channel ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {sending ? (
                      <>
                        <Icon icon="eos-icons:three-dots-loading" className="animate-pulse w-5 h-5" />
                        <span>{locale.rules?.sending || 'Sending...'}</span>
                      </>
                    ) : (
                      <>
                        <Icon icon="mdi:send" className="w-5 h-5" />
                        <span>{locale.rules?.sendRules || 'Send Rules'}</span>
                      </>
                    )}
                  </motion.button>
                  <p className="mt-1 text-xs text-gray-400">
                    {locale.rules?.sendRulesDescription || 'Send or update the rules message in the selected channel'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Settings */}
        <div
          className={`bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-6 ${
            data.enabled ? '' : 'opacity-50 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-500/10 p-2 rounded-lg">
              <Icon icon="mdi:format-text" className="text-emerald-400 w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-gray-100 uppercase">{locale.rules?.contentTitle || 'Content Settings'}</h2>
          </div>

          <div className="space-y-4">
            {/* Toggle between Embed and Plain Text */}
            <div className="flex gap-2 items-center mb-4">
              <Checkbox isChecked={data.useEmbed} toggleCheckbox={handleUseEmbedToggle} />
              <span className="text-sm text-gray-400">{locale.rules?.useEmbed || 'Use Embed for Rules'}</span>
            </div>

            {/* Embed Settings */}
            {data.useEmbed && (
              <div className="space-y-4 p-4 bg-[#1D1B45] rounded-lg">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon icon="mdi:format-title" className="text-gray-400 w-5 h-5" />
                    <h3 className="text-xs font-bold uppercase text-gray-400">{locale.rules?.embedSelect || 'Select Embed'}</h3>
                  </div>
                  <DiscordStyledMultiSelect
                    type="any"
                    options={
                      guild.embeds?.map((embed) => ({
                        label: embed.title || `Embed #${embed._id.substring(0, 6)}`,
                        value: embed._id,
                      })) || []
                    }
                    onChange={handleEmbedChange}
                    value={data.embedId || ''}
                    isMulti={false}
                    placeholder={locale.rules?.selectEmbedPlaceholder || 'Select an embed template...'}
                    noOptionsMessage={() => locale.rules?.noEmbedsAvailable || 'No embeds available. Create one in the Embed Builder.'}
                  />
                  {errorFields.embedId && (
                    <p className="mt-1 text-red-500 text-sm">{locale.rules?.errorRequiredEmbed || 'Please select an embed'}</p>
                  )}

                  {data.embedId && guild.embeds?.some((embed) => embed._id === data.embedId) && (
                    <div className="mt-3 p-3 bg-[#1D1B45] rounded-lg border border-[#3a3f4e]">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-1 h-12 rounded-full"
                          style={{ backgroundColor: guild.embeds.find((embed) => embed._id === data.embedId)?.color || '#5865F2' }}
                        />
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {guild.embeds.find((embed) => embed._id === data.embedId)?.title ||
                              locale.rules?.untitledEmbed ||
                              'Untitled Embed'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 truncate max-w-md">
                            {guild.embeds.find((embed) => embed._id === data.embedId)?.description?.substring(0, 100) ||
                              locale.rules?.noDescription ||
                              'No description'}
                            {(guild.embeds.find((embed) => embed._id === data.embedId)?.description?.length || 0) > 100 ? '...' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Icon icon="mdi:text-long" className="text-gray-400 w-5 h-5" />
                <h3 className="text-xs font-bold uppercase text-gray-400">{locale.rules?.descriptionLabel || 'Description'}</h3>
                {data.useEmbed && (
                  <span className="text-xs text-amber-400 ml-2">
                    {locale.rules?.descriptionDisabledWithEmbed || 'Disabled when using embed'}
                  </span>
                )}
              </div>
              <textarea
                className={`w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-lg bg-[#1D1B45] min-h-[84px] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                  data.useEmbed ? 'opacity-50 cursor-not-allowed' : ''
                } ${errorFields.description ? 'border-2 border-red-500' : ''}`}
                value={data.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder={
                  data.useEmbed
                    ? locale.rules?.descriptionDisabledPlaceholder || 'Description is disabled when using embed'
                    : locale.rules?.descriptionPlaceholder || 'Enter a description for your rules...'
                }
                disabled={data.useEmbed}
                ref={errorFields.description ? firstErrorRef : null}
              />
              {errorFields.description && (
                <p className="mt-1 text-red-500 text-sm">{locale.rules?.errorRequiredDescription || 'Please enter a description'}</p>
              )}
              {data.useEmbed && (
                <p className="mt-1 text-xs text-gray-400">
                  {locale.rules?.embedDescriptionNote ||
                    'When using an embed, the description from the selected embed template will be used instead'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Rules Section */}
        <div
          className={`bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-6 ${
            data.enabled ? '' : 'opacity-50 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <Icon icon="mdi:gavel" className="text-blue-400 w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-gray-100 uppercase">{locale.rules?.rulesListTitle || 'Rules List'}</h2>
          </div>

          <div className="text-sm font-bold leading-none text-gray-400 mb-6">
            {locale.rules?.rulesListSubtitle || 'Add up to 25 rules for your server'}
          </div>

          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="rules">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-4">
                  {data.rules.map((rule, index) => (
                    <Draggable key={`rule-${index}`} draggableId={`rule-${index}`} index={index}>
                      {(provided, snapshot) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex flex-col px-5 pt-4 pb-5 w-full font-bold rounded-xl bg-[#1D1B45] border border-[#2F333F] hover:border-[#3a3f4e] ${
                            errorFields.rules && errorFields.rules[index] ? 'border-2 border-red-500/50' : ''
                          } ${snapshot.isDragging ? 'shadow-lg' : ''} transition-all duration-300`}
                        >
                          <div className="flex justify-between items-center text-xs uppercase text-zinc-400 mb-4">
                            <div className="flex gap-2 cursor-move" {...provided.dragHandleProps}>
                              <Icon icon="mdi:drag" className="text-gray-500 size-5" />
                              <div className="font-bold">
                                {locale.rules?.ruleLabel || 'RULE'} {index + 1}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Tooltip
                                id={`deleteRule-${index}`}
                                className="text-white text-sm font-normal normal-case"
                                style={{ borderRadius: '5px', background: '#111214' }}
                              />
                              <Icon
                                data-tooltip-id={`deleteRule-${index}`}
                                data-tooltip-content={locale.rules?.deleteRuleTooltip || 'Delete rule'}
                                icon="mdi:trash-can-outline"
                                className="cursor-pointer text-gray-500 size-5 hover:text-red-400 transition-colors duration-200"
                                onClick={() => handleDeleteRule(index)}
                              />
                              <Icon
                                icon={rule.isCollapsed ? 'iconamoon:arrow-up-2-bold' : 'iconamoon:arrow-down-2-bold'}
                                className="cursor-pointer text-gray-500 size-5 hover:text-gray-300 transition-colors duration-200"
                                onClick={() => handleToggleCollapse(index)}
                              />
                            </div>
                          </div>

                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {/* Rule Title and Emoji Row */}
                            <div className="grid grid-cols-7 gap-4">
                              {/* Rule Title */}
                              <div className="col-span-5">
                                <div className="text-xs font-bold uppercase text-zinc-400 mb-2">{locale.rules?.ruleTitle || 'TITLE'}</div>
                                <input
                                  className={`w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-lg bg-[#25235b] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                                    errorFields.rules && errorFields.rules[index] ? 'border-2 border-red-500' : ''
                                  }`}
                                  maxLength={100}
                                  value={rule.title}
                                  onChange={(e) => handleRuleChange(index, 'title', e.target.value)}
                                  style={{ display: rule.isCollapsed ? 'none' : 'block' }}
                                  placeholder={locale.rules?.ruleTitlePlaceholder || 'Enter rule title...'}
                                  ref={errorFields.rules && errorFields.rules[index] ? firstErrorRef : null}
                                />

                                <div
                                  className="px-3 mt-2 text-xl rounded-lg text-zinc-200 flex items-center"
                                  style={{ display: rule.isCollapsed ? 'flex' : 'none' }}
                                >
                                  {rule.title || locale.rules?.noRuleTitleText || 'No title'}
                                  {rule.emoji && (
                                    <span className="ml-2 text-xl">
                                      <EmojiDisplay emoji={rule.emoji} customEmojis={emojis} />
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Emoji Selector */}
                              <div className="col-span-2">
                                <div className="text-xs font-bold uppercase text-zinc-400 mb-2">{locale.rules?.emoji || 'EMOJI'}</div>
                                <div className="relative">
                                  <div className="flex items-center justify-between text-sm font-medium rounded-lg text-gray-300 bg-[#25235b] border border-[#3a3f4e] overflow-hidden transition-all duration-200 hover:border-blue-500 h-[42px]">
                                    <div className="flex-grow pl-3 py-2.5 flex items-center justify-center">
                                      {rule.emoji ? (
                                        <EmojiDisplay emoji={rule.emoji} customEmojis={emojis} />
                                      ) : (
                                        <div className="flex items-center justify-center text-gray-400 text-xs">
                                          {locale.rules?.noEmoji || 'No emoji'}
                                        </div>
                                      )}
                                    </div>
                                    <Tooltip
                                      id={`emojiPickerTooltip-${index}`}
                                      className="text-white text-xs font-normal"
                                      style={{ borderRadius: '4px', background: '#111214' }}
                                    />
                                    <motion.button
                                      type="button"
                                      whileTap={{ scale: 0.95 }}
                                      className="h-[42px] w-[42px] flex items-center justify-center border-l border-[#3a3f4e] focus:outline-none hover:bg-[#1D1B45] transition-colors duration-200"
                                      onClick={(e) => toggleEmojiPicker(index, e)}
                                      ref={(el) => (emojiButtonRefs.current[index] = el)}
                                      aria-label={locale.rules?.selectEmoji || 'Select Emoji'}
                                      data-tooltip-id={`emojiPickerTooltip-${index}`}
                                      data-tooltip-content={locale.rules?.selectEmoji || 'Select Emoji'}
                                    >
                                      <Icon icon={'mdi:smiley'} className="size-5 text-gray-300" />
                                    </motion.button>
                                  </div>

                                  <AnimatePresence>
                                    {showEmojiPicker === index && typeof window !== 'undefined' && (
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
                                            searchPlaceholder={locale.rules?.searchEmoji || 'Search emoji...'}
                                            theme="dark"
                                            emojiStyle="native"
                                            lazyLoadEmojis
                                            width={320}
                                            height={400}
                                            previewConfig={{
                                              showPreview: false,
                                            }}
                                            customEmojis={
                                              emojis?.map((e) => ({
                                                id: e.id,
                                                names: [e.name],
                                                imgUrl: `https://cdn.discordapp.com/emojis/${e.id}.${e.animated ? 'gif' : 'png'}`,
                                                category: 'Custom',
                                              })) || []
                                            }
                                            onEmojiClick={(emojiData) => {
                                              if (emojiData.isCustom) {
                                                const customEmoji = emojis?.find((e) => e.id === emojiData.emoji);
                                                if (customEmoji) {
                                                  handleEmojiChange({ native: false, name: customEmoji.name, id: customEmoji.id }, index);
                                                }
                                              } else {
                                                handleEmojiChange({ native: emojiData.emoji }, index);
                                              }
                                              setShowEmojiPicker(null);
                                            }}
                                            categories={[
                                              {
                                                name: locale.rules?.customCategory || 'Custom',
                                                category: 'custom',
                                              },
                                              {
                                                name: locale.rules?.smileysCategory || 'Smileys & People',
                                                category: 'smileys_people',
                                              },
                                              {
                                                name: locale.rules?.animalsCategory || 'Animals & Nature',
                                                category: 'animals_nature',
                                              },
                                              {
                                                name: locale.rules?.foodCategory || 'Food & Drink',
                                                category: 'food_drink',
                                              },
                                              {
                                                name: locale.rules?.activitiesCategory || 'Activities',
                                                category: 'activities',
                                              },
                                              {
                                                name: locale.rules?.travelCategory || 'Travel & Places',
                                                category: 'travel_places',
                                              },
                                              {
                                                name: locale.rules?.objectsCategory || 'Objects',
                                                category: 'objects',
                                              },
                                              {
                                                name: locale.rules?.symbolsCategory || 'Symbols',
                                                category: 'symbols',
                                              },
                                              {
                                                name: locale.rules?.flagsCategory || 'Flags',
                                                category: 'flags',
                                              },
                                            ]}
                                          />
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>

                                {/* Clear emoji button */}
                                {rule.emoji && !rule.isCollapsed && (
                                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end mt-1">
                                    <button
                                      type="button"
                                      className="text-xs text-gray-400 hover:text-white hover:underline transition-colors duration-200 flex items-center gap-1"
                                      onClick={() => handleRuleChange(index, 'emoji', '')}
                                    >
                                      <Icon icon="mdi:close-circle-outline" className="w-3.5 h-3.5" />
                                      {locale.rules?.clearEmoji || 'Clear emoji'}
                                    </button>
                                  </motion.div>
                                )}
                              </div>
                            </div>

                            {/* Rule Description */}
                            <div className="mt-4" style={{ display: rule.isCollapsed ? 'none' : 'block' }}>
                              <div className="text-xs font-bold uppercase text-zinc-400 mb-2">
                                {locale.rules?.description || 'DESCRIPTION'}
                              </div>
                              <textarea
                                className={`w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-lg bg-[#25235b] min-h-[84px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none ${
                                  errorFields.rules && errorFields.rules[index] ? 'border-2 border-red-500' : ''
                                }`}
                                value={rule.description}
                                onChange={(e) => handleRuleChange(index, 'description', e.target.value)}
                                placeholder={locale.rules?.ruleDescriptionPlaceholder || 'Enter rule description...'}
                              />

                              {/* Character counter for description */}
                              <div className="mt-1 text-right">
                                <span className="text-xs text-gray-400">{rule.description.length}/1000</span>
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {data.rules.length < 25 && (
            <motion.div
              onClick={handleAddRule}
              className="relative group flex justify-center items-center px-4 sm:px-16 py-4 sm:py-6 w-full text-base sm:text-xl font-bold text-blue-400 rounded-2xl border-2 border-dashed border-blue-500/20 cursor-pointer overflow-hidden mt-4"
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
            >
              <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-all duration-300"></div>
              <div className="flex gap-1.5 items-center">
                <Icon
                  icon="ph:plus-circle-fill"
                  className="transition-transform duration-300 group-hover:rotate-90 group-hover:text-blue-300 text-xl sm:text-2xl"
                />
                <span className="group-hover:text-blue-300 transition-colors duration-300">
                  {locale.rules?.addRuleButton || 'Add Rule'}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <SaveBar
        hasUnsavedChanges={settings.hasUnsavedChanges}
        saving={settings.saving}
        onSave={onSave}
        onReset={onReset}
        warn={settings.warn}
      />
    </motion.section>
  );
}
