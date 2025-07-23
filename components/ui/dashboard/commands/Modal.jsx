import { useContext, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import Rodal from 'rodal';
import { DataContext } from '../../../../context';

const Modal = ({ show, onClose, onSave, title, children, saving }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('keydown', handleEsc);
    } else {
      document.removeEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [show, onClose]);

  const { locale } = useContext(DataContext);

  return (
    <Rodal visible={show} onClose={onClose} duration={200} leaveAnimation="fade" closeOnEsc showCloseButton={false} height={'auto'}>
      <div className="bg-[#060A1B] rounded shadow flex flex-col justify-center items-start h-full">
        <div className="w-full px-4 pt-[15.22px] pb-4 rounded-tl rounded-tr flex justify-start items-center">
          <div className="w-8 h-6 pr-2" />
          <div className="pb-[0.78px] flex flex-col justify-start items-start">
            <div className="text-gray-100 text-2xl font-normal leading-[30px]">{title || 'New Trigger'}</div>
          </div>
          <div className="w-8 px-1 py-[3.22px] opacity-50 rounded-[3px] flex justify-center items-center">
            <div className="pb-[3.56px] bg-black/opacity-0 flex flex-col justify-start items-center">
              <div className="w-6 h-6 p-1 flex justify-center items-center" />
            </div>
          </div>
        </div>
        <div className="w-full grow px-4 rounded-tl-[5px] rounded-tr-[5px] flex flex-col justify-start items-start gap-4">
          <div className="w-full pb-4 flex justify-center items-start flex flex-col">{children}</div>
        </div>
        <div className="w-full flex justify-end px-4 py-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-bl-[5px] rounded-br-[5px] shadow-inner flex justify-start items-start">
          <button
            className="flex flex-col justify-center px-5 py-1 rounded transition-colors duration-300 hover:underline font-normal"
            onClick={onClose}
          >
            <div className="justify-center py-1">{locale.modal.cancel}</div>
          </button>
          <button
            className="flex flex-col justify-center items-center py-[2px] px-[16px] h-[38px] w-[80px] bg-indigo-500 rounded hover:bg-indigo-600 transition-colors duration-300 font-normal"
            onClick={onSave}
            disabled={saving}
          >
            <div className="flex justify-center items-center">
              {saving ? <Icon icon={'eos-icons:three-dots-loading'} className="text-[#ffffffa3] size-[38px]" /> : locale.modal.save}
            </div>
          </button>
        </div>
      </div>
    </Rodal>
  );
};

export default Modal;
