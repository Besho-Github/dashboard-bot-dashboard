const graytheme = (e) => {
  return {
    control: (provided) => ({
      ...provided,
      background: 'linear-gradient(to bottom right, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
      color: 'white',
      borderColor: '#10152f',
      opacity: e ? 0.5 : 1,
    }),
    menu: (provided) => ({
      ...provided,
      background: 'linear-gradient(to bottom right, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
      borderColor: '#202225',
      padding: '10px 0',
    }),
  };
};

export { graytheme };
