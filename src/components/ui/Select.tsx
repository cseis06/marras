import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { IconChevronDown, IconCheck } from '@tabler/icons-react';

export interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  required?: boolean;
  className?: string;
  name?: string;
}

export default function Select({
  label,
  options,
  value,
  onChange,
  placeholder,
  icon,
  iconPosition = 'right',
  disabled = false,
  required = false,
  className = '',
  name,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const hasValue = !!selectedOption;
  const isFloating = isFocused || hasValue;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    setIsFocused(true);
  };

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        setIsOpen(false);
        setIsFocused(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          const currentIndex = options.findIndex((opt) => opt.value === value);
          const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
          onChange?.(options[nextIndex].value);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          const currentIndex = options.findIndex((opt) => opt.value === value);
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
          onChange?.(options[prevIndex].value);
        }
        break;
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Hidden input for form submission */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={value ?? ''}
          required={required}
        />
      )}
      <div className='text-xs text-gray-400 pb-1'>
        {label}
        {required && <span className="text-red-500 ml-0.5"> *</span>}
      </div>

      {/* Select trigger */}
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          w-full flex items-center bg-gray-200 rounded-lg py-5 px-3 text-left
          transition-all duration-200 outline-none
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isFocused ? 'ring-1 ring-emerald-500' : ''}
          ${iconPosition === 'left' ? 'flex-row' : 'flex-row-reverse'}
        `}
      >
        {icon && (
          <span className={`text-gray-400 flex-shrink-0 ${iconPosition === 'left' ? 'mr-2' : 'ml-2'}`}>
            {icon}
          </span>
        )}
        
        <div className="relative flex-1 min-w-0">
          <span className={`block text-sm truncate ${hasValue ? 'text-gray-800' : 'text-transparent'}`}>
            {selectedOption?.label ?? placeholder ?? 'Seleccionar'}
          </span>
        </div>

        <IconChevronDown
          size={18}
          className={`
            text-gray-400 flex-shrink-0 ml-2 transition-transform duration-200
            ${isOpen ? 'rotate-180' : ''}
          `}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setIsOpen(false);
              setIsFocused(false);
            }}
          />
          <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            <div className="max-h-60 overflow-y-auto py-1">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors
                      ${isSelected ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'}
                    `}
                  >
                    {option.icon && (
                      <span className="flex-shrink-0">{option.icon}</span>
                    )}
                    <span className="flex-1 truncate">{option.label}</span>
                    {isSelected && (
                      <IconCheck size={16} className="flex-shrink-0 text-emerald-600" />
                    )}
                  </button>
                );
              })}

              {options.length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-400">
                  Sin opciones disponibles
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}