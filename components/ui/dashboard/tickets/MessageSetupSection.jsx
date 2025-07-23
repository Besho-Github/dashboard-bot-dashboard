import React, { useState, useRef, useContext } from 'react';
import { Icon } from '@iconify/react';
import Checkbox from '../common/checkBox';
import { GuildDataContext } from '@/context/guild';

export default function MessageSetupSection({
  locale,
  categories,
  channels,
  selectedSetupChannel,
  sendingSetup,
  onCategoryToggle,
  onChannelChange,
  onSendSetup,
  hasUnsavedChanges,
}) {
  const { isPremium } = useContext(GuildDataContext);
  // Simple array of selected category names
  const [selectedCategoryNames, setSelectedCategoryNames] = useState([]);
  const [customBackground, setCustomBackground] = useState(null);
  const [customLine, setCustomLine] = useState(null);
  const [dragOver, setDragOver] = useState({ background: false, line: false });
  const [showPreview, setShowPreview] = useState({ background: false, line: false });
  const backgroundInputRef = useRef(null);
  const lineInputRef = useRef(null);

  // Filter only text channels (for message posting)
  const textChannels = channels?.filter((channel) => channel.type === 0 || channel.type === 5);

  // Handle category toggle with improved animation
  const handleCategoryToggle = (categoryName) => {
    if (hasUnsavedChanges) return;

    setSelectedCategoryNames((prev) => {
      // Check if the category is already selected
      const isSelected = prev.includes(categoryName);

      // If selected, remove it; otherwise, add it
      const newSelection = isSelected ? prev.filter((name) => name !== categoryName) : [...prev, categoryName];

      // Pass selected names to parent
      onCategoryToggle(newSelection);

      return newSelection;
    });
  };

  // Handle drag and drop
  const handleDragOver = (e, fileType) => {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, [fileType]: true }));
  };

  const handleDragLeave = (e, fileType) => {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, [fileType]: false }));
  };

  const handleDrop = (e, fileType) => {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, [fileType]: false }));

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        if (fileType === 'background') {
          setCustomBackground(file);
        } else if (fileType === 'line') {
          setCustomLine(file);
        }
      }
    }
  };

  // Handle file uploads with validation
  const handleFileChange = (e, fileType) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(locale?.tickets?.messageSetup?.invalidFileType || 'Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(locale?.tickets?.messageSetup?.fileTooLarge || 'File size must be less than 5MB');
        return;
      }

      if (fileType === 'background') {
        setCustomBackground(file);
      } else if (fileType === 'line') {
        setCustomLine(file);
      }
    }
  };

  // Clear file selections
  const clearFileSelection = (fileType) => {
    if (fileType === 'background') {
      setCustomBackground(null);
      if (backgroundInputRef.current) backgroundInputRef.current.value = '';
    } else if (fileType === 'line') {
      setCustomLine(null);
      if (lineInputRef.current) lineInputRef.current.value = '';
    }
  };

  // Toggle preview
  const togglePreview = (fileType) => {
    setShowPreview((prev) => ({ ...prev, [fileType]: !prev[fileType] }));
  };

  // Disable send button if no channel or categories selected
  const isSendDisabled = !selectedSetupChannel || selectedCategoryNames.length === 0 || sendingSetup || hasUnsavedChanges;

  // Handle send with additional files
  const handleSend = () => {
    onSendSetup({
      customBackground,
      customLine,
    });
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Icon icon="mdi:message-settings" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{locale?.tickets?.messageSetup?.title || 'Message Setup'}</h2>
            <p className="text-sm text-gray-400">
              {locale?.tickets?.messageSetup?.description || 'Configure and send ticket setup messages to your server channels'}
            </p>
          </div>
          {!isPremium && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 rounded-full">
              <Icon icon="mdi:crown" className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-medium text-amber-300">Premium</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Card */}
      <div
        className={`relative bg-gradient-to-br from-[#0d1226] to-[#0a0f1f] p-8 rounded-2xl border border-[#282b38] shadow-2xl backdrop-blur-sm ${
          !isPremium ? 'pointer-events-none' : ''
        }`}
      >
        {/* Premium Lock Overlay */}
        {!isPremium && (
          <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon icon="mdi:crown" className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Premium Feature</h3>
              <p className="text-gray-300 mb-6 max-w-md">
                Message Setup is a premium feature. Upgrade to Premium to configure and send custom ticket setup messages to your server.
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105">
                Upgrade to Premium
              </button>
            </div>
          </div>
        )}

        <div className={!isPremium ? 'opacity-20' : ''}>
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  selectedSetupChannel ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'
                }`}
              >
                <Icon icon="mdi:check" className="w-4 h-4" />
              </div>
              <div
                className={`h-1 w-16 rounded-full transition-all duration-300 ${selectedSetupChannel ? 'bg-green-500' : 'bg-gray-600'}`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  selectedCategoryNames.length > 0 ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'
                }`}
              >
                <Icon icon="mdi:check" className="w-4 h-4" />
              </div>
              <div
                className={`h-1 w-16 rounded-full transition-all duration-300 ${
                  selectedCategoryNames.length > 0 ? 'bg-green-500' : 'bg-gray-600'
                }`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  !isSendDisabled ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'
                }`}
              >
                <Icon icon="mdi:send" className="w-4 h-4" />
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {selectedSetupChannel && selectedCategoryNames.length > 0
                ? locale?.tickets?.messageSetup?.readyToSend || 'Ready to send'
                : locale?.tickets?.messageSetup?.setupRequired || 'Setup required'}
            </div>
          </div>

          {/* Channel Selection */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Icon icon="mdi:pound" className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-semibold text-white">
                {locale?.tickets?.messageSetup?.channelTitle || 'Select channel for setup message'}
              </h3>
            </div>
            <div className="relative group">
              <select
                className="w-full bg-[#131836] border border-[#282b38] rounded-xl p-4 text-white appearance-none cursor-pointer transition-all duration-300 hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                value={selectedSetupChannel || ''}
                onChange={(e) => onChannelChange(e.target.value)}
                disabled={hasUnsavedChanges}
              >
                <option value="" disabled>
                  {locale?.tickets?.messageSetup?.selectChannel || 'Select a channel'}
                </option>
                {textChannels?.map((channel) => (
                  <option key={channel.id} value={channel.id}>
                    # {channel.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <Icon icon="mdi:chevron-down" className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 transition-colors" />
              </div>
              {selectedSetupChannel && (
                <div className="absolute -top-2 -right-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          </div>

          {/* Custom File Uploads */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Icon icon="mdi:image-multiple" className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                {locale?.tickets?.messageSetup?.customImagesTitle || 'Custom Images (Optional)'}
              </h3>
            </div>

            <div className={`relative`}>
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6`}>
                {/* Custom Background */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-300">
                      {locale?.tickets?.messageSetup?.customBackgroundLabel || 'Background Image'}
                    </p>
                    {customBackground && (
                      <button
                        onClick={() => togglePreview('background')}
                        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        {showPreview.background ? 'Hide Preview' : 'Show Preview'}
                      </button>
                    )}
                  </div>

                  <div
                    className={`relative border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                      dragOver.background
                        ? 'border-indigo-400 bg-indigo-500/10'
                        : customBackground
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-[#282b38] hover:border-indigo-400 hover:bg-[#131836]'
                    }`}
                    onDragOver={(e) => handleDragOver(e, 'background')}
                    onDragLeave={(e) => handleDragLeave(e, 'background')}
                    onDrop={(e) => handleDrop(e, 'background')}
                    onClick={() => backgroundInputRef.current?.click()}
                  >
                    <input
                      ref={backgroundInputRef}
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      onChange={(e) => handleFileChange(e, 'background')}
                      disabled={hasUnsavedChanges}
                    />
                    <div className="flex flex-col items-center text-center">
                      <Icon
                        icon={customBackground ? 'mdi:check-circle' : 'mdi:cloud-upload'}
                        className={`w-8 h-8 mb-2 ${customBackground ? 'text-green-400' : 'text-gray-400'}`}
                      />
                      <p className="text-sm font-medium mb-1">
                        {customBackground
                          ? customBackground.name
                          : locale?.tickets?.messageSetup?.dragDropImage || 'Drag & drop or click to select'}
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                    </div>

                    {customBackground && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearFileSelection('background');
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-full transition-colors"
                        disabled={hasUnsavedChanges}
                      >
                        <Icon icon="mdi:close" className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {customBackground && showPreview.background && (
                    <div className="mt-3 p-3 bg-[#0a0f1f] rounded-lg border border-[#282b38]">
                      <img
                        src={URL.createObjectURL(customBackground)}
                        alt="Background preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                {/* Custom Line */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-300">{locale?.tickets?.messageSetup?.customLineLabel || 'Line Image'}</p>
                    {customLine && (
                      <button
                        onClick={() => togglePreview('line')}
                        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        {showPreview.line ? 'Hide Preview' : 'Show Preview'}
                      </button>
                    )}
                  </div>

                  <div
                    className={`relative border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                      dragOver.line
                        ? 'border-indigo-400 bg-indigo-500/10'
                        : customLine
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-[#282b38] hover:border-indigo-400 hover:bg-[#131836]'
                    }`}
                    onDragOver={(e) => handleDragOver(e, 'line')}
                    onDragLeave={(e) => handleDragLeave(e, 'line')}
                    onDrop={(e) => handleDrop(e, 'line')}
                    onClick={() => lineInputRef.current?.click()}
                  >
                    <input
                      ref={lineInputRef}
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      onChange={(e) => handleFileChange(e, 'line')}
                      disabled={hasUnsavedChanges}
                    />
                    <div className="flex flex-col items-center text-center">
                      <Icon
                        icon={customLine ? 'mdi:check-circle' : 'mdi:cloud-upload'}
                        className={`w-8 h-8 mb-2 ${customLine ? 'text-green-400' : 'text-gray-400'}`}
                      />
                      <p className="text-sm font-medium mb-1">
                        {customLine ? customLine.name : locale?.tickets?.messageSetup?.dragDropImage || 'Drag & drop or click to select'}
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                    </div>

                    {customLine && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearFileSelection('line');
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-full transition-colors"
                        disabled={hasUnsavedChanges}
                      >
                        <Icon icon="mdi:close" className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {customLine && showPreview.line && (
                    <div className="mt-3 p-3 bg-[#0a0f1f] rounded-lg border border-[#282b38]">
                      <img src={URL.createObjectURL(customLine)} alt="Line preview" className="w-full h-16 object-cover rounded-lg" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Category Selection */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Icon icon="mdi:tag-multiple" className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-semibold text-white">
                  {locale?.tickets?.messageSetup?.categoriesTitle || 'Select categories to include'}
                </h3>
              </div>
              {categories?.length > 0 && (
                <div className="text-sm text-gray-400">
                  {selectedCategoryNames.length} / {categories.length} selected
                </div>
              )}
            </div>

            {categories?.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {categories.map((category, index) => (
                    <div
                      key={category.id}
                      className={`group relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
                        selectedCategoryNames.includes(category.name)
                          ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20'
                          : 'border-[#1f2230] bg-[#080d1e] hover:bg-[#0f1428] hover:border-[#2a2d3a]'
                      }`}
                      onClick={() => handleCategoryToggle(category.name)}
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
                            style={{ backgroundColor: category.color || '#4f46e5' }}
                          >
                            <Icon icon="mdi:tag" className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <span className="font-medium text-white">{category.name}</span>
                            <p className="text-xs text-gray-400 mt-1">{category.description || 'Ticket category'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {selectedCategoryNames.includes(category.name) && (
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                          )}
                          <Checkbox
                            isChecked={selectedCategoryNames.includes(category.name)}
                            toggleCheckbox={(e) => {
                              e.stopPropagation();
                              handleCategoryToggle(category.name);
                            }}
                            id={`category-${category.id}`}
                            disabled={hasUnsavedChanges}
                          />
                        </div>
                      </div>

                      {/* Selection indicator */}
                      {selectedCategoryNames.includes(category.name) && (
                        <div className="absolute inset-0 border-2 border-indigo-400 rounded-xl pointer-events-none animate-pulse"></div>
                      )}
                    </div>
                  ))}
                </div>

                {selectedCategoryNames.length > 0 && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <Icon icon="mdi:information" className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-blue-300 font-medium mb-1">Selected Categories</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedCategoryNames.map((name, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400 bg-[#080d1e] rounded-xl border border-[#1f2230]">
                <Icon icon="mdi:tag-off" className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                <p className="text-lg font-medium mb-2">No Categories Available</p>
                <p className="text-sm">{locale?.tickets?.messageSetup?.noCategories || 'Add categories first to continue.'}</p>
              </div>
            )}
          </div>

          {/* Send Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSend}
              disabled={isSendDisabled}
              className={`relative px-8 py-4 rounded-xl font-medium transition-all duration-300 flex items-center space-x-3 ${
                isSendDisabled
                  ? 'bg-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
              }`}
            >
              {sendingSetup ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{locale?.tickets?.messageSetup?.sending || 'Sending...'}</span>
                </>
              ) : (
                <>
                  <Icon icon="mdi:rocket-launch" className="w-5 h-5" />
                  <span>{locale?.tickets?.messageSetup?.send || 'Send Setup Message'}</span>
                </>
              )}

              {!isSendDisabled && !sendingSetup && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
              )}
            </button>
          </div>

          {/* Warning Messages */}
          {hasUnsavedChanges && (
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/40 rounded-xl">
              <div className="flex items-start space-x-3">
                <Icon icon="mdi:alert-circle" className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <p className="text-amber-300 font-medium">
                    {locale?.tickets?.messageSetup?.saveChangesWarning || 'Please save your changes before sending the setup message.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
