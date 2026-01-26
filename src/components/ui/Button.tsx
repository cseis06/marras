import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'gradient';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  bgColor?: string;
  textColor?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'filled',
      icon,
      iconPosition = 'left',
      bgColor = 'bg-emerald-600',
      textColor = 'text-white',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'w-full px-5 py-4 rounded-lg font-medium transition-all duration-200 active:scale-95 hover:opacity-80 flex gap-2 items-center justify-center text-center text-base font-semibold uppercase';

    const variantStyles = {
      filled: `${bgColor} ${textColor}`,
      outlined: `bg-transparent border-2 ${bgColor.replace('bg-', 'border-')} ${textColor}`,
      gradient: 'bg-linear-90 from-emerald-800 via-green-500 to-lime-400 text-white',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

/*

// Variantes

<div className="p-8 space-y-8 max-w-md mx-auto">
    // Variante Filled (por defecto)
    <div className="space-y-3">
    <h3 className="text-sm font-semibold text-gray-500">Filled</h3>
    <Button>Botón Filled</Button>
    <Button icon={<IconPlus size={18} />}>Con ícono izquierda</Button>
    <Button icon={<IconArrowRight size={18} />} iconPosition="right">
        Con ícono derecha
    </Button>
    <Button bgColor="bg-blue-600">Color personalizado</Button>
    </div>

    // Variante Outlined
    <div className="space-y-3">
    <h3 className="text-sm font-semibold text-gray-500">Outlined</h3>
    <Button variant="outlined" textColor="text-emerald-600">
        Botón Outlined
    </Button>
    <Button
        variant="outlined"
        icon={<IconHeart size={18} />}
        bgColor="bg-rose-500"
        textColor="text-rose-500"
    >
        Me gusta
    </Button>
    <Button
        variant="outlined"
        icon={<IconDownload size={18} />}
        iconPosition="right"
        bgColor="bg-indigo-600"
        textColor="text-indigo-600"
    >
        Descargar
    </Button>
    </div>

    // Variante Gradient
    <div className="space-y-3">
    <h3 className="text-sm font-semibold text-gray-500">Gradient</h3>
    <Button variant="gradient">Botón Gradient</Button>
    <Button variant="gradient" icon={<IconSend size={18} />}>
        Enviar mensaje
    </Button>
    <Button variant="gradient" icon={<IconArrowRight size={18} />} iconPosition="right">
        Continuar
    </Button>
    </div>

    // Botón deshabilitado
    <div className="space-y-3">
    <h3 className="text-sm font-semibold text-gray-500">Deshabilitado</h3>
    <Button disabled className="opacity-50 cursor-not-allowed">
        Deshabilitado
    </Button>
    </div>
</div>

*/