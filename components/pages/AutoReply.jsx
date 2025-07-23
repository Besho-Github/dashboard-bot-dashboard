import { useContext, useState, useRef } from 'react';
import { DataContext } from '../../context';
import { GuildDataContext } from '../../context/guild';
import Head from 'next/head';
import { Icon } from '@iconify/react';
import { api } from '../../utils/api';
import Reply from '../ui/dashboard/autoreply/Reply';
import Modal from '../ui/dashboard/autoreply/Modal';

export default function AutoReply() {
  const { locale } = useContext(DataContext);
  const { guild } = useContext(GuildDataContext);

  const [state, setState] = useState({
    autoReply: guild.autoReply,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newReply, setNewReply] = useState({
    trigger: '',
    message: '',
    mention: true,
    attachment: '',
    embed: '',
    enabled_channels: [],
  });
  const [currentEditIndex, setCurrentEditIndex] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [errors, setErrors] = useState({
    trigger: '',
    message: '',
    attachment: '',
  });

  const triggerRef = useRef();
  const messageRef = useRef();
  const attachmentRef = useRef();

  const validateInputs = () => {
    const errors = {
      trigger: '',
      message: '',
      attachment: '',
    };

    if (!newReply.trigger) {
      errors.trigger = 'Trigger is required.';
      triggerRef.current.focus();
    } else if (!newReply.message && !newReply.attachment) {
      errors.message = 'Either message or attachment is required.';
      errors.attachment = 'Either message or attachment is required.';
      messageRef.current.focus();
    }

    setErrors(errors);

    return !errors.trigger && !errors.message && !errors.attachment;
  };

  const handleAddNew = async () => {
    if (!validateInputs()) {
      return;
    }

    setSaving(true);
    try {
      const response = await api.post(`/guilds/${guild.id}/autoreply`, newReply);
      if (response.status === 200) {
        setState((prevState) => ({
          autoReply: response.data.autoReply,
        }));
        setIsModalOpen(false);
        setNewReply({
          trigger: '',
          message: '',
          mention: true,
          attachment: '',
          embed: '',
          enabled_channels: [],
        });
        setErrors({
          trigger: '',
          message: '',
          attachment: '',
        });
      }
    } catch (error) {
      console.error('Failed to add new autoreply:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!validateInputs()) {
      return;
    }

    setSaving(true);
    try {
      const response = await api.put(`/guilds/${guild.id}/autoreply/${state.autoReply[currentEditIndex]._id}`, newReply);
      if (response.status === 200) {
        setState((prevState) => {
          const updatedReplies = [...prevState.autoReply];
          updatedReplies[currentEditIndex] = response.data.autoReply;
          return { autoReply: updatedReplies };
        });
        setIsEditModalOpen(false);
        setNewReply({
          trigger: '',
          message: '',
          mention: true,
          attachment: '',
          embed: '',
          enabled_channels: [],
        });
        setCurrentEditIndex(null);
        setErrors({
          trigger: '',
          message: '',
          attachment: '',
        });
      }
    } catch (error) {
      console.error('Failed to edit autoreply:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (index) => {
    try {
      const replyId = state.autoReply[index]._id;
      setDeleting(replyId);
      const response = await api.delete(`/guilds/${guild.id}/autoreply/${replyId}`);
      if (response.status === 200) {
        guild.autoReply = guild.autoReply.filter(({ _id }) => _id !== replyId);
        setState((prevState) => ({
          autoReply: prevState.autoReply.filter((_, i) => i !== index),
        }));
      }
    } catch (error) {
      console.error('Failed to delete autoreply:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReply((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleMentionChange = () => {
    setNewReply((prevState) => ({
      ...prevState,
      mention: !prevState.mention,
    }));
  };

  const RemoveAttachment = () => {
    setNewReply((prevState) => ({
      ...prevState,
      attachment: '',
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      attachment: '',
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      try {
        let compressedFile = file;

        // Check if the file size is greater than 2MB
        if (file.size > 2 * 1024 * 1024) {
          const options = {
            maxSizeMB: 2, // Maximum size in MB
            maxWidthOrHeight: 1920, // Optional: maximum width or height (in pixels)
            useWebWorker: true, // Optional: use web worker for faster compression
          };

          // Compress the image
          compressedFile = await imageCompression(file, options);
        }

        const formData = new FormData();
        formData.append('image', compressedFile);

        // Upload the image
        const response = await api.post(`/guilds/${guild.id}/upload-image`, formData);
        const imageUrl = response.data.url;
        setNewReply((prevState) => ({
          ...prevState,
          attachment: imageUrl,
        }));
        setErrors((prevErrors) => ({
          ...prevErrors,
          attachment: '',
        }));
      } catch (error) {
        console.error('Failed to upload image:', error);
      } finally {
        setUploading(false);
      }
    }
  };

  const ResetModal = () => {
    setNewReply({
      trigger: '',
      message: '',
      mention: true,
      attachment: '',
      embed: '',
      enabled_channels: [],
    });
  };

  const handleEditClick = (index) => {
    setCurrentEditIndex(index);
    setNewReply(state.autoReply[index]);
    setIsEditModalOpen(true);
  };

  const handleEnabledChannelsChange = (selectedChannels) => {
    setNewReply((prevState) => ({
      ...prevState,
      enabled_channels: selectedChannels.map((e) => e.value),
    }));
  };

  return (
    <>
      <Head>
        <title>{locale.autoreply.title}</title>
      </Head>
      <header className="p-2.5 border-b border-[#3d4049] text-xl font-semibold">
        <h1>{locale.autoreply.title}</h1>
      </header>
      <div className="bg-[#060A1B] p-5 rounded mb-[100px] mt-3">
        <div className="flex flex-col pb-20">
          {state.autoReply.map((reply, index) => (
            <Reply
              key={index}
              reply={reply}
              onEdit={() => handleEditClick(index)}
              onDelete={() => handleDelete(index)}
              deleting={deleting}
            />
          ))}
          <div
            onClick={() => {
              ResetModal();
              setIsModalOpen(true);
            }}
            className="relative group flex justify-center items-center px-16 py-6 mt-2.5 w-full text-xl font-bold text-indigo-400 rounded-2xl border-2 border-dashed border-zinc-700 max-md:px-5 max-md:max-w-full cursor-pointer hover:bg-indigo-500 hover:border-indigo-400 hover:text-white active:bg-indigo-500 active:border-indigo-600 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all"
          >
            <div className="flex gap-1.5 items-center">
              <Icon icon={'ph:plus-circle-fill'} className="transition-transform duration-200 group-hover:rotate-90" />
              <div className="my-auto">{locale.autoreply.addNew}</div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddNew}
        newReply={newReply}
        handleInputChange={handleInputChange}
        handleMentionChange={handleMentionChange}
        handleEnabledChannelsChange={handleEnabledChannelsChange}
        handleFileChange={handleFileChange}
        RemoveAttachment={RemoveAttachment}
        errors={errors}
        saving={saving}
        uploading={uploading}
        triggerRef={triggerRef}
        messageRef={messageRef}
        attachmentRef={attachmentRef}
        locale={locale}
        title={locale.autoreply.newTrigger}
      />
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEdit}
        newReply={newReply}
        handleInputChange={handleInputChange}
        handleMentionChange={handleMentionChange}
        handleEnabledChannelsChange={handleEnabledChannelsChange}
        handleFileChange={handleFileChange}
        RemoveAttachment={RemoveAttachment}
        errors={errors}
        saving={saving}
        uploading={uploading}
        triggerRef={triggerRef}
        messageRef={messageRef}
        attachmentRef={attachmentRef}
        locale={locale}
        title={locale.autoreply.editTrigger}
      />
    </>
  );
}
