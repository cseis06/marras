import { useState, forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { IconCalendar } from '@tabler/icons-react';

interface DateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  helperText?: string;
  error?: string;
}

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      label,
      helperText,
      error,
      className = '',
      value,
      defaultValue,
      onFocus,
      onBlur,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value || !!defaultValue);

    const isFloating = isFocused || hasValue;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    return (
      <div className={`w-full ${className}`}>
        <div
          className={`
            relative w-full bg-gray-200 rounded-lg transition-all duration-200
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${isFocused ? 'ring-1 ring-emerald-500' : ''}
            ${error ? 'ring-1 ring-red-500' : ''}
          `}
        >
          <div className="flex items-center px-3">
            <span
              className={`
                text-gray-400 flex-shrink-0 transition-colors
                ${error ? 'text-red-500' : isFocused ? 'text-emerald-600' : ''}
              `}
            >
              <IconCalendar size={20} />
            </span>

            <div className="relative flex-1">
              <input
                ref={ref}
                type="date"
                value={value}
                defaultValue={defaultValue}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
                disabled={disabled}
                className={`
                  w-full bg-transparent outline-none pt-5 pb-2 px-3 text-gray-800 text-sm
                  [&::-webkit-calendar-picker-indicator]:opacity-0
                  [&::-webkit-calendar-picker-indicator]:absolute
                  [&::-webkit-calendar-picker-indicator]:right-0
                  [&::-webkit-calendar-picker-indicator]:w-full
                  [&::-webkit-calendar-picker-indicator]:h-full
                  [&::-webkit-calendar-picker-indicator]:cursor-pointer
                  ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                  ${!hasValue ? 'text-transparent' : ''}
                `}
                {...props}
              />
              <label
                className={`
                  absolute left-3 transition-all duration-200 ease-out pointer-events-none
                  ${error ? 'text-red-500' : 'text-gray-400'}
                  ${isFloating ? 'top-1 text-[10px]' : 'top-1/2 -translate-y-1/2 text-sm'}
                `}
              >
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
            </div>
          </div>
        </div>

        {(helperText || error) && (
          <p
            className={`mt-1.5 text-xs ${
              error ? 'text-red-500' : 'text-gray-500'
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

DateInput.displayName = 'DateInput';

export default DateInput;