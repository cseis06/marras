import { useState, forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  clickableIcon?: true | false;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, iconPosition = 'right', className = '', clickableIcon = false, value, defaultValue, onFocus, onBlur, ...props }, ref) => {
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
      <div className={`relative w-full font-normal bg-gray-200 rounded-md px-2 py-1.5 ${className}`}>
        <div className={`flex items-center ${iconPosition === 'left' ? 'flex-row' : 'flex-row-reverse'}`}>
          {icon && (
            <div className={`text-gray-400 flex-shrink-0 p-2 ${clickableIcon ? "cursor-pointer" : ""}`}>
              {icon}
            </div>
          )}
          <div className='relative flex-1'>
            <input
              ref={ref}
              value={value}
              defaultValue={defaultValue}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              className='w-full bg-transparent border-none outline-none pt-5 pb-1.5 px-3 text-gray-800 peer text-sm'
              {...props}
            />
            <label
              className={`absolute left-2 transition-all duration-200 ease-out pointer-events-none text-gray-400
                ${isFloating ? 'top-1 text-[10px]' : 'top-1/2 -translate-y-1/2 text-sm'}`}
            >
              {label}
            </label>
          </div>
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;