import { useState, useEffect, forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  label: string;
  value: number | string;
  onChange: (value: number) => void;
  currency?: string;
  helperText?: string;
  error?: string;
  className?: string;
}

const formatCurrency = (value: number): string => {
  if (isNaN(value) || value === 0) return '';
  return new Intl.NumberFormat('es-PY', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const parseCurrency = (value: string): number => {
  const cleaned = value.replace(/\D/g, '');
  return parseInt(cleaned, 10) || 0;
};

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      label,
      value,
      onChange,
      currency = '₲',
      helperText,
      error,
      className = '',
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [displayValue, setDisplayValue] = useState('');

    const numericValue = typeof value === 'string' ? parseCurrency(value) : value;
    const hasValue = numericValue > 0;
    const isFloating = isFocused || hasValue;

    useEffect(() => {
      setDisplayValue(formatCurrency(numericValue));
    }, [numericValue]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const numeric = parseCurrency(rawValue);
      setDisplayValue(formatCurrency(numeric));
      onChange(numeric);
    };

    return (
      <div className={`relative w-full ${className}`}>
        <div
          className={`
            flex items-center gap-2 pb-2 border-b-2 transition-colors duration-200
            ${error ? 'border-red-500' : isFocused ? 'border-emerald-600' : 'border-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <span
            className={`
              text-lg font-medium transition-colors duration-200
              ${error ? 'text-red-500' : isFocused ? 'text-emerald-600' : 'text-gray-400'}
            `}
          >
            {currency}
          </span>

          <div className="relative flex-1">
            <label
              className={`
                absolute left-0 transition-all duration-200 pointer-events-none
                ${
                  isFloating
                    ? '-top-5 text-xs ' + (error ? 'text-red-500' : 'text-emerald-600')
                    : 'top-0 text-base text-gray-400'
                }
              `}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <input
              ref={ref}
              type="text"
              inputMode="numeric"
              value={displayValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={disabled}
              className={`
                w-full bg-transparent outline-none text-gray-800 text-lg
                ${disabled ? 'cursor-not-allowed' : ''}
              `}
              {...props}
            />
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

CurrencyInput.displayName = 'CurrencyInput';

export default CurrencyInput;