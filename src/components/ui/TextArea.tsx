import { useState, forwardRef } from 'react';
import type { TextareaHTMLAttributes, ReactNode } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  icon?: ReactNode;
  helperText?: string;
  error?: string;
  autoResize?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      icon,
      helperText,
      error,
      autoResize = false,
      className = '',
      value,
      defaultValue,
      onFocus,
      onBlur,
      disabled,
      required,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value || !!defaultValue);

    const isFloating = isFocused || hasValue;

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHasValue(!!e.target.value);
      
      if (autoResize) {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
      }
      
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
          <div className="flex px-3 pt-2">
            {icon && (
              <span
                className={`
                  text-gray-400 flex-shrink-0 mt-1 transition-colors
                  ${error ? 'text-red-500' : isFocused ? 'text-emerald-600' : ''}
                `}
              >
                {icon}
              </span>
            )}

            <div className="relative flex-1">
              <label
                className={`
                  absolute left-3 transition-all duration-200 ease-out pointer-events-none
                  ${error ? 'text-red-500' : 'text-gray-400'}
                  ${isFloating ? 'top-0 text-[10px]' : 'top-3 text-sm'}
                `}
              >
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
              </label>

              <textarea
                ref={ref}
                value={value}
                defaultValue={defaultValue}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
                disabled={disabled}
                rows={rows}
                className={`
                  w-full bg-transparent outline-none pt-4 pb-2 px-3 text-gray-800 text-sm resize-none
                  ${disabled ? 'cursor-not-allowed' : ''}
                `}
                {...props}
              />
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

TextArea.displayName = 'TextArea';

export default TextArea;