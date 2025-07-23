import { useContext } from 'react';
import { NumberInput, WelcomeThemedSelect } from '../../../selects/Inputs';
import { DataContext } from '../../../../context';

export default function Avatar({ state, handleElementChange }) {
  const handleNumberInputChange = (value, field) => {
    let updatedValue = parseFloat(value).toFixed(2); // Limit to 2 decimal places
    if (updatedValue % 1 === 0) {
      updatedValue = Math.trunc(updatedValue); // Convert to integer
    }

    handleElementChange('avatar', {
      size: field === 'width' || field === 'height' ? { ...state.avatar.size, [field]: Number(updatedValue) } : state.avatar.size,
      position: field === 'left' || field === 'top' ? { ...state.avatar.position, [field]: Number(updatedValue) } : state.avatar.position,
    });
  };

  const handleShapeChange = (selectedOption) => {
    handleElementChange('avatar', {
      shape: selectedOption.target.value,
    });
  };

  const { locale } = useContext(DataContext);

  return (
    <div className="p-5">
      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-1">
          <div className="flex flex-col text-sm font-semibold uppercase text-zinc-400">
            <label className="mb-2">{locale.welcome.sec_3.text_1}</label>
            <NumberInput value={state.avatar.size.width} onChange={(value) => handleNumberInputChange(value, 'width')} className="mb-4" />
            <label className="mb-2">{locale.welcome.sec_3.text_4}</label>
            <NumberInput value={state.avatar.size.height} onChange={(value) => handleNumberInputChange(value, 'height')} />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex flex-col text-sm font-semibold uppercase text-zinc-400">
            <label className="mb-2">{locale.welcome.sec_3.text_2}</label>
            <NumberInput value={state.avatar.position.top} onChange={(value) => handleNumberInputChange(value, 'top')} className="mb-4" />
            <label className="mb-2">{locale.welcome.sec_3.text_5}</label>
            <NumberInput value={state.avatar.position.left} onChange={(value) => handleNumberInputChange(value, 'left')} />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex flex-col text-sm font-semibold uppercase text-zinc-400">
            <label className="mb-2">{locale.welcome.sec_3.text_3}</label>
            <WelcomeThemedSelect
              value={state.avatar.shape}
              options={[
                { name: locale.welcome.sec_3.option_1, value: 'square' },
                { name: locale.welcome.sec_3.option_2, value: 'circle' },
              ]}
              onChange={handleShapeChange}
              className="mt-3"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
