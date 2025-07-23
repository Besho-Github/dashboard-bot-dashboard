import Head from 'next/head';
import Switch from '../ui/dashboard/common/Switch';
import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react/dist/iconify.js';
import { api } from '../../utils/api';
import { GuildDataContext } from '../../context/guild';
import { automodRules } from '../../utils';
import Rule from '../ui/dashboard/automod/Rule';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataContext } from '../../context';
import { useParams } from 'next/navigation';

export default function AutoMod() {
  const { guild, channels, roles } = useContext(GuildDataContext);
  const { locale } = useContext(DataContext);

  const [state, setState] = useState({
    rules: [],
    default: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/guilds/${guild.id}/automod`).then(({ data }) => {
      let Data = data.filter((rule) => rule.name.includes('Wicks'));
      setState({
        rules: Data,
        default: Data,
      });
      setLoading(false);
    });
  }, []);

  const changeRuleSettings = (id, updatedRule) => {
    setState((prevState) => ({
      ...prevState,
      rules: prevState.rules.map((rule) => (rule.id === id ? { ...rule, ...updatedRule } : rule)),
    }));
  };

  const Reset = () => {
    setState((prevState) => ({
      ...prevState,
      rules: prevState.default,
    }));
  };

  return (
    <>
      <Head>
        <title>{locale.automod.pageTitle}</title>
      </Head>
      <header className="p-2.5 border-b border-[#3d4049] text-xl font-semibold">
        <h1>{locale.automod.title}</h1>
      </header>
      <div className="bg-[#060A1B] p-5 rounded mt-3 gap-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Icon icon="eos-icons:three-dots-loading" className="w-12 h-12 text-indigo-400 mb-4" />
            <p className="text-white/70 text-lg">{locale.automod.loading || 'Loading...'}</p>
          </div>
        ) : (
          automodRules.map((rule) => (
            <AutoModRule
              key={rule.id}
              autoMod={state.rules}
              name={rule.name}
              icon={rule.icon}
              changeRuleSettings={changeRuleSettings}
              id={rule.id}
              setState={setState}
              channels={channels}
              roles={roles}
              Reset={Reset}
              actions={rule.actions}
              inputs={rule.inputs}
              state={state}
            />
          ))
        )}
      </div>
      <ToastContainer />
    </>
  );
}

function AutoModRule({ autoMod, name, icon, id, setState, channels, roles, changeRuleSettings, Reset, actions, inputs, state }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [saving, setSaving] = useState(false);

  const rule = autoMod.find((r) => r.name.toLowerCase().includes(name.toLowerCase()));

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const { id: guildId } = useParams();
  const Save = (id) => {
    setSaving(id);
    const data = state.rules.find((rule) => rule.id == id);
    api
      .patch(`/guilds/${guildId}/automod/${id}`, {
        actions: data.actions,
        exempt_roles: data.exempt_roles,
        exempt_channels: data.exempt_channels,
        trigger_metadata: data.trigger_metadata,
      })
      .then(() => {
        setSaving(false);
        setIsCollapsed(true);
      });
  };

  const Setup = () => {
    setLoading(true);
    api
      .post(`/guilds/${guildId}/automod/setup`, { rule: id })
      .then(({ data }) => {
        setState((prevState) => ({
          ...prevState,
          rules: [...autoMod, data],
          default: [...prevState.default, data],
        }));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        toast.error(
          <>
            <strong>reached maximum number of rules.</strong>
            <br /> Please remove an existing rule to add a new one.
          </>,
          {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
            transition: Bounce,
          }
        );
      });
  };

  const toggle = () => {
    setToggled(true);
    api
      .patch(`/guilds/${guildId}/automod/${rule.id}`, {
        enabled: !rule.enabled,
      })
      .then(() => {
        setToggled(false);
        setState((prevState) => ({
          ...prevState,
          rules: prevState.rules.map((r) => (r.id === rule.id ? { ...r, enabled: !r.enabled } : r)),
        }));
      })
      .catch(() => {
        setToggled(false);
      });
  };
  const { locale } = useContext(DataContext);

  return (
    <div className="group relative overflow-hidden backdrop-blur-sm border border-white/5 bg-gradient-to-br from-white/[0.03] to-white/[0.05] rounded-2xl p-5 hover:border-white/10 transition-all duration-300 mb-4">
      {/* <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
       */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5">
            <img src={icon} className="w-5 h-5" alt={name} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-medium text-white/90">{locale.automod[id].name}</h3>
            <p className="text-sm text-white/70 text-ellipsis overflow-hidden md:text-clip md:whitespace-normal truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px] lg:max-w-none">
              {locale.automod[id].action}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {rule ? (
            <>
              <Switch active={rule.enabled} onChange={toggle} loading={toggled} />
              <motion.button
                onClick={toggleCollapse}
                className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5 hover:border-indigo-500/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon icon={isCollapsed ? 'mdi:chevron-down' : 'mdi:chevron-up'} className="w-4 h-4 text-indigo-300" />
              </motion.button>
            </>
          ) : (
            <motion.button
              className="px-4 py-2 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5 hover:border-indigo-500/20 transition-all"
              onClick={Setup}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? (
                <Icon icon="eos-icons:three-dots-loading" className="w-5 h-5 text-indigo-300" />
              ) : (
                <span className="text-sm font-medium text-white/90">{locale.automod.setup}</span>
              )}
            </motion.button>
          )}
        </div>
      </div>

      <motion.div initial={false} animate={{ height: isCollapsed ? 0 : 'auto' }} transition={{ duration: 0.3 }} className="overflow-hidden">
        {rule && (
          <>
            <div className="w-full h-px bg-[#3d4049] my-4" />
            <Rule
              saving={saving}
              rule={rule}
              channels={channels}
              roles={roles}
              changeRuleSettings={changeRuleSettings}
              Reset={Reset}
              Save={Save}
              actions={actions}
              inputs={inputs}
              setIsCollapsed={setIsCollapsed}
            />
          </>
        )}
      </motion.div>
    </div>
  );
}
