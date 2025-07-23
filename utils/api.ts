import axios from 'axios';

const api = axios.create({
  baseURL: process.env.API_URL,
});

export async function fetchGuilds() {
  const response = await api.get('/user/guilds');
  return response.data;
}

export async function fetchUser() {
  const response = await api.get('/user/me');
  return response.data;
}

export async function fetchGuild(id: string) {
  try {
    const response = await api.get(`/guilds/${id}`);
    return response.data;
  } catch (error: any) {
    return error.response.status;
  }
}

export async function fetchGuildChannels(id: string) {
  try {
    const response = await api.get(`/guilds/${id}/channels`);
    return response.data;
  } catch (error: any) {
    return error.response.status;
  }
}

export async function fetchGuildRoles(id: string) {
  try {
    const response = await api.get(`/guilds/${id}/roles`);
    return response.data;
  } catch (error: any) {
    return error.response.status;
  }
}

export async function fetchGuildEmojis(id: string) {
  try {
    const response = await api.get(`/guilds/${id}/emojis`);
    return response.data;
  } catch (error: any) {
    return false;
  }
}

export { api };
