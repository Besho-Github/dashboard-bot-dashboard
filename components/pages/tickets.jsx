import React, { useContext, useState } from 'react';
import { GuildDataContext } from '../../context/guild';
import SaveBar from '../ui/dashboard/common/SaveBar';
import TimeAndEmbed from '../ui/dashboard/tickets/TimeAndEmbed';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { DataContext } from '../../context';
import { useTicketsState } from '../../hooks/useTicketsState';
import { useImageUpload } from '../../hooks/useImageUpload';
import BackgroundSection from '../ui/dashboard/tickets/BackgroundSection';
import LineSection from '../ui/dashboard/tickets/LineSection';
import CategorySection from '../ui/dashboard/tickets/CategorySection';
import PermissionsSection from '../ui/dashboard/tickets/PermissionsSection';
import MessageSetupSection from '../ui/dashboard/tickets/MessageSetupSection';
import { api } from '../../utils/api';

export default function Tickets() {
  const { guild, channels, roles, emojis } = useContext(GuildDataContext);
  const { locale } = useContext(DataContext);
  const [selectedSetupChannel, setSelectedSetupChannel] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sendingSetup, setSendingSetup] = useState(false);

  // Use custom hooks for state management and image uploads
  const {
    state,
    handleInputChange,
    handleSelectChange,
    handleChannelType,
    handleRemoveCategory,
    handleColorChange,
    handleEmojiChange,
    handleWorkingHoursChange,
    handleWorkingHoursToggle,
    handleDescriptionChange,
    handlePermissionChange,
    handleAddCategory,
    updateTicketsData,
    reset,
    saveTickets,
  } = useTicketsState(guild, channels, roles);

  const { uploadImage, handleFileChange, handleCategoryImageChange, handleCategoryImageRemove, removeImage } = useImageUpload(
    guild.id,
    updateTicketsData,
    state
  );

  // Ensure permissions structure exists
  if (!state.tickets.data.config.permissions) {
    state.tickets.data.config.permissions = {
      admin: {
        add: true,
        claim: true,
        close: true,
        copy: true,
        delete: true,
        reminder: true,
      },
      user: {
        add: true,
        close: true,
        copy: true,
        reminder: false,
      },
    };
  }

  // Handle selected categories from the MessageSetupSection
  const handleCategoryToggle = (categoryNames) => {
    // Simply store the array of category names
    setSelectedCategories(categoryNames);
    console.log('Selected categories:', categoryNames);
  };

  const handleSetupChannelChange = (channelId) => {
    setSelectedSetupChannel(channelId);
  };

  const handleSendSetup = async (files) => {
    try {
      setSendingSetup(true);

      console.log('Sending categories:', selectedCategories);

      if (selectedCategories.length === 0) {
        console.error('No categories selected');
        setSendingSetup(false);
        return;
      }

      // Create FormData to handle file uploads
      const formData = new FormData();
      formData.append('channelId', selectedSetupChannel);

      // Add categories
      selectedCategories.forEach((category) => {
        formData.append('categories[]', category);
      });

      // Add custom files if they exist
      if (files?.customBackground) {
        formData.append('customBackground', files.customBackground);
      }

      if (files?.customLine) {
        formData.append('customLine', files.customLine);
      }

      // Send POST request with FormData
      await api.post(`/guilds/${guild.id}/tickets/setup`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Reset selected categories after successful send
      setSelectedCategories([]);
      setSendingSetup(false);
    } catch (error) {
      console.error('Error sending setup:', error);
      setSendingSetup(false);
    }
  };

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <Head>
        <title>{locale.tickets.pageTitle}</title>
      </Head>
      <header className="p-2.5 border-b border-[#3d4049] text-xl font-semibold">
        <h1>{locale.tickets.title}</h1>
      </header>
      <div className="bg-[#060A1B] p-5 pb-20 rounded mt-3">
        <ValidationError errors={state.errors} />
        <div className="flex flex-col">
          {/* Background image section */}
          <BackgroundSection
            locale={locale}
            background={state.tickets.data.config.background}
            uploading={state.uploadingBackground}
            handleFileChange={(e) => handleFileChange(e, 'background')}
            removeImage={() => removeImage('background')}
          />

          <div className="mx-5 my-10 h-[1px] bg-[#282b38]"></div>

          {/* Line image section */}
          <LineSection
            locale={locale}
            line={state.tickets.data.config.line}
            uploading={state.uploadingLine}
            handleFileChange={(e) => handleFileChange(e, 'line')}
            removeImage={() => removeImage('line')}
          />

          <div className="mx-5 my-10 h-[1px] bg-[#282b38]"></div>

          {/* Permissions section */}
          <PermissionsSection
            locale={locale}
            permissions={state.tickets.data.config.permissions}
            onPermissionChange={handlePermissionChange}
          />

          <div className="mx-5 my-10 h-[1px] bg-[#282b38]"></div>

          {/* Time and embed section */}
          <TimeAndEmbed
            workingHours={state.tickets.data.config.workingHours}
            description={state.tickets.data.config.embed.description}
            onDescriptionChange={handleDescriptionChange}
            onWorkingHoursChange={handleWorkingHoursChange}
            onWorkingHoursToggle={handleWorkingHoursToggle}
          />

          <div className="mx-5 my-10 h-[1px] bg-[#282b38]"></div>

          {/* Categories section */}
          <CategorySection
            locale={locale}
            categories={state.tickets.data.ticketOptions}
            channels={channels}
            roles={roles}
            customEmojis={emojis}
            handleChannelType={handleChannelType}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleRemoveCategory={handleRemoveCategory}
            handleColorChange={handleColorChange}
            handleEmojiChange={handleEmojiChange}
            handleCategoryImageChange={handleCategoryImageChange}
            handleCategoryImageRemove={handleCategoryImageRemove}
            uploadingCategory={state.uploadingCategory}
            errors={state.error}
            onAddCategory={handleAddCategory}
            guild={guild}
          />

          <div className="mx-5 my-10 h-[1px] bg-[#282b38]"></div>

          {/* Message Setup section */}
          <MessageSetupSection
            locale={locale}
            categories={state.tickets.data.ticketOptions}
            channels={channels}
            selectedSetupChannel={selectedSetupChannel}
            selectedCategories={selectedCategories}
            sendingSetup={sendingSetup}
            onCategoryToggle={handleCategoryToggle}
            onChannelChange={handleSetupChannelChange}
            onSendSetup={handleSendSetup}
            hasUnsavedChanges={state.saving}
          />
        </div>
      </div>
      <SaveBar hasUnsavedChanges={state.saving} saving={state.loading} onReset={reset} onSave={saveTickets} warn={state.warn} />
    </motion.section>
  );
}

export function ValidationError({ errors }) {
  return (
    errors.length > 0 && (
      <div className="flex flex-col justify-center px-3 py-3.5 text-white rounded-lg border border-red-500 border-solid bg-red-500 bg-opacity-30 mb-5">
        <div className="text-xs leading-5 max-md:max-w-full">Validation errors:</div>
        {errors.map((error, i) => (
          <div key={i} className="flex gap-2 py-1 mt-1 max-md:flex-wrap">
            <div className="my-auto text-xs gap-0.5 leading-5">•</div>
            <div className="flex-auto text-xs leading-5 max-md:max-w-full">{error.message}</div>
          </div>
        ))}
      </div>
    )
  );
}
