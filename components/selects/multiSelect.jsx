import React, { useContext } from 'react';
import Select from 'react-select';
import { Icon } from '@iconify/react/dist/iconify.js';
import { decimalToHexColor } from '../../utils';
import { DataContext } from '../../context';

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    background: 'linear-gradient(to bottom right, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
    color: 'white',
    borderColor: '#10152f',
    opacity: state.isDisabled ? 0.5 : 1,
  }),
  input: (provided) => ({
    ...provided,
    color: 'white',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#111214',
    borderColor: '#202225',
    padding: '10px 0',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#b9bbbe',
  }),
  valueContainer: (css, state) => ({
    ...css,
    display: 'flex',
    flexWrap: state.isMulti ? 'wrap' : 'nowrap',
    padding: '5px 10px',
    gap: '2px',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#c1c6ce',
  }),
  multiValue: (base) => ({
    ...base,
    background: '#2b2d33',
  }),
  menuList: (provided) => ({
    ...provided,
    '::-webkit-scrollbar': {
      width: '0px',
    },
    '::-webkit-scrollbar-track': {
      background: '#2f3136',
    },
    '::-webkit-scrollbar-thumb': {
      background: '#5865f2',
    },
  }),
  option: (provided) => ({
    ...provided,
    backgroundColor: '#2b2d33',
  }),
};

const transformChannels = (channels) => {
  const categories = channels.filter((channel) => channel.type === 4);
  const textChannels = channels.filter((channel) => channel.type === 0);
  const options = [
    ...categories.map((category) => ({
      label: category.name,
      type: category.type,
      value: category.id,
      options: [],
    })),
    {
      label: 'Other',
      type: 4,
      value: null,
      options: [],
    },
  ];

  textChannels.forEach((channel) => {
    const parentChannel = options.find((opt) => opt.value === channel.parent_id || opt.value == null);
    parentChannel.options.push({
      label: channel.name,
      type: channel.type,
      value: channel.id,
      parent: channel.parent_id,
    });
  });
  return options;
};

const CustomOption = ({ innerProps, data, isSelected, ...props }) => {
  console.log(props);
  const optionStyles = props.getStyles('option', props);
  return (
    <div {...innerProps} className={`flex items-center pl-3 pr-[1.25rem] py-1 cursor-pointer ${isSelected && 'bg-[#343A5D]'}`}>
      <div
        className={`flex items-center gap-1.5 px-2 py-1 text-sm rounded-sm ml-2 text-[#dbdee1] overflow-hidden`}
        style={{ background: optionStyles.backgroundColor }}
      >
        {data.icon && <Icon icon={getIcon(10)} color={data.icon} />}
        <Icon icon={getIcon(data.type)} color={data.color && decimalToHexColor(data.color)} />
        <span className="truncate">{data.label}</span>
      </div>
    </div>
  );
};

const MultiValue = ({ data, ...rest }) => {
  const multiValueStyles = rest.getStyles('multiValue', rest);
  const { language } = useContext(DataContext);
  const isRTL = language === 'ar';

  return (
    <div className="inline-flex mr-1">
      <div
        className="grid grid-cols-[auto_minmax(0,1fr)_auto] text-sm rounded-sm text-[#dbdee1]"
        style={{ background: multiValueStyles.background }}
      >
        <div className={`flex items-center justify-center px-2 py-1`}>
          <Icon icon={getIcon(data.type)} color={data.color && decimalToHexColor(data.color)} />
        </div>
        <div className="py-1 overflow-hidden">
          <span className="truncate block">{data.label}</span>
        </div>
        <div
          className="hover:bg-[#561c1f] flex items-center justify-center px-2 py-1 rounded-r-sm cursor-pointer transition-colors duration-250"
          onClick={() => rest.removeProps.onClick()}
        >
          <Icon icon={'material-symbols:close'} />
        </div>
      </div>
    </div>
  );
};

const getIcon = (type) => {
  switch (type) {
    case 0:
      return 'mdi:hashtag';
    case 10:
      return 'ic:sharp-circle';
    case 4:
      return 'material-symbols:folder';
    default:
      return null;
  }
};

const CustomSingleValue = ({ children, data, innerProps }) => {
  const { language } = useContext(DataContext);
  const isRTL = language === 'ar';

  return (
    <div {...innerProps} className="items-center gap-1 flex">
      {data.icon && <Icon icon={getIcon(10)} color={data.icon} className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
      <Icon icon={getIcon(data.type)} color={data.color && decimalToHexColor(data.color)} />
      <span className="truncate">{children}</span>
    </div>
  );
};

const DiscordStyledMultiSelect = ({ options, onChange, value, disabled, type = 'channels', components = null, theme = null, ...props }) => {
  const transformOptions = (options) => {
    switch (type) {
      case 'channels':
        return transformChannels(options.filter((option) => !value.includes(option.id)));
      case 'roles':
        return options
          .filter((r) => r.name != '@everyone')
          .map((role) => ({
            label: role.name,
            value: role.id,
            color: role.color,
            type: 10,
          }));
      case 'categories':
        return options
          .filter((category) => category.type === 4)
          .map((category) => ({
            label: category.name,
            value: category.id,
            type: category.type,
          }));
      default:
        return options;
    }
  };

  const transformedOptions = transformOptions(options);
  const getCurrentValues = () => {
    switch (type) {
      case 'channels':
        return options
          .filter((channel) => value.includes(channel.id))
          .map((channel) => ({ label: channel.name, value: channel.id, type: channel.type }));
      case 'roles':
        return options
          .filter((role) => value.includes(role.id))
          .map((role) => ({ label: role.name, value: role.id, color: role.color, type: 10 }));
      case 'categories':
        return options
          .filter((category) => value.includes(category.id) && category.type === 4)
          .map((category) => ({ label: category.name, value: category.id, type: category.type }));
      default:
        return options.filter((option) => option.value == value);
    }
  };
  const { locale } = useContext(DataContext);
  return (
    <Select
      isDisabled={disabled}
      placeholder={type === 'channels' ? locale.logs.channels : type === 'roles' ? locale.logs.roles : 'Enter categories...'}
      isMulti={true}
      onChange={onChange}
      options={transformedOptions}
      styles={{ ...customStyles, ...theme }}
      components={{
        ...components,
        Option: CustomOption,
        MultiValue,
        SingleValue: CustomSingleValue,
        IndicatorSeparator: null,
      }}
      value={getCurrentValues()}
      {...props}
    />
  );
};

export default DiscordStyledMultiSelect;

export { customStyles, CustomOption, CustomSingleValue };
