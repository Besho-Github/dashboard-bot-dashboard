import Head from 'next/head';
import { useState, useContext } from 'react';
import { Icon } from '@iconify/react';
import { api } from '../../utils/api';
import { GuildDataContext } from '../../context/guild';
import EmbedCard from '../ui/dashboard/embedBuilder/EmbedCard';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataContext } from '../../context';

export default function EmbedBuilder() {
  const { guild } = useContext(GuildDataContext);
  const [embeds, setEmbeds] = useState(JSON.parse(JSON.stringify(guild.embeds)));
  const [loadingStates, setLoadingStates] = useState({});
  const [addNewLoading, setAddNewLoading] = useState(false);

  const { locale } = useContext(DataContext);

  const handleSaveEmbed = async (embed) => {
    setAddNewLoading(true);
    try {
      const response = await api.post(`/guilds/${guild.id}/embed`, embed);
      setEmbeds(response.data.embeds);
      guild.embeds = response.data.embeds;
    } catch (error) {
      console.error('Error saving embed:', error);
    } finally {
      setAddNewLoading(false);
    }
  };

  const handleEditEmbed = async (embedId, updatedEmbed) => {
    setLoadingStates((prev) => ({ ...prev, [embedId]: { ...prev[embedId], save: true } }));
    try {
      const response = await api.put(`/guilds/${guild.id}/embed/${embedId}`, updatedEmbed);
      setEmbeds((prev) => prev.map((e) => (e._id === embedId ? response.data.embed : e)));
      toast.success(locale.embed.main.toast, {
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
      guild.embeds = embeds.map((e) => (e._id === embedId ? response.data.embed : e));
    } catch (error) {
      console.error('Error editing embed:', error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [embedId]: { ...prev[embedId], save: false } }));
    }
  };

  const handleDeleteEmbed = async (embedId) => {
    setLoadingStates((prev) => ({ ...prev, [embedId]: { ...prev[embedId], delete: true } }));
    try {
      await api.delete(`/guilds/${guild.id}/embed/${embedId}`);
      setEmbeds((prev) => prev.filter((e) => e._id !== embedId));
      guild.embeds = embeds.filter((e) => e._id !== embedId);
    } catch (error) {
      console.error('Error deleting embed:', error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [embedId]: { ...prev[embedId], delete: false } }));
    }
  };

  const handleEmbedChange = (embedId, key, value) => {
    setEmbeds((prev) =>
      prev.map((embed) => {
        if (embed._id === embedId) {
          if (key.includes('.')) {
            const keys = key.split('.');
            let updatedEmbed = { ...embed };
            let nestedObj = updatedEmbed;

            for (let i = 0; i < keys.length - 1; i++) {
              const k = keys[i];
              nestedObj[k] = { ...nestedObj[k] };
              nestedObj = nestedObj[k];
            }

            nestedObj[keys[keys.length - 1]] = value;
            return updatedEmbed;
          } else {
            return { ...embed, [key]: value };
          }
        }
        return embed;
      })
    );
  };

  const handleAddField = (embedId) => {
    setEmbeds((prev) =>
      prev.map((embed) => (embed._id === embedId ? { ...embed, fields: [...embed.fields, { name: '', value: '', inline: false }] } : embed))
    );
  };

  const handleClearFields = (embedId) => {
    setEmbeds((prev) => prev.map((embed) => (embed._id === embedId ? { ...embed, fields: [] } : embed)));
  };

  const handleFieldChange = (embedId, index, key, value) => {
    setEmbeds((prev) =>
      prev.map((embed) => {
        if (embed._id === embedId) {
          const fields = [...embed.fields];
          fields[index] = { ...fields[index], [key]: value };
          return { ...embed, fields };
        }
        return embed;
      })
    );
  };

  const handleRemoveField = (embedId, index) => {
    setEmbeds((prev) =>
      prev.map((embed) => {
        if (embed._id === embedId) {
          const fields = [...embed.fields];
          fields.splice(index, 1);
          return { ...embed, fields };
        }
        return embed;
      })
    );
  };
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post(`/guilds/${guild.id}/upload-image`, formData);
      return response.data.url;
    } catch (error) {
      console.error('Image upload failed:', error);
      return '';
    }
  };

  const handleImageUpload = async (embedId, e, type) => {
    setLoadingStates((prev) => ({ ...prev, [type]: { upload: true } }));
    const file = e.target.files[0];
    const url = await uploadImage(file);
    setLoadingStates((prev) => ({ ...prev, [type]: { upload: false } }));
    setEmbeds((prev) =>
      prev.map((embed) => {
        if (embed._id === embedId) {
          if (type === 'author' || type === 'footer') {
            return { ...embed, [type]: { ...embed[type], icon_url: url } };
          } else {
            return { ...embed, [type]: { ...embed[type], url } };
          }
        }
        return embed;
      })
    );
  };

  const handleImageRemove = (embedId, type) => {
    setEmbeds((prev) =>
      prev.map((embed) => {
        if (embed._id === embedId) {
          if (type === 'author' || type === 'footer') {
            return { ...embed, [type]: { ...embed[type], icon_url: '' } };
          } else {
            return { ...embed, [type]: { ...embed[type], url: '' } };
          }
        }
        return embed;
      })
    );
  };

  const isValidEmbed = (embed) => {
    return (
      embed.author.name.trim() !== '' &&
      embed.footer.text.trim() !== '' &&
      embed.description.trim() !== '' &&
      embed.fields.every((field) => field.name !== '' && field.value !== '')
    );
  };

  return (
    <>
      <Head>
        <title>{locale.embed.main.pageTitle}</title>
      </Head>
      <header className="p-2.5 border-b border-[#3d4049] text-xl font-semibold">
        <h1>{locale.embed.main.title}</h1>
      </header>
      <div className="bg-[#060A1B] p-3 rounded mb-[100px] mt-3">
        {embeds.map((embed, i) => (
          <EmbedCard
            index={i + 1}
            key={embed._id}
            embed={embed}
            handleAddField={() => handleAddField(embed._id)}
            handleClearFields={() => handleClearFields(embed._id)}
            handleChange={(e) => handleEmbedChange(embed._id, e.target.name, e.target.value)}
            handleEditEmbed={() => handleEditEmbed(embed._id, embed)}
            handleDeleteEmbed={() => handleDeleteEmbed(embed._id)}
            handleColorChange={(color) => handleEmbedChange(embed._id, 'color', color)}
            handleFieldChange={(index, e) => handleFieldChange(embed._id, index, e.target.name, e.target.value)}
            handleRemoveField={(index) => handleRemoveField(embed._id, index)}
            handleImageUpload={(e, type) => handleImageUpload(embed._id, e, type)}
            handleImageRemove={(type) => handleImageRemove(embed._id, type)}
            isValidEmbed={() => isValidEmbed(embed)}
            loadingStates={loadingStates}
          />
        ))}
        <div
          onClick={() => {
            if (!addNewLoading) {
              handleSaveEmbed(
                {
                  content: '',
                  title: locale.embed.body.sec_3.embedTitle,
                  description: '',
                  fields: [],
                  author: {
                    name: locale.embed.body.sec_3.authorName,
                    url: '',
                    icon_url: '',
                  },
                  url: '',
                  color: '#FFFFFF',
                  image: {
                    url: '',
                  },
                  thumbnail: {
                    url: '',
                  },
                  footer: {
                    text: locale.embed.body.sec_3.footer,
                    icon_url: '',
                  },
                  timestamp: new Date().toISOString(),
                },
                true
              );
            }
          }}
          className="relative group flex justify-center items-center px-16 py-6 mt-2.5 w-full text-xl font-bold text-indigo-400 rounded-2xl border-2 border-dashed border-zinc-700 max-md:px-5 max-md:max-w-full cursor-pointer hover:bg-indigo-500 hover:border-indigo-400 hover:text-white active:bg-indigo-500 active:border-indigo-600 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all"
        >
          <div className="flex gap-1.5 items-center">
            {addNewLoading ? (
              <Icon icon={'eos-icons:three-dots-loading'} className="text-[#ffffffa3] size-12" />
            ) : (
              <>
                <Icon icon={'ph:plus-circle-fill'} className="transition-transform duration-200 group-hover:rotate-90" />
                <div className="my-auto">{locale.embed.main.add}</div>
              </>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
