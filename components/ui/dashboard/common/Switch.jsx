import React, { useContext } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { DataContext } from '../../../../context';

const Switch = ({ active, onChange, size = 'md', disabled = false, loading = false }) => {
  const { locale } = useContext(DataContext);
  const isRTL = locale.getLanguage() === 'ar';

  const sizeClasses = {
    xs: 'w-[30px] h-[20px]', // New size
    sm: 'w-[40px] h-[25px]',
    md: 'w-[50px] h-[30px]',
    lg: 'w-[65px] h-[40px]',
  };

  const toggleSizeClasses = {
    xs: 'w-[13px] h-[13px]', // New size
    sm: 'w-[18px] h-[18px]',
    md: 'w-[23px] h-[23px]',
    lg: 'w-[30px] h-[30px]',
  };

  const translateXClasses = {
    xs: isRTL ? '-translate-x-2' : 'translate-x-2.5', // New translation
    sm: isRTL ? '-translate-x-3' : 'translate-x-3.5',
    md: isRTL ? '-translate-x-5' : 'translate-x-5',
    lg: isRTL ? '-translate-x-6' : 'translate-x-6',
  };

  const loadingSizeClasses = {
    xs: 'w-[14px] h-[12px]', // New size
    sm: 'w-[22px] h-[18px]',
    md: 'w-[28px] h-[23px]',
    lg: 'w-[35px] h-[30px]',
  };

  const loadingTranslateXClasses = {
    xs: isRTL ? '-translate-x-2' : 'translate-x-2.5', // New translation
    sm: isRTL ? '-translate-x-3.5' : 'translate-x-3.5',
    md: isRTL ? '-translate-x-[7px]' : 'translate-x-[7px]',
    lg: isRTL ? '-translate-x-[10px]' : 'translate-x-[10px]',
  };

  return (
    <div
      className={`relative flex items-center rounded-full p-1 cursor-pointer transition-colors duration-500 ${sizeClasses[size]} ${
        loading ? 'bg-gray-400' : active ? 'bg-[#5867A9]' : 'bg-slate-500'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={!disabled && !loading ? onChange : undefined}
    >
      <div
        className={`bg-white rounded-full shadow-md transform transition-transform flex items-center justify-center drop-shadow-xl ${
          loading ? loadingSizeClasses[size] : toggleSizeClasses[size]
        } ${loading ? loadingTranslateXClasses[size] : active ? translateXClasses[size] : ''}`}
      >
        {loading ? (
          <Icon icon={'eos-icons:three-dots-loading'} color={'#64748b'} className={'w-[65%]'} />
        ) : active ? (
          <Icon icon={'zondicons:checkmark'} color={'#5867A9'} className={'w-[65%]'} />
        ) : (
          <Icon icon={'ep:close-bold'} color={'#64748b'} className={'w-[65%]'} />
        )}
      </div>
    </div>
  );
};

export default Switch;
