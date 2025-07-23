import React, { useContext } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { DataContext } from '../../../../context';

export default function BigSwitch({ isOn, toggleSwitch }) {
  const { locale } = useContext(DataContext);

  const isRTL = locale.getLanguage() == 'ar';

  return (
    <div
      className={`main-container w-[150px] h-[31.6px] ${
        isOn ? 'bg-[#5866a8]' : 'bg-[#64748b]'
      } rounded-[20px] relative overflow-hidden my-0 cursor-pointer transition-colors duration-500 flex items-center justify-start`}
      onClick={toggleSwitch}
    >
      {!isOn ? (
        <Icon icon={'zondicons:checkmark'} color={'#ffffff'} className={`${isRTL ? 'mr-[calc(70%)]' : 'ml-[calc(70%)]'}`} />
      ) : (
        <Icon icon={'ep:close-bold'} color={'#ffffff'} className={`${isRTL ? 'mx-[calc(20%)]' : 'mx-[calc(20%)]'}`} />
      )}

      <div
        className={`w-[49.47%] h-[97.47%] bg-[#fff] rounded-[18px] absolute top-[1.27%] ${
          isOn ? (isRTL ? 'right-[calc(50%)]' : 'left-[calc(50%)]') : isRTL ? 'right-[1px]' : 'left-[1px]'
        } shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] transition-all duration-300 flex justify-center items-center`}
      >
        {isOn ? (
          <Icon icon={'zondicons:checkmark'} color={'#5866a8'} className={'w-[65%]'} />
        ) : (
          <Icon icon={'ep:close-bold'} color={'#64748b'} className={'w-[65%]'} />
        )}
      </div>
    </div>
  );
}
