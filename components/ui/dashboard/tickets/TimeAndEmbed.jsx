import React, { useContext } from 'react';
import Switch from '../common/Switch';
import { DataContext } from '../../../../context';

export default function TimeAndEmbed({ workingHours, description, onDescriptionChange, onWorkingHoursChange, onWorkingHoursToggle }) {
  const { locale } = useContext(DataContext);

  return (
    <div className="flex flex-col px-5">
      <div className="flex justify-between items-center mb-4 text-sm font-bold uppercase tracking-wide text-gray-300">
        <span>{locale.tickets.Sec_3.title}</span>
      </div>
      <div className="flex flex-col gap-4 mb-4">
        <textarea
          maxLength={4096}
          className="flex flex-col justify-between py-2 pr-2 pl-2 whitespace-nowrap rounded-sm bg-[#111331] min-h-[84px] max-md:max-w-full focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          value={description}
          onChange={onDescriptionChange}
          rows={4}
        ></textarea>
        <div className="flex flex-col items-start text-sm font-medium text-gray-300">
          <div className="flex justify-between items-center mb-4 text-sm font-bold uppercase tracking-wide text-gray-300 gap-5">
            <span>{locale.tickets.Sec_3.switch_title}</span>
            <Switch size="sm" active={workingHours.active} onChange={onWorkingHoursToggle} />
          </div>
          <div className="flex gap-5">
            <div className="flex flex-col">
              <label className="font-bold uppercase mb-1">{locale.tickets.Sec_3.from}</label>
              <input
                type="time"
                disabled={!workingHours.active}
                value={workingHours.start}
                onChange={(e) => onWorkingHoursChange('start', e.target.value)}
                className="bg-[#111331] p-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-bold uppercase mb-1">{locale.tickets.Sec_3.until}</label>
              <input
                type="time"
                disabled={!workingHours.active}
                value={workingHours.end}
                onChange={(e) => onWorkingHoursChange('end', e.target.value)}
                className="bg-[#111331] p-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
