import React from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { TRANSPARENT } from '../../../../utils';

export default function LineSection({ locale, line, uploading, handleFileChange, removeImage }) {
  return (
    <div className="flex flex-wrap gap-5 justify-between items-start w-full md:flex-nowrap">
      <div className="flex flex-col flex-1 self-start px-5 mt-1 text-sm">
        <div className="font-bold tracking-wide text-gray-400 uppercase leading-[1.44]">{locale.tickets.Sec_2.title}</div>
        <label className="self-start items-center flex justify-center px-4 py-2 mt-4 font-medium text-white rounded bg-gradient-to-br from-indigo-500/10 to-purple-500/10 cursor-pointer h-[36px] w-[170px] ">
          <span>
            {uploading ? (
              <Icon icon={'eos-icons:three-dots-loading'} className="text-[#ffffffa3] size-[38px]" />
            ) : (
              locale.tickets.Sec_2.btn_1
            )}
          </span>
          <input type="file" accept="image/gif, image/jpeg, image/png" className="hidden" onChange={handleFileChange} />
        </label>
      </div>
      <div className="flex flex-col px-5 text-xs font-semibold leading-3 whitespace-nowrap md:max-w-[400px] md:flex-grow">
        <img
          loading="lazy"
          src={line || TRANSPARENT}
          className="w-full rounded border border-solid aspect-[5/1] border-slate-800"
          alt="Line"
        />
        <div className="self-center mt-4 cursor-pointer text-[#aeb1c2]" onClick={removeImage}>
          {locale.tickets.remove}
        </div>
      </div>
    </div>
  );
}
