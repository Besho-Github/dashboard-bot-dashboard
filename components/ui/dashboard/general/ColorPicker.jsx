import { Icon } from '@iconify/react';
import React, { useContext } from 'react';
import { getContrastColor } from '../../../../utils';
import { useRouter } from 'next/router';
import { DataContext } from '../../../../context';

export default function ColorPicker({ selectedColor, onChange }) {
  const { locale } = useContext(DataContext);
  const isRTL = locale.getLanguage() === 'ar';
  const colors = [
    '#1ABC9C',
    '#2ECC71',
    '#3498DB',
    '#9B59B6',
    '#E91E63',
    '#F1C40F',
    '#E67E22',
    '#E74C3C',
    '#95A5A6',
    '#607D8B',
    '#11806A',
    '#1F8B4C',
    '#206694',
    '#71368A',
    '#AD1457',
    '#C27C0E',
    '#A84300',
    '#992D22',
    '#979C9F',
    '#546E7A',
  ];

  const handleColorSelect = (color) => {
    onChange(color);
  };

  return (
    <div className="flex">
      <div
        className="mr-2 mt-2 relative w-[66px] h-[50px] rounded-[4px] border-[0.89px] border-solid border-[#ffffff1a]"
        style={{ backgroundColor: selectedColor }}
      >
        <Icon
          className="absolute w-[14px] h-[14px] top-[5px] left-[45px] transition-colors duration-500"
          icon={'fa-solid:eye-dropper'}
          style={{ color: getContrastColor(selectedColor) }}
        />
        <input
          type="color"
          className="appearance-none h-full rounded-[4px] cursor-pointer opacity-0 w-[4rem]"
          value={selectedColor}
          onChange={(e) => handleColorSelect(e.target.value)}
        />
      </div>
      <div className={`color-container flex flex-wrap ${isRTL ? '' : '-mr-2'} box-border max-w-[300px]`} role="list" tabIndex="0">
        {colors.map((color) => (
          <div
            key={color}
            className="color-swatch flex items-center justify-center rounded mt-2 mr-2 w-[20px] h-[20px] box-border cursor-pointer"
            style={{ backgroundColor: color }}
            onClick={() => handleColorSelect(color)}
            role="listitem"
            tabIndex="0"
            aria-label={color}
          >
            {selectedColor === color && <Icon icon={'iconamoon:check-light'} height="16" width="16" />}
          </div>
        ))}
      </div>
    </div>
  );
}
