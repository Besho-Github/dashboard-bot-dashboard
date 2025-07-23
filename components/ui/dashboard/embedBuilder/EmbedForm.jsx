import React, { useContext } from 'react';
import { Icon } from '@iconify/react';
import ColorPicker from '../general/ColorPicker';
import { DataContext } from '../../../../context';
import CustomCheckbox from '../common/checkBox';

export default function EmbedForm({
  embed,
  handleAddField,
  handleClearFields,
  handleChange,
  handleColorChange,
  handleFieldChange,
  handleRemoveField,
  handleImageUpload,
  handleImageRemove,
  loadingStates,
}) {
  const { locale } = useContext(DataContext);
  const isRTL = locale.getLanguage() === 'ar';

  return (
    <div className="max-w-2xl">
      <FormHeader />
      <div
        className="flex flex-col px-5 py-4 rounded-lg bg-zinc-800/95 border-opacity-70 border-l-4 border-solid lg:ml-12 shadow-lg transition-all duration-200 hover:bg-zinc-800"
        style={{ borderColor: embed.color }}
      >
        <div className="px-px max-md:max-w-full">
          <div className="flex gap-6 max-md:flex-col">
            <div className="flex flex-col w-[84%] max-md:w-full">
              <div className="flex flex-col grow text-sm">
                {/* Author Section */}
                <div className="flex gap-3 items-center">
                  {embed.author.icon_url ? (
                    <div className="relative group">
                      <div
                        style={{ backgroundImage: `url(${embed.author.icon_url})` }}
                        onClick={() => handleImageRemove('author')}
                        className="size-9 bg-contain bg-no-repeat bg-center cursor-pointer rounded-full border-2 border-zinc-700 transition-all duration-200 hover:border-zinc-600 hover:shadow-lg"
                      >
                        <div className="absolute -top-2 -right-2 bg-zinc-800 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Icon icon="ph:x-bold" className="size-3 text-zinc-400" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer group">
                      <div className="flex items-center justify-center size-9 rounded-full border-2 border-dashed border-zinc-700 transition-all duration-200 hover:border-zinc-500 hover:bg-zinc-700/30">
                        {loadingStates['author']?.upload ? (
                          <Icon icon="ri:loader-4-line" className="animate-spin text-white size-4" />
                        ) : (
                          <Icon icon="ph:plus-bold" className="size-4 text-zinc-500 group-hover:text-zinc-400" />
                        )}
                      </div>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'author')} className="hidden" />
                    </label>
                  )}
                  <input
                    type="text"
                    name="author.name"
                    value={embed.author.name}
                    onChange={handleChange}
                    placeholder={locale.embed.body.sec_2.authorName}
                    className="bg-transparent px-2 py-1.5 rounded-md hover:bg-zinc-700/20 focus:bg-zinc-700/30 transition-colors duration-200 outline-none text-white w-full"
                  />
                </div>

                {/* Title Input */}
                <input
                  type="text"
                  name="title"
                  value={embed.title}
                  onChange={handleChange}
                  placeholder={locale.embed.body.sec_2.title}
                  className="mt-4 text-lg font-semibold text-sky-500 bg-transparent px-2 py-1.5 rounded-md hover:bg-zinc-700/20 focus:bg-zinc-700/30 transition-colors duration-200 outline-none w-full"
                />

                {/* Description Textarea */}
                <textarea
                  name="description"
                  value={embed.description}
                  onChange={handleChange}
                  placeholder={locale.embed.body.sec_2.description}
                  className="mt-4 text-zinc-300 bg-transparent outline-none rounded-md border border-zinc-700 p-2.5 resize-none hover:border-zinc-600 focus:border-zinc-500 transition-colors duration-200 min-h-[100px]"
                />

                <ColorPicker selectedColor={embed.color} onChange={handleColorChange} />

                {/* Fields Section */}
                <div className="relative mt-8">
                  {/* Fields Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-zinc-200 font-medium flex items-center gap-2">
                      <Icon icon="ph:list-bold" className="size-4" />
                      {locale.embed.body.sec_2.fields}
                      <span className="text-xs text-zinc-500 font-normal">({embed.fields.length}/25)</span>
                    </h3>
                  </div>

                  {/* Fields Grid */}
                  <div className="grid grid-cols-1 gap-4">
                    {embed.fields.map((field, index) => (
                      <div
                        key={index}
                        className={`
                          group/field relative
                          ${field.inline ? 'sm:col-span-1' : 'sm:col-span-full'}
                          ${field.inline ? 'sm:w-full' : 'sm:w-full'}
                        `}
                      >
                        <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl overflow-hidden transition-all duration-200 hover:border-zinc-600/70 hover:shadow-lg hover:shadow-black/5 hover:bg-zinc-800/70">
                          {/* Field Header - Enhanced with better spacing */}
                          <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/30 border-b border-zinc-700/50">
                            <span className="text-xs font-medium text-zinc-400 flex items-center gap-2">
                              <Icon icon="ph:list-numbers" className="size-3.5" />
                              Field {index + 1}
                            </span>
                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-2 cursor-pointer group/checkbox">
                                <CustomCheckbox
                                  isChecked={field.inline}
                                  size={4}
                                  toggleCheckbox={(e) =>
                                    handleFieldChange(index, {
                                      target: { value: !field.inline, name: 'inline' },
                                    })
                                  }
                                />
                                <span className="text-xs text-zinc-400 group-hover/checkbox:text-zinc-300 transition-colors duration-200">
                                  {locale.embed.body.sec_2.inline}
                                </span>
                              </label>
                              <button
                                onClick={() => handleRemoveField(index)}
                                className="p-1.5 rounded-md text-zinc-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
                              >
                                <Icon icon="ph:trash-bold" className="size-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Field Content - Enhanced with better spacing and visual hierarchy */}
                          <div className="p-4 space-y-3.5">
                            <div className="relative">
                              <div className="absolute left-3 top-2.5 text-zinc-400">
                                <Icon icon="ph:text-t-bold" className="size-4" />
                              </div>
                              <input
                                type="text"
                                name="name"
                                value={field.name}
                                onChange={(e) => handleFieldChange(index, e)}
                                placeholder={locale.embed.body.sec_2.fieldName}
                                className="w-full bg-zinc-900/40 text-zinc-200 pl-10 pr-16 py-2.5 rounded-lg border border-transparent hover:border-zinc-700 focus:border-zinc-600 transition-all duration-200 outline-none placeholder-zinc-500"
                                maxLength={256}
                              />
                              <div className="absolute right-3 top-2.5 text-xs text-zinc-500 bg-zinc-900/50 px-2 py-0.5 rounded-md">
                                {field.name.length}/256
                              </div>
                            </div>

                            <div className="relative">
                              <div className="absolute left-3 top-3 text-zinc-400">
                                <Icon icon="ph:text-align-left-bold" className="size-4" />
                              </div>
                              <textarea
                                name="value"
                                value={field.value}
                                onChange={(e) => handleFieldChange(index, e)}
                                placeholder={locale.embed.body.sec_2.fieldValue}
                                className="w-full bg-zinc-900/40 text-zinc-300 pl-10 pr-3 py-2.5 rounded-lg border border-transparent hover:border-zinc-700 focus:border-zinc-600 transition-all duration-200 outline-none placeholder-zinc-500 resize-none min-h-[100px]"
                                maxLength={1024}
                              />
                              <div className="absolute right-3 bottom-2 text-xs text-zinc-500 bg-zinc-900/50 px-2 py-0.5 rounded-md">
                                {field.value.length}/1024
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail Section */}
            <div className="flex flex-col w-[16%] max-md:w-full">
              {!embed.thumbnail.url ? (
                <label className="cursor-pointer group">
                  <div className="flex flex-col size-[90px] rounded-lg border-2 border-dashed border-zinc-700 justify-center items-center transition-all duration-200 hover:border-zinc-500 hover:bg-zinc-700/30">
                    {loadingStates['thumbnail']?.upload ? (
                      <Icon icon="ri:loader-4-line" className="animate-spin text-white size-5" />
                    ) : (
                      <Icon icon="ph:plus-bold" className="size-5 text-zinc-500 group-hover:text-zinc-400" />
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'thumbnail')} className="hidden" />
                </label>
              ) : (
                <div className="relative group">
                  <div
                    style={{ backgroundImage: `url(${embed.thumbnail.url})` }}
                    className="size-[90px] bg-contain bg-no-repeat bg-center cursor-pointer rounded-lg border-2 border-zinc-700 transition-all duration-200 hover:border-zinc-600 hover:shadow-lg"
                    onClick={() => handleImageRemove('thumbnail')}
                  >
                    <div className="absolute -top-2 -right-2 bg-zinc-800 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icon icon="ph:x-bold" className="size-4 text-zinc-400" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 my-6">
          <button
            className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg text-white text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
            onClick={handleAddField}
          >
            <Icon icon="ph:plus-bold" className="size-4" />
            {locale.embed.body.sec_2.addField}
          </button>
          <button
            className="flex-1 py-2.5 px-4 border-2 border-red-500/70 hover:bg-red-500/10 active:bg-red-500/20 rounded-lg text-red-500 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
            onClick={handleClearFields}
          >
            <Icon icon="ph:trash-bold" className="size-4" />
            {locale.embed.body.sec_2.clearField}
          </button>
        </div>

        {/* Main Image Section */}
        {embed.image.url ? (
          <div className="relative group">
            <div
              style={{ backgroundImage: `url(${embed.image.url})` }}
              className="w-full h-[300px] bg-contain bg-no-repeat bg-center cursor-pointer rounded-lg border-2 border-zinc-700 transition-all duration-200 hover:border-zinc-600 hover:shadow-lg"
              onClick={() => handleImageRemove('image')}
            >
              <div className="absolute top-3 right-3 bg-zinc-800/90 rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                <Icon icon="ph:x-bold" className="size-4 text-zinc-400" />
                <span className="text-sm text-zinc-400">{locale.embed.body.sec_2.remove}</span>
              </div>
            </div>
          </div>
        ) : (
          <label className="cursor-pointer group">
            <div className="flex justify-center items-center py-12 rounded-lg border-2 border-dashed border-zinc-700 transition-all duration-200 hover:border-zinc-500 hover:bg-zinc-700/30">
              {loadingStates['image']?.upload ? (
                <Icon icon="ri:loader-4-line" className="animate-spin text-white size-6" />
              ) : (
                <div className="flex items-center gap-2 text-zinc-500 group-hover:text-zinc-400">
                  <Icon icon="ph:image-bold" className="size-6" />
                  <span className="text-sm font-medium">{locale.embed.body.sec_2.image}</span>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image')} className="hidden" />
          </label>
        )}

        {/* Footer Section */}
        <div className="flex gap-3 items-center mt-4">
          {embed.footer.icon_url ? (
            <div className="relative group">
              <div
                style={{ backgroundImage: `url(${embed.footer.icon_url})` }}
                onClick={() => handleImageRemove('footer')}
                className="size-6 bg-contain bg-no-repeat bg-center cursor-pointer rounded-full border border-zinc-700 transition-all duration-200 hover:border-zinc-600"
              >
                <div className="absolute -top-1 -right-1 bg-zinc-800 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Icon icon="ph:x-bold" className="size-2 text-zinc-400" />
                </div>
              </div>
            </div>
          ) : (
            <label className="cursor-pointer group">
              <div className="flex items-center justify-center size-6 rounded-full border border-dashed border-zinc-700 transition-all duration-200 hover:border-zinc-500 hover:bg-zinc-700/30">
                {loadingStates['footer']?.upload ? (
                  <Icon icon="ri:loader-4-line" className="animate-spin text-white size-3" />
                ) : (
                  <Icon icon="ph:plus-bold" className="size-3 text-zinc-500 group-hover:text-zinc-400" />
                )}
              </div>
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'footer')} className="hidden" />
            </label>
          )}
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <input
              type="text"
              name="footer.text"
              value={embed.footer.text}
              onChange={handleChange}
              placeholder={locale.embed.body.sec_2.footer}
              className="bg-transparent px-2 py-1 rounded hover:bg-zinc-700/20 focus:bg-zinc-700/30 transition-colors duration-200 outline-none w-[100px]"
            />
            <span className="text-zinc-700">•</span>
            <input
              type="datetime-local"
              name="timestamp"
              value={new Date(embed.timestamp).toISOString().slice(0, 16)}
              onChange={handleChange}
              className="bg-transparent px-2 py-1 rounded hover:bg-zinc-700/20 focus:bg-zinc-700/30 transition-colors duration-200 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
function FormHeader() {
  const { locale } = useContext(DataContext);
  const isRTL = locale.getLanguage() === 'ar';

  return (
    <div className="flex gap-2 items-start font-bold">
      <img
        loading="lazy"
        srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/2c10566467a8b17e70c6aad7152d0edc4f9a3d636551bcb2d191ef0a3bc280ab?apiKey=1eaf93c5924e4067a234e68e37b771e8&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/2c10566467a8b17e70c6aad7152d0edc4f9a3d636551bcb2d191ef0a3bc280ab?apiKey=1eaf93c5924e4067a234e68e37b771e8&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/2c10566467a8b17e70c6aad7152d0edc4f9a3d636551bcb2d191ef0a3bc280ab?apiKey=1eaf93c5924e4067a234e68e37b771e8&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/2c10566467a8b17e70c6aad7152d0edc4f9a3d636551bcb2d191ef0a3bc280ab?apiKey=1eaf93c5924e4067a234e68e37b771e8&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/2c10566467a8b17e70c6aad7152d0edc4f9a3d636551bcb2d191ef0a3bc280ab?apiKey=1eaf93c5924e4067a234e68e37b771e8&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/2c10566467a8b17e70c6aad7152d0edc4f9a3d636551bcb2d191ef0a3bc280ab?apiKey=1eaf93c5924e4067a234e68e37b771e8&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/2c10566467a8b17e70c6aad7152d0edc4f9a3d636551bcb2d191ef0a3bc280ab?apiKey=1eaf93c5924e4067a234e68e37b771e8&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/2c10566467a8b17e70c6aad7152d0edc4f9a3d636551bcb2d191ef0a3bc280ab?apiKey=1eaf93c5924e4067a234e68e37b771e8&"
        className="shrink-0 self-stretch w-10 aspect-square"
      />
      <div className="flex gap-1 whitespace-nowrap">
        <div className="grow my-auto text-base leading-5 text-gray-100">Wicks</div>
        <div
          className={`flex gap-0 justify-center text-sm leading-4 text-white uppercase bg-indigo-500 rounded pr-1 ${
            isRTL ? 'px-2' : 'px-px'
          }`}
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/7f8ef22966c50487e09cd116ee75a84c8b78d7f143fa28d21501f41bb2968fa0?apiKey=1eaf93c5924e4067a234e68e37b771e8&"
            className="shrink-0 w-4 aspect-square"
          />
          <div className="my-auto">{locale.embed.body.sec_2.app}</div>
        </div>
      </div>
      <div className="text-xs leading-5 text-zinc-400">13/06/2024 12:09</div>
    </div>
  );
}
