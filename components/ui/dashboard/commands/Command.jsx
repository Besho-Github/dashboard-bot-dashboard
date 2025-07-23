import { Icon } from '@iconify/react/dist/iconify.js';
import Switch from '../common/Switch';
import { motion } from 'framer-motion';

const Command = ({ name, description, active, icon, editCommand, changeSwitch, loading }) => {
  return (
    <div className="group relative overflow-hidden backdrop-blur-sm border border-white/5 bg-gradient-to-br from-white/[0.03] to-white/[0.05] rounded-2xl p-5 hover:border-white/10 transition-all duration-300 m-2">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5">
            <img src={icon} className="w-5 h-5" />
          </div>

          <div className="flex flex-col">
            <span className="text-base font-medium text-white/90">/{name}</span>
            <span className="text-sm text-white/70 md:text-clip md:whitespace-normal truncate max-w-[70px] sm:max-w-[350px] lg:max-w-none">
              {description}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Switch active={active} loading={loading} onChange={() => changeSwitch(name, !active)} />

          <motion.button
            onClick={() => editCommand(name)}
            className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5 hover:border-indigo-500/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon icon="solar:pen-2-bold" className="w-4 h-4 text-indigo-300" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Command;
