import { useState } from 'react';
import type { ReactNode } from 'react';
import { IconChevronDown } from '@tabler/icons-react';

interface ExpandableCellProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  renderPreview: (items: T[]) => ReactNode;
  maxHeight?: string;
}

export default function ExpandableCell<T>({
  items,
  renderItem,
  renderPreview,
  maxHeight = 'max-h-48',
}: ExpandableCellProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  if (items.length === 0) {
    return <span className="text-gray-400 text-sm">Sin datos</span>;
  }

  return (
    <div className="relative z-">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-gray-700 hover:text-emerald-600 transition-colors"
      >
        {renderPreview(items)}
        <IconChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute z-20 top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-64 ${maxHeight} overflow-y-auto`}>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="p-2 rounded-lg hover:bg-gray-50">
                  {renderItem(item, index)}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}