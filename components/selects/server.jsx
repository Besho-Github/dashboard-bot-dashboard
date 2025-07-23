import React, { useContext } from 'react';
import Select from 'react-select';
import { useRouter } from 'next/router';
import { getAbbreviation } from '../../utils';
import { DataContext } from '../../context';
import { useParams } from 'next/navigation';

// Styling for the select component to match Discord's theme
const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: '#0C122D',
    color: 'white',
    borderColor: '#10152f',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#5865f2',
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#0C122D',
    borderColor: '#202225',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#b9bbbe',
  }),
  valueContainer: (css, state) => ({
    ...css,
    display: 'flex',
    padding: '5px 10px',
    overflow: 'initial',
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
};

// Custom components for options and single value
const CustomOption = ({ innerProps, data, isSelected }) => {
  const { locale } = useContext(DataContext);
  const isRTL = locale.getLanguage() === 'ar';

  return (
    <div {...innerProps} className={`flex items-center px-3 py-2 hover:bg-[#2C3355] cursor-pointer ${isSelected && 'bg-[#343A5D]'}`}>
      {!data.icon ? (
        <div className={`w-6 h-6 rounded bg-[#353945] flex items-center justify-center ${isRTL ? 'ml-2' : 'mr-2'}`}>
          {getAbbreviation(data.label)}
        </div>
      ) : data.icon.toString().startsWith('https') ? (
        <img src={data.icon} alt="" className={`rounded w-6 h-6 ${isRTL ? 'ml-2' : 'mr-2'}`} />
      ) : (
        { ...data.icon }
      )}
      {data.label}
    </div>
  );
};

const CustomSingleValue = ({ children, ...props }) => {
  const { locale } = useContext(DataContext);
  const isRTL = locale.getLanguage() === 'ar';
  return (
    <div {...props.innerProps} className="flex items-center">
      {props.data.icon ? (
        props.data.icon.toString().startsWith('https') ? (
          <img src={props.data.icon} alt="" className={`rounded w-[30px] height-[30px] ${isRTL ? 'ml-[10px]' : 'mr-[10px]'}`} />
        ) : (
          { ...props.data.icon }
        )
      ) : (
        <div
          className={`rounded w-[30px] height-[30px] bg-[#353945] flex items-center justify-center ${isRTL ? 'ml-[10px]' : 'mr-[10px]'}`}
        >
          {getAbbreviation(props.data.label)}
        </div>
      )}
      {children}
    </div>
  );
};

const DiscordStyledSelect = ({ guilds, onChange }) => {
  const { id } = useParams();
  const options = guilds.map((guild) => ({
    icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=64` : null,
    label: guild.name,
    value: guild.id,
  }));
  const value = options.find((option) => option.value == id);
  return (
    <Select
      onChange={onChange}
      options={options}
      styles={customStyles}
      components={{ Option: CustomOption, SingleValue: CustomSingleValue, IndicatorSeparator: null }}
      isSearchable={false}
      isClearable={false}
      value={value}
    />
  );
};

export default DiscordStyledSelect;

export { customStyles, CustomOption, CustomSingleValue };
