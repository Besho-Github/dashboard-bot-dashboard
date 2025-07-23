import { Icon } from '@iconify/react';
import { TRANSPARENT } from '../../../../utils';

const StatusBadge = ({ status }) => {
  const colors = {
    online: 'bg-green-500',
    dnd: 'bg-red-500',
    idle: 'bg-yellow-500',
    invisible: 'bg-gray-500',
    offline: 'bg-gray-500',
  };

  return <div className={`w-3 h-3 rounded-full ${colors[status]}`} />;
};

const ActivityBadge = ({ type }) => {
  const icons = {
    0: 'mdi:gamepad-variant-outline',
    1: 'mdi:video-wireless-outline',
    2: 'mdi:headphones',
    3: 'mdi:television-classic',
    5: 'mdi:trophy-outline',
  };

  return <Icon icon={icons[type]} className="w-5 h-5 text-gray-300" />;
};

export const PremiumContent = ({ premiumData, handleChange, locale, isRTL, id, showModal }) => {
  const handleManage = () => {
    showModal(1);
  };

  const getUrl = (image, type, size) => {
    if (!image) return '';
    return image.startsWith('data:')
      ? image
      : `https://cdn.discordapp.com/${type}/${premiumData.bot.user.id}/${image}.${image.startsWith('a_') ? 'gif' : 'png'}?size=${size}`;
  };

  const handleFileChange = async (event, field) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange(field, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const SelectArrow = () => (
    <div className={`pointer-events-none absolute inset-y-0 ${isRTL ? 'left-0' : 'right-0'} flex items-center px-2 text-gray-700`}>
      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
      </svg>
    </div>
  );

  return (
    <>
      <div>
        <header className="p-2.5 border-b border-[#3d4049] text-xl font-semibold">
          <h1>{locale.premium.title}</h1>
        </header>
        <div className="bg-gray-900 text-white rounded-lg shadow-xl overflow-hidden mt-3">
          <div className="relative h-32 md:h-48 bg-[#757e8a]">
            <input type="file" id="banner-upload" className="hidden" onChange={(e) => handleFileChange(e, 'user.banner')} />
            <label
              htmlFor="banner-upload"
              className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300"
            >
              <Icon icon="fa-solid:pen" className="w-10 h-10" />
            </label>
            <img
              src={getUrl(premiumData.bot.user.banner, 'banners', 2048) || TRANSPARENT}
              alt="Bot Banner"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative px-4 md:px-6 py-4">
            <div
              className={`absolute -top-16 ${isRTL ? 'right-4' : 'left-4'} md:${
                isRTL ? 'right-6' : 'left-6'
              } w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-900 overflow-hidden`}
            >
              <input type="file" id="avatar-upload" className="hidden" onChange={(e) => handleFileChange(e, 'user.avatar')} />
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300"
              >
                <Icon icon="fa-solid:pen" className="w-8 h-8" />
              </label>
              <img
                src={getUrl(premiumData.bot.user.avatar, 'avatars', 1024) || 'https://cdn.discordapp.com/embed/avatars/1.png'}
                alt="Bot Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <div className={`${isRTL ? 'mr-28 md:mr-36' : 'ml-28 md:ml-36'} mt-2 md:mt-0`}>
              <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                {premiumData.bot.user.username}
                <StatusBadge status={premiumData.bot.bot_status} />
              </h2>
              <div className="flex items-center gap-2 text-gray-300 mt-1">
                <ActivityBadge type={premiumData.bot.activity_type} />
                <span className="text-sm md:text-base">{premiumData.bot.activity_text}</span>
              </div>
            </div>
          </div>

          <div className="px-4 md:px-6 py-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">{locale.premium.botName}</label>
                <input
                  className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-10"
                  value={premiumData.bot.user.username}
                  onChange={(e) => handleChange('user.username', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">{locale.premium.botStatus}</label>
                <div className="relative">
                  <select
                    className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none h-10"
                    value={premiumData.bot.bot_status}
                    onChange={(e) => handleChange('bot_status', e.target.value)}
                  >
                    <option value="online">Online</option>
                    <option value="dnd">Do Not Disturb</option>
                    <option value="idle">Idle</option>
                    <option value="invisible">Invisible</option>
                    <option value="offline">Offline</option>
                  </select>
                  <SelectArrow />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">{locale.premium.activityText}</label>
                <input
                  className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-10"
                  value={premiumData.bot.activity_text}
                  onChange={(e) => handleChange('activity_text', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">{locale.premium.activityType}</label>
                <div className="relative">
                  <select
                    className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none h-10"
                    value={premiumData.bot.activity_type}
                    onChange={(e) => handleChange('activity_type', parseInt(e.target.value))}
                  >
                    <option value={0}>Playing</option>
                    <option value={1}>Streaming</option>
                    <option value={2}>Listening</option>
                    <option value={3}>Watching</option>
                    <option value={5}>Competing</option>
                  </select>
                  <SelectArrow />
                </div>
              </div>
            </div>

            {premiumData.bot.activity_type === 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">{locale.premium.streamUrl}</label>
                <input
                  className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-10"
                  value={premiumData.bot.stream_url || ''}
                  onChange={(e) => handleChange('stream_url', e.target.value)}
                  placeholder="https://twitch.tv/username"
                />
              </div>
            )}
          </div>

          <div className="px-4 md:px-6 py-4 bg-gray-800">
            <h3 className="text-lg font-semibold mb-4">{locale.premium.botSubscription}</h3>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-300">
                  {locale.premium.yourPlan}:{' '}
                  <span className="font-semibold text-indigo-400">
                    {premiumData.plan === 0
                      ? locale.premium.monthlyPlan
                      : premiumData.plan === 1
                      ? locale.premium.threeMonthPlan
                      : premiumData.plan === 2
                      ? locale.premium.sixMonthPlan
                      : locale.premium.yearlyPlan}
                  </span>
                </p>
                <p className="text-sm text-gray-300 mt-1">
                  {locale.premium.subscriptionEnding}
                  <span className="font-semibold">
                    {' '}
                    {new Date(premiumData.endDate).toLocaleDateString(locale.language, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </p>
              </div>
              <button
                className={`px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center justify-center min-w-[120px]`}
                onClick={handleManage}
                data-tooltip-id="manage-button-tooltip"
              >
                <span>{locale.premium.AddVoucher}</span>
                <Icon icon="mdi:ticket-percent" className={`w-5 h-5 ${isRTL ? 'mr-1' : 'ml-1'}`} />
              </button>
            </div>
          </div>

          <div className="px-4 md:px-6 py-4 bg-gray-800 border-t border-gray-700">
            <a
              href={`https://discord.com/oauth2/authorize?client_id=${premiumData.bot.user.id}&permissions=8&scope=bot&guild_id=${id}&disable_guild_select=true`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span>{locale.premium.invite}</span>
              <Icon icon="mdi:open-in-new" className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default PremiumContent;
