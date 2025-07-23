import React, { useContext, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Checkbox from '../ui/dashboard/common/checkBox';
import InputField from '../ui/dashboard/autoreply/InputField';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Tooltip } from 'react-tooltip';
import { GuildDataContext } from '../../context/guild';
import SaveBar from '../ui/dashboard/common/SaveBar';
import { api } from '../../utils/api';
import DiscordStyledMultiSelect from '../selects/multiSelect';
import RangeInput from '../ui/dashboard/common/RangeInput';
import { DataContext } from '../../context';
import Head from 'next/head';

export default function Apply() {
  const { locale, language } = useContext(DataContext);
  const isRTL = language == 'ar';
  const { guild, roles, channels } = useContext(GuildDataContext);
  const [data, setData] = useState(JSON.parse(JSON.stringify(guild.apply)));
  const [settings, setSettings] = useState({
    hasUnsavedChanges: false,
    saving: false,
    warn: false,
  });
  const [errorFields, setErrorFields] = useState({}); // State for tracking fields with errors
  const firstErrorRef = useRef(null);

  // Handle description change
  const handleDescriptionChange = (e) => {
    setData({ ...data, description: e.target.value });
    setSettings({ ...settings, hasUnsavedChanges: true });
    setErrorFields({ ...errorFields, description: false }); // Clear error for description
  };

  // Handle question change
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = data.questions.map((question, i) => (i === index ? { ...question, [field]: value } : question));
    setData({ ...data, questions: updatedQuestions });
    setSettings({ ...settings, hasUnsavedChanges: true });

    // Clear error for this question
    if (errorFields.questions) {
      const updatedErrorFields = { ...errorFields };
      updatedErrorFields.questions[index] = false;
      setErrorFields(updatedErrorFields);
    }
  };

  // Handle adding a new question
  const handleAddQuestion = () => {
    if (data.questions.length < 5) {
      setData({
        ...data,
        questions: [...data.questions, { text: '', isParagraph: false, isRequired: false, isCollapsed: false }],
      });
      setSettings({ ...settings, hasUnsavedChanges: true });
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (section, field) => {
    setData({
      ...data,
      [section]: {
        ...data[section],
        [field]: !data[section][field],
      },
    });
    setSettings({ ...settings, hasUnsavedChanges: true });
  };

  // Handle deleting a question
  const handleDeleteQuestion = (index) => {
    const updatedQuestions = data.questions.filter((_, i) => i !== index);
    setData({ ...data, questions: updatedQuestions });
    setSettings({ ...settings, hasUnsavedChanges: true });
  };

  // Handle collapse/extend toggle
  const handleToggleCollapse = (index) => {
    const updatedQuestions = data.questions.map((question, i) =>
      i === index ? { ...question, isCollapsed: !question.isCollapsed } : question
    );
    setData({ ...data, questions: updatedQuestions });
    setSettings({ ...settings, hasUnsavedChanges: true });
  };

  // Handle drag and drop
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(data.questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setData({ ...data, questions: items });
    setSettings({ ...settings, hasUnsavedChanges: true });
  };

  // Reset changes function
  const onReset = () => {
    setData(guild.apply);
    setSettings({ hasUnsavedChanges: false, saving: false });
    setErrorFields({});
  };

  // Prepare data for save by removing 'isCollapsed'
  const prepareDataForSave = () => {
    const preparedData = {
      ...data,
      questions: data.questions.map(({ _id, isCollapsed, ...rest }) => rest),
    };
    return preparedData;
  };

  // Validate data before save
  const validateData = () => {
    let errors = {};
    let hasErrors = false;

    if (!data.description.trim()) {
      errors.description = true;
      hasErrors = true;
    }

    const questionErrors = data.questions.map((question) => !question.text.trim());
    if (questionErrors.includes(true)) {
      errors.questions = questionErrors;
      hasErrors = true;
    }

    setErrorFields(errors);
    return hasErrors;
  };

  // Save changes function
  const onSave = async () => {
    const hasErrors = validateData();
    if (hasErrors) {
      firstErrorRef.current?.scrollIntoView({ behavior: 'smooth' });
      setSettings({ ...settings, warn: true });
      return;
    }

    setSettings({ ...settings, saving: true });
    try {
      const preparedData = prepareDataForSave();
      const response = await api.post(`/guilds/${guild.id}/apply`, preparedData);
      if (response.status === 200) {
        setSettings({ hasUnsavedChanges: false, saving: false });
        guild.apply = preparedData;
        setErrorFields({});
      }
    } catch (error) {
      console.error('Error saving data:', error);
      setSettings({ ...settings, saving: false });
      // Handle additional error scenarios as needed
    }
  };

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <Head>
        <title>{locale.apply.title}</title>
      </Head>

      <header className="p-2.5 border-b border-[#3d4049] text-xl font-semibold flex items-center justify-between">
        <h1>{locale.apply.title}</h1>
      </header>

      <div className="bg-[#060A1B] p-5 rounded-lg mb-[100px] mt-3 shadow-lg">
        {/* Description Section */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-500/10 p-2 rounded-lg">
              <Icon icon="mdi:text-box-outline" className="text-indigo-400 w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-gray-100 uppercase">{locale.apply.descriptionTitle}</h2>
          </div>

          <textarea
            className={`w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-lg bg-[#1D1B45] min-h-[84px] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
              errorFields.description ? 'border-2 border-red-500' : ''
            }`}
            value={data.description}
            onChange={handleDescriptionChange}
            ref={errorFields.description ? firstErrorRef : null}
          />
        </div>

        {/* Questions Section */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-500/10 p-2 rounded-lg">
              <Icon icon="mdi:frequently-asked-questions" className="text-emerald-400 w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-gray-100 uppercase">{locale.apply.questionsTitle}</h2>
          </div>

          <div className="text-sm font-bold leading-none text-gray-400 mb-6">{locale.apply.questionsSubtitle}</div>

          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="questions">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-4">
                  {data.questions.map((question, index) => (
                    <Draggable key={`question-${index}`} draggableId={`question-${index}`} index={index}>
                      {(provided, snapshot) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex flex-col px-3.5 pt-3 pb-5 w-full font-bold rounded-xl bg-[#1D1B45] ${
                            errorFields.questions && errorFields.questions[index] ? 'border-2 border-red-500/50' : ''
                          } ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                        >
                          <div className="flex justify-between items-center text-xs uppercase text-zinc-400">
                            <div className="flex gap-2 cursor-move" {...provided.dragHandleProps}>
                              <Icon icon="mdi:drag" className="text-gray-500 size-5" />
                              <div>
                                {locale.apply.questionLabel} {index + 1}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Tooltip
                                id="deleteQuestion"
                                className="text-white text-sm font-normal normal-case"
                                style={{ borderRadius: '5px', background: '#111214' }}
                              />
                              <Icon
                                data-tooltip-id="deleteQuestion"
                                data-tooltip-content={locale.apply.deleteQuestionTooltip}
                                icon="mdi:trash-can-outline"
                                className="cursor-pointer text-gray-500 size-5 hover:text-red-400 transition-colors duration-200"
                                onClick={() => handleDeleteQuestion(index)}
                              />
                              <Icon
                                icon={question.isCollapsed ? 'iconamoon:arrow-up-2-bold' : 'iconamoon:arrow-down-2-bold'}
                                className="cursor-pointer text-gray-500 size-5 hover:text-gray-300 transition-colors duration-200"
                                onClick={() => handleToggleCollapse(index)}
                              />
                            </div>
                          </div>

                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <input
                              className={`w-full px-4 py-3 mt-4 text-sm font-medium text-gray-300 rounded-lg bg-[#121331] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 ${
                                errorFields.questions && errorFields.questions[index] ? 'border-2 border-red-500' : ''
                              }`}
                              maxLength={45}
                              value={question.text}
                              onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                              style={{ display: question.isCollapsed ? 'none' : 'block' }}
                              placeholder="Enter question..."
                            />

                            <div
                              className="px-3 mt-2 text-xl rounded-lg text-zinc-200"
                              style={{ display: question.isCollapsed ? 'block' : 'none' }}
                            >
                              {question.text || locale.apply.noQuestionText}
                            </div>

                            <div className="flex gap-7 mt-4" style={{ display: question.isCollapsed ? 'none' : 'flex' }}>
                              <div className="flex gap-2 items-center">
                                <Checkbox
                                  isChecked={question.isParagraph}
                                  toggleCheckbox={() => handleQuestionChange(index, 'isParagraph', !question.isParagraph)}
                                />
                                <span className="text-sm text-gray-400">{locale.apply.paragraphLabel}</span>
                              </div>
                              <div className="flex gap-2 items-center">
                                <Checkbox
                                  isChecked={question.isRequired}
                                  toggleCheckbox={() => handleQuestionChange(index, 'isRequired', !question.isRequired)}
                                />
                                <span className="text-sm text-gray-400">{locale.apply.requiredLabel}</span>
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {data.questions.length < 5 && (
            <motion.div
              onClick={handleAddQuestion}
              className="relative group flex justify-center items-center px-4 sm:px-16 py-4 sm:py-6 w-full text-base sm:text-xl font-bold text-indigo-400 rounded-2xl border-2 border-dashed border-indigo-500/20 cursor-pointer overflow-hidden mt-4"
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
            >
              <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/10 transition-all duration-300"></div>
              <div className="flex gap-1.5 items-center">
                <Icon
                  icon="ph:plus-circle-fill"
                  className="transition-transform duration-300 group-hover:rotate-90 group-hover:text-indigo-300 text-xl sm:text-2xl"
                />
                <span className="group-hover:text-indigo-300 transition-colors duration-300">{locale.apply.addQuestionButton}</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Actions Section - Grid with Accept and Reject settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Accept Settings */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-500/10 p-2 rounded-lg">
                <Icon icon="mdi:check-circle" className="text-green-400 w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-gray-100 uppercase">{locale.apply.onAcceptTitle}</h2>
            </div>

            <div className="space-y-4">
              {/* DM Settings */}
              <div>
                <div className="flex gap-2 items-center mb-2">
                  <Checkbox isChecked={data.onAccept.sendDM} toggleCheckbox={() => handleCheckboxChange('onAccept', 'sendDM')} />
                  <span className="text-sm text-gray-400">{locale.apply.sendDMLabel}</span>
                </div>
                <InputField
                  disabled={!data.onAccept.sendDM}
                  styles={{ opacity: !data.onAccept.sendDM ? 0.5 : 1 }}
                  bgColor="#232428"
                  value={data.onAccept.dmMessage}
                  onChange={(e) => {
                    setData({ ...data, onAccept: { ...data.onAccept, dmMessage: e.target.value } });
                    setSettings({ ...settings, hasUnsavedChanges: true });
                  }}
                />
              </div>

              {/* Role Settings */}
              <div>
                <div className="flex gap-2 items-center mb-2">
                  <Checkbox isChecked={data.onAccept.addRole} toggleCheckbox={() => handleCheckboxChange('onAccept', 'addRole')} />
                  <span className="text-sm text-gray-400">{locale.apply.addRoleLabel}</span>
                </div>
                <DiscordStyledMultiSelect
                  type="roles"
                  options={roles}
                  disabled={!data.onAccept.addRole}
                  onChange={(e) => {
                    setData({ ...data, onAccept: { ...data.onAccept, role: e.value } });
                    setSettings({ ...settings, hasUnsavedChanges: true });
                  }}
                  value={data.onAccept.role || ''}
                  isMulti={false}
                />
              </div>
            </div>
          </div>

          {/* Reject Settings */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-500/10 p-2 rounded-lg">
                <Icon icon="mdi:close-circle" className="text-red-400 w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-gray-100 uppercase">{locale.apply.onRejectTitle}</h2>
            </div>

            <div className="space-y-4">
              {/* DM Settings */}
              <div>
                <div className="flex gap-2 items-center mb-2">
                  <Checkbox isChecked={data.onReject.sendDM} toggleCheckbox={() => handleCheckboxChange('onReject', 'sendDM')} />
                  <span className="text-sm text-gray-400">{locale.apply.sendDMLabel}</span>
                </div>
                <InputField
                  disabled={!data.onReject.sendDM}
                  styles={{ opacity: !data.onReject.sendDM ? 0.5 : 1 }}
                  bgColor="#232428"
                  value={data.onReject.dmMessage}
                  onChange={(e) => {
                    setData({ ...data, onReject: { ...data.onReject, dmMessage: e.target.value } });
                    setSettings({ ...settings, hasUnsavedChanges: true });
                  }}
                />
              </div>

              {/* Role Settings */}
              <div>
                <div className="flex gap-2 items-center mb-2">
                  <Checkbox isChecked={data.onReject.addRole} toggleCheckbox={() => handleCheckboxChange('onReject', 'addRole')} />
                  <span className="text-sm text-gray-400">{locale.apply.addRoleLabel}</span>
                </div>
                <DiscordStyledMultiSelect
                  type="roles"
                  options={roles}
                  disabled={!data.onReject.addRole}
                  onChange={(e) => {
                    setData({ ...data, onReject: { ...data.onReject, role: e.value } });
                    setSettings({ ...settings, hasUnsavedChanges: true });
                  }}
                  value={data.onReject.role || ''}
                  isMulti={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Logs Section */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <Icon icon="mdi:text-box-search" className="text-blue-400 w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-gray-100 uppercase">{locale.apply.logsTitle}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Icon icon="mdi:pound" className="text-gray-400 w-5 h-5" />
                <h3 className="text-xs font-bold uppercase text-gray-400">{locale.apply.logChannelLabel}</h3>
              </div>
              <DiscordStyledMultiSelect
                type="channels"
                options={channels}
                onChange={(e) => {
                  setData({ ...data, logChannel: e.value });
                  setSettings({ ...settings, hasUnsavedChanges: true });
                }}
                value={data.logChannel || ''}
                isMulti={false}
              />
            </div>
          </div>
        </div>

        {/* Cooldown Section */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-500/10 p-2 rounded-lg">
              <Icon icon="mdi:timer" className="text-purple-400 w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-gray-100 uppercase">{locale.apply.cooldownTitle}</h2>
          </div>

          <RangeInput
            onChange={(e) => {
              setData({ ...data, cooldown: e });
              setSettings({ ...settings, hasUnsavedChanges: true });
            }}
            value={data.cooldown}
            labels={{
              minLabel: locale.apply.cooldownMinLabel,
              maxLabel: locale.apply.cooldownMaxLabel,
              minutesLabel: locale.apply.minutesLabel,
              hoursLabel: locale.apply.hoursLabel,
            }}
            cooldownDescription={locale.apply.cooldownDescription}
            isRTL={isRTL}
          />
        </div>
      </div>

      <SaveBar
        hasUnsavedChanges={settings.hasUnsavedChanges}
        saving={settings.saving}
        onSave={onSave}
        onReset={onReset}
        warn={settings.warn}
      />
    </motion.section>
  );
}
