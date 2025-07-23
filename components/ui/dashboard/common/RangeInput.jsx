import * as React from 'react';

function RangeInput({ value = 60 * 5, onChange, min = 60 * 5, max = 60 * 60 * 24, labels, cooldownDescription, isRTL }) {
  const sliderRef = React.useRef(null);
  const tooltipRef = React.useRef(null);
  const [thumbPosition, setThumbPosition] = React.useState(0);
  const [showTooltip, setShowTooltip] = React.useState(false); // New state to control tooltip visibility

  // Handle value change and update thumb position
  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    updateThumbPosition(newValue);
  };

  // Calculate and update the thumb and tooltip positions
  const updateThumbPosition = (value) => {
    if (sliderRef.current && tooltipRef.current) {
      const sliderRect = sliderRef.current.getBoundingClientRect();
      const tooltipWidth = tooltipRef.current.offsetWidth;
      const thumbWidth = 10; // Approximate width of the thumb in pixels
      const thumbPos = calculateThumbPosition(value, sliderRect.width, thumbWidth);
      const adjustedPosition = adjustTooltipPosition(thumbPos, tooltipWidth, sliderRect.width);

      setThumbPosition(adjustedPosition);
    }
  };

  // Calculate the thumb position based on the current value
  const calculateThumbPosition = (value, sliderWidth, thumbWidth) => {
    const relativeValue = (value - min) / (max - min); // Convert to relative value between 0 and 1
    return relativeValue * (sliderWidth - thumbWidth) + thumbWidth / 2;
  };

  // Adjust the tooltip position to ensure it stays within bounds
  const adjustTooltipPosition = (thumbPos, tooltipWidth, sliderWidth) => {
    if (sliderWidth - tooltipWidth > 0) {
      if (sliderWidth - thumbPos < tooltipWidth / 2) {
        const shift = tooltipWidth / 2 - (sliderWidth - thumbPos);
        return Math.min(Math.max(thumbPos - tooltipWidth / 2, 0), sliderWidth - tooltipWidth) + shift;
      } else if (sliderWidth - tooltipWidth / 2 < sliderWidth - thumbPos) {
        const shift = tooltipWidth / 2 - thumbPos;
        return Math.min(Math.max(thumbPos - tooltipWidth / 2, 0), sliderWidth - tooltipWidth) - shift;
      }
    }
    return Math.min(Math.max(thumbPos - tooltipWidth / 2, 0), sliderWidth - tooltipWidth);
  };

  React.useEffect(() => {
    updateThumbPosition(value); // Set initial thumb position
  }, [value]);

  // Format value to display in hours and minutes
  const formatTime = (value) => {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    return `${hours > 0 ? hours + labels.hoursLabel : ''} ${minutes}${labels.minutesLabel}`;
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="flex justify-between w-full text-sm font-medium text-gray-400">
        <span>{labels.minLabel}</span>
        <span>{labels.maxLabel}</span>
      </div>
      <div className="relative w-full" ref={sliderRef}>
        <div className="relative w-full h-2 bg-zinc-600 rounded-full">
          <div className="absolute h-2 bg-indigo-400 rounded-full" style={{ width: `${((value - min) / (max - min)) * 100}%` }} />
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={handleChange}
            onMouseEnter={() => setShowTooltip(true)} // Show tooltip on hover
            onMouseLeave={() => setShowTooltip(false)} // Hide tooltip when not hovering
            className="absolute inset-0 w-full h-2 cursor-pointer"
            style={{
              WebkitAppearance: 'none',
              appearance: 'none',
              height: '2px',
              background: 'transparent',
            }}
          />
          <div
            ref={tooltipRef}
            className="absolute transform -translate-y-full p-2 text-xs font-medium text-white bg-[#111214] rounded-[5px]"
            style={{ [isRTL ? 'right' : 'left']: `${thumbPosition}px`, top: '-20px', visibility: showTooltip ? 'visible' : 'hidden' }}
          >
            <div className="relative whitespace-nowrap">
              {formatTime(value)}
              <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-0.1 mt-1 w-2 h-2 bg-[#111214] rotate-45"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="self-start text-sm font-bold leading-normal text-gray-400 max-md:max-w-full">{cooldownDescription}</div>
      <style jsx>{`
        input[type='range'] {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          background: transparent;
        }

        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 10px;
          height: 24px;
          border-radius: 3px;
          background: #ffffff;
          cursor: pointer;
        }

        input[type='range']::-webkit-slider-runnable-track {
          width: 100%;
          height: 17px;
          cursor: pointer;
          background: transparent;
        }

        input[type='range']::-moz-range-track {
          width: 100%;
          height: 2px;
          cursor: pointer;
          background: transparent;
        }

        input[type='range']::-ms-track {
          width: 100%;
          height: 2px;
          cursor: pointer;
          background: transparent;
          border-color: transparent;
          color: transparent;
        }
      `}</style>
    </div>
  );
}

export default RangeInput;
