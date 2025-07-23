import React, { useContext } from 'react';
import { DataContext } from '../../../../context';
import { Icon } from '@iconify/react/dist/iconify.js';

const SelectableList = ({ active, onChange }) => {
  const { locale } = useContext(DataContext);

  const items = [
    { id: 'Background', icon: 'mdi:image', color: 'blue' },
    { id: 'Avatar', icon: 'mdi:account-circle', color: 'purple' },
    { id: 'Username', icon: 'mdi:account', color: 'green' },
    { id: 'Text', icon: 'mdi:text', color: 'amber' },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-4 border-b border-white/5">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onChange(item.id)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
            active === item.id ? `bg-${item.color}-500/10 text-${item.color}-400` : 'text-gray-400 hover:bg-gray-700/30'
          }`}
        >
          <Icon icon={item.icon} className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:inline">{locale.welcome.list[`option_${items.indexOf(item) + 1}`]}</span>
        </div>
      ))}
    </div>
  );
};

export default SelectableList;
