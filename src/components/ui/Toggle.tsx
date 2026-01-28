import { forwardRef } from 'react';

interface ToggleProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  labelPosition?: 'left' | 'right';
  activeLabel?: string;
  inactiveLabel?: string;
  className?: string;
  name?: string;
}

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      label,
      checked,
      onChange,
      disabled = false,
      size = 'md',
      labelPosition = 'right',
      activeLabel,
      inactiveLabel,
      className = '',
      name,
    },
    ref
  ) => {
    const sizes = {
      sm: {
        track: 'w-8 h-4',
        thumb: 'w-3 h-3',
        translate: 'translate-x-4',
        text: 'text-xs',
      },
      md: {
        track: 'w-11 h-6',
        thumb: 'w-5 h-5',
        translate: 'translate-x-5',
        text: 'text-sm',
      },
      lg: {
        track: 'w-14 h-7',
        thumb: 'w-6 h-6',
        translate: 'translate-x-7',
        text: 'text-base',
      },
    };

    const currentSize = sizes[size];
    const displayLabel = label || (checked ? activeLabel : inactiveLabel);

    const handleClick = () => {
      if (!disabled) {
        onChange(!checked);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    };

    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {displayLabel && labelPosition === 'left' && (
          <span
            className={`${currentSize.text} ${
              disabled ? 'text-gray-400' : 'text-gray-700'
            }`}
          >
            {displayLabel}
          </span>
        )}

        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={label || 'Toggle'}
          disabled={disabled}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={`
            relative inline-flex shrink-0 cursor-pointer rounded-full
            transition-colors duration-200 ease-in-out
            focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2
            ${currentSize.track}
            ${checked ? 'bg-emerald-600' : 'bg-gray-300'}
            ${disabled ? 'cursor-not-allowed opacity-50' : ''}
          `}
        >
          <span
            className={`
              pointer-events-none inline-block rounded-full bg-white shadow-lg
              transform transition-transform duration-200 ease-in-out
              ${currentSize.thumb}
              ${checked ? currentSize.translate : 'translate-x-0.5'}
              mt-0.5
            `}
          />
        </button>

        {displayLabel && labelPosition === 'right' && (
          <span
            className={`${currentSize.text} ${
              disabled ? 'text-gray-400' : 'text-gray-700'
            }`}
          >
            {displayLabel}
          </span>
        )}

        {name && (
          <input type="hidden" name={name} value={checked ? 'true' : 'false'} />
        )}
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';

export default Toggle;