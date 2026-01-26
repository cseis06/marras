interface BadgeProps {
  variant: 'success' | 'warning' | 'error' | 'info' | 'orange' | 'neutral';
  size: 'xxs' | 'xs' | 'md' | 'lg' | 'xl'  
  children: React.ReactNode;
}

const variantStyles = {
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  orange: 'bg-orange-100 text-orange-700',
  neutral: 'bg-gray-100 text-gray-700',
};

const sizeStyles = {
  xxs : 'text-[10px]',
  xs: 'text-sm',
  md: 'text-md',
  lg: 'text-lg',
  xl: 'text-2xl',
}

export default function Badge({ variant, children, size }: BadgeProps) {
  return (
    <span className={`px-2.5 py-1 rounded-full ${sizeStyles[size]} font-medium ${variantStyles[variant]}`}>
      {children}
    </span>
  );
}