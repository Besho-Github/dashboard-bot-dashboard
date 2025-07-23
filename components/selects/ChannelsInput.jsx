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
    padding: '12px',
    paddingTop: '8px',
    paddingBottom: '16px',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#b9bbbe',
  }),
  valueContainer: (css) => ({
    ...css,
    display: 'flex',
    flexWrap: 'wrap',
    padding: '5px 10px',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#c1c6ce',
  }),
  multiValue: (base) => ({
    ...base,
    background: '#2b2d33',
  }),
  groupHeading: (provided) => ({
    ...provided,
    backgroundColor: '#2b2d33',
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
    display: 'flex',
    gap: '8px',
    flexDirection: 'column',
  }),
  option: (provided) => ({
    ...provided,
    backgroundColor: '#2b2d33',
  }),
};

const transformChannels = (channels) => {
  const categories = channels.filter((channel) => channel.type === 4);
  const textChannels = channels.filter((channel) => channel.type === 0);

  const options = [];

  // Loop through each category and its channels
  categories.forEach((category) => {
    // Add the category itself
    options.push({
      label: category.name,
      type: category.type,
      value: category.id,
    });

    // Add the channels that belong to this category
    textChannels.forEach((channel) => {
      if (channel.parent_id === category.id) {
        options.push({
          label: `${channel.name}`, // Indent or mark channels for visual hierarchy
          type: channel.type,
          value: channel.id,
          parent: channel.parent_id,
        });
      }
    });
  });

  // Handle channels without a category (Other)
  const otherChannels = textChannels.filter((channel) => !channel.parent_id);

  // Add a placeholder for 'Other' category
  if (otherChannels.length > 0) {
    options.push({
      label: 'Other',
      type: 4,
      value: 'Other',
    });
  }

  // Add channels without a category
  otherChannels.forEach((channel) => {
    options.push({
      label: `${channel.name}`,
      type: channel.type,
      value: channel.id,
      parent: channel.parent_id,
    });
  });

  return options;
};

const CustomOption = ({ innerProps, data, isSelected, ...props }) => {
  return (
    <div {...innerProps} className={`flex items-center pr-[1.25rem] cursor-pointer ${isSelected && 'bg-[#343A5D]'}`}>
      <div
        className={`flex items-center gap-1 px-2 py-1 text-sm rounded bg-[#232528] text-[#dbdee1] overflow-hidden ${
          data.type == 0 ? 'ml-3' : ''
        }`}
      >
        <Icon icon={getIcon(data.type)} color={data.color && decimalToHexColor(data.color)} className="size-5 text-[#9AA0AA]" />
        <span className={`truncate ${data.type == 0 ? '' : 'uppercase font-bold'}`}>{data.label}</span>
      </div>
    </div>
  );
};

const MultiValue = ({ data, ...rest }) => {
  const multiValueStyles = rest.getStyles('multiValue', rest);
  const { language } = useContext(DataContext);
  const isRTL = language === 'ar';

  return (
    <div className="flex items-center">
      <div className={`flex text-sm rounded-sm ml-2 text-[#dbdee1] items-stretch`} style={{ background: multiValueStyles.background }}>
        <div className={`flex items-center ${isRTL ? 'mr-2' : 'ml-2'}`}>
          <Icon icon={getIcon(data.type)} color={data.color && decimalToHexColor(data.color)} />
        </div>
        <div className="mx-2 my-1">
          <span className="whitespace-nowrap">{data.label}</span>
        </div>
        <div
          className="hover:bg-[#561c1f] flex items-center rounded-r-sm cursor-pointer transition-colors duration-250"
          onClick={() => rest.removeProps.onClick(data.value)}
        >
          <Icon className="mx-1 my-1" icon={'material-symbols:close'} />
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
const GroupHeading = ({ data, children, innerProps }) => {
  const { language } = useContext(DataContext);
  const isRTL = language === 'ar';

  return (
    <div {...innerProps} className={`flex items-center pl-3 pr-[1.25rem] py-1 cursor-pointer`}>
      <div className={`flex items-center gap-1.5 px-2 py-1 text-sm rounded-sm ml-2 text-[#dbdee1] overflow-hidden bg-[#2b2d33]`}>
        {data.icon && <Icon icon={getIcon(10)} color={data.icon} className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        <Icon icon={getIcon(data.type)} color={data.color && decimalToHexColor(data.color)} />
        <span className="truncate">{children}</span>
      </div>
    </div>
  );
};

const DiscordStyledMultiSelect = ({ options, onChange, value, disabled, type = 'channels', theme = null, ...props }) => {
  const transformOptions = (options) => {
    return transformChannels(
      options.filter((option) => {
        // If 'Other' is included in the value, we exclude options with no parentId
        if (value.includes('Other') && !option.parent_id && option.type != 4) {
          return false;
        }
        // We exclude options where the value contains the option id or the parentId
        return !value.includes(option.id) && !value.includes(option.parent_id);
      })
    );
  };

  const transformedOptions = transformOptions(options);

  const getCurrentValues = () => {
    return [
      ...options
        .filter((channel) => value.includes(channel.id))
        .map((channel) => ({ label: channel.name, value: channel.id, type: channel.type })),
      ...(value.includes('Other') ? [{ label: 'Other', type: 4, value: 'Other' }] : []),
    ];
  };

  const { locale } = useContext(DataContext);
  return (
    <Select
      isDisabled={disabled}
      placeholder={locale.logs.channels}
      isMulti={true}
      onChange={onChange}
      options={transformedOptions}
      styles={{ ...customStyles, ...theme }}
      components={{ Option: CustomOption, MultiValue, SingleValue: CustomSingleValue, GroupHeading, IndicatorSeparator: null }}
      value={getCurrentValues()}
      {...props}
    />
  );
};

export default DiscordStyledMultiSelect;

export { customStyles, CustomOption, CustomSingleValue };
