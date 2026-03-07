import { useRef, useEffect } from 'react';
import { IconPackage, IconCheck, IconClock, IconUser } from '@tabler/icons-react';
import gsap from 'gsap';
import type { CustomOrderAssignment, ChefColor } from '../types/Kitchen';
import { chefColorStyles } from '../types/Kitchen';

interface CustomOrderPostItProps {
  order: CustomOrderAssignment;
  color: ChefColor;
  index: number;
}

export default function CustomOrderPostIt({
  order,
  color,
  index,
}: CustomOrderPostItProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const checkRef = useRef<HTMLDivElement>(null);

  const colorStyles = chefColorStyles[color];

  // Animación del check cuando está completado
  useEffect(() => {
    if (checkRef.current && order.completed) {
      gsap.fromTo(
        checkRef.current,
        { scale: 0, rotate: -180 },
        {
          scale: 1,
          rotate: 0,
          duration: 0.5,
          delay: index * 0.1 + 0.4,
          ease: 'back.out(2)',
        }
      );
    }
  }, [order.completed, index]);

  // Hover animation
  const handleMouseEnter = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: -6,
        rotate: -1,
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
        ${order.completed 
          ? 'bg-emerald-50 border-l-emerald-400' 
          : `${colorStyles.bg} ${colorStyles.border}`
        }
        transition-colors
      `}
    >
      {/* Header con número de pedido y estado */}
      <div className="flex items-start justify-between mb-3">
        <div className={`
          p-2.5 rounded-xl 
          ${order.completed ? 'bg-emerald-500' : colorStyles.accent} 
          text-white
        `}>
          <IconPackage size={22} stroke={2} />
        </div>
        
        <div className="flex items-center gap-2">
          {/* Cantidad */}
          <span className={`
            px-2.5 py-1 rounded-lg font-bold text-sm
            ${order.completed 
              ? 'bg-emerald-500 text-white' 
              : `${colorStyles.accent} text-white`
            }
          `}>
            ×{order.quantity}
          </span>
          
          {/* Indicador de estado */}
          <div ref={checkRef}>
            {order.completed ? (
              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                <IconCheck size={16} className="text-white" stroke={3} />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center">
                <IconClock size={16} className="text-amber-600" stroke={2} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Número de pedido */}
      <div className="mb-3">
        <span className={`
          inline-block px-2 py-0.5 rounded text-xs font-mono
          ${order.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-white/60 text-gray-500'}
        `}>
          #{order.orderNumber}
        </span>
      </div>

      {/* Cliente */}
      <div className="flex items-center gap-2 mb-3">
        <IconUser size={16} className={order.completed ? 'text-emerald-600' : 'text-gray-400'} />
        <h4 className={`
          text-base font-semibold leading-tight truncate
          ${order.completed ? 'text-emerald-800' : 'text-gray-800'}
        `}>
          {order.clientName}
        </h4>
      </div>

      {/* Notas de personalización */}
      <div className={`
        p-3 rounded-xl border-2 border-dashed
        ${order.completed 
          ? 'bg-emerald-100/50 border-emerald-200' 
          : 'bg-white/50 border-gray-200'
        }
      `}>
        <p className={`
          text-sm italic leading-relaxed
          ${order.completed ? 'text-emerald-700' : 'text-gray-600'}
        `}>
          "{order.notes}"
        </p>
      </div>

      {/* Estado badge en la parte inferior */}
      <div className="mt-4 flex justify-end">
        <span className={`
          px-3 py-1 rounded-full text-xs font-medium
          ${order.completed 
            ? 'bg-emerald-500 text-white' 
            : 'bg-amber-100 text-amber-700'
          }
        `}>
          {order.completed ? 'Completado' : 'Pendiente'}
        </span>
      </div>

      {/* Línea decorativa superior para completados */}
      {order.completed && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-t-2xl" />
      )}

      {/* Sombra decorativa inferior */}
      <div
        className={`
          absolute -bottom-1 left-3 right-3 h-2 rounded-b-xl opacity-20
          ${order.completed ? 'bg-emerald-500' : colorStyles.accent}
        `}
        style={{ filter: 'blur(4px)' }}
      />
    </div>
  );
}