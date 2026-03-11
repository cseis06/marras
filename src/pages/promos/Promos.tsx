import { useMemo, useState, useRef, useEffect } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { 
  IconEdit, 
  IconTrash, 
  IconPlus, 
  IconTicket, 
  IconArrowLeft,
  IconPercentage,
  IconCurrencyDollar
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ActionButtons from '../../components/ui/ActionButtons';
import SlidePanel from '../../components/ui/SlidePanel';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import PromoForm from './components/PromoForm';
import { discountCodes as initialDiscountCodes } from './data/DiscountCodes';
import type { DiscountCode } from './types/DiscountCode';

const columnHelper = createColumnHelper<DiscountCode>();

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function Promos() {
  const navigate = useNavigate();

  // Refs para animaciones
  const containerRef = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const createButtonRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Estado de datos
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>(initialDiscountCodes);

  // Estado del SlidePanel
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<DiscountCode | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado del ConfirmDialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [promoToDelete, setPromoToDelete] = useState<DiscountCode | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Animaciones de entrada
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Animación del botón "Volver"
      tl.fromTo(
        backButtonRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4 }
      );

      // Animación del header (título y descripción)
      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.2'
      );

      // Animación del botón "Nuevo Código"
      tl.fromTo(
        createButtonRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.4 },
        '-=0.3'
      );

      // Animación de la tabla
      tl.fromTo(
        tableRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.2'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Obtener códigos existentes para validación
  const existingCodes = useMemo(
    () => discountCodes
      .filter((code) => !selectedPromo || code.id !== selectedPromo.id)
      .map((code) => code.code),
    [discountCodes, selectedPromo]
  );

  // Handlers del SlidePanel
  const handleCreate = () => {
    setSelectedPromo(null);
    setIsPanelOpen(true);
  };

  const handleEdit = (promo: DiscountCode) => {
    setSelectedPromo(promo);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedPromo(null);
  };

  const handleSubmit = async (data: Omit<DiscountCode, 'id'>) => {
    setIsSubmitting(true);

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (selectedPromo) {
      // Editar
      setDiscountCodes((prev) =>
        prev.map((code) =>
          code.id === selectedPromo.id ? { ...data, id: selectedPromo.id } : code
        )
      );
    } else {
      // Crear
      const newPromo: DiscountCode = {
        ...data,
        id: `${Date.now()}`,
      };
      setDiscountCodes((prev) => [newPromo, ...prev]);
    }

    setIsSubmitting(false);
    handleClosePanel();
  };

  // Handlers del ConfirmDialog
  const handleDeleteClick = (promo: DiscountCode) => {
    setPromoToDelete(promo);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!promoToDelete) return;

    setIsDeleting(true);

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 600));

    setDiscountCodes((prev) => prev.filter((code) => code.id !== promoToDelete.id));

    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
    setPromoToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setPromoToDelete(null);
  };

  // Otros handlers
  const handleExport = () => {
    console.log('Exportar códigos promocionales');
    // TODO: descargar excel
  };

  const handleFilter = () => {
    console.log('Abrir filtros');
    // TODO: modal de filtros
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('code', {
        header: 'Código',
        cell: (info) => (
          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded0">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('type', {
        header: 'Tipo',
        cell: (info) => {
          const type = info.getValue();
          return (
            <div className={`${type === 'percentage' ? 'text-blue-700' : 'text-emerald-700'}`}>
              <span className="flex items-center gap-1">
                {type === 'percentage' ? (
                  <>
                    <IconPercentage size={12} />
                    Porcentaje
                  </>
                ) : (
                  <>
                    <IconCurrencyDollar size={12} />
                    Monto fijo
                  </>
                )}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor('value', {
        header: 'Valor',
        cell: (info) => {
          const promo = info.row.original;
          return (
            <span className="font-medium">
              {promo.type === 'percentage' 
                ? `${promo.value}%` 
                : formatCurrency(promo.value)}
            </span>
          );
        },
      }),
      columnHelper.accessor('minAmount', {
        header: 'Monto mínimo',
        cell: (info) => {
          const value = info.getValue();
          return value ? (
            <span className="text-sm text-gray-600">{formatCurrency(value)}</span>
          ) : (
            <span className="text-xs text-gray-400">Sin mínimo</span>
          );
        },
      }),
      columnHelper.accessor('maxDiscount', {
        header: 'Desc. máximo',
        cell: (info) => {
          const promo = info.row.original;
          const value = info.getValue();
          
          if (promo.type === 'fixed') {
            return <span className="text-xs text-gray-400">N/A</span>;
          }
          
          return value ? (
            <span className="text-sm text-gray-600">{formatCurrency(value)}</span>
          ) : (
            <span className="text-xs text-gray-400">Sin límite</span>
          );
        },
      }),
      columnHelper.accessor('active', {
        header: 'Estado',
        cell: (info) => {
          const active = info.getValue();
          return (
            <Badge 
              variant={active ? 'success' : 'neutral'} 
              size="xxs"
            >
              {active ? 'Activo' : 'Inactivo'}
            </Badge>
          );
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Acciones',
        cell: (info) => (
          <ActionButtons
            actions={[
              {
                icon: <IconEdit size={18} />,
                onClick: () => handleEdit(info.row.original),
                label: 'Editar',
              },
              {
                icon: <IconTrash size={18} />,
                onClick: () => handleDeleteClick(info.row.original),
                label: 'Eliminar',
                variant: 'danger',
              },
            ]}
          />
        ),
      }),
    ],
    []
  );

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-6 py-8">
      {/* Header con botón crear */}
      <div className="flex items-center justify-between">
        {/* Header */}
        <div className="mb-6">
          <button
            ref={backButtonRef}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-4 opacity-0"
          >
            <IconArrowLeft size={20} />
            <span className="text-sm">Volver</span>
          </button>
          <div ref={headerRef} className="opacity-0">
            <h1 className="text-2xl font-bold text-gray-800">Gestiona los Códigos Promocionales</h1>
            <p className="text-sm text-gray-500 mt-1">
              Puedes crear, editar o eliminar códigos de descuento para los pedidos
            </p>
          </div>
        </div>
        <div ref={createButtonRef} className="opacity-0">
          <Button
            variant="gradient"
            icon={<IconPlus size={18} />}
            onClick={handleCreate}
            className='max-w-50 text-sm!'
          >
            Nuevo Código
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <div ref={tableRef} className="opacity-0">
        <Table<DiscountCode>
          title={<IconTicket />}
          data={discountCodes}
          columns={columns}
          searchPlaceholder="Buscar código..."
          onExport={handleExport}
          onFilter={handleFilter}
          pageSize={5}
        />
      </div>

      {/* SlidePanel para Crear/Editar */}
      <SlidePanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        title={selectedPromo ? 'Editar Código Promocional' : 'Nuevo Código Promocional'}
        width="w-full max-w-xl"
      >
        <PromoForm
          key={selectedPromo?.id ?? 'new'}
          promo={selectedPromo}
          existingCodes={existingCodes}
          onSubmit={handleSubmit}
          onCancel={handleClosePanel}
          loading={isSubmitting}
        />
      </SlidePanel>

      {/* ConfirmDialog para Eliminar */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Eliminar código promocional"
        message={
          <>
            ¿Estás seguro de eliminar el código{' '}
            <span className="font-mono font-semibold text-emerald-600">
              {promoToDelete?.code}
            </span>
            ? Esta acción no se puede deshacer.
          </>
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}