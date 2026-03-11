import { useMemo, useState, useRef, useEffect } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { IconHistory, IconEdit, IconMapPin, IconTrash, IconPlus, IconUsers, IconArrowLeft } from '@tabler/icons-react';
import gsap from 'gsap';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ExpandableCell from '../../components/ui/ExpandableCell';
import ActionButtons from '../../components/ui/ActionButtons';
import SlidePanel from '../../components/ui/SlidePanel';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ClientForm from './components/ClientForm';
import { clients as initialClients } from './data/Clients';
import type { Client, Location, DelinquencyStatus } from './types/Client';
import { useNavigate } from 'react-router-dom';

const columnHelper = createColumnHelper<Client>();

const delinquencyConfig: Record<DelinquencyStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'neutral' }> = {
  al_dia: { label: 'Al día', variant: 'success' },
  pendiente: { label: 'Pendiente', variant: 'neutral' },
  atrasado: { label: 'Atrasado', variant: 'warning' },
  moroso: { label: 'Moroso', variant: 'error' },
};

export default function Clients() {

  const navigate = useNavigate();

  // Refs para animaciones
  const containerRef = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const createButtonRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

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

      // Animación del botón "Nuevo Cliente"
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
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Header con botón crear */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        {/* Header */}
        <div>
          <button
            ref={backButtonRef}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-3 sm:mb-4 opacity-0"
          >
            <IconArrowLeft size={20} />
            <span className="text-sm">Volver</span>
          </button>
          <div ref={headerRef} className="opacity-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Gestiona a los Clientes</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Puedes crear, editar o eliminar o ver información de los clientes
            </p>
          </div>
        </div>
        <div ref={createButtonRef} className="opacity-0 flex-shrink-0">
          <Button
            variant="gradient"
            icon={<IconPlus size={18} />}
            onClick={handleCreate}
            className="w-full sm:w-auto text-sm!"
          >
            <span className="sm:inline">Nuevo Cliente</span>
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <div ref={tableRef} className="opacity-0">
        <Table<Client>
          title={<IconUsers />}
          data={clients}
          columns={columns}
          searchPlaceholder="Buscar cliente..."
          onExport={handleExport}
          onFilter={handleFilter}
          pageSize={5}
        />
      </div>

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