import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAbbreviation(words: string) {
  return words
    .toUpperCase()
    .split(' ')
    .map((w) => w[0])
    .join('');
}

export function getContrastColor(hexColor: string) {
  // Remove the leading '#' if present
  const color = hexColor.replace('#', '');

  // Convert the hexadecimal color to RGB values
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  // Calculate the relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black or white based on the luminance value
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export function decimalToHexColor(decimal: number) {
  if (!decimal) return '#000000';
  // Convert decimal to hexadecimal
  let hex = decimal?.toString(16);
  // Pad with leading zeros if necessary to ensure 6 characters
  while (hex.length < 6) {
    hex = '0' + hex;
  }
  // Return the formatted hex color code
  return '#' + hex;
}

export function hexToDecimalColor(hexColor: string): number {
  // Remove the '#' if it exists
  const cleanedHex = hexColor.replace('#', '');

  // Convert the cleaned hexadecimal string to an integer
  return parseInt(cleanedHex, 16);
}

export const modCommands = [
  'ban',
  'unban',
  'clear',
  'hide',
  'kick',
  'lock',
  'move',
  'role',
  'setnick',
  'show',
  'timeout',
  'unlock',
  'untimeout',
  'unwarn',
  'vkick',
  'vmute',
  'warn',
  'warns',
];
export const commands = ['user', 'server', 'roles', 'ping', 'banner', 'avatar'];

export const logs = [
  { name: 'banMember', icon: '/icons/kick.svg' },
  { name: 'timeout', icon: '/icons/timeout.svg' },
  { name: 'createChannel', icon: '/icons/show.svg' },
  { name: 'createThread', icon: '/icons/show.svg' },
  { name: 'createRole', icon: '/icons/show.svg' },
  { name: 'deleteChannel', icon: '/icons/deletemessage.svg' },
  { name: 'deleteThread', icon: '/icons/deletemessage.svg' },
  { name: 'deleteMessage', icon: '/icons/deletemessage.svg' },
  { name: 'deleteMessages', icon: '/icons/deletemessage.svg' },
  { name: 'deleteRole', icon: '/icons/deleteuser.svg' },
  { name: 'editMessages', icon: '/icons/move.svg' },
  { name: 'kickMember', icon: '/icons/kick.svg' },
  { name: 'voiceMove', icon: '/icons/move.svg' },
  { name: 'voiceDisconnect', icon: '/icons/hide.svg' },
  { name: 'memberJoined', icon: '/icons/role.svg' },
  { name: 'memberLeft', icon: '/icons/deleteuser.svg' },
  { name: 'nicknameChanged', icon: '/icons/setnick.svg' },
  { name: 'memberRoleGiven', icon: '/icons/role.svg' },
  { name: 'memberRoleRemoved', icon: '/icons/deleteuser.svg' },
  { name: 'serversInvites', icon: '/icons/move.svg' },
  { name: 'unbanMember', icon: '/icons/unwarn.svg' },
  { name: 'updateChannel', icon: '/icons/show.svg' },
  { name: 'updateThread', icon: '/icons/show.svg' },
  { name: 'updateChannelPermissions', icon: '/icons/show.svg' },
  { name: 'updateRole', icon: '/icons/role.svg' },
  { name: 'updateServer', icon: '/icons/show.svg' },
  { name: 'voiceJoined', icon: '/icons/unvmute.svg' },
  { name: 'voiceLeft', icon: '/icons/vmute.svg' },
  { name: 'voiceState', icon: '/icons/warn.svg' },
  { name: 'voiceSwitched', icon: '/icons/role.svg' },
  { name: 'updateEmojis', icon: '/icons/show.svg' },
  { name: 'updateStickers', icon: '/icons/show.svg' },
];

export const TRANSPARENT =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

export const getDimensions = (imagewidth: number, imageheight: number) => {
  var maxWidth = 500;
  var maxHeight = 500;
  if (imagewidth > maxWidth && imageheight < maxHeight) {
    var ratio = maxWidth / imagewidth,
      width = imagewidth * ratio,
      height = imageheight * ratio;
  } else if (imageheight > maxHeight && imagewidth < maxWidth) {
    var ratio = imageheight,
      width = (imagewidth * maxWidth) / ratio,
      height = (imageheight * maxHeight) / ratio;
  } else if (imagewidth > maxWidth && imageheight > maxHeight) {
    var ratio = maxWidth / imagewidth,
      width = imagewidth * ratio,
      height = imageheight * ratio;
  } else {
    var ratio = maxWidth / imagewidth,
      width = imagewidth * ratio,
      height = imageheight * ratio;
  }
  return { width, height };
};

/*
inputs
1 bad words
2 disabled channels
3 disabled roles
4 mentions number
*/
export const automodRules = [
  {
    id: 0,
    name: 'BAD WORDS',
    icon: '/icons/deletemessage.svg',
    actions: [1, 2, 3],
    inputs: [1, 2, 3],
  },
  {
    id: 1,
    name: 'SPAM DETECTION',
    icon: '/icons/spam.svg',
    actions: [1, 2],
    inputs: [2, 3],
  },
  {
    id: 2,
    name: 'LINK FILTERING',
    icon: '/icons/link.svg',
    actions: [1, 2, 3],
    inputs: [2, 3],
  },
  {
    id: 3,
    name: 'MENTION SPAM',
    icon: '/icons/mention.svg',
    actions: [1, 2, 3],
    inputs: [2, 3, 4],
  },
  {
    id: 4,
    name: 'MASS CAPS DETECTION',
    icon: '/icons/mass.svg',
    actions: [1, 2, 3],
    inputs: [2, 3],
  },
  {
    id: 5,
    name: 'DISCORD INVITES FILTERING',
    icon: '/icons/mass.svg',
    actions: [1, 2, 3],
    inputs: [2, 3],
  },
];

export function formatNumber(num: number) {
  if (num === undefined || num === null) return '0';

  const units = ['', 'k', 'M', 'B', 'T']; // Add more units if needed
  let unitIndex = 0;

  while (num >= 1000 && unitIndex < units.length - 1) {
    num /= 1000;
    unitIndex++;
  }

  let formattedNumber = Number.isInteger(num) ? num.toFixed(0) : num.toFixed(1);
  return formattedNumber + units[unitIndex];
}
