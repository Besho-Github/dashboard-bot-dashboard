import React from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { TRANSPARENT } from '../../../../utils';

export default function BackgroundSection({ locale, background, uploading, handleFileChange, removeImage }) {
  return (
    <div className="flex flex-wrap gap-5 w-full text-gray-400 md:flex-nowrap">
      <div className="flex flex-col flex-1 self-start px-5 mt-1 text-sm">
        <div className="font-bold tracking-wide uppercase leading-[1.44]">{locale.tickets.Sec_1.title}</div>
        <div className="mt-3.5 leading-[1.59]">
          {locale.tickets.Sec_1.p_1}
          <br />
          {locale.tickets.Sec_1.p_2}
          <br />
          {locale.tickets.Sec_1.p_3}
        </div>
        <label className="self-start items-center flex justify-center px-4 py-2 mt-4 font-medium text-white rounded bg-gradient-to-br from-indigo-500/10 to-purple-500/10 cursor-pointer h-[36px] w-[170px] ">
          <span>
            {uploading ? (
              <Icon icon={'eos-icons:three-dots-loading'} className="text-[#ffffffa3] size-[38px]" />
            ) : (
              locale.tickets.Sec_1.btn_1
            )}
          </span>
          <input type="file" accept="image/gif, image/jpeg, image/png" className="hidden" onChange={handleFileChange} />
        </label>
      </div>
      <div className="flex flex-col px-5 text-xs font-semibold leading-3 whitespace-nowrap md:max-w-[400px] md:flex-grow">
        <img
          loading="lazy"
          src={background || TRANSPARENT}
          className="w-full rounded border border-solid aspect-[16/9] border-slate-800"
          alt="Background"
        />
        <div className="self-center mt-4 cursor-pointer text-[#aeb1c2]" onClick={removeImage}>
          {locale.tickets.remove}
        </div>
      </div>
    </div>
  );
}
