import React, { useContext, useState, useCallback } from 'react';
import Command from '../ui/dashboard/commands/Command';
import Rodal from 'rodal';
import Modal from '../ui/dashboard/commands/Modal';
import { ModalTemplate } from '../ui/dashboard/commands/ModalTemplate';
import { GuildDataContext } from '../../context/guild';
import { api } from '../../utils/api';
import Head from 'next/head';
import SaveBar from '../ui/dashboard/common/SaveBar';
import { Icon } from '@iconify/react/dist/iconify.js';
import { ToastContainer, toast, Slide, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import imageCompression from 'browser-image-compression';
import { DataContext } from '../../context';
import { motion } from 'framer-motion';

export default function Colors() {
  const { locale, language } = useContext(DataContext);
  const isRTL = language === 'ar';
  const { guild, channels, roles } = useContext(GuildDataContext);
  const [isPickerModalOpen, setIsPickerModalOpen] = useState(false);
  const [isCommandModalOpen, setIsCommandModalOpen] = useState(false);
  const [selectedPicker, setSelectedPicker] = useState(null);
  const [activeShape, setActiveShape] = useState(guild.colors?.shape || null);
  const [selectedCommand, setSelectedCommand] = useState(null);
  const [loading, setLoading] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pickerTitle, setPickerTitle] = useState(guild.colors?.title || locale.colors.defaultPickerTitle);
  const [backgroundImage, setBackgroundImage] = useState(guild.colors?.background || '');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [commands, setCommands] = useState({
    colors: guild.commands.colors,
    color: guild.commands.color,
  });

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

  const pickers = ['/colors/1.png', '/colors/2.png', '/colors/3.png'];
  const shapes = ['/shapes/circle.svg', '/shapes/heart.svg', '/shapes/star.svg', '/shapes/rectangle.svg', '/shapes/pentagon.svg'];

  const handlePickerClick = (index) => {
    setSelectedPicker(index);
    setIsPickerModalOpen(true);
  };

  const handleShapeClick = (index) => {
    setActiveShape(index);
    setHasUnsavedChanges(true);
  };

  const handleConfirm = async () => {
    if (selectedPicker === null) return;

    const paletteId = selectedPicker + 1;
    setLoading(true);
    setIsPickerModalOpen(false);

    const toastId = toast.loading(locale.colors.creatingColorRoles, {
      position: isRTL ? 'bottom-left' : 'bottom-right',
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: false,
      draggable: false,
      pauseOnHover: true,
    });

    try {
      const response = await api.post(`/guilds/${guild.id}/create-roles`, { id: paletteId });

      if (response.status === 202) {
        toast.update(toastId, {
          type: 'success',
          render: locale.colors.roleCreationStarted,
          position: isRTL ? 'bottom-left' : 'bottom-right',
          autoClose: 5000,
          isLoading: false,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          transition: Bounce,
        });
      }
    } catch (error) {
      if (error.response.status === 429) {
        toast.update(toastId, {
          render: locale.colors.rateLimitExceeded,
          type: 'warning',
          isLoading: false,
          autoClose: 5000,
          position: isRTL ? 'bottom-left' : 'bottom-right',
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          transition: Bounce,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClosePickerModal = () => {
    setIsPickerModalOpen(false);
  };

  const handleCommandModalClose = () => {
    setIsCommandModalOpen(false);
    setSelectedCommand(null);
  };

  const uploadImage = async (file) => {
    try {
      setUploadingImage(true);
      let compressedFile = file;

      if (file.size > 2 * 1024 * 1024) {
        const options = {
          maxSizeMB: 2,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        compressedFile = await imageCompression(file, options);
      }

      const formData = new FormData();
      formData.append('image', compressedFile);

      const response = await api.post(`/guilds/${guild.id}/upload-image`, formData);
      return response.data.url;
    } catch (error) {
      console.error(locale.colors.imageUploadFailed, error);
      return '';
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadedImageUrl = await uploadImage(file);
      if (uploadedImageUrl) {
        setBackgroundImage(uploadedImageUrl);
        setHasUnsavedChanges(true);
      }
    }
  };

  const handleRemoveBackground = () => {
    setBackgroundImage('');
    setHasUnsavedChanges(true);
  };

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
        setHasUnsavedChanges(false);
        setCommandState((prevState) => ({ ...prevState, saving: false }));
      })
      .catch((error) => {
        console.error(locale.colors.failedToSaveCommand, error);
        setCommandState((prevState) => ({ ...prevState, saving: false }));
      });
  }, [commandState, selectedCommand, guild.id]);

  const handleSaveColors = useCallback(() => {
    setSaving(true);

    const data = {
      shape: activeShape,
      title: pickerTitle,
      background: backgroundImage,
    };

    api
      .post(`/guilds/${guild.id}/colors`, data)
      .then(() => {
        guild.colors = data;
        setHasUnsavedChanges(false);
      })
      .catch((error) => {
        console.error(locale.colors.failedToSaveColors, error);
      })
      .finally(() => {
        setSaving(false);
      });
  }, [activeShape, pickerTitle, backgroundImage, guild.id]);

  const handleResetChanges = () => {
    setActiveShape(guild.colors?.shape || null);
    setSelectedPicker(null);
    setPickerTitle(guild.colors?.title || locale.colors.defaultPickerTitle);
    setBackgroundImage(guild.colors?.background || '');
    setHasUnsavedChanges(false);
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

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <Head>
        <title>{locale.colors.pageTitle}</title>
      </Head>

      <div className="bg-[#060A1B] p-5 rounded-lg mb-[100px] mt-3 shadow-lg">
        {/* Color Palette Section */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-500/10 p-2 rounded-lg">
              <Icon icon="mdi:palette" className="text-indigo-400 w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-gray-100 uppercase">{locale.colors.selectPalette}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {pickers.map((src, index) => (
              <div
                key={index}
                className="flex flex-col justify-center rounded-lg bg-[#1D1B45] hover:bg-[#3A3A4F] transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 cursor-pointer"
                onClick={() => handlePickerClick(index)}
              >
                <img
                  loading="lazy"
                  src={src}
                  className="object-contain aspect-[1.1] w-full rounded-lg transition-opacity duration-300 ease-in-out hover:opacity-90"
                />
              </div>
            ))}

            {/* Background Upload Section */}
            <div className="relative aspect-[1.1]">
              {uploadingImage ? (
                <div className="flex items-center justify-center w-full h-full bg-[#232428] rounded-lg">
                  <Icon icon="eos-icons:three-dots-loading" className="text-[#ffffffa3] size-[38px]" />
                </div>
              ) : backgroundImage ? (
                <div className="relative pb-[100%] rounded-lg group">
                  <img
                    src={backgroundImage?.replace('media.wicks.bot', process.env.MEDIA_DOMAIN)}
                    alt="Background"
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                  />
                  <div
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer rounded-lg"
                    onClick={handleRemoveBackground}
                  >
                    <span className="bg-[#333333] rounded text-white py-1 px-3 uppercase">{locale.colors.remove}</span>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="background-upload"
                  className="flex items-center justify-center w-full h-full bg-[#1D1B45] rounded-lg hover:bg-[#3A3A4F] transition-all duration-300 cursor-pointer"
                >
                  <Icon icon="mage:image-upload" className="w-12 h-10 text-white" />
                  <input id="background-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Shape Selection Section */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-500/10 p-2 rounded-lg">
              <Icon icon="mdi:shape" className="text-emerald-400 w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-gray-100 uppercase">{locale.colors.shapeTitle}</h2>
          </div>

          <div className="flex flex-wrap gap-5">
            {shapes.map((src, index) => (
              <div
                key={index}
                className={`p-5 bg-[#1D1B45] rounded-lg cursor-pointer transition-all duration-300 ease-in-out transform ${
                  activeShape === index + 1 ? 'ring-4 ring-[#EBCB8B] scale-110' : 'hover:-translate-y-1 hover:scale-105 hover:opacity-90'
                }`}
                onClick={() => handleShapeClick(index + 1)}
              >
                <img loading="lazy" src={src} className="object-contain w-[80px] aspect-square" />
              </div>
            ))}
          </div>
        </div>

        {/* Picker Text Section */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <Icon icon="mdi:text" className="text-blue-400 w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-gray-100 uppercase">{locale.colors.pickerTextTitle}</h2>
          </div>

          <input
            className="w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-lg bg-[#1D1B45] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            value={pickerTitle}
            onChange={(e) => {
              setPickerTitle(e.target.value);
              setHasUnsavedChanges(true);
            }}
            placeholder="Enter picker title..."
          />
        </div>

        {/* Commands Section */}
        <div className="lg:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-500/10 p-2 rounded-lg">
              <Icon icon="mdi:console" className="text-purple-400 w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-gray-100 uppercase">{locale.colors.commandsTitle}</h2>
          </div>

          <Command
            name="color"
            active={commands.color.enabled}
            description={locale.colors.colorDescription}
            icon="/icons/colors.svg"
            changeSwitch={() => changeSwitch('color', !commands.color.enabled)}
            editCommand={editCommand}
            loading={loading === 'color'}
          />
          <Command
            name="colors"
            active={commands.colors.enabled}
            description={locale.colors.colorsDescription}
            icon="/icons/colors.svg"
            changeSwitch={() => changeSwitch('colors', !commands.colors.enabled)}
            editCommand={editCommand}
            loading={loading === 'colors'}
          />
          <Rodal
            visible={isPickerModalOpen}
            onClose={handleClosePickerModal}
            width={400}
            height={250}
            customStyles={{
              backgroundColor: '#1E293B',
              color: '#F8FAFC',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-3 text-center text-[#E2E8F0]">{locale.colors.confirmTitle}</h2>
                <p className="text-sm text-center text-[#94A3B8] mb-4">{locale.colors.confirmMessage}</p>

                <div className="flex items-center p-3 text-xs font-bold tracking-wide leading-4 text-white rounded border border-amber-400 bg-amber-400 bg-opacity-10">
                  <Icon icon="mdi:alert-circle" className={`size-6 ${isRTL ? 'ml-2' : 'mr-2'} text-[#D32F2F]`} />
                  <span className="text-xs font-semibold">{locale.colors.warningMessage}</span>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-5">
                <button
                  onClick={handleClosePickerModal}
                  className="px-4 py-2 rounded-md text-[#64748B] bg-[#334155] transition-colors duration-300 hover:bg-[#475569] hover:text-white"
                >
                  {locale.colors.cancelButton}
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex items-center justify-center py-2 px-6 rounded-md bg-[#4F46E5] text-white transition-transform duration-300 transform hover:scale-105"
                >
                  {locale.colors.confirmButton}
                </button>
              </div>
            </div>
          </Rodal>

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
        </div>
      </div>

      <SaveBar onSave={handleSaveColors} onReset={handleResetChanges} hasUnsavedChanges={hasUnsavedChanges} saving={saving} warn={false} />
      <ToastContainer transition={Slide} />
    </motion.section>
  );
}
