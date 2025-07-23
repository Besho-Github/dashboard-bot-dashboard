import { useState, useCallback } from 'react';
import { api } from '../utils/api';

export function useTicketsState(guild, channels, roles) {
  const getInitialState = () => ({
    tickets: guild.ticket,
    uploadingBackground: false,
    uploadingLine: false,
    saving: false,
    loading: false,
    error: Array(guild.ticket.data.ticketOptions.length).fill(null),
    errors: [],
    uploadingCategory: null,
  });

  const [state, setState] = useState(getInitialState);

  // Function to update tickets data
  const updateTicketsData = useCallback((newData) => {
    setState((prevState) => ({
      ...prevState,
      ...newData,
    }));
  }, []);

  // Handle input changes for category fields
  const handleInputChange = useCallback(
    (e, index, field) => {
      const updatedTickets = JSON.parse(JSON.stringify(state.tickets)); // deep copy
      const value = e.target.value;
      updatedTickets.data.ticketOptions[index][field] = value;

      let errors = [...state.error];
      const nameCount = updatedTickets.data.ticketOptions.filter((category) => category.name === value).length;
      if (nameCount > 1) {
        errors[index] = 'Category name must be unique';
      } else {
        errors[index] = null;
      }

      setState((prevState) => ({
        ...prevState,
        saving: true,
        tickets: updatedTickets,
        error: errors,
      }));
    },
    [state.tickets, state.error]
  );

  // Handle select changes
  const handleSelectChange = useCallback(
    (value, index, field) => {
      const updatedTickets = JSON.parse(JSON.stringify(state.tickets)); // deep copy
      updatedTickets.data.ticketOptions[index][field] = value;
      setState((prevState) => ({
        ...prevState,
        saving: true,
        tickets: updatedTickets,
      }));
    },
    [state.tickets]
  );

  // Handle channel type changes
  const handleChannelType = useCallback(
    (e, index) => {
      const updatedTickets = JSON.parse(JSON.stringify(state.tickets)); // deep copy
      updatedTickets.data.ticketOptions[index].sectionType = e.value;
      setState((prevState) => ({
        ...prevState,
        saving: true,
        tickets: updatedTickets,
      }));
    },
    [state.tickets]
  );

  // Handle category removal
  const handleRemoveCategory = useCallback(
    (index) => {
      const updatedTickets = JSON.parse(JSON.stringify(state.tickets)); // deep copy
      updatedTickets.data.ticketOptions.splice(index, 1);
      setState((prevState) => ({
        ...prevState,
        saving: true,
        tickets: updatedTickets,
      }));
    },
    [state.tickets]
  );

  // Handle color changes
  const handleColorChange = useCallback(
    (color, index) => {
      const updatedTickets = JSON.parse(JSON.stringify(state.tickets)); // deep copy
      updatedTickets.data.ticketOptions[index].color = color;
      setState((prevState) => ({
        ...prevState,
        saving: true,
        tickets: updatedTickets,
      }));
    },
    [state.tickets]
  );

  // Handle emoji changes
  const handleEmojiChange = useCallback(
    (emoji, index) => {
      const updatedTickets = JSON.parse(JSON.stringify(state.tickets)); // deep copy
      const Emoji = emoji.native ? emoji.native : `<${emoji.name}:${emoji.id}>`;
      updatedTickets.data.ticketOptions[index].emoji = Emoji;
      setState((prevState) => ({
        ...prevState,
        saving: true,
        tickets: updatedTickets,
      }));
    },
    [state.tickets]
  );

  // Handle description changes
  const handleDescriptionChange = (e) => {
    const description = e.target.value;
    setState((prevState) => ({
      ...prevState,
      saving: true,
      tickets: {
        ...prevState.tickets,
        data: {
          ...prevState.tickets.data,
          config: {
            ...prevState.tickets.data.config,
            embed: {
              ...prevState.tickets.data.config.embed,
              description: description,
            },
          },
        },
      },
    }));
  };

  // Handle working hours changes
  const handleWorkingHoursChange = (field, value) => {
    setState((prevState) => ({
      ...prevState,
      saving: true,
      tickets: {
        ...prevState.tickets,
        data: {
          ...prevState.tickets.data,
          config: {
            ...prevState.tickets.data.config,
            workingHours: {
              ...prevState.tickets.data.config.workingHours,
              [field]: value,
            },
          },
        },
      },
    }));
  };

  // Handle working hours toggle
  const handleWorkingHoursToggle = () => {
    setState((prevState) => ({
      ...prevState,
      saving: true,
      tickets: {
        ...prevState.tickets,
        data: {
          ...prevState.tickets.data,
          config: {
            ...prevState.tickets.data.config,
            workingHours: {
              ...prevState.tickets.data.config.workingHours,
              active: !prevState.tickets.data.config.workingHours.active,
            },
          },
        },
      },
    }));
  };

  // Handle permission changes
  const handlePermissionChange = useCallback((userType, permissionKey, value) => {
    setState((prevState) => ({
      ...prevState,
      saving: true,
      tickets: {
        ...prevState.tickets,
        data: {
          ...prevState.tickets.data,
          config: {
            ...prevState.tickets.data.config,
            permissions: {
              ...prevState.tickets.data.config.permissions,
              [userType]: {
                ...prevState.tickets.data.config.permissions?.[userType],
                [permissionKey]: value,
              },
            },
          },
        },
      },
    }));
  }, []);

  // Add new category
  const handleAddCategory = (channels, roles) => {
    const newCategory = {
      logChannelId: channels.find((channel) => channel.type == 0)?.id || '',
      categoryId: channels.find((channel) => channel.type == 4)?.id || '',
      color: '#FFFFFF',
      name: '',
      emoji: null,
      roleId: roles[0]?.id || '',
      image: '',
      embed: {
        color: '#FFFFFF',
      },
      sectionType: '21',
    };
    const updatedTickets = JSON.parse(JSON.stringify(state.tickets)); // deep copy
    updatedTickets.data.ticketOptions.push(newCategory);

    const newErrorState = [...state.error, null];

    setState((prevState) => ({
      ...prevState,
      saving: true,
      tickets: updatedTickets,
      error: newErrorState,
    }));
    setTimeout(() => {
      window.scrollBy({ behavior: 'smooth', top: window.innerHeight });
    }, 100);
  };

  // Reset state
  const reset = () => {
    setState(getInitialState());
  };

  // Save tickets
  const saveTickets = async () => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    try {
      await api.post(`/guilds/${guild.id}/tickets`, state.tickets.data);
      setState((prevState) => ({
        ...prevState,
        loading: false,
        saving: false,
      }));
      guild.ticket = state.tickets;
    } catch (error) {
      if (error.response && error.response.data) {
        const { details } = error.response.data;
        setState((prevState) => ({
          ...prevState,
          loading: false,
          errors: details || [],
          warn: true,
        }));
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    }
  };

  return {
    state,
    updateTicketsData,
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
    handleAddCategory: () => handleAddCategory(channels, roles),
    reset,
    saveTickets,
  };
}
