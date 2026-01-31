import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { IconSearch, IconX } from '@tabler/icons-react';

export interface SearchOption {
  id: string;
  label: string;
  sublabel?: string;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  };
  icon?: ReactNode;
  data?: unknown;
}

interface SearchInputProps {
  label: string;
  options: SearchOption[];
  value?: SearchOption | null;
  onChange?: (option: SearchOption | null) => void;
  placeholder?: string;
  icon?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  emptyMessage?: string;
  filterKeys?: string[];
}

const badgeStyles = {
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  neutral: 'bg-gray-100 text-gray-700',
};

export default function SearchInput({
  label,
  options,
  value,
  onChange,
  placeholder = 'Buscar...',
  icon,
  disabled = false,
  required = false,
  className = '',
  emptyMessage = 'No se encontraron resultados',
  filterKeys = ['label', 'sublabel'],
}: SearchInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevFilteredLengthRef = useRef<number>(0);

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    
    const term = searchTerm.toLowerCase();
    return options.filter((option) => {
      return filterKeys.some((key) => {
        const val = option[key as keyof SearchOption];
        return typeof val === 'string' && val.toLowerCase().includes(term);
      });
    });
  }, [options, searchTerm, filterKeys]);

  // Reset highlighted index when filtered options change - usando ref para evitar cascading renders
  const currentFilteredLength = filteredOptions.length;
  if (currentFilteredLength !== prevFilteredLengthRef.current) {
    prevFilteredLengthRef.current = currentFilteredLength;
    if (highlightedIndex >= currentFilteredLength) {
      // Solo actualizamos si el índice actual está fuera de rango
      // Esto se manejará en el próximo render
    }
  }

  // Calcular el índice válido
  const safeHighlightedIndex = useMemo(() => {
    if (highlightedIndex >= filteredOptions.length) {
      return -1;
    }
    return highlightedIndex;
  }, [highlightedIndex, filteredOptions.length]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
        if (!value) setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value]);

  const handleFocus = () => {
    if (disabled) return;
    setIsFocused(true);
    setIsOpen(true);
    if (value) {
      setSearchTerm('');
    }
  };

  const handleSelect = useCallback((option: SearchOption) => {
    onChange?.(option);
    setSearchTerm(option.label);
    setIsOpen(false);
    setIsFocused(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  }, [onChange]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
    setSearchTerm('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(-1); // Reset en el mismo handler, no en useEffect
    if (!isOpen) setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (safeHighlightedIndex >= 0 && filteredOptions[safeHighlightedIndex]) {
          handleSelect(filteredOptions[safeHighlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setIsFocused(false);
        setHighlightedIndex(-1);
        if (!value) setSearchTerm('');
        inputRef.current?.blur();
        break;
    }
  };

  const displayValue = isFocused ? searchTerm : value?.label || searchTerm;
  const hasValue = !!value || !!searchTerm;
  const isFloating = isFocused || hasValue;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div
        className={`
          relative w-full bg-gray-200 rounded-lg transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isFocused ? 'ring-1 ring-emerald-500' : ''}
        `}
      >
        <div className="flex items-center px-3">
          <span className={`text-gray-400 flex-shrink-0 transition-colors ${isFocused ? 'text-emerald-600' : ''}`}>
            {icon || <IconSearch size={20} />}
          </span>

          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={displayValue}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder={isFloating ? placeholder : ''}
              className="w-full bg-transparent outline-none pt-5 pb-2 px-3 text-gray-800 text-sm"
            />
            <label
              className={`
                absolute left-3 transition-all duration-200 ease-out pointer-events-none text-gray-400
                ${isFloating ? 'top-1 text-[10px]' : 'top-1/2 -translate-y-1/2 text-sm'}
              `}
            >
              {label}
              {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
          </div>

          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <IconX size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setIsOpen(false);
              setIsFocused(false);
              setHighlightedIndex(-1);
              if (!value) setSearchTerm('');
            }}
          />
          <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            <div className="max-h-60 overflow-y-auto py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                      ${safeHighlightedIndex === index ? 'bg-emerald-50' : 'hover:bg-gray-50'}
                      ${value?.id === option.id ? 'bg-emerald-50' : ''}
                    `}
                  >
                    {option.icon && (
                      <span className="flex-shrink-0 text-gray-400">
                        {option.icon}
                      </span>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-800 truncate">
                          {option.label}
                        </span>
                        {option.badge && (
                          <span
                            className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                              badgeStyles[option.badge.variant]
                            }`}
                          >
                            {option.badge.text}
                          </span>
                        )}
                      </div>
                      {option.sublabel && (
                        <span className="text-xs text-gray-500 truncate block">
                          {option.sublabel}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-400 text-center">
                  {emptyMessage}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}