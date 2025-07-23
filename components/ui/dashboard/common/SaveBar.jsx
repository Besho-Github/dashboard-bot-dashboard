import React, { useState, useEffect, useContext } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { motion } from 'framer-motion';
import { DataContext } from '../../../../context';

const SaveBar = ({ onSave, onReset, hasUnsavedChanges, saving, warn = false }) => {
  const [warning, setWarn] = useState(warn);
  const [visible, setVisible] = useState(hasUnsavedChanges);
  const [render, setRender] = useState(hasUnsavedChanges);
  const { locale } = useContext(DataContext);

  useEffect(() => {
    if (hasUnsavedChanges) {
      setRender(true);
      setVisible(true);
    } else {
      setVisible(false);
      const timeout = setTimeout(() => setRender(false), 500); // Match duration to CSS transition
      return () => clearTimeout(timeout);
    }
  }, [hasUnsavedChanges]);
  useEffect(() => {
    if (warn) {
      setWarn(true);
      setTimeout(() => setWarn(false), 500);
    }
  }, [warn]);

  return (
    <>
      {render && (
        <motion.div
          className={`fixed bottom-4 md:left-[30%] transform -translate-x-1/2 w-11/12 max-w-2xl p-4 rounded-lg shadow-lg flex justify-between items-center text-white z-50 transition-opacity transition-color duration-500 ${
            visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          } ${warning ? 'bg-[#f84044] animate-shake' : 'bg-[#0c122d]'}`}
          animate={{ y: visible ? [200, 0] : [0, 200] }}
        >
          <div className="flex items-center flex-shrink">
            <Icon icon={'f7:exclamationmark-circle'} className="h-6 w-6 text-yellow-400" />
            <span className="mx-2 md:mx-4 truncate w-[4rem] md:w-full text-sm md:text-base">{locale.savebar.alart}</span>
          </div>
          <div className="flex gap-1 md:gap-2 flex-shrink-0">
            <button
              onClick={onReset}
              className="px-2 md:px-4 py-2 rounded text-white hover:underline text-sm md:text-base whitespace-nowrap"
            >
              {locale.savebar.btn_1}
            </button>
            <button
              className={`flex flex-col justify-center items-center py-[2px] px-2 md:px-[16px] h-[38px] w-[60px] md:w-[80px] bg-indigo-500 rounded hover:bg-indigo-600 transition-colors duration-300 font-normal text-sm md:text-base ${
                saving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={onSave}
              disabled={saving}
            >
              <div className="flex justify-center items-center">
                {saving ? <Icon icon={'eos-icons:three-dots-loading'} className="text-[#ffffffa3] size-[38px]" /> : locale.savebar.btn_2}
              </div>
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default SaveBar;
