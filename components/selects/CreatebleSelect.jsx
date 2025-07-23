import React, { useState, useMemo, useContext } from 'react';
import CreatableSelect from 'react-select/creatable';
import { Icon } from '@iconify/react/dist/iconify.js';
import { getAbbreviation, decimalToHexColor } from '../../utils';
import { DataContext } from '../../context';

const customStyles = {
  control: (provided) => ({
    ...provided,
    background: 'linear-gradient(to bottom right, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
    color: 'white',
    borderColor: '#10152f',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#111214',
    borderColor: '#202225',
    padding: '10px 0',
  }),
  input: (provided) => ({
    ...provided,
    color: 'white',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#b9bbbe',
  }),
  valueContainer: (css) => ({
    ...css,
    display: 'flex',
    padding: '5px 10px',
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

const CustomOption = ({ innerProps, data, isSelected }) => (
  <div {...innerProps} className={`flex items-center px-3 py-1 cursor-pointer ${isSelected ? 'bg-[#343A5D]' : ''}`}>
    <div className="flex items-center gap-1.5 bg-[#232428] px-2 py-1 text-sm rounded-sm ml-2 text-[#dbdee1]">
      {typeof data.type !== 'undefined' ? (
        <Icon icon={'mdi:hashtag'} />
      ) : (
        <Icon icon={'ic:sharp-circle'} color={decimalToHexColor(data.color)} />
      )}
      {data.label}
    </div>
  </div>
);

const CustomSingleValue = ({ children, ...props }) => (
  <div {...props.innerProps} className="flex items-center">
    {props.data.icon ? (
      props.data.icon.startsWith('https') ? (
        <img src={props.data.icon} alt="" className="rounded mr-[10px] w-[30px] height-[30px]" />
      ) : (
        <div>{props.data.icon}</div>
      )
    ) : (
      <div className="rounded mr-[10px] w-[30px] height-[30px] bg-[#353945] flex items-center justify-center">
        {getAbbreviation(props.data.label)}
      </div>
    )}
    {children}
  </div>
);

const MultiValue = ({ data, ...rest }) => {
  return (
    <div className="flex items-center">
      <div className={`flex bg-[#2b2d33] text-sm rounded-sm ml-2 text-[#dbdee1] items-stretch`}>
        <div className="mx-2 my-1">
          <span>{data.value}</span>
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

const CreatableStyledSelect = ({ onChange, value, theme }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (newInputValue) => {
    setInputValue(newInputValue.trim());
  };

  const handleCreateItem = () => {
    if (!inputValue) return;

    if (value.some((item) => item === inputValue)) {
      setInputValue('');
    } else {
      onChange([...value, inputValue]);
      setInputValue('');
    }
  };

  const handleKeyDown = (event) => {
    if (!inputValue) return;

    const key = event.key || event.keyCode;

    // Check for 'Enter', 'Tab', or spacebar
    if (key === 'Enter' || key === 'Tab' || key === ' ' || key === 13 || key === 9 || key === 32) {
      // Prevent default behavior first to stop form submission or any other default action
      event.preventDefault();
      event.stopPropagation();

      handleCreateItem();
    }
  };

  const handleKeyPress = (event) => {
    const key = event.key || event.code;

    if (key === 'Enter' || key === ' ' || key === 'Spacebar' || key === 'Space') {
      event.preventDefault();
      event.stopPropagation();
      handleCreateItem();
    }
  };

  // Special handler for mobile submit events
  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (inputValue) {
      handleCreateItem();
    }
    return false;
  };

  const memoizedValue = useMemo(() => value.map((c) => ({ label: c, value: c })), [value]);
  const { locale } = useContext(DataContext);
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <CreatableSelect
        styles={theme ? theme : customStyles}
        inputValue={inputValue}
        isClearable
        isMulti
        menuIsOpen={false}
        onChange={(newValue) => onChange(newValue.map((item) => item.value))}
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onKeyPress={handleKeyPress}
        className="editSelect"
        placeholder={locale.protection.placeholder}
        value={memoizedValue}
        components={{ Option: CustomOption, SingleValue: CustomSingleValue, MultiValue }}
        blurInputOnSelect={false}
        onFocus={(e) => e.preventDefault()}
      />
    </form>
  );
};

export default CreatableStyledSelect;
export { customStyles, CustomOption, CustomSingleValue };
