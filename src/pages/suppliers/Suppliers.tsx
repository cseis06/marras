import { useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconTruckDelivery,
  IconArrowLeft,
  IconMail,
  IconPhone,
} from '@tabler/icons-react';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ActionButtons from '../../components/ui/ActionButtons';
import SlidePanel from '../../components/ui/SlidePanel';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import SupplierForm from './SuppliersForm';
import { suppliers as initialSuppliers } from './data/Suppliers';
import type { Supplier, SupplierCategory, SupplierStatus } from './types/Supplier';
import { useNavigate } from 'react-router-dom';

const columnHelper = createColumnHelper<Supplier>();

const statusConfig: Record<SupplierStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'neutral' }> = {
  activo: { label: 'Activo', variant: 'success' },
  inactivo: { label: 'Inactivo', variant: 'neutral' },
  suspendido: { label: 'Suspendido', variant: 'error' },
};

const categoryConfig: Record<SupplierCategory, { label: string }> = {
  verduras: { label: 'Verduras y Frutas' },
  carnes: { label: 'Carnes' },
  lacteos: { label: 'Lácteos' },
  bebidas: { label: 'Bebidas' },
  limpieza: { label: 'Limpieza' },
  empaques: { label: 'Empaques' },
  otros: { label: 'Otros' },
};

export default function Suppliers() {
  const navigate = useNavigate();

  // Estado de datos
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);

  // Estado del SlidePanel
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado del ConfirmDialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handlers del SlidePanel
  const handleCreate = () => {
    setSelectedSupplier(null);
    setIsPanelOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedSupplier(null);
  };

  const handleSubmit = async (data: Omit<Supplier, 'id'>) => {
    setIsSubmitting(true);

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (selectedSupplier) {
      // Editar
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === selectedSupplier.id ? { ...data, id: selectedSupplier.id } : s
        )
      );
    } else {
      // Crear
      const newSupplier: Supplier = {
        ...data,
        id: `${Date.now()}`,
      };
      setSuppliers((prev) => [newSupplier, ...prev]);
    }

    setIsSubmitting(false);
    handleClosePanel();
  };

  // Handlers del ConfirmDialog
  const handleDeleteClick = (supplier: Supplier) => {
    setSupplierToDelete(supplier);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!supplierToDelete) return;

    setIsDeleting(true);

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 600));

    setSuppliers((prev) => prev.filter((s) => s.id !== supplierToDelete.id));

    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
    setSupplierToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setSupplierToDelete(null);
  };

  // Otros handlers
  const handleExport = () => {
    console.log('Exportar proveedores');
    // TODO: descargar excel
  };

  const handleFilter = () => {
    console.log('Abrir filtros');
    // TODO: modal de filtros
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('ruc', {
        header: 'RUC',
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
      columnHelper.accessor('businessName', {
        header: 'Razón Social',
        cell: (info) => (
          <div>
            <p className="font-medium text-gray-800">{info.getValue()}</p>
            <p className="text-xs text-gray-500">{info.row.original.contactName}</p>
          </div>
        ),
      }),
      columnHelper.accessor('category', {
        header: 'Categoría',
        cell: (info) => {
          const category = info.getValue();
          const config = categoryConfig[category];
          return <span className="text-sm text-gray-600">{config.label}</span>;
        },
      }),
      columnHelper.accessor('phone', {
        header: 'Contacto',
        cell: (info) => (
          <div className="space-y-1">
            <p className="flex items-center gap-1 text-sm">
              <IconPhone size={14} className="text-gray-400" />
              {info.getValue()}
            </p>
            <p className="flex items-center gap-1 text-xs text-gray-500">
              <IconMail size={12} className="text-gray-400" />
              {info.row.original.email}
            </p>
          </div>
        ),
      }),
      columnHelper.accessor('city', {
        header: 'Ciudad',
        cell: (info) => <span className="text-sm text-gray-600">{info.getValue()}</span>,
      }),
      columnHelper.accessor('status', {
        header: 'Estado',
        cell: (info) => {
          const status = info.getValue();
          const config = statusConfig[status];
          return <Badge variant={config.variant} size="xxs">{config.label}</Badge>;
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
    <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-6 py-8">
      {/* Header con botón crear */}
      <div className="flex items-center justify-between">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-4"
          >
            <IconArrowLeft size={20} />
            <span className="text-sm">Volver</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Proveedores</h1>
          <p className="text-sm text-gray-500 mt-1">
            Administra la información de tus proveedores
          </p>
        </div>
        <Button
          variant="gradient"
          icon={<IconPlus size={18} />}
          onClick={handleCreate}
          className="max-w-50 text-sm!"
        >
          Nuevo Proveedor
        </Button>
      </div>

      {/* Tabla */}
      <Table<Supplier>
        title={<IconTruckDelivery />}
        data={suppliers}
        columns={columns}
        searchPlaceholder="Buscar proveedor..."
        onExport={handleExport}
        onFilter={handleFilter}
        pageSize={5}
      />

      {/* SlidePanel para Crear/Editar */}
      <SlidePanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        title={selectedSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        width="w-full max-w-xl"
      >
        <SupplierForm
          key={selectedSupplier?.id ?? 'new'}
          supplier={selectedSupplier}
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
        title="Eliminar proveedor"
        message={
          <>
            ¿Estás seguro de eliminar a{' '}
            <span className="font-semibold">{supplierToDelete?.businessName}</span>? Esta acción
            no se puede deshacer.
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