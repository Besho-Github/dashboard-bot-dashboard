import { Icon } from '@iconify/react/dist/iconify.js';
import { useState, useEffect, useContext } from 'react';
import { DataContext } from '../../context';

export function NumberInput({ value, onChange }) {
  const { locale } = useContext(DataContext);
  const isRTL = locale.getLanguage() === 'ar';

  const handleDecrement = (e) => {
    onChange(Math.max(value - 1, 0)); // Ensuring the value doesn't go below 0
  };

  const handleIncrement = (e) => {
    onChange(value + 1);
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (newValue === '') {
      onChange(0);
      return;
    }
    // Remove leading zeros
    const trimmedValue = newValue.replace(/^0+/, '');
    const parsedValue = parseInt(trimmedValue);
    if (!isNaN(parsedValue)) {
      onChange(Math.max(0, parsedValue));
    } else {
      onChange(1);
    }
  };

  return (
    <div className="flex w-full min-w-[120px] max-w-full text-white rounded-lg bg-[#1D1B45] border border-[#1E1F22]">
      <button
        onClick={isRTL ? handleIncrement : handleDecrement}
        className={`shrink-0 aspect-square h-9 flex items-center m-1 justify-center bg-[#25235b] ${
          isRTL ? 'rounded-r' : 'rounded-l'
        } text-[#B5BAC1] active:text-[#dbdee1]`}
      >
        <Icon icon={isRTL ? 'ph:plus-bold' : 'ph:minus-bold'} className="size-4" />
      </button>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        className="flex-1 min-w-0 px-2 text-center bg-[#1D1B45] border-none text-white outline-none"
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      />
      <button
        onClick={isRTL ? handleDecrement : handleIncrement}
        className={`shrink-0 aspect-square h-9 flex items-center justify-center bg-[#25235b] ${
          isRTL ? 'rounded-l' : 'rounded-r'
        } m-1 text-[#B5BAC1] active:text-[#dbdee1]`}
      >
        <Icon icon={isRTL ? 'ph:minus-bold' : 'ph:plus-bold'} className="size-4" />
      </button>
    </div>
  );
}

export function ThemedSelect({ value, onChange }) {
  const { locale } = useContext(DataContext);

  const options = ['notify', 'roles', 'kick', 'ban'];

  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={onChange}
        className="block w-full appearance-none bg-[#1D1B45] text-white rounded px-3 py-2 pr-8 leading-tight focus:outline-none focus:border-[#71747e] text-[12px] md:text-[1rem]"
      >
        {options.map((option, index) => (
          <option key={index} value={option} className="text-white">
            {locale.protection.options[option]}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
}

export function WelcomeThemedSelect({ value, onChange, options }) {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={onChange}
        className="block w-full appearance-none bg-[#1D1B45] text-white rounded px-3 py-2 pr-8 leading-tight focus:outline-none focus:border-[#71747e] text-[12px] md:text-[1rem]"
      >
        {options.map((option, index) => (
          <option key={index} value={option.value} className="text-white">
            {option.name}
          </option>
        ))}
      </select>

      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
}

export function TimeInput({ timeValue, changeTimeValue }) {
  const { locale } = useContext(DataContext);
  const [timeUnit, setTimeUnit] = useState('seconds');
  const [inputValue, setInputValue] = useState(Math.floor(timeValue));

  const unitToSeconds = {
    seconds: 1,
    minutes: 60,
    hours: 3600,
    days: 86400,
  };

  const maxTimeInSeconds = 2419200; // 4 weeks

  useEffect(() => {
    changeTimeValue(inputValue * unitToSeconds[timeUnit]);
  }, [inputValue, timeUnit]);

  const handleUnitChange = (event) => {
    const newUnit = event.target.value;
    const newTimeInSeconds = inputValue * unitToSeconds[timeUnit];
    const newInputValue = Math.floor(newTimeInSeconds / unitToSeconds[newUnit]);

    setTimeUnit(newUnit);
    setInputValue(newInputValue);
  };

  const handleInputChange = (e) => {
    let value = Math.floor(Number(e.target.value));
    if (value < 0) return;

    const maxValue = Math.floor(maxTimeInSeconds / unitToSeconds[timeUnit]);
    setInputValue(Math.min(value, maxValue));
  };
  const isRTL = locale.getLanguage() === 'ar';
  return (
    <>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col items-end gap-3.5 text-base text-center whitespace-nowrap rounded border border-solid bg-[#1D1B45] border-[#1E1F22]"
      >
        <div className="flex items-center gap-2">
          <input
            className="my-auto text-zinc-200 bg-[#1D1B45] py-2 text-center outline-none rounded-l w-[5rem] lg:w-full"
            type="number"
            value={inputValue}
            onChange={handleInputChange}
          />
          <div className={`flex gap-2 text-white rounded-none bg-[#1D1B45] ${isRTL ? 'rounded-l' : 'rounded-r'}`}>
            <select
              value={timeUnit}
              onChange={handleUnitChange}
              className={`bg-[#242158] text-white p-2 outline-none ${isRTL ? 'rounded-l' : 'rounded-r'}`}
            >
              <option value="seconds">{locale.automod.input.option_1}</option>
              <option value="minutes">{locale.automod.input.option_2}</option>
              <option value="hours">{locale.automod.input.option_3}</option>
              <option value="days">{locale.automod.input.option_4}</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
