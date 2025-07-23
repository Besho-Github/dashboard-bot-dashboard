import React, { useState, useContext } from 'react';
import { Icon } from '@iconify/react';
import { DataContext } from '../../../../context';
import { motion } from 'framer-motion';

const Reply = ({ reply, onEdit, onDelete, deleting }) => {
  const { locale } = useContext(DataContext);

  return (
    <div className="group relative overflow-hidden backdrop-blur-sm border border-white/5 bg-gradient-to-br from-white/[0.03] to-white/[0.05] rounded-2xl p-5 hover:border-white/10 transition-all duration-300 mb-4 last:mb-0">
      {/* Glass Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-4">
          {/* Trigger with Icon */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5">
              <Icon icon="mdi:message-reply-text" className="w-5 h-5 text-indigo-300" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-medium text-white/90 truncate">{reply.trigger}</h3>
            </div>
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <ActionButtons onEdit={onEdit} onDelete={onDelete} deleting={reply._id === deleting} locale={locale} />
          </div>
        </div>

        {/* Response Types */}
        <div className="flex flex-wrap items-center gap-2">
          {reply.message && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
              <Icon icon="mdi:message-text" className="w-4 h-4 text-indigo-300" />
              <span className="text-sm text-white/70 truncate max-w-[200px]">{reply.message}</span>
            </div>
          )}

          {reply.embed && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
              <Icon icon="mdi:code-json" className="w-4 h-4 text-purple-300" />
              <span className="text-sm text-white/70">{locale.autoreply.useEmbed}</span>
            </div>
          )}

          {reply.attachment && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
              <Icon icon="mdi:image" className="w-4 h-4 text-emerald-300" />
              <img loading="lazy" src={reply.attachment} alt="Preview" className="w-4 h-4 rounded-md object-cover" />
            </div>
          )}
        </div>

        {/* Action Buttons - Mobile */}
        <div className="sm:hidden flex flex-col w-full gap-2">
          <ActionButtons onEdit={onEdit} onDelete={onDelete} deleting={deleting} locale={locale} />
        </div>
      </div>
    </div>
  );
};

// Separated ActionButtons component for cleaner code
const ActionButtons = ({ onEdit, onDelete, deleting, locale }) => (
  <>
    <motion.button
      onClick={onEdit}
      className="group/btn relative px-4 py-2 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5 hover:border-indigo-500/20 w-full sm:w-auto"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative flex items-center justify-center sm:justify-start gap-2">
        <Icon icon="solar:pen-2-bold" className="w-4 h-4 text-indigo-300" />
        <span className="text-sm font-medium text-indigo-300">{locale.autoreply.edit}</span>
      </div>
    </motion.button>

    <motion.button
      onClick={onDelete}
      className="group/btn relative px-4 py-2 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-white/5 hover:border-red-500/20 w-full sm:w-auto"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative flex items-center justify-center sm:justify-start gap-2">
        {deleting ? (
          <div className="w-[72px] flex justify-center">
            <Icon icon="eos-icons:three-dots-loading" className="w-4 h-4 text-red-300" />
          </div>
        ) : (
          <>
            <Icon icon="solar:trash-bin-trash-bold" className="w-4 h-4 text-red-300" />
            <span className="text-sm font-medium text-red-300">{locale.autoreply.delete}</span>
          </>
        )}
      </div>
    </motion.button>
  </>
);

export default Reply;
