import React, { useContext } from 'react';
import { Icon } from '@iconify/react';
import { DataContext } from '../../../../context';

const FileUpload = ({ attachment, onFileChange, onRemoveAttachment, error, uploading }) => {
  const { locale } = useContext(DataContext);

  return (
    <div className="flex flex-col gap-1 w-full max-w-full mb-2.5">
      <div className="w-full text-xs font-bold tracking-wide leading-4 text-gray-400 uppercase">{locale.autoreply.attachment}</div>

      {/* Main upload area - fixed height */}
      <div
        className={`
        w-full h-[100px] mt-2 rounded-lg border-2 border-dashed transition-all duration-300
        ${attachment ? 'border-gray-600 bg-gray-800' : 'border-gray-600 hover:border-gray-400'}
        ${error ? 'border-red-500' : ''}
      `}
      >
        <input type="file" id="backgroundImageInputEdit" onChange={onFileChange} className="hidden" />

        <div className="flex items-center justify-center h-full p-3">
          {attachment ? (
            // Compact preview area
            <div className="flex items-center gap-3">
              <img src={attachment} className="size-10 rounded-lg object-cover" alt="Attachment preview" />
              <div className="flex flex-col">
                <button onClick={onRemoveAttachment} className="text-xs text-red-400 hover:text-red-300 transition-colors mt-0.5">
                  {locale.autoreply.removeFile}
                </button>
              </div>
            </div>
          ) : (
            // Compact upload prompt
            <label htmlFor="backgroundImageInputEdit" className="cursor-pointer">
              <div className="flex flex-col items-center gap-1.5">
                {uploading ? (
                  <Icon icon={'eos-icons:three-dots-loading'} className="text-[#ffffffa3] size-[32px]" />
                ) : (
                  <>
                    <Icon icon={'mdi:file-image-add-outline'} className="size-6 text-gray-400" />
                    <div className="text-xs text-gray-300">
                      <span className="text-primary-400 hover:text-primary-300">{locale.autoreply.chooseFile}</span>
                    </div>
                    <p className="text-[10px] text-gray-500">PNG, JPG up to 5MB</p>
                  </>
                )}
              </div>
            </label>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-1.5 text-red-500 text-xs mt-1">
          <Icon icon="mdi:alert-circle" className="size-3.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
export default FileUpload;
