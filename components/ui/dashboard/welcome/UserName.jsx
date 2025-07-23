import { NumberInput } from '../../../selects/Inputs';
import { getContrastColor } from '../../../../utils';
import { Icon } from '@iconify/react';
import { useContext } from 'react';
import { DataContext } from '../../../../context';

export default function UserName({ state, handleElementChange }) {
  const { name } = state;

  const handleChange = (property, value) => {
    handleElementChange('name', {
      ...name,
      [property]: value,
    });
  };

  const handleColorChange = (e) => {
    handleChange('color', e.target.value);
  };

  const handleNumberChange = (property, field, value) => {
    const parsedValue = parseFloat(value).toFixed(2);
    handleChange(property, { ...name[property], [field]: Number(parsedValue) });
  };

  const { locale } = useContext(DataContext);

  return (
    <div className="p-5">
      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-1">
          <div className="flex flex-col text-sm font-semibold uppercase text-zinc-400">
            <label className="mb-2">{locale.welcome.sec_4.text_1}</label>
            <NumberInput value={name.size.width} onChange={(value) => handleNumberChange('size', 'width', value)} className="mb-4" />
            <label className="mb-2">{locale.welcome.sec_4.text_4}</label>
            <NumberInput value={name.size.font_size} onChange={(value) => handleNumberChange('size', 'font_size', value)} />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex flex-col text-sm font-semibold uppercase text-zinc-400">
            <label className="mb-2">{locale.welcome.sec_4.text_2}</label>
            <NumberInput value={name.position.top} onChange={(value) => handleNumberChange('position', 'top', value)} className="mb-4" />
            <label className="mb-2">{locale.welcome.sec_4.text_5}</label>
            <NumberInput value={name.position.left} onChange={(value) => handleNumberChange('position', 'left', value)} />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex flex-col text-sm font-semibold uppercase text-zinc-400">
            <label className="mb-2">{locale.welcome.sec_4.text_3}</label>
            <div className="relative h-8 rounded border border-solid border-white/10" style={{ backgroundColor: name.color }}>
              <Icon
                className="absolute w-4 h-4 top-1.5 right-2.5"
                icon={'fa-solid:eye-dropper'}
                style={{ color: getContrastColor(name.color) }}
              />
              <input
                type="color"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                value={name.color}
                onChange={handleColorChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
