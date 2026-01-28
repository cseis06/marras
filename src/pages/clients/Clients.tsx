import { useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { IconHistory, IconEdit, IconMapPin, IconTrash, IconPlus, IconUsers } from '@tabler/icons-react';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ExpandableCell from '../../components/ui/ExpandableCell';
import ActionButtons from '../../components/ui/ActionButtons';
import SlidePanel from '../../components/ui/SlidePanel';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ClientForm from './ClientForm';
import { clients as initialClients } from './data/Clients';
import type { Client, Location, DelinquencyStatus } from './types/Client';

const columnHelper = createColumnHelper<Client>();

const delinquencyConfig: Record<DelinquencyStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'neutral' }> = {
  al_dia: { label: 'Al día', variant: 'success' },
  pendiente: { label: 'Pendiente', variant: 'neutral' },
  atrasado: { label: 'Atrasado', variant: 'warning' },
  moroso: { label: 'Moroso', variant: 'error' },
};

export default function Clients() {
  // Estado de datos
  const [clients, setClients] = useState<Client[]>(initialClients);

  // Estado del SlidePanel
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado del ConfirmDialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handlers del SlidePanel
  const handleCreate = () => {
    setSelectedClient(null);
    setIsPanelOpen(true);
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedClient(null);
  };

  const handleSubmit = async (data: Omit<Client, 'id'>) => {
    setIsSubmitting(true);

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (selectedClient) {
      // Editar
      setClients((prev) =>
        prev.map((c) =>
          c.id === selectedClient.id ? { ...data, id: selectedClient.id } : c
        )
      );
    } else {
      // Crear
      const newClient: Client = {
        ...data,
        id: `${Date.now()}`,
      };
      setClients((prev) => [newClient, ...prev]);
    }

    setIsSubmitting(false);
    handleClosePanel();
  };

  // Handlers del ConfirmDialog
  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;

    setIsDeleting(true);

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 600));

    setClients((prev) => prev.filter((c) => c.id !== clientToDelete.id));

    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
    setClientToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setClientToDelete(null);
  };

  // Otros handlers
  const handleViewHistory = (client: Client) => {
    console.log('Ver historial:', client.id);
    // TODO: navigate o abrir modal de historial
  };

  const handleExport = () => {
    console.log('Exportar clientes');
    // TODO: descargar excel
  };

  const handleFilter = () => {
    console.log('Abrir filtros');
    // TODO: modal de filtros
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('document', {
        header: 'Cédula',
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
      columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
        id: 'fullName',
        header: 'Nombre',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('phone', {
        header: 'Contacto',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('locations', {
        header: 'Ubicaciones',
        enableSorting: false,
        cell: (info) => {
          const locations = info.getValue();
          return (
            <ExpandableCell<Location>
              items={locations}
              renderPreview={(items) => (
                <span className="flex items-center gap-1">
                  <IconMapPin size={16} className="text-gray-400" />
                  <p className="line-clamp-1 text-xs">
                    {items.length} {items.length === 1 ? 'ubicación' : 'ubicaciones'}
                  </p>
                </span>
              )}
              renderItem={(location) => (
                <div className="text-xs">
                  <p className="font-medium text-gray-800">{location.alias}</p>
                  <p className="text-gray-600">{location.address}</p>
                  <p className="text-gray-500 text-[10px]">
                    {location.neighborhood}, {location.city}
                  </p>
                  {location.reference && (
                    <p className="text-gray-400 text-[10px] mt-1">Ref: {location.reference}</p>
                  )}
                </div>
              )}
            />
          );
        },
      }),
      columnHelper.accessor('delinquencyStatus', {
        header: 'Morosidad',
        cell: (info) => {
          const status = info.getValue();
          const config = delinquencyConfig[status];
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
                icon: <IconHistory size={18} />,
                onClick: () => handleViewHistory(info.row.original),
                label: 'Ver historial',
              },
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
    <div className="p-6">
      {/* Header con botón crear */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Clientes</h1>
          <p className="text-xs text-gray-500 mt-1">
            Consulte y actualice los datos de sus clientes.
          </p>
        </div>
        <Button
          variant="gradient"
          icon={<IconPlus size={18} />}
          onClick={handleCreate}
          className='max-w-[200px] text-sm!'
        >
          Nuevo Cliente
        </Button>
      </div>

      {/* Tabla */}
      <Table<Client>
        title={<IconUsers />}
        data={clients}
        columns={columns}
        searchPlaceholder="Buscar cliente..."
        onExport={handleExport}
        onFilter={handleFilter}
        pageSize={5}
      />

      {/* SlidePanel para Crear/Editar */}
      <SlidePanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        title={selectedClient ? 'Editar Cliente' : 'Nuevo Cliente'}
        width="w-full max-w-xl"
      >
        <ClientForm
          key={selectedClient?.id ?? 'new'}
          client={selectedClient}
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
        title="Eliminar cliente"
        message={
          <>
            ¿Estás seguro de eliminar a{' '}
            <span className="font-semibold">
              {clientToDelete?.firstName} {clientToDelete?.lastName}
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