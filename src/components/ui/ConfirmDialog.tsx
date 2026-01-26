import type { ReactNode } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';
import Modal from './Modal';
import Button from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

const variantStyles = {
  danger: {
    icon: 'bg-red-100 text-red-600',
    button: 'bg-red-600',
  },
  warning: {
    icon: 'bg-amber-100 text-amber-600',
    button: 'bg-amber-600',
  },
  info: {
    icon: 'bg-blue-100 text-blue-600',
    button: 'bg-blue-600',
  },
};

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar acción',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  const styles = variantStyles[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center">
        <div className={`p-3 rounded-full ${styles.icon} mb-4`}>
          <IconAlertTriangle size={24} />
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex gap-3 w-full">
          <Button
            variant="outlined"
            textColor="text-gray-600"
            bgColor="bg-gray-300"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            bgColor={styles.button}
            onClick={onConfirm}
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Procesando...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}