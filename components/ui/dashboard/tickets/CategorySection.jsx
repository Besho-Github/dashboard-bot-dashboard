import React from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import MemoizedCategory from './Category';

export default function CategorySection({
  locale,
  categories,
  channels,
  roles,
  customEmojis,
  handleChannelType,
  handleInputChange,
  handleSelectChange,
  handleRemoveCategory,
  handleColorChange,
  handleEmojiChange,
  handleCategoryImageChange,
  handleCategoryImageRemove,
  uploadingCategory,
  errors,
  onAddCategory,
  guild,
}) {
  return (
    <div className="flex flex-col px-5">
      <div className="w-full text-sm font-bold tracking-wide leading-5 text-gray-400 uppercase max-md:max-w-full">
        {locale.tickets.Sec_4.title}
      </div>
      <div className="flex flex-col self-center mt-6 w-full max-w-[660px] max-md:max-w-full">
        {categories.map((category, index) => (
          <MemoizedCategory
            key={index}
            index={index}
            category={category}
            channels={channels}
            roles={roles}
            handleChannelType={handleChannelType}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleRemoveCategory={handleRemoveCategory}
            handleColorChange={handleColorChange}
            handleEmojiChange={handleEmojiChange}
            handleCategoryImageChange={handleCategoryImageChange}
            handleCategoryImageRemove={handleCategoryImageRemove}
            customEmojis={customEmojis}
            uploading={uploadingCategory === index}
            error={errors[index] || null}
            guild={guild}
          />
        ))}
        <div
          onClick={onAddCategory}
          className="relative group flex justify-center items-center px-16 py-6 mt-2.5 w-full text-xl font-bold text-indigo-400 rounded-2xl border-2 border-dashed border-zinc-700 max-md:px-5 max-md:max-w-full cursor-pointer hover:bg-indigo-500 hover:border-indigo-400 hover:text-white active:bg-indigo-500 active:border-indigo-600 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all"
        >
          <div className="flex gap-1.5 items-center">
            <Icon icon={'ph:plus-circle-fill'} className="transition-transform duration-200 group-hover:rotate-90" />
            <div className="my-auto">{locale.tickets.add}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
