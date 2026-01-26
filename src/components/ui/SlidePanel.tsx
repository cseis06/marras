import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { IconX } from '@tabler/icons-react';

interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
}

export default function SlidePanel({
  isOpen,
  onClose,
  title,
  children,
  footer,
  width = 'w-full max-w-lg',
}: SlidePanelProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;

    if (!overlay || !panel) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';

      gsap.set(overlay, { display: 'flex' });
      gsap.to(overlay, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.fromTo(
        panel,
        { x: '100%' },
        { x: '0%', duration: 0.3, ease: 'power2.out' }
      );
    } else {
      gsap.to(overlay, { opacity: 0, duration: 0.2, ease: 'power2.in' });
      gsap.to(panel, {
        x: '100%',
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(overlay, { display: 'none' });
          document.body.style.overflow = '';
        },
      });
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex justify-end opacity-0 hidden"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`relative h-full bg-white shadow-2xl flex flex-col ${width}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <IconX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}