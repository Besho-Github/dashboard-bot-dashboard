import { useCallback } from 'react';
import { api } from '../utils/api';
import imageCompression from 'browser-image-compression';

export function useImageUpload(guildId, updateTicketsData, state) {
  // Upload image with compression if needed
  const uploadImage = useCallback(
    async (file) => {
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
        return await api.post(`/guilds/${guildId}/upload-image`, formData);
      } catch (error) {
        console.error('Image upload failed:', error);
        return { data: { url: '' } };
      }
    },
    [guildId]
  );

  // Handle file change for background and line images
  const handleFileChange = useCallback(
    (event, name) => {
      const selectedFile = event.target.files[0];
      const upload = name === 'background' ? 'uploadingBackground' : 'uploadingLine';
      if (!selectedFile) return;

      updateTicketsData({
        [upload]: true,
      });

      uploadImage(selectedFile).then(({ data }) => {
        updateTicketsData({
          [upload]: false,
          saving: true,
          tickets: {
            ...state.tickets,
            data: {
              ...state.tickets.data,
              config: {
                ...state.tickets.data.config,
                [name]: data.url,
              },
            },
          },
        });
      });
    },
    [uploadImage, updateTicketsData, state.tickets]
  );

  // Handle category image change
  const handleCategoryImageChange = useCallback(
    (e, index) => {
      const selectedFile = e.target.files[0];
      if (!selectedFile) return;

      const updatedTickets = JSON.parse(JSON.stringify(state.tickets)); // deep copy

      updateTicketsData({
        uploadingCategory: index,
      });

      uploadImage(selectedFile).then(({ data }) => {
        updatedTickets.data.ticketOptions[index].image = data.url;
        updateTicketsData({
          saving: true,
          tickets: updatedTickets,
          uploadingCategory: null,
        });
      });
    },
    [uploadImage, updateTicketsData, state.tickets]
  );

  // Handle category image removal
  const handleCategoryImageRemove = useCallback(
    (index) => {
      const updatedTickets = JSON.parse(JSON.stringify(state.tickets)); // deep copy
      updatedTickets.data.ticketOptions[index].image = '';
      updateTicketsData({
        saving: true,
        tickets: updatedTickets,
      });
    },
    [updateTicketsData, state.tickets]
  );

  // Remove background or line image
  const removeImage = useCallback(
    (type) => {
      updateTicketsData({
        saving: true,
        tickets: {
          ...state.tickets,
          data: {
            ...state.tickets.data,
            config: {
              ...state.tickets.data.config,
              [type]: '',
            },
          },
        },
      });
    },
    [updateTicketsData, state.tickets]
  );

  return {
    uploadImage,
    handleFileChange,
    handleCategoryImageChange,
    handleCategoryImageRemove,
    removeImage,
  };
}
