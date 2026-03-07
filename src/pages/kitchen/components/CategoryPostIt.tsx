import { useRef, useEffect } from 'react';
import { IconChefHat } from '@tabler/icons-react';
import gsap from 'gsap';
import type { CategoryAssignment, ChefColor } from '../types/Kitchen';
import { chefColorStyles } from '../types/Kitchen';

interface CategoryPostItProps {
  assignment: CategoryAssignment;
  color: ChefColor;
  index: number;
}

export default function CategoryPostIt({
  assignment,
  color,
  index,
}: CategoryPostItProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const progressPercent = assignment.quantity > 0
    ? Math.round((assignment.completed / assignment.quantity) * 100)
    : 0;

  const colorStyles = chefColorStyles[color];
  const isComplete = progressPercent === 100;

  // Animación de entrada
  useEffect(() => {
    if (progressRef.current) {
      gsap.fromTo(
        progressRef.current,
        { width: '0%' },
        {
          width: `${progressPercent}%`,
          duration: 0.8,
          delay: index * 0.1 + 0.3,
          ease: 'power2.out',
        }
      );
    }
  }, [index, progressPercent]);

  // Hover animation
  const handleMouseEnter = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: -6,
        rotate: 1,
        boxShadow: '0 12px 24px -8px rgba(0, 0, 0, 0.18)',
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: 0,
        rotate: 0,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        post-it relative p-5 rounded-2xl border-l-4 shadow-md cursor-default
        ${colorStyles.bg} ${colorStyles.border}
        ${isComplete ? 'ring-2 ring-emerald-300 ring-offset-2' : ''}
        transition-colors
      `}
    >
      {/* Header con icono y cantidad */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${colorStyles.accent} text-white`}>
          <IconChefHat size={22} stroke={2} />
        </div>
        <div className={`px-3 py-1.5 rounded-lg font-bold text-sm ${colorStyles.accent} text-white`}>
          {assignment.quantity}
        </div>
      </div>

      {/* Nombre de categoría */}
      <h4 className="text-base font-semibold text-gray-800 mb-3 leading-tight">
        {assignment.categoryName}
      </h4>

      {/* Progreso */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Progreso</span>
          <span className={`font-semibold ${colorStyles.text}`}>
            {assignment.completed}/{assignment.quantity}
          </span>
        </div>

        {/* Barra de progreso */}
        <div className="h-2.5 bg-white/70 rounded-full overflow-hidden shadow-inner">
          <div
            ref={progressRef}
            className={`h-full rounded-full ${isComplete ? 'bg-emerald-500' : colorStyles.accent}`}
            style={{ width: 0 }}
          />
        </div>

        {/* Porcentaje */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {assignment.quantity - assignment.completed} pendientes
          </span>
          <span className={`text-xs font-medium ${isComplete ? 'text-emerald-600' : colorStyles.text}`}>
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Indicador de completado */}
      {isComplete && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {/* Sombra decorativa inferior */}
      <div
        className={`absolute -bottom-1 left-3 right-3 h-2 rounded-b-xl opacity-20 ${colorStyles.accent}`}
        style={{ filter: 'blur(4px)' }}
      />
    </div>
  );
}