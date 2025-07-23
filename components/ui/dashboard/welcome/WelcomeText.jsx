import { Icon } from '@iconify/react/dist/iconify.js';
import { NumberInput } from '../../../selects/Inputs';
import { getContrastColor } from '../../../../utils';
import { useContext } from 'react';
import { DataContext } from '../../../../context';
import CustomCheckbox from '../common/checkBox';

export default function WelcomeText({ state, handleElementChange }) {
  const { welcome_text } = state;

  const handleTextChange = (e) => {
    handleElementChange('welcome_text', { content: e.target.value });
  };

  const handleWidthChange = (value) => {
    handleElementChange('welcome_text', {
      size: {
        ...welcome_text.size,
        width: Number(parseFloat(value).toFixed(2)),
      },
    });
  };

  const handleFontSizeChange = (value) => {
    handleElementChange('welcome_text', {
      size: {
        ...welcome_text.size,
        font_size: Number(parseFloat(value).toFixed(2)),
      },
    });
  };

  const handleTopChange = (value) => {
    handleElementChange('welcome_text', {
      position: {
        ...welcome_text.position,
        top: Number(parseFloat(value).toFixed(2)),
      },
    });
  };

  const handleLeftChange = (value) => {
    handleElementChange('welcome_text', {
      position: {
        ...welcome_text.position,
        left: Number(parseFloat(value).toFixed(2)),
      },
    });
  };

  const handleColorChange = (e) => {
    handleElementChange('welcome_text', { color: e.target.value });
  };

  const handleEnabledChange = (e) => {
    handleElementChange('welcome_text', { enabled: +!welcome_text.enabled });
  };

  const { locale } = useContext(DataContext);
  const isRTL = locale.getLanguage() === 'ar';

  return (
    <div className="flex flex-col p-5">
      <div className="my-3 flex items-center">
        <label htmlFor="welcomeTextEnabled" className="cursor-pointer flex items-center">
          <CustomCheckbox isChecked={welcome_text.enabled} toggleCheckbox={handleEnabledChange} className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
          <span className="text-sm font-medium text-gray-400">{locale.welcome.sec_5.checkbox}</span>
        </label>
      </div>

      <div className="w-full text-xs font-semibold leading-4 uppercase text-zinc-400">{locale.welcome.sec_5.inputTitle}</div>

      <input
        className="px-3 py-3 mt-3 text-sm font-medium leading-4 text-gray-400 rounded-sm bg-[#1D1B45] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        type="text"
        value={welcome_text.content}
        placeholder="Enter text here"
        onChange={handleTextChange}
      />

      <div className="mt-5 w-full">
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1">
            <div className="text-xs font-semibold leading-4 uppercase text-zinc-400 mb-2">{locale.welcome.sec_5.text_1}</div>
            <NumberInput value={welcome_text.size.width} onChange={handleWidthChange} className="mb-4" />
            <div className="text-xs font-semibold leading-4 uppercase text-zinc-400 mb-2">{locale.welcome.sec_5.text_4}</div>
            <NumberInput value={welcome_text.size.font_size} onChange={handleFontSizeChange} />
          </div>

          <div className="flex-1">
            <div className="text-xs font-semibold leading-4 uppercase text-zinc-400 mb-2">{locale.welcome.sec_5.text_2}</div>
            <NumberInput value={welcome_text.position.top} onChange={handleTopChange} className="mb-4" />
            <div className="text-xs font-semibold leading-4 uppercase text-zinc-400 mb-2">{locale.welcome.sec_5.text_5}</div>
            <NumberInput value={welcome_text.position.left} onChange={handleLeftChange} />
          </div>

          <div className="flex-1">
            <div className="text-xs font-semibold leading-4 uppercase text-zinc-400 mb-2">{locale.welcome.sec_5.text_3}</div>
            <div className="relative h-8 rounded border border-solid border-white/10 mt-2" style={{ backgroundColor: welcome_text.color }}>
              <Icon
                className="absolute w-4 h-4 top-1.5 right-2.5"
                icon={'fa-solid:eye-dropper'}
                style={{ color: getContrastColor(welcome_text.color) }}
              />
              <input
                type="color"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                value={welcome_text.color}
                onChange={handleColorChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
